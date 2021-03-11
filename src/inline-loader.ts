import crypto from 'crypto';
import { promises as fs, mkdirSync } from 'fs';
import { basename, dirname } from 'path';
import util from 'util';
import { deserialize, serialize } from 'v8';

import { Expression } from '@babel/types';
import findCacheDir from 'find-cache-dir';
import loaderUtils from 'loader-utils';

import type { ResolvedImport, Style } from './types';
import {
  buildDependencyError,
  collectStyles,
  replaceStyleTemplates,
  resolveOptions,
} from './utils/loaders';
import replaceComposes from './utils/replaceComposes';

const cacheDir = findCacheDir({ name: 'astroturf-loader' });

mkdirSync(cacheDir, { recursive: true });

const inMemoryStyleCache = new Map<string, Map<string, Style>>();

const hash = (name: string) =>
  `${crypto.createHash('md4').update(name).digest('hex')}.cache`;

const cache = {
  async set(source: string, newStyles: Style[]) {
    const styles = (await this.get(source)) || new Map();
    inMemoryStyleCache.set(source, styles);
    newStyles.forEach((style) => {
      styles.set(style.identifier, style);
    });

    await fs.writeFile(`${cacheDir}/${hash(source)}`, serialize(styles));
  },

  async get(source: string): Promise<Map<string, Style> | undefined> {
    let styles = inMemoryStyleCache.get(source);

    if (!styles) {
      try {
        styles = deserialize(await fs.readFile(`${cacheDir}/${hash(source)}`));
        inMemoryStyleCache.set(source, styles!);
      } catch (err) {
        /* ignore */
      }
    }
    return styles;
  },
};

const debug = util.debuglog('astroturf:loader');

module.exports = async function loader(
  this: any,
  content: string,
  _map?: any,
  meta?: any,
) {
  const { resourcePath } = this;
  const loaderOpts = loaderUtils.getOptions(this) || {};
  const cb = this.async();

  const loadModule = util.promisify((request: string, done: any) =>
    this.loadModule(request, (err, _, _1, module) => done(err, module)),
  );

  if (loaderOpts.styleId) {
    const { source, styleId } = loaderOpts as {
      source: string;
      styleId: string;
    };
    this.resourcePath = source;
    const styles = await cache.get(source);

    let css = styles?.get(styleId)?.value;

    if (!css) {
      await loadModule(source);
      css = inMemoryStyleCache.get(source)?.get(styleId)?.value;
    }

    if (!css) {
      return cb(
        new Error(
          `Could not resolve style ${loaderOpts.styleId} in file ${loaderOpts.source}`,
        ),
      );
    }

    return cb(null, css);
  }

  function getLoaderRequest(from: string, to: string, id: string) {
    const cssBase = basename(to);

    const file = `${cssBase}!=!astroturf/inline-loader?source=${from}&styleId=${id}!${from}`;

    return file;
  }

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
      buildDependency(request).then((module: any) => {
        const styles = inMemoryStyleCache.get(module.resource);

        const style = styles?.get(identifier);

        if (!style) {
          throw buildDependencyError(
            content,
            interpolation,
            Array.from((styles as any) || []),
            module.resource,
            loc!,
          );
        }

        debug(`resolved request to: ${style.absoluteFilePath}`);

        const styleReq = getLoaderRequest(
          module.resource,
          style.absoluteFilePath,
          style.identifier,
        );

        // replace composes first bc we need need to use a different identifier
        localStyle.value = replaceComposes(localStyle.value, (match) =>
          match
            .replace(source, styleReq)
            .replace(
              imported,
              style.type === 'stylesheet' ? memberProperty : 'cls2',
            ),
        );

        // replace selector interpolations
        localStyle.value = localStyle.value
          .replace(source, styleReq)
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

    options.getRequirePath = getLoaderRequest;

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

    return Promise.all(dependencies)
      .then(async () => {
        await cache.set(resourcePath, styles);

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
