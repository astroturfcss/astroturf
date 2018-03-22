const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlPlugin = require('html-webpack-plugin');

// eslint-disable-next-line max-len
const cssLoader =
  'css-loader?modules&camelCase&importLoaders=1&localIdentName="[name]--[local]--[hash:base64:5]"';

module.exports = {
  entry: './example/client.js',
  devtool: false,
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', cssLoader],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: require.resolve('../lib/loader'),
          },
        ],
      },
    ],
  },
  mode: 'development',
  resolve: {
    alias: {
      'css-literal-loader': path.resolve(__dirname, '../'),
    },
  },
  plugins: [
    new HtmlPlugin({ inject: true }),
    // new MiniCssExtractPlugin({
    //   filename: 'styles.css',
    // }),
  ],
};
