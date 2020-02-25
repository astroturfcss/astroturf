const path = require('path');

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
    rules: [
      inlineRule,
      {
        oneOf: [
          rules.sass.external(),
          {
            test: /\.module\.scss/,
            use: [
              loaders.style(),
              require.resolve('../lib/css-loader'),
              loaders.sass(),
            ],
          },
        ],
      },
    ],
  },
  mode: 'development',
  resolve: {
    alias: {
      astroturf: path.resolve(__dirname, '../lib'),
    },
  },
  plugins: [plugins.html()],
};
