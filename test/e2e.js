import webpack from 'webpack';

import getConfig from './webpack.config';

process.env.NODE_ENV = 'development';

webpack(
  [
    getConfig('styled'),
    // getConfig('example'),
  ],
  (err, result) => {
    // console.log(err, result.compilation.errors[0]); // eslint-disable-line no-console
  },
);
