const { relative, dirname } = require('path');

const { transformAsync } = require('@babel/core');
const fs = require('fs-extra');
const MemoryFS = require('memory-fs');
const prettier = require('prettier');
const webpack = require('webpack');

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

export function format(strings, ...values) {
  const str = strings.reduce(
    (acc, next, idx) => `${acc}${next}${values[idx] || ''}`,
    '',
  );

  return prettier.format(str, { parser: 'babel' });
}

export async function run(src, options, filename = 'MyStyleFile.js') {
  const { code, metadata } = await transformAsync(src, {
    filename,
    babelrc: false,
    plugins: [
      [require('../src/plugin.js'), { ...options, writeFiles: false }],
    ].filter(Boolean),
    parserOpts: PARSER_OPTS,
  });

  return [
    prettier.format(code, { filepath: filename }),
    metadata.astroturf.styles,
  ];
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
      _compilation: {
        fileTimestamps: new Map(),
      },
      _module: {},
      resolve(request, cb) {
        cb(null, relative(dirname(filename), request));
      },
      emitVirtualFile: (_absoluteFilePath, _value) => {},
      async: () => (err, result) => {
        if (err) reject(err);
        else
          resolve([
            prettier.format(result, { filepath: filename }),
            meta.styles,
          ]);
      },
    };

    loader.call(loaderContext, src, null, meta);
  });
}

export const fixtures = fs
  .readdirSync(`${__dirname}/fixtures`)
  .map((file) => `${__dirname}/fixtures/${file}`)
  .filter((f) => !f.endsWith('.json'));

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
              `Webpack threw the following errors:\n\n ${[
                ...errors,
                ...warnings,
              ].join('\n')}`,
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

function testAllRunnersImpl(t, msg, testFn) {
  t.each([
    ['babel', run],
    ['webpack', runLoader],
  ])(`${msg} (%s)`, (name, ...args) => testFn(...args));
}

export function testAllRunners(msg, testFn) {
  testAllRunnersImpl(test, msg, testFn);
}

testAllRunners.only = testAllRunnersImpl.bind(null, test.only);
