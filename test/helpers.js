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
    'decorators',
    'classProperties',
    'exportDefaultFrom',
    'exportNamespaceFrom',
    'asyncGenerators',
    'dynamicImport',
    'throwExpressions',
  ],
};

export const fixtures = fs
  .readdirSync(`${__dirname}/fixtures`)
  .filter(f => f.endsWith('.js'))
  .map(f => basename(f, extname(f)));

export function babelRunFixture(fixture) {
  describe(fixture, () => {
    let options = {};
    try {
      options = fs.readJsonSync(`${__dirname}/fixtures/${fixture}.json`);
    } catch (err) {
      /* ignore */
    }

    const { code, metadata } = transformFileSync(
      `${__dirname}/fixtures/${fixture}.js`,
      {
        babelrc: false,
        // eslint-ignore-next-line
        plugins: [
          [require('../src/plugin.js'), { ...options, writeFiles: false }],
        ],
        parserOpts: PARSER_OPTS,
      },
    );

    const { styles } = metadata['css-literal-loader'] || {};

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
  describe(fixture, () => {
    const fixturePath = `${__dirname}/fixtures/${fixture}.js`;
    let options = {};
    try {
      options = fs.readJsonSync(`${__dirname}/fixtures/${fixture}.json`);
    } catch (err) {
      /* ignore */
    }

    const styles = [];
    const loaderContext = {
      query: options,
      loaders: [{ request: '/path/css-literal-loader' }],
      loaderIndex: 0,
      context: '',
      resource: fixturePath,
      resourcePath: fixturePath,
      request: `babel-loader!css-literal-loader!${fixturePath}`,
      emitVirtualFile: (path, value) => styles.push({ path, value }),
    };

    const code = loader.call(
      loaderContext,
      fs.readFileSync(fixturePath, 'utf-8'),
    );

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
