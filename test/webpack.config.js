import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

// eslint-disable-next-line max-len
const cssLoader = 'css-loader?modules&camelCase&importLoaders=1&localIdentName="[name]--[local]--[hash:base64:5]"';

export default function getConfig(entry, extract = true) {
  return {
    entry: './test/fixtures/example',
    output: {
      path: path.join(__dirname, 'build'),
      filename: '[name].js',
    },

    module: {
      rules: [
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: cssLoader,
            disable: !extract,
          }),
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
    plugins: [
      new ExtractTextPlugin('styles.css'),
    ],
  };
}
