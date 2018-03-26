import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import VmPlugin from '../src/VirtualModulePlugin';

// eslint-disable-next-line max-len
const cssLoader =
  'css-loader?modules&camelCase&importLoaders=1&localIdentName="[name]--[local]--[hash:base64:5]"';

export default function getConfig() {
  return {
    entry: './test/fixtures/example',
    devtool: false,
    output: {
      path: path.join(__dirname, 'build'),
      filename: '[name].js',
    },

    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, cssLoader],
        },
        {
          test: /\.js$/,
          use: 'babel-loader',
        },
        {
          test: /\.js$/,
          use: [
            {
              loader: require.resolve('../src/loader'),
              options: { tagName: 'less' },
            },
          ],
        },
      ],
    },
    mode: 'development',
    plugins: [
      new VmPlugin(),
      new MiniCssExtractPlugin({
        filename: 'styles.css',
      }),
    ],
  };
}
