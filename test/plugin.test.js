const { fixtures, babelRunFixture } = require('./helpers');

process.env.NODE_ENV = 'development';

describe('Plugin', () => {
  fixtures.forEach(fixture => {
    babelRunFixture(fixture);
  });
});
