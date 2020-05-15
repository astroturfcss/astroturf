import path from 'path';

import Plugin from '../src/VirtualModulePlugin';
import { runWebpack } from './helpers';

const runLoader = require.resolve('./tools/run-loader');

describe('virtual module plugin', () => {
  const resolveRelative = (to, from) => path.join(path.dirname(from), to);

  // function getBaseConfig(entry, { run } = {}) {
  //   return {
  //     devtool: false,
  //     mode: 'development',
  //     entry: {
  //       main: require.resolve(entry),
  //     },
  //     optimization: {
  //       sideEffects: true,
  //     },
  //     module: {
  //       rules: [
  //         {
  //           test: /\.jsx?$/,
  //           exclude: /node_modules|astroturf\/src/,
  //           use: [
  //             {
  //               loader: 'babel-loader',
  //               options: {
  //                 babelrc: false,
  //                 plugins: ['@babel/plugin-transform-react-jsx'],
  //               },
  //             },
  //             {
  //               loader: require.resolve('./tools/run-loader.ts'),
  //               options: { run },
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     plugins: [],
  //   };
  // }

  it('works', async () => {
    const entry = path.resolve('./fake.js');

    const assets = await runWebpack({
      devtool: false,
      mode: 'development',
      entry: {
        main: path.resolve('./fake.js'),
      },

      plugins: [
        new Plugin({
          [entry]: "module.exports = 'hi'",
        }),
      ],
    });

    expect(assets['main.js'].source()).toContain("module.exports = 'hi'");
  });

  it('bootstraps via a loader', async () => {
    const run = jest.fn(function run(src) {
      expect(this.emitVirtualFile).not.toBeDefined();
      const plugin = Plugin.bootstrap(this._compilation);

      plugin.addFile(
        resolveRelative('./fake.js', this.resourcePath),
        "module.exports = 'fake'",
      );

      return `const msg = require('./fake.js');\n\n${src}`;
    });

    const assets = await runWebpack({
      devtool: false,
      mode: 'development',
      entry: {
        main: require.resolve('./integration/virtual-entry.js'),
      },
      module: {
        rules: [
          {
            test: /virtual-entry\.js$/,
            use: {
              loader: runLoader,
              options: { run },
            },
          },
        ],
      },
    });

    expect(run).toHaveBeenCalled();
    expect(assets['main.js'].source()).toContain("module.exports = 'fake'");
  });
});
