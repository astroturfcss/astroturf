import loaderUtils from 'loader-utils';

module.exports = function runLoader(...args) {
  const cb = this.async();
  const options = loaderUtils.getOptions(this);

  Promise.resolve(options.run.apply(this, args)).then(
    (result) => cb(null, ...[].concat(result)),
    (err) => cb(err),
  );
};
