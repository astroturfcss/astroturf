/**
 * @jest-environment node
 */

import path from 'path';

import ExtractCSS from 'mini-css-extract-plugin';
import stripAnsi from 'strip-ansi';
import Template from 'webpack/lib/Template';

import { runWebpack } from './helpers';

function getBaseConfig(entry, options = {}) {
  return {
    devtool: false,
    mode: 'development',
    context: __dirname,
    entry: {
      main: require.resolve(entry),
      vendor: ['react', 'react-dom', 'astroturf', 'astroturf/react'],
    },
    optimization: {
      sideEffects: true,
      // moduleIds: 'natural',
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
              options: { useAltLoader: true, ...options },
            },
          ],
        },
      ],
    },
    plugins: [],
    // plugins: [new VirtualModulePlugin()],
    resolve: {
      modules: ['node_modules', 'shared'],
      alias: {
        astroturf: path.resolve(__dirname, '../src/runtime'),
      },
    },
    resolveLoader: {
      alias: {
        'astroturf/inline-loader': require.resolve('../src/inline-loader'),
      },
    },
  };
}

const options = {
  modules: {
    localIdentName: '[name]__[local]-[hash:base64:3]',
  },
};

const normalize = (source) => {
  return source.split(Template.toIdentifier(__dirname)).join('');
};

describe('webpack integration', () => {
  function getConfig(entry) {
    const config = getBaseConfig(entry, {
      allowGlobal: true,
    });

    config.module.rules.unshift(
      {
        test: /\.css$/,
        use: [ExtractCSS.loader, { loader: 'css-loader', options }],
      },
      {
        test: /\.scss$/,
        use: [
          ExtractCSS.loader,
          { loader: 'css-loader', options },
          'sass-loader',
        ],
      },
    );
    config.plugins.push(new ExtractCSS());
    return config;
  }

  it('should work', async () => {
    const assets = await runWebpack(getConfig('./integration/main.js'));

    expect(normalize(assets['main.js'])).toMatchFile(
      path.join(__dirname, '__file_snapshots__/integration-js.js'),
    );
    expect(assets['main.css']).toMatchFile(
      path.join(__dirname, '__file_snapshots__/integration-styles.css'),
    );
  });

  it('should provide a helpful error when failing to resolve a default', async () => {
    const error = await runWebpack(
      getConfig('./integration/error-default-import.js'),
    ).catch((err) => err);

    const message = stripAnsi(error.message);

    expect(message).toEqual(
      expect.stringContaining("import Button from './Button';"),
    );
    expect(message).toEqual(expect.stringContaining('Also available: styles'));
  });

  it('should provide a helpful error when failing to resolve a named import', async () => {
    const error = await runWebpack(
      getConfig('./integration/error-named-import.js'),
    ).catch((err) => err);

    const message = stripAnsi(error.message);

    expect(message).toEqual(
      expect.stringContaining('Available: styles, Button'),
    );
    expect(message).toEqual(expect.stringContaining('Imported as MyButton'));
  });

  it.skip('should throw on cycles', async () => {
    const timeout = global.setTimeout;

    jest
      .spyOn(global, 'setTimeout')
      .mockImplementation((fn) => timeout(fn, 0));

    const result = runWebpack(getConfig('./integration/cycle.js'));

    await expect(result).rejects.toThrow(
      /cyclical style interpolation was detected/,
    );

    jest.restoreAllMocks();
  });

  it('issue 365', async () => {
    const assets = await runWebpack(getConfig('./integration/issue-365.js'));

    expect(assets['main.css']).toMatchFile(
      path.join(__dirname, '__file_snapshots__/issue-365-styles.css'),
    );
    expect(assets['main.js']).toMatchFile(
      path.join(__dirname, '__file_snapshots__/issue-365-js.js'),
    );
  });
});
