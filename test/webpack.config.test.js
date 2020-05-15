import path from 'path';

module.expprts = {
  devtool: false,
  mode: 'development',
  entry: {
    main: require.resolve('./test/main.js'),
    vendor: ['react', 'react-dom', 'astroturf', 'astroturf/react'],
  },
  optimization: {
    sideEffects: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules|astroturf\/src/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              plugins: ['@babel/plugin-transform-react-jsx'],
            },
          },
          {
            loader: require.resolve('../src/loader.ts'),
            options: {},
          },
        ],
      },
    ],
  },
  plugins: [],
  resolve: {
    modules: ['node_modules', 'shared'],
    alias: {
      astroturf: path.resolve(__dirname, '../src/runtime'),
    },
  },
  resolveLoader: {
    alias: {
      // this resolves the mocked value back to the file, which
      // prevents snapshots from including file paths
      'astroturf/css-loader': require.resolve('../src/css-loader'),
    },
  },
};
