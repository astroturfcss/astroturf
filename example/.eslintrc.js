module.exports = {
  extends: '4catalyzer-react',
  env: {
    browser: true,
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: {
          resolve: {
            alias: {
              astroturf$: `${__dirname}/../lib/index.js`,
            },
          },
        },
      },
    },
  },
};
