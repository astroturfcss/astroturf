import webpack from 'webpack';

import getConfig from './webpack.config';

process.env.NODE_ENV = 'development';

webpack([
  getConfig('styled'),
  // getConfig('example'),
]);
