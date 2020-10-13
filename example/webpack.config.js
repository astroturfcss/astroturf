const path = require('path');

process.traceDeprecation = true;

const { rules, plugins, loaders } = require('webpack-atoms').createAtoms({
  env: 'development',
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
  devServer: {
    stats: 'minimal',
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
  },

  module: {
    rules: [inlineRule, rules.sass()],
  },
  mode: 'development',
  resolve: {
    alias: {
      astroturf: path.resolve(__dirname, '../lib'),
    },
  },
  plugins: [plugins.html()],
};
