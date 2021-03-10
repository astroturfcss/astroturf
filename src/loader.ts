/* eslint-disable global-require */

import loaderUtils from 'loader-utils';

module.exports = function astroturfLoader(...args) {
  const { useAltLoader = false } = loaderUtils.getOptions(this) || {};

  const loader = useAltLoader
    ? require('./inline-loader')
    : require('./vfs-loader');

  return loader.apply(this, args);
};
