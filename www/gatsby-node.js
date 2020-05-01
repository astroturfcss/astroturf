/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */

const path = require('path');

const { createWebpackRule } = require('gatsby-plugin-css');

const postcssConfig = require('./postcss.config');

exports.onCreateWebpackConfig = ({ actions, ...api }) => {
  const {
    oneOf: [moduleRule],
  } = createWebpackRule({
    api,
    modulesTest: /\.astroturf$/,
    useCssModuleLoader: true,
    postcssPlugins: postcssConfig.config,
  });

  // console.log('H', moduleRule);

  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: require.resolve('../lib/loader'),
            options: {
              extension: '.astroturf',
              enableCssProp: true,
              experiments: {
                modularCssExternals: true,
              },
            },
          },
        },
        moduleRule,
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
