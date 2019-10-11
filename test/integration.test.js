/**
 * @jest-environment node
 */

import path from 'path';
import ExtractCSS from 'mini-css-extract-plugin';
import stripAnsi from 'strip-ansi';

import { runWebpack } from './helpers';

describe('webpack integration', () => {
  function getConfig(entry) {
    return {
      devtool: false,
      mode: 'development',
      entry: {
        main: require.resolve(entry),
        vendor: ['react', 'react-dom', 'astroturf'],
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
                loader: require.resolve('../src/loader'),
                options: { enableCssProp: true },
              },
            ],
          },
        ],
      },
      resolve: {
        modules: ['node_modules', 'shared'],
        alias: {
          astroturf: require.resolve('../src/runtime/styled'),
        },
      },
      plugins: [new ExtractCSS()],
    };
  }

  it('should work', async () => {
    const assets = await runWebpack(getConfig('./integration/main.js'));

    expect(assets['main.css'].source()).toMatchFile(
      path.join(__dirname, '__file_snapshots__/integration-styles.css'),
    );
    expect(assets['main.js'].source()).toMatchFile(
      path.join(__dirname, '__file_snapshots__/integration-js.js'),
    );
  });

  it('should provide a helpful error when failing to resolve a default', async () => {
    const error = await runWebpack(
      getConfig('./integration/error-default-import.js'),
    ).catch(err => err);

    const message = stripAnsi(error.message);

    expect(message).toEqual(
      expect.stringContaining("import Button from './Button';"),
    );
    expect(message).toEqual(expect.stringContaining('Also available: styles'));
  });

  it('should provide a helpful error when failing to resolve a named import', async () => {
    const error = await runWebpack(
      getConfig('./integration/error-named-import.js'),
    ).catch(err => err);

    const message = stripAnsi(error.message);

    expect(message).toEqual(
      expect.stringContaining('Available: styles, Button'),
    );
    expect(message).toEqual(expect.stringContaining('Imported as MyButton'));
  });

  it.skip('should throw on cycles', async () => {
    const timeout = global.setTimeout;

    jest.spyOn(global, 'setTimeout').mockImplementation(fn => timeout(fn, 0));

    const result = runWebpack(getConfig('./integration/cycle.js'));

    await expect(result).rejects.toThrow(
      /cyclical style interpolation was detected/,
    );

    jest.restoreAllMocks();
  });
});
