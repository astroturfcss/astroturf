const path = require('path');

const ExtractPlugin = require('mini-css-extract-plugin');

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
  // cache: { type: 'memory' },
  devServer: {
    stats: 'minimal',
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
  },
  // optimization: {
  //   minimize: false,
  // },
  module: {
    rules: [
      inlineRule,
      {
        test: /\.scss$/,
        use: [
          // ExtractPlugin.loader,
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                auto: true,
                localIdentName: '[name]--[local]--[hash:base64:5]',
              },
            },
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

  plugins: [
    plugins.html(),
    //
    // new ExtractPlugin(),
  ],
};
