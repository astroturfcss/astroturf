const path = require('path');

const { rules, plugins, loaders } = require('webpack-atoms').createAtoms({
  env: 'development',
});

const inlineRule = rules.js(require('../.babelrc'));

inlineRule.use = [
  ...inlineRule.use,
  {
    loader: require.resolve('../lib/loader'),
    options: { tagName: 'scss', extension: '.module.scss' },
  },
  {
    loader: require.resolve('../lib/loader'),
    options: { extension: '.module.css' },
  },
];

module.exports = {
  entry: './src/client.js',
  devtool: 'cheap-module-source-map',
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
  },

  module: {
    rules: [
      inlineRule,
      {
        oneOf: [
          rules.sass.external(),
          {
            test: /\.module\.scss/,
            use: [
              loaders.style(),
              require.resolve('../lib/css-loader'),
              loaders.sass(),
            ],
          },
          {
            test: /\.module\.css/,
            use: [loaders.style(), require.resolve('../lib/css-loader')],
          },
        ],
      },
    ],
  },
  mode: 'development',
  resolve: {
    alias: {
      astroturf: path.resolve(__dirname, '../lib/index.js'),
    },
  },
  plugins: [plugins.html()],
};
