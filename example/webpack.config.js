const path = require('path');

const { rules, plugins } = require('webpack-atoms').createAtoms({
  env: 'development',
  useMiniExtract: true,
});

const inlineRule = rules.js();
inlineRule.use = [
  ...inlineRule.use,
  {
    loader: require.resolve('../lib/loader'),
    options: { extension: '.module.scss' },
  },
];

module.exports = {
  entry: './src/client.js',
  devtool: 'cheap-module-source-map',
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
  },

  module: {
    rules: [
      inlineRule,
      rules.css.modules(),
      {
        oneOf: [rules.sass.external(), rules.sass.modules()],
      },
    ],
  },
  mode: 'development',
  resolve: {
    alias: {
      'css-literal-loader': path.resolve(__dirname, '../'),
    },
  },
  plugins: [plugins.html()],
};
