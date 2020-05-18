const path = require('path');

const HtmlPlugin = require('html-webpack-plugin');
const ExtractCSS = require('mini-css-extract-plugin');
const webpack = require('webpack');

const cssModuleOptions = {
  modules: {
    localIdentName: '[name]__[local]',
  },
  importLoaders: 1,
  esModule: true,
};

module.exports = {
  // devtool: false,
  mode: 'development',
  entry: {
    main: require.resolve('./test/manual/entry.js'),
    vendor: ['react', 'react-dom', 'astroturf', 'astroturf/react'],
  },
  optimization: {
    sideEffects: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules|astroturf\/src/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              plugins: ['@babel/plugin-transform-react-jsx'],
            },
          },
          {
            loader: require.resolve('./lib/loader'),
            options: {},
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader', // ExtractCSS.loader,
            options: { esModule: true },
          },
          {
            loader: 'css-loader',
            options: cssModuleOptions,
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlPlugin(),
    // new ExtractCSS(),
    new webpack.DefinePlugin({
      __DEV__: true,
    }),
  ],
  resolve: {
    modules: ['node_modules', 'shared'],
    alias: {
      astroturf: path.resolve(__dirname, './src/runtime'),
    },
  },
  // resolveLoader: {
  //   alias: {
  //     // this resolves the mocked value back to the file, which
  //     // prevents snapshots from including file paths
  //     'astroturf/css-loader': require.resolve('./src/css-loader'),
  //   },
  // },
};
