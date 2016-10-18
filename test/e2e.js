import webpack from 'webpack';

import getConfig from './webpack.config';

webpack(getConfig('./fixtures/example.js'), (err, result) => {
  console.log(err, result.compilation.errors[0])
})
