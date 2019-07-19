/**
 * @jest-environment node
 */

import path from 'path';
import ExtractCSS from 'mini-css-extract-plugin';
import { runWebpack } from './helpers';

describe('webpack integration', () => {
  let config;

  beforeEach(() => {
    config = {
      devtool: false,
      mode: 'development',
      entry: {
        main: require.resolve('./integration'),
        vendor: ['react', 'react-dom'],
      },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              ExtractCSS.loader,
              {
                loader: require.resolve('../src/css-loader'),
                options: {
                  modules: {
                    localIdentName: '[name]__[local]',
                  },
                },
              },
            ],
          },
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  babelrc: false,
                  plugins: ['@babel/plugin-transform-react-jsx'],
                },
              },
              {
                loader: require.resolve('../src/loader'),
                options: { enableCssProp: true },
              },
            ],
          },
        ],
      },
      resolve: {
        alias: {
          astroturf: require.resolve('../src/runtime/styled'),
        },
      },
      plugins: [new ExtractCSS()],
    };
  });

  it('should work', async () => {
    const assets = await runWebpack(config);

    expect(assets['main.css'].source()).toMatchFile(
      path.join(__dirname, '__file_snapshots__/integration-styles.css'),
    );
    expect(assets['main.js'].source()).toMatchFile(
      path.join(__dirname, '__file_snapshots__/integration-js.js'),
    );
  });
});
