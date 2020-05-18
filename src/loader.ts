import { dirname } from 'path';
import util from 'util';

import { codeFrameColumns } from '@babel/code-frame';
import { Expression, SourceLocation } from '@babel/types';
import chalk from 'chalk';
import levenshtein from 'fast-levenshtein';
import loaderUtils from 'loader-utils';
import sortBy from 'lodash/sortBy';
import MagicString from 'magic-string';
import * as webpack from 'webpack';

import VirtualModulePlugin from './VirtualModulePlugin';
import config from './config';
import traverse from './traverse';
import {
  AstroturfMetadata,
  Change,
  DependencyResolver,
  ResolvedImport,
  ResolvedOptions,
  Style,
} from './types';
import { createRequirePath, getNameFromFile } from './utils/createFilename';
import getLoaderPrefix from './utils/getLoaderPrefix';
import replaceComposes from './utils/replaceComposes';
// @ts-ignore

type LoaderContext = webpack.loader.LoaderContext;

const debug = util.debuglog('astroturf:loader');

type AstroturfLoaderError = new (...args: any[]) => AstroturfLoaderErrorClass;
declare class AstroturfLoaderErrorClass extends Error {
  constructor(msg: Error | string, codeFrame: any);

  error?: Error | string;
}

// can'ts use class syntax b/c babel doesn't transpile it correctly for Error
const AstroturfLoaderError: AstroturfLoaderError = (() => {
  function ctor(
    this: AstroturfLoaderErrorClass,
    errorOrMessage: string | Error,
    // @ts-ignore
    codeFrame: any = errorOrMessage.codeFrame,
  ) {
    Error.call(this);
    this.name = 'AstroturfLoaderError';

    if (typeof errorOrMessage !== 'string') {
      this.message = errorOrMessage.message;
      this.error = errorOrMessage;

      try {
        this.stack = errorOrMessage.stack!.replace(/^(.*?):/, `${this.name}:`);
      } catch (err) {
        Error.captureStackTrace(this, ctor);
      }
    } else {
      this.message = errorOrMessage;
      Error.captureStackTrace(this, ctor);
    }

    if (codeFrame) this.message += `\n\n${codeFrame}\n`;
  }

  ctor.prototype = Object.create(Error.prototype);
  ctor.prototype.constructor = ctor;
  return ctor as any;
})();

function buildDependencyError(
  content: string,
  { type, identifier, request }: ResolvedImport,
  { styles, resource }: { styles: Style[]; resource: string },
  loc: SourceLocation,
) {
  let idents = styles.map((s) => s.identifier);

  let closest: string | undefined;
  let minDistance = 2;
  idents.forEach((ident) => {
    const d = levenshtein.get(ident, identifier);
    if (d < minDistance) {
      minDistance = d;
      closest = ident;
    }
  });
  const isDefaultImport = type === 'ImportDefaultSpecifier';

  if (!closest && isDefaultImport) {
    closest = idents.find((ident) => ident === getNameFromFile(resource));
  }
  if (closest) idents = idents.filter((ident) => ident !== closest);

  const identMsg = idents.map((s) => chalk.yellow(s)).join(', ');

  const alternative = isDefaultImport
    ? `Instead try: ${chalk.yellow(`import ${closest} from '${request}';`)}`
    : `Did you mean to import as ${chalk.yellow(closest)} instead?`;

  return new AstroturfLoaderError(
    // eslint-disable-next-line prefer-template
    `Could not find a style associated with the interpolated value. ` +
      `Styles should use the same name used by the intended component or class set in the imported file.\n\n` +
      codeFrameColumns(
        content,
        { start: loc.start },
        {
          highlightCode: true,
          message: !isDefaultImport
            ? `(Imported as ${chalk.bold(identifier)})`
            : '',
        },
      ) +
      `\n\n${
        closest
          ? `${alternative}\n\nAlso available: ${identMsg}`
          : `Available: ${identMsg}`
      }`,
  );
}

function collectStyles(
  src: string,
  filename: string,
  resolveDependency: DependencyResolver,
  opts: Partial<ResolvedOptions>,
): AstroturfMetadata {
  const getRequirePath = opts.getRequirePath || createRequirePath;

  // maybe eventually return the ast directly if babel-loader supports it
  try {
    const { metadata } = traverse(src, filename, {
      ...opts,
      resolveDependency,
      writeFiles: false,
      generateInterpolations: true,
      getRequirePath: (...args) => {
        const file = getLoaderPrefix() + getRequirePath(...args);

        return file;
      },
    })!;
    return (metadata as any).astroturf;
  } catch (err) {
    throw new AstroturfLoaderError(err);
  }
}

