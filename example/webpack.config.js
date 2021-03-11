const path = require('path');

process.traceDeprecation = true;

const { rules, plugins } = require('webpack-atoms').createAtoms({
  env: 'development',
});

const inlineRule = rules.js();
inlineRule.use = [
  ...inlineRule.use,
  {
    loader: 'astroturf/loader',
    options: { extension: '.module.scss', useAltLoader: true },
  },
];

module.exports = {
  entry: './src/client.js',
  devtool: 'cheap-module-source-map',
  cache: { type: 'filesystem' },
  devServer: {
    stats: 'minimal',
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
  },

  module: {
    rules: [
      inlineRule,
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1, modules: true },
          },
          'sass-loader',
        ],
      },
    ],
  },
  mode: 'development',
  resolve: {
    alias: {
      astroturf: path.resolve(__dirname, '../lib'),
    },
  },
  resolveLoader: {
    alias: {
      astroturf: path.resolve(__dirname, '../lib'),
    },
  },

  plugins: [plugins.html()],
};
