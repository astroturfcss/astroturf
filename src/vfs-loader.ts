/* eslint-disable max-classes-per-file */
import { dirname } from 'path';
import util from 'util';

import { Expression } from '@babel/types';

import VirtualModulePlugin from './VirtualModulePlugin';
import type { ResolvedImport, Style } from './types';
import {
  buildDependencyError,
  collectStyles,
  replaceStyleTemplates,
  resolveOptions,
} from './utils/loaders';
import replaceComposes from './utils/replaceComposes';

const debug = util.debuglog('astroturf:loader');

const LOADER_PLUGIN = Symbol('loader added VM plugin');
const SEEN = Symbol('astroturf seen modules');

module.exports = async function loader(
  this: any,
  content: string,
  _map?: any,
  meta?: any,
) {
  const { resourcePath, _compilation: compilation } = this;
  const cb = this.async()!;

  if (!compilation[SEEN]) compilation[SEEN] = new Map();

  const loadModule = util.promisify((request: string, done: any) =>
    this.loadModule(request, (err, _, _1, module) => done(err, module)),
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

    const memberProperty = 'property' in node && (node.property as any).name;

    const imported = `###ASTROTURF_IMPORTED_${dependencies.length}###`;
    const source = `###ASTROTURF_SOURCE_${dependencies.length}###`;

    debug(`resolving dependency: ${request}`);
    dependencies.push(
      buildDependency(request).then(({ styles, resource }: any) => {
        const style = styles.find((s: Style) => s.identifier === identifier);

        if (!style) {
          throw buildDependencyError(
            content,
            interpolation,
            styles,
            resource,
            loc!,
          );
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
        styles.forEach((style) => {
          emitVirtualFile(style.absoluteFilePath, style.value);
          // compilation.fileTimestamps.set(style.absoluteFilePath, +mtime);
        });

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
