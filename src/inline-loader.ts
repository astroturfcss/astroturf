import { basename, dirname } from 'path';
import util from 'util';

import { Expression } from '@babel/types';
import loaderUtils from 'loader-utils';

import type { ResolvedImport, Style } from './types';
import {
  buildDependencyError,
  collectStyles,
  replaceStyleTemplates,
  resolveOptions,
} from './utils/loaders';
import replaceComposes from './utils/replaceComposes';

const styleCache = new Map();

const debug = util.debuglog('astroturf:loader');

function getLoaderRequest(from: string, to: string, id: string) {
  const cssBase = basename(to);
  const file = `${cssBase}!=!astroturf/inline-loader?source="${to}"&styleId="${id}"!${from}`;

  return file;
}

module.exports = async function loader(
  this: any,
  content: string,
  _map?: any,
  meta?: any,
) {
  const { resourcePath } = this;
  const loaderOpts = loaderUtils.getOptions(this) || {};
  const cb = this.async();

  if (loaderOpts.styleId) {
    const css = styleCache.get(loaderOpts.source)?.get(loaderOpts.styleId)
      ?.value;
    cb(null, css);
    return undefined;
  }

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
      buildDependency(request).then((module: any) => {
        const styles = styleCache.get(module.resource);

        const style = styles?.get(identifier);

        if (!style) {
          throw buildDependencyError(
            content,
            interpolation,
            Array.from(styles || []),
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

    const styleMap = new Map();

    styleCache.set(resourcePath, styleMap);
    styles.forEach((style) => {
      styleMap.set(style.identifier, style);
    });

    return Promise.all(dependencies)
      .then(() => {
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
