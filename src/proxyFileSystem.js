const uniq = require('lodash/uniq');

const withSyncMethod = (methods, name) => [...methods, name, `${name}Sync`];

const TO_PROXY = ['exists', 'readFile', 'writeFile', 'stat', 'unlink']
  .reduce(withSyncMethod, [])
  .concat(['createReadStream', 'createWriteStream']);

/**
 * Wrap the filesystem object so that fs actions on virtual files
 * are handled correctly
 */
export default function proxyFileSystem(realFs, virtualFs) {
  const proto = Object.getPrototypeOf(realFs);
  const fs = Object.create(proto);
  const proxiedMethods = { __isProxiedFileSystem: true };

  TO_PROXY.forEach((method) => {
    // only proxy methods present in the real fs
    if (typeof realFs[method] !== 'function') return;

    proxiedMethods[method] = function proxy(path, ...args) {
      if (!virtualFs.existsSync(path)) {
        return realFs[method](path, ...args);
      }

      if (!virtualFs[method]) {
        const err = new Error(
          `[VirtualModulePlugin] unsupport method: \`${method}\`` +
            ` on virtual file: \`${path}\`.`,
        );

        if (method.endsWith('Sync')) throw err;
        else return args.pop()(err);
      }
      return virtualFs[method](path, ...args);
    };
  });

  proxiedMethods.readdirSync = function readdirSync(dirPath) {
    const virtualFiles = virtualFs.existsSync(dirPath)
      ? virtualFs.readdirSync(dirPath)
      : [];

    return uniq([...realFs.readdirSync(dirPath), ...virtualFiles]);
  };

  proxiedMethods.readdir = function readdir(dirPath, cb) {
    realFs.readdir(dirPath, (err, realFiles) => {
      if (err) return cb(err);

      const virtualFiles = virtualFs.existsSync(dirPath)
        ? virtualFs.readdirSync(dirPath)
        : [];

      return cb(null, uniq([...realFiles, ...virtualFiles]));
    });
  };

  return Object.assign(fs, realFs, proxiedMethods);
}
