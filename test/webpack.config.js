import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import VirtualModulePlugin from '../src/VirtualModulePlugin';

// eslint-disable-next-line max-len
const cssLoader = 'css?modules&camelCase&importLoaders=1&localIdentName="[name]--[local]--[hash:base64:5]"';

export default function getConfig(entry, extract = true) {
  return {
    entry: './test/fixtures/example',
    output: {
      path: path.join(__dirname, 'build'),
      filename: '[name].js',
    },

    module: {
      loaders: [
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', cssLoader, {
            disable: !extract,
          }),
        },
        {
          test: /\.js$/,
          loader: 'babel',
        },
        {
          test: /\.js$/,
          loader: require.resolve('../src/'),
        },
      ],
    },
    plugins: [
      new ExtractTextPlugin('styles.css'),
    ],
  };
}
