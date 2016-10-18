
let withSyncMethod = (methods, name) => ([...methods, name, `${name}Sync`]);

const TO_PROXY = ['exists', 'readFile', 'writeFile', 'stat', 'unlink', 'readlink']
  .reduce(withSyncMethod, [])
  .concat(['createReadStream', 'createWriteStream'])

/**
 * Wrap the filesystem object so that fs actions on virtual files
 * are handled correctly
 */
export default function proxyFileSystem(realFs, virtualFs) {
  let proto = Object.getPrototypeOf(realFs)
  let fs = Object.create(proto);
  let proxiedMethods = { __isProxiedFileSystem: true }

  TO_PROXY.forEach(method => {
    proxiedMethods[method] = function proxy(path, ...args) {
      if (!virtualFs.existsSync(path))
        return realFs[method](path, ...args);

      if (!virtualFs[method]) {
        let err = new Error(
          '[VirtualModulePlugin] unsupport method: `' + method +
          '` on virtual file: `' + path + '`.'
        )
        if (method.match(/Sync$/)) throw err
        else return args.pop()(err)
      }
      return virtualFs[method](path, ...args);
    }
  })

  return Object.assign(fs, realFs, proxiedMethods)
}
