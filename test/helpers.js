const { relative, dirname, basename } = require('path');

const { transformAsync } = require('@babel/core');
const fs = require('fs-extra');
const prettier = require('prettier');

const loader = require('../src/loader');
const {
  createRequirePath,
  default: createFilename,
} = require('../src/utils/createFilename');

const FILE_NAME = '/MyStyleFile.js';

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

function normalizeNewLines(str) {
  return str.replace(/\n\s*?\n/g, '\n').trim();
}

function rmSourceMap(str) {
  return str.slice(0, str.indexOf('/*# sourceMappingURL=') || str.length);
}
export const loaderPrefix = '';

export const buildLoaderRequest = (ident, file = FILE_NAME) => {
  const cssFile = createFilename(file, {}, ident);
  return `${basename(
    cssFile,
  )}!=!astroturf/inline-loader?style=1!${FILE_NAME}?styleId=${ident}`;
};

export function format(strings, ...values) {
  let str = strings.reduce(
    (acc, next, idx) => `${acc}${next}${values[idx] || ''}`,
    '',
  );

  str = str.slice(0, str.indexOf('/*# sourceMappingURL=') || str.length);
  return normalizeNewLines(prettier.format(str, { parser: 'babel' }));
}

export async function run(src, options, filename = 'MyStyleFile.js') {
  const { code, metadata } = await transformAsync(src, {
    filename,
    babelrc: false,
    plugins: [[require('../src/plugin'), { ...options, writeFiles: false }]],
    parserOpts: PARSER_OPTS,
    sourceType: 'unambiguous',
  });

  return [
    normalizeNewLines(
      rmSourceMap(prettier.format(code, { filepath: filename })),
    ),
    metadata.astroturf.styles,
  ];
}

export async function runBabel(
  src,
  { filename = 'MyStyleFile.js', ...babelConfig },
) {
  const { code, metadata } = await transformAsync(src, {
    filename,
    parserOpts: PARSER_OPTS,
    sourceType: 'unambiguous',
    babelrc: false,
    ...babelConfig,
  });

  return [
    normalizeNewLines(
      rmSourceMap(prettier.format(code, { filepath: filename })),
    ),
    metadata.astroturf.styles,
  ];
}

export function runLoader(src, options, filename = FILE_NAME) {
  return new Promise((resolve, reject) => {
    const meta = {};
    const resourcePath = filename.replace(__dirname, '');
    const loaderContext = {
      query: { useAltLoader: true, ...options },
      getOptions() {
        return this.query;
      },
      loaders: [{ request: '/path/astroturf/loader' }],
      loaderIndex: 0,
      context: '',
      resourcePath,
      resource: resourcePath,
      request: `babel-loader!astroturf/loader!${resourcePath}`,
      _compiler: {},
      _compilation: {
        fileTimestamps: new Map(),
      },
      _module: {},
      resolve(request, cb) {
        cb(null, relative(dirname(filename), request));
      },
      // emitVirtualFile: (_absoluteFilePath, _value) => {},
      async: () => (err, result) => {
        if (err) reject(err);
        else
          resolve([
            normalizeNewLines(prettier.format(result, { filepath: filename })),
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

export * from './webpack-helpers';

function testAllRunnersImpl(t, msg, testFn) {
  t.each([
    ['babel', run],
    ['webpack', runLoader],
  ])(`${msg}  (%s)`, (name, runner) =>
    testFn(runner, {
      current: name,
      requirePath: (ident) => {
        if (name === 'babel') {
          const cssFile = createFilename(FILE_NAME, {}, ident);
          return createRequirePath(FILE_NAME, cssFile);
        }

        return buildLoaderRequest(ident, FILE_NAME);
      },
    }),
  );
}

export function testAllRunners(msg, testFn) {
  testAllRunnersImpl(test, msg, testFn);
}

testAllRunners.only = testAllRunnersImpl.bind(null, test.only);
