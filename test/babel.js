const { transformFileSync } = require('@babel/core');
const { dirname, extname, basename, resolve } = require('path');

process.env.NODE_ENV = 'development';

function getFileName(hostFile, { extension = '.css' }) {
  const base = basename(hostFile, extname(hostFile));
  return `${resolve(
    dirname(hostFile),
    '../build',
  )}/__extracted_styles/${base}_${extension}`;
}

function runFixture(fixture) {
  return transformFileSync(`${__dirname}/fixtures/${fixture}.js`, {
    babelrc: false,
    presets: [['@4c/4catalyzer', { target: 'node', node: 'current' }]],
    // eslint-ignore-next-line
    plugins: [[require('../src/plugin.js'), { getFileName }]],
  }).code;
}

console.log(runFixture('styled'));
