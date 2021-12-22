/* eslint-disable global-require */

module.exports = function astroturfLoader(...args) {
  const { useAltLoader = false } = (this as any).getOptions() || {};

  const loader = useAltLoader
    ? require('./inline-loader')
    : require('./vfs-loader');

  return loader.apply(this, args);
};
