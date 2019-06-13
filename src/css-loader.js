module.exports = c => c;

// createLoaderObject: https://github.com/webpack/loader-runner/blob/master/lib/LoaderRunner.js
function createLoader(loader) {
  // const query = loader.ident ? `??${loader.ident}` : '';

  // return {
  //   path: null,
  //   query: null,
  //   options: null,
  //   ident: null,
  //   normal: null,
  //   pitch: null,
  //   raw: null,
  //   data: null,
  //   pitchExecuted: false,
  //   normalExecuted: false,
  //   ...loader,
  //   request: `${loader.path}${query}`,
  // };\
  return loader;
}

/**
 * A loader that replaces itself with css-loader and postcss-loader
 */
module.exports.pitch = function pitch() {
  const remaining = this.loaders.slice(this.loaderIndex + 1);
  this.loaders = [
    createLoader({
      path: require.resolve('css-loader'),
      // query: '',
      options: {
        ...this.query,
        modules: true,
        importLoaders: remaining.length ? 2 : 1,
      },
    }),
    createLoader({
      path: require.resolve('postcss-loader'),
      query: '',
      ident: 'postcss-astroturf',
      options: {
        ident: 'postcss-astroturf',
        plugins: [require('postcss-nested')()], // eslint-disable-line global-require
      },
    }),
    ...remaining,
  ];
};
