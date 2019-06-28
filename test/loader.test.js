const { fixtures, webpackRunFixture } = require('./helpers');

process.env.NODE_ENV = 'development';

const fixtureMatch = null; // /interpolations/;

describe('Loader', () => {
  fixtures.forEach(fixture => {
    webpackRunFixture(fixture, fixtureMatch && fixture.match(fixtureMatch));
  });
});
