const fs = require('fs-extra');
const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const { transformAsync } = require('@babel/core');
const { relative, dirname } = require('path');
const loader = require('../src/loader');

const PARSER_OPTS = {
  plugins: [
    'jsx',
    'flow',
    'doExpressions',
    'objectRestSpread',
    'classProperties',
    'exportDefaultFrom',
    'exportNamespaceFrom',
    'asyncGenerators',
    'dynamicImport',
    'throwExpressions',
  ],
};

export async function run(src, options, filename) {
  const { code, metadata } = await transformAsync(src, {
    babelrc: false,
    plugins: [
      [require('../src/plugin.js'), { ...options, writeFiles: false }],
    ].filter(Boolean),
    filename: filename || 'MyStyleFile.js',
    parserOpts: PARSER_OPTS,
  });

  return [code, metadata.astroturf.styles];
}

export function runLoader(src, options, filename = 'MyStyleFile.js') {
  return new Promise((resolve, reject) => {
    const meta = {};
    const loaderContext = {
      query: options,
      loaders: [{ request: '/path/css-literal-loader' }],
      loaderIndex: 0,
      context: '',
      resource: filename,
      resourcePath: filename,
      request: `babel-loader!css-literal-loader!${filename}`,
      _compiler: {},
      _compilation: {},
      _module: {},
      resolve(request, cb) {
        cb(null, relative(dirname(filename), request));
      },
      emitVirtualFile: (_absoluteFilePath, _value) => {},
      async: () => (err, result) => {
        if (err) reject(err);
        else resolve([result, meta.styles]);
      },
    };

    loader.call(loaderContext, src, null, meta);
  });
}

export const fixtures = fs
  .readdirSync(`${__dirname}/fixtures`)
  .map(file => `${__dirname}/fixtures/${file}`)
  .filter(f => !f.endsWith('.json'));

export function runWebpack(config) {
  const compiler = webpack({
    ...config,
    output: {
      filename: '[name].js',
      path: '/build',
    },
    optimization: {
      runtimeChunk: true,
      splitChunks: {
        chunks: 'initial',
      },
    },
  });
  compiler.outputFileSystem = new MemoryFS();
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
        return;
      }
      if (stats.hasErrors() || stats.hasWarnings()) {
        const { errors, warnings } = stats.toJson();
        reject(
          Object.assign(
            new Error(
              `Webpack threw the following errors:\n\n ${errors.join('\n')}`,
            ),
            { errors, warnings, framesToPop: 1 },
          ),
        );
        return;
      }
      resolve(stats.compilation.assets);
    });
  });
}
