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

export function babelRunFixture(fixture) {
  const options = getOptions(fixture);

  if (options.loaderOnly) return;

  describe(basename(fixture, extname(fixture)), () => {
    const { code, metadata } = transformFileSync(fixture, {
      babelrc: false,
      // eslint-ignore-next-line
      plugins: [
        [require('../src/plugin.js'), { ...options, writeFiles: false }],
      ],
      parserOpts: PARSER_OPTS,
    });

    const { styles } = metadata.astroturf || {};

    it('js ', () => {
      expect(code).toMatchSnapshot(`Compiled JS`);

      if (options.TEST_SHOULD_FAIL) expect(styles.length).toEqual(0);
      else expect(styles.length).toBeGreaterThan(0);
    });

    styles.forEach(s => {
      it(`${s.identifier}`, () => {
        expect(s.value).toMatchSnapshot(`${basename(s.path)}`);
      });
    });
  });
}

export function webpackRunFixture(fixture) {
  const options = getOptions(fixture);

  if (options.pluginOnly) return;

  describe(basename(fixture, extname(fixture)), () => {
    const styles = [];
    const loaderContext = {
      query: options,
      loaders: [{ request: '/path/css-literal-loader' }],
      loaderIndex: 0,
      context: '',
      resource: fixture,
      resourcePath: fixture,
      request: `babel-loader!css-literal-loader!${fixture}`,
      emitVirtualFile: (path, value) => styles.push({ path, value }),
    };

    const code = loader.call(loaderContext, fs.readFileSync(fixture, 'utf-8'));

    it('js ', () => {
      expect(code).toMatchSnapshot(`Compiled JS`);
      if (options.TEST_SHOULD_FAIL) expect(styles.length).toEqual(0);
      else expect(styles.length).toBeGreaterThan(0);
    });

    styles.forEach((s, idx) => {
      it(`${idx}`, () => {
        expect(s.value).toMatchSnapshot(`${basename(s.path)}`);
      });
    });
  });
}
