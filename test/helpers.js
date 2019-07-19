const fs = require('fs-extra');
const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const { transformAsync } = require('@babel/core');
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

export async function runLoader(src, options, filename = 'MyStyleFile.js') {
  const loaderContext = {
    query: options,
    loaders: [{ request: '/path/css-literal-loader' }],
    loaderIndex: 0,
    context: '',
    resource: filename,
    resourcePath: filename,
    request: `babel-loader!css-literal-loader!${filename}`,
    emitVirtualFile: (_absoluteFilePath, _value) => {},
  };

  const meta = {};
  const code = await loader.call(loaderContext, src, null, meta);

  return [code, meta.styles];
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
          Object.assign(new Error(errors.join('\n')), { errors, warnings }),
        );
        return;
      }
      resolve(stats.compilation.assets);
    });
  });
}