function replaceStyleTemplates(
  loaderContext: LoaderContext,
  filename: string,
  src: string,
  locations: Change[],
) {
  locations = sortBy(locations, (i) => i.start || 0);

  const magic = new MagicString(src);

  locations.forEach(({ start = 0, end = 0, code = '' }) => {
    if (code.endsWith(';')) code = code.slice(0, -1); // remove trailing semicolon

    if (start === end) {
      magic.appendLeft(start, code);
    } else {
      magic.overwrite(start, end, code);
    }
  });

  return {
    code: magic.toString(),
    map: loaderContext.sourceMap
      ? magic.generateMap({ includeContent: true, source: filename })
      : null,
  };
}

const LOADER_PLUGIN = Symbol('loader added VM plugin');
const SEEN = Symbol('astroturf seen modules');

async function resolveOptions(
  loaderContext: LoaderContext,
): Promise<Partial<ResolvedOptions>> {
  const loaderOpts = loaderUtils.getOptions(loaderContext) || {};

  if (loaderOpts.config === false) {
    return loaderOpts;
  }
  const result = await (typeof loaderOpts.config === 'string'
    ? config.load(loaderOpts.config)
    : config.search(loaderContext.resourcePath));

  return result?.config || loaderOpts;
}

module.exports = async function loader(
  this: LoaderContext,
  content: string,
  _map?: any,
  meta?: any,
) {
  const { resourcePath, _compilation: compilation } = this;
  const cb = this.async()!;

  if (!compilation[SEEN]) compilation[SEEN] = new Map();

  const loadModule = util.promisify((request: string, done: any) =>
    this.loadModule(request, (err, _, __, module) => done(err, module)),
  );

  const resolve = util.promisify(this.resolve);

  const dependencies = [] as Promise<void>[];

  const buildDependency = async (request: string) => {
    const resource = await resolve(dirname(resourcePath), request);
    return loadModule(resource);
  };

  function resolveDependency(
    interpolation: ResolvedImport,
    localStyle: Style,
    node: Expression,
  ) {
    const { identifier, request } = interpolation;
    if (!interpolation.identifier) return null;
    const { loc } = node;

    const memberProperty = 'property' in node && node.property.name;

    const imported = `###ASTROTURF_IMPORTED_${dependencies.length}###`;
    const source = `###ASTROTURF_SOURCE_${dependencies.length}###`;

    debug(`resolving dependency: ${request}`);
    dependencies.push(
      buildDependency(request).then((module: any) => {
        const style = module.styles.find(
          (s: Style) => s.identifier === identifier,
        );

        if (!style) {
          throw buildDependencyError(content, interpolation, module, loc!);
        }

        debug(`resolved request to: ${style.absoluteFilePath}`);

        // replace composes first bc we need need to use a different identifier
        localStyle.value = replaceComposes(localStyle.value, (match) =>
          match
            .replace(source, `~${style.absoluteFilePath}`)
            .replace(
              imported,
              style.type === 'stylesheet' ? memberProperty : 'cls2',
            ),
        );

        // replace selector interpolations
        localStyle.value = localStyle.value
          .replace(source, `~${style.absoluteFilePath}`)
          .replace(
            imported,
            style.type === 'stylesheet' ? memberProperty : 'cls1',
          );
      }),
    );

    return { source, imported };
  }

  try {
    const options = await resolveOptions(this);

    const { styles = [], changeset } = collectStyles(
      content,
      resourcePath,
      resolveDependency,
      options,
    );

    if (meta) {
      meta.styles = styles;
    }

    if (!styles.length) {
      return cb(null, content);
    }

    compilation[SEEN].set(resourcePath, styles);
    this._module.styles = styles;
    // @ts-ignore
    let { emitVirtualFile } = this;

    // The plugin isn't loaded
    if (!emitVirtualFile) {
      const { compiler } = compilation;
      let plugin = compiler[LOADER_PLUGIN];
      if (!plugin) {
        debug('adding plugin to compiiler');
        plugin = VirtualModulePlugin.bootstrap(compilation);

        compiler[LOADER_PLUGIN] = plugin;
      }
      emitVirtualFile = plugin.addFile;
    }

    return Promise.all(dependencies)
      .then(() => {
        // const timeStamps = compilation.fileSystemInfo ? new Map() : null;

        styles.forEach((style) => {
          emitVirtualFile(style.absoluteFilePath, style.value);
          // if (timeStamps) {
          //   timeStamps.set(style.absoluteFilePath, +mtime);
          // } else {
          //   compilation.fileTimestamps.set(style.absoluteFilePath, +mtime);
          // }
        });

        // if (timeStamps) {
        //   console.log('update');
        //   compilation.fileSystemInfo.addFileTimestamps(timeStamps);
        // }

        const result = replaceStyleTemplates(
          this,
          resourcePath,
          content,
          changeset,
        );

        cb(null, result.code, result.map as any);
      })
      .catch(cb);
  } catch (err) {
    return cb(err);
  }
};
