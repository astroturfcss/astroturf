/**
 * @jest-environment node
 */

import fs from 'fs';
import ExtractCSS from 'mini-css-extract-plugin';
import webpack from 'webpack';

const outputPath = `${__dirname}/build`;
describe('webpack integration', () => {
  let compiler;

  beforeEach(() => {
    compiler = webpack({
      devtool: false,
      mode: 'development',
      entry: require.resolve('./integration'),
      output: {
        path: outputPath,
      },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              ExtractCSS.loader,
              // require.resolve('../src/css-loader'),
              {
                loader: 'css-loader',
                options: { modules: true, importLoaders: 1 },
              },
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss-astroturf',
                  plugins: [require('postcss-nested')()], // eslint-disable-line global-require
                },
              },
            ],
          },
          {
            test: /\.jsx?$/,
            use: ['babel-loader', require.resolve('../src/loader')],
          },
        ],
      },
      resolve: {
        alias: {
          astroturf: require.resolve('../src/runtime/styled'),
        },
      },
      plugins: [new ExtractCSS()],
    });
  });

  it('should work', done => {
    compiler.run((err, stats) => {
      console.log(stats.toJson().errors);
      expect(err).toBe(null);
      expect(stats.hasErrors()).toBe(false);
      expect(stats.hasWarnings()).toBe(false);

      expect(
        fs.readFileSync(`${outputPath}/main.css`, 'utf8'),
      ).toMatchSnapshot();

      done();
    });
  });
});
