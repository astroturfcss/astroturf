const { basename, extname } = require('path');
const { fixtures, webpackRunFixture, babelRunFixture } = require('./helpers');

process.env.NODE_ENV = 'development';

const fixtureMatch = null; // /interpolations/;

describe('fixtures', () => {
  fixtures.forEach(fixture => {
    describe(basename(fixture, extname(fixture)), () => {
      webpackRunFixture(fixture, fixtureMatch && fixture.match(fixtureMatch));

      babelRunFixture(fixture, fixtureMatch && fixture.match(fixtureMatch));
    });
  });
});
