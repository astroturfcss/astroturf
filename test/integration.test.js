/**
 * @jest-environment node
 */

import path from 'path';
import ExtractCSS from 'mini-css-extract-plugin';
import stripAnsi from 'strip-ansi';

import { runWebpack } from './helpers';

function getBaseConfig(entry, options = { enableCssProp: true }) {
  return {
    devtool: false,
    mode: 'development',
    entry: {
      main: require.resolve(entry),
      vendor: ['react', 'react-dom', 'astroturf'],
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
              loader: require.resolve('../src/loader.ts'),
              options,
            },
          ],
        },
      ],
    },
    plugins: [],
    resolve: {
      modules: ['node_modules', 'shared'],
      alias: {
        astroturf: require.resolve('../src/runtime/styled'),
      },
    },
    resolveLoader: {
      alias: {
        // this resolves the mocked value back to the file, which
        // prevents snapshots from including file paths
        'astroturf/css-loader': require.resolve('../src/css-loader'),
      },
    },
  };
}

const cssModuleOptions = {
  modules: {
    localIdentName: '[name]__[local]',
  },
  importLoaders: 1,
  esModule: true,
};

describe('webpack integration', () => {
  function getConfig(entry) {
    const config = getBaseConfig(entry, {
      allowGlobal: true,
      enableCssProp: true,
    });

    config.module.rules.unshift({
      test: /\.css$/,
      use: [
        {
          loader: ExtractCSS.loader,
          options: { esModule: true },
        },
        {
          loader: 'css-loader',
          options: cssModuleOptions,
        },
        'sass-loader',
      ],
    });
    config.plugins.push(new ExtractCSS());
    return config;
  }

  it('should work', async () => {
    const assets = await runWebpack(getConfig('./integration/main.js'));

    expect(assets['main.js'].source()).toMatchFile(
      path.join(__dirname, '__file_snapshots__/integration-js.js'),
    );
    expect(assets['main.css'].source()).toMatchFile(
      path.join(__dirname, '__file_snapshots__/integration-styles.css'),
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

  it('issue 365', async () => {
    const assets = await runWebpack(getConfig('./integration/issue-365.js'));

    expect(assets['main.css'].source()).toMatchFile(
      path.join(__dirname, '__file_snapshots__/issue-365-styles.css'),
    );
    expect(assets['main.js'].source()).toMatchFile(
      path.join(__dirname, '__file_snapshots__/issue-365-js.js'),
    );
  });
});

describe('css-loader', () => {
  function getConfig(entry) {
    const config = getBaseConfig(entry, {
      enableCssProp: true,
      extension: '.scss',
    });

    config.module.rules.unshift(
      {
        test: /\.css$/,
        use: [
          {
            loader: ExtractCSS.loader,
            options: { esModule: true },
          },

          {
            loader: 'css-loader',
            options: cssModuleOptions,
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: ExtractCSS.loader,
            options: { esModule: true },
          },

          {
            loader: 'css-loader',
            options: cssModuleOptions,
          },
          'sass-loader',
        ],
      },
    );

    config.plugins.push(new ExtractCSS());
    return config;
  }

  it('should work', async () => {
    const assets = await runWebpack(
      getConfig('./integration/css-loader-1.js'),
    );

    expect(assets['main.css'].source()).toMatchFile(
      path.join(__dirname, '__file_snapshots__/css-loader-1-styles.css'),
    );
    expect(assets['main.js'].source()).toMatchFile(
      path.join(__dirname, '__file_snapshots__/css-loader-1-js.js'),
    );
  });

  it('adds default plugins when last in chain', async () => {
    const assets = await runWebpack(
      getConfig('./integration/css-loader-2.js'),
    );

    const src = assets['main.css'].source();
    expect(src).not.toContain('&:hover');

    expect(src).toMatchFile(
      path.join(__dirname, '__file_snapshots__/default-plugins-styles.css'),
    );
    expect(assets['main.js'].source()).toMatchFile(
      path.join(__dirname, '__file_snapshots__/default-plugins-js.js'),
    );
  });
});
