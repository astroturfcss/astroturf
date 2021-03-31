const path = require('path');

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: require.resolve('../lib/loader'),
            options: {
              extension: '.astroturf.module.css',
              enableCssProp: true,
              experiments: {
                modularCssExternals: true,
              },
            },
          },
        },
      ],
    },
    resolve: {
      alias: {
        astroturf: path.resolve(__dirname, '../src/runtime'),
      },
    },
  });
};

exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelOptions({
    options: {
      babelrcRoots: true,
    },
  });
};
