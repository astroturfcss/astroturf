const fs = require('fs-extra');
const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const { transformAsync } = require('@babel/core');
const { join, basename, extname } = require('path');
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

const getOptions = f => {
  try {
    return fs.readJsonSync(
      `${__dirname}/fixtures/${basename(f, extname(f))}.json`,
    );
  } catch (err) {
    return {};
  }
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

export function babelRunFixture(fixture, only) {
  const options = getOptions(fixture);
  let styles = [];
  if (options.loaderOnly) return;

  let error = null;
  let output;

  beforeAll(async () => {
    try {
      output = await run(
        fs.readFileSync(fixture, 'utf8'),
        { enableCssProp: true, ...options },
        fixture,
      );
    } catch (err) {
      error = err;
    }

    styles = output ? output[1] : [];
  });
  // eslint-disable-next-line no-underscore-dangle
  const _it = only ? it.only : it;

  _it('js ', () => {
    if (options.TEST_SHOULD_FAIL) {
      expect(styles.length).toEqual(0);
      // There may be an error, or may just be styles weren't extracted
      expect(
        error
          ? error.message.slice(error.message.indexOf(':') + 1).trim() // remove file path
          : output[0],
      ).toMatchSnapshot('Compilation Error');
    } else {
      if (error) throw error;
      expect(output[0]).toMatchFile(
        join(__dirname, '__file_snapshots__', `plugin__${basename(fixture)}`),
      );
      expect(styles.length).toBeGreaterThan(0);
    }
  });

  _it(`styles`, () => {
    styles.forEach(s => {
      expect(s.value).toMatchFile(
        join(
          __dirname,
          '__file_snapshots__',
          `plugin__${basename(s.absoluteFilePath)}`,
        ),
      );
    });
  });
}

export function webpackRunFixture(fixture, only) {
  const options = getOptions(fixture);

  if (options.pluginOnly) return;

  let error = null;
  let code, styles;

  beforeAll(async () => {
    try {
      [code, styles] = await runLoader(
        fs.readFileSync(fixture, 'utf-8'),
        { enableCssProp: true, ...options },
        fixture,
      );
    } catch (err) {
      styles = [];
      error = err;
    }
  });
  // eslint-disable-next-line no-underscore-dangle
  const _it = only ? it.only : it;

  _it('loader js', () => {
    if (options.TEST_SHOULD_FAIL) {
      expect(styles.length).toEqual(0);
      // There may be an error, or may just be styles weren't extracted
      expect(
        error
          ? error.message.slice(error.message.indexOf(':') + 1).trim() // remove file path
          : code,
      ).toMatchSnapshot('Compilation Error');
    } else {
      if (error) throw error;
      expect(code).toMatchFile(
        join(__dirname, '__file_snapshots__', `loader__${basename(fixture)}`),
      );
      expect(styles.length).toBeGreaterThan(0);
    }
  });

  _it(`loader styles`, () => {
    styles.forEach(s => {
      expect(s.value).toMatchFile(
        join(
          __dirname,
          '__file_snapshots__',
          `loader__${basename(s.absoluteFilePath)}`,
        ),
      );
    });
  });
}

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
    // externals: {
    //   react: 'React',
    //   'react-dom': 'ReactDOM',
    // },
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
