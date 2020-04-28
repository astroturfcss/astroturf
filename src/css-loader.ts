import path from 'path';

import { getOptions, parseQuery } from 'loader-utils';
import postcss from 'postcss';
import postcssNested from 'postcss-nested';
import * as webpack from 'webpack';

type Loader = webpack.loader.Loader;
type LoaderContext = webpack.loader.LoaderContext;

// eslint-disable-next-line consistent-return
const loader: Loader = function astroturfCssLoader(
  this: LoaderContext,
  css: string,
  prevMap: any,
  meta?: any,
) {
  const isLast = this.loaderIndex === this.loaders.length - 1;

  if (!isLast) {
    return css;
  }

  const cb = this.async() as any;

  postcss([postcssNested()])
    .process(css, {
      from: this.resourcePath,
      map: {
        inline: true,
        prev: prevMap || undefined,
      },
    })
    .then((result) => {
      const map = result.map ? result.map.toJSON() : undefined;

      if (map) {
        map.file = path.resolve(map.file!);
        map.sources = map.sources.map((src: string) => path.resolve(src));
      }
      if (!meta) {
        meta = {};
      }

      meta.ast = {
        type: 'postcss',
        version: result.processor!.version,
        root: result.root,
      };

      cb(null, result.css, map, meta);
    })
    .catch((err) => cb(err));
};

/**
 * The pitch loader, takes itself from the front of the loader stack and
 * inserts itself immediately in front of the css-loader
 */
export function pitch(this: LoaderContext) {
  const loaderOpts = getOptions(this) || {};
  let cssIdx = this.loaders.findIndex((l) => l.path.includes('css-loader/'));
  const cssLoader = this.loaders[cssIdx];

  if (!cssLoader) {
    return undefined;
  }

  // `inline` means the loader was specified in the request by the js loader.
  // We want to remove the astroturf css loader from the end, and insert it
  // right after the webpack `css-loader`. That way we can make any changes
  // after the preprocessor has finished.
  //
  // To accomplish this we turn the current Module (webpack's meaning) into
  // a simple passthrough to the actual style by re-exporting everything with the
  // the correct loader order stringified inline. If we tried the alter the
  // order for this pass, we'd end up with duplicate styles, b/c webpack treats
  // the request as the module ID, and `looder!./file.css` is different than
  // `./file.css`. This comes up for inter-style dependencies, where css-loader
  // imports style dependencies in the JS output using the same loaders that applied to the
  // entry style file.
  //
  // Overall the passthrough avoids duplicate styles but creates extra module cruft.
  // Effectively two module wrappers per style, HOWEVER, that penalty can be avoided
  // through webpacks sideEffects optimization, which will flatten the module graph
  // when modules simply re-export something else and are marked as sideEffect free.
  if (loaderOpts.inline) {
    const loaders = [...this.loaders];
    const [me] = loaders.splice(this.loaderIndex, 1);

    if (this.loaderIndex < cssIdx) cssIdx--;

    loaders.splice(cssIdx + 1, 0, { request: me.path });

    const prefix = loaders.map((x) => x.request).join('!');

    // Mark this module as side effect free so it can be optimized away
    // by Webpack. I don't think there is a more public way to do this.
    this._module.factoryMeta.sideEffectFree = true;

    return `export { default } from "-!${prefix}!${this.resourcePath}";`;
  }

  // This branch runs after the loader has been moved from the step above.
  // Here we need to make sure that `css-loader`'s options are adjusted to account
  // for the loader ahead of it, that it doesn't expect. To do that we just change
  // `importLoaders` by incrementing it.
  //
  // CAUTION: this is not strictly correct because we don't know where we came from
  // If a user added this loader in their config manually incrementing would likely
  // be wrong. That shouldn't be a problem tho, users should not manually configure this.
  let options: any = {};

  if (typeof cssLoader.options === 'string') {
    options = parseQuery(`?${cssLoader.options}`) || {};
  } //
  else if (cssLoader.options) {
    // It is VERY important we don't mutate options, because that object is from
    // the webpack config, mutating it would change the options for any usage of the
    // loader, when we only want to affect the current chain.
    options = { ...cssLoader.options };
  }

  this.loaders[cssIdx].options = {
    ...options,
    importLoaders: (options.importLoaders || 0) + 1,
  };

  return undefined;
}

export default loader;
