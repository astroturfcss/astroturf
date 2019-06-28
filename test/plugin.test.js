const { fixtures, babelRunFixture } = require('./helpers');

process.env.NODE_ENV = 'development';

const fixtureMatch = null; // /interpolations/;

describe('Plugin', () => {
  fixtures.forEach(fixture => {
    babelRunFixture(fixture, fixtureMatch && fixture.match(fixtureMatch));
  });
});
