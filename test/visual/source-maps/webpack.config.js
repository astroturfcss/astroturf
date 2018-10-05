const path = require('path');

const { rules, plugins, loaders } = require('webpack-atoms').createAtoms({
  env: 'development',
});

const inlineRule = rules.js(require('../../../.babelrc'));

inlineRule.use = [
  ...inlineRule.use,
  {
    loader: require.resolve('../../../lib/loader'),
    options: { extension: '.module.css', sourceMap: true, writeFiles: true },
  },
];

module.exports = {
  entry: './client.js',
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
  },

  module: {
    rules: [
      inlineRule,
      {
        test: /\.module\.css/,
        use: [
          loaders.style({ sourceMap: true }),
          {
            loader: require.resolve('../../../lib/css-loader'),
            options: { sourceMap: true },
          },
        ],
      },
    ],
  },
  mode: 'development',
  resolve: {
    alias: {
      astroturf: path.resolve(__dirname, '../../../lib/index.js'),
    },
  },
  plugins: [plugins.html()],
};
