const { babelRunFixture } = require('./helpers');
const { extname, basename } = require('path');
const fs = require('fs-extra');

process.env.NODE_ENV = 'development';

describe('css-literal-loader', () => {
  const files = fs.readdirSync(`${__dirname}/fixtures`);

  files.forEach(file => {
    if (file.endsWith('.json')) return;
    babelRunFixture(basename(file, extname(file)));
  });
});
