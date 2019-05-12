module.exports = c => c;

/**
 * A loader that replaces itself with css-loader and postcss-loader
 */
module.exports.pitch = function pitch() {
  const remaining = this.loaders.slice(this.loaderIndex + 1);
  this.loaders = [
    {
      path: require.resolve('css-loader'),
      query: '',
      options: {
        ...this.query,
        modules: true,
        importLoaders: remaining.length ? 2 : 1,
      },
    },
    {
      path: require.resolve('postcss-loader'),
      query: '',
      options: {
        ident: 'postcss-astroturf',
        plugins: [require('postcss-nested')()], // eslint-disable-line global-require
      },
    },
    ...remaining,
  ];
};
