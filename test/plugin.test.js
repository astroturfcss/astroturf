const { fixtures, babelRunFixture } = require('./helpers');

process.env.NODE_ENV = 'development';

describe('Plugin', () => {
  fixtures
    // .filter(f => f.includes('styled-no-assignment'))
    .forEach(fixture => {
      babelRunFixture(fixture);
    });
});
