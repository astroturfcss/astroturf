const { transform } = require('@babel/core');
const { readFileSync } = require('fs');

const { code } = transform(
  readFileSync(`${__dirname}/fixtures/example.js`, 'utf8'),
  {
    filename: `${__dirname}/fixtures/example.js`,
    presets: [['es2015', { loose: true }], 'stage-1', 'react'],
    // eslint-ignore-next-line
    plugins: [require('../src/plugin.js')],
  },
);

console.log(code);
