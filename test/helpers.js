const fs = require('fs-extra');
const { transformFileSync } = require('@babel/core');
const { basename } = require('path');

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
      expect(styles.length).toBeGreaterThan(0);
    });

    styles.forEach(s => {
      it(`${s.identifier}`, () => {
        expect(s.value).toMatchSnapshot(`${basename(s.path)}`);
      });
    });
  });
}
