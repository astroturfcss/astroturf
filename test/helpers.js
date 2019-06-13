const fs = require('fs-extra');
const { transformFileSync } = require('@babel/core');
const { basename, extname } = require('path');
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

export const fixtures = fs
  .readdirSync(`${__dirname}/fixtures`)
  .map(file => `${__dirname}/fixtures/${file}`)
  .filter(f => !f.endsWith('.json'));

export function babelRunFixture(fixture, only) {
  const options = getOptions(fixture);

  if (options.loaderOnly) return;

  describe(basename(fixture, extname(fixture)), () => {
    let error = null;
    let output;
    try {
      output = transformFileSync(fixture, {
        babelrc: false,
        // eslint-ignore-next-line
        plugins: [
          [require('../src/plugin.js'), { ...options, writeFiles: false }],
        ],
        parserOpts: PARSER_OPTS,
      });
    } catch (err) {
      error = err;
    }
    // eslint-disable-next-line no-underscore-dangle
    const _it = only ? it.only : it;

    const styles = output ? output.metadata.astroturf.styles : [];

    _it('js ', () => {
      if (options.TEST_SHOULD_FAIL) {
        expect(styles.length).toEqual(0);
        // There may be an error, or may just be styles weren't extracted
        expect(
          error
            ? error.message.slice(error.message.indexOf(':') + 1).trim() // remove file path
            : output.code,
        ).toMatchSnapshot('Compilation Error');
      } else {
        if (error) throw error;
        expect(output.code).toMatchSnapshot('Compiled JS');
        expect(styles.length).toBeGreaterThan(0);
      }
    });

    styles.forEach(s => {
      _it(`${s.identifier}`, () => {
        expect(s.value).toMatchSnapshot(`${basename(s.absoluteFilePath)}`);
      });
    });
  });
}

export function webpackRunFixture(fixture, only) {
  const options = getOptions(fixture);

  if (options.pluginOnly) return;

  describe(basename(fixture, extname(fixture)), () => {
    const styles = [];
    let error = null;
    let code;

    const loaderContext = {
      query: options,
      loaders: [{ request: '/path/css-literal-loader' }],
      loaderIndex: 0,
      context: '',
      resource: fixture,
      resourcePath: fixture,
      request: `babel-loader!css-literal-loader!${fixture}`,
      emitVirtualFile: (absoluteFilePath, value) =>
        styles.push({ absoluteFilePath, value }),
    };

    try {
      code = loader.call(loaderContext, fs.readFileSync(fixture, 'utf-8'));
    } catch (err) {
      error = err;
    }
    // eslint-disable-next-line no-underscore-dangle
    const _it = only ? it.only : it;

    _it('js ', () => {
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
        expect(code).toMatchSnapshot('Compiled JS');
        expect(styles.length).toBeGreaterThan(0);
      }
    });

    styles.forEach((s, idx) => {
      _it(`${idx}`, () => {
        expect(s.value).toMatchSnapshot(`${basename(s.absoluteFilePath)}`);
      });
    });
  });
}
