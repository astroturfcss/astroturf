const { basename, extname, join } = require('path');

const fs = require('fs-extra');

const { fixtures, run, runLoader } = require('./helpers');

process.env.NODE_ENV = 'development';

const getOptions = (f) => {
  try {
    return fs.readJsonSync(
      `${__dirname}/fixtures/${basename(f, extname(f))}.json`,
    );
  } catch (err) {
    return {};
  }
};

describe('fixtures', () => {
  fixtures.forEach((fixture) => {
    const options = getOptions(fixture);
    const content = fs.readFileSync(fixture, 'utf8');

    // if (!fixture.includes('styled-interpolations')) return;

    function expectErrorToMatchSnapshot(error, code) {
      // There may be an error, or may just be styles weren't extracted
      expect(
        error
          ? error.message.slice(error.message.indexOf(':') + 1).trim() // remove file path
          : code,
      ).toMatchSnapshot('Compilation Error');
    }

    describe(basename(fixture, extname(fixture)), () => {
      if (!options.loaderOnly) {
        describe('plugin', () => {
          let result, error;

          beforeAll(async () => {
            try {
              result = await run(content, options, fixture);
            } catch (err) {
              error = err;
            }
          });

          it('js ', () => {
            const [code, styles] = result || [];
            if (options.TEST_SHOULD_FAIL) {
              expect(styles.length).toEqual(0);
              expectErrorToMatchSnapshot(error, code);
            } else {
              if (error) throw error;
              expect(code).toMatchFile(
                join(
                  __dirname,
                  '__file_snapshots__',
                  `plugin__${basename(fixture)}`,
                ),
              );
              expect(styles.length).toBeGreaterThan(0);
            }
          });

          it(`styles`, () => {
            (result[1] || []).forEach((s) => {
              expect(s.value).toMatchFile(
                join(
                  __dirname,
                  '__file_snapshots__',
                  `plugin__${basename(s.absoluteFilePath).replace(
                    '.module',
                    '',
                  )}`,
                ),
              );
            });
          });
        });
      }

      if (!options.pluginOnly) {
        describe('loader', () => {
          let result, error;

          beforeAll(async () => {
            try {
              result = await runLoader(
                fs.readFileSync(fixture, 'utf-8'),
                options,
                fixture,
              );
            } catch (err) {
              error = err;
            }
          });

          it('js', () => {
            const [code, styles] = result || [];

            if (options.TEST_SHOULD_FAIL) {
              expect(styles.length).toEqual(0);
              expectErrorToMatchSnapshot(error, code);
            } else {
              if (error) throw error;
              expect(code).toMatchFile(
                join(
                  __dirname,
                  '__file_snapshots__',
                  `loader__${basename(fixture)}`,
                ),
              );
              expect(styles.length).toBeGreaterThan(0);
            }
          });

          it(`styles`, () => {
            (result[1] || []).forEach((s) => {
              expect(s.value).toMatchFile(
                join(
                  __dirname,
                  '__file_snapshots__',
                  `loader__${basename(s.absoluteFilePath).replace(
                    '.module',
                    '',
                  )}`,
                ),
              );
            });
          });
        });
      }
    });
  });
});
