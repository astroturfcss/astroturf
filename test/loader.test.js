const { fixtures, webpackRunFixture } = require('./helpers');

process.env.NODE_ENV = 'development';

describe('Loader', () => {
  fixtures.forEach(fixture => {
    webpackRunFixture(fixture);
  });
});
