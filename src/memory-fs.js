const path = require('path');

const { createHash } = require(`crypto`);
const errors = require('errno');
const util = require('util');
const { ReadableStream, WritableStream } = require('stream');
const MemoryFileSystemError = require('memory-fs/lib/MemoryFileSystem');

const debug = util.debuglog('astroturf:memory-fs');

const returnsTrue = () => true;
const returnsFalse = () => false;

const md5 = input => {
  const hash = createHash('md5');
  hash.update(input);
  return hash.digest('hex');
};

const read = (file, optsOrEncoding) => {
  const encoding = optsOrEncoding?.encoding || optsOrEncoding;

  file.atime = new Date();

  return encoding ? file.contents.toString(encoding) : file.contents;
};

/**
 * A simple in memorry ponyfill of the node fs that stores objects in memory.
 * We don't use `memory-fs` because our use-case is much narrower (only need files not dirs)
 * and it doesn't support stat timestamps
 */
class MemoryFs {
  constructor() {
    this.paths = new Map();

    ['stat', 'readdir', 'rmdir', 'unlink', 'readFile', 'writeFile'].forEach(
      fn => {
        this[fn] = (...args) => {
          const cb = args.pop();
          let result;
          try {
            result = this[`${fn}Sync`](...args);
          } catch (err) {
            setImmediate(() => cb(err));
            return;
          }
          setImmediate(() => cb(null, result));
        };
      },
    );
  }

  addFile = (p, data, updateMtime = false) => {
    p = path.normalize(p);
    const hash = md5(data);
    const existing = this.paths.get(p);

    const keepTime = !updateMtime && existing && existing.hash === hash;
    if (!keepTime)
      debug(
        `${existing ? 'modifying' : 'writing'} file ${path.relative(
          process.cwd(),
          p,
        )} [${hash}]`,
      );

    this.paths.set(p, {
      hash,
      contents: Buffer.from(data),

      birthtime: existing ? existing.birthtime : new Date(),
      ctime: existing ? existing.ctime : new Date(),
      atime: existing ? existing.atime : new Date(),
      mtime:
        !updateMtime && existing && existing.hash === hash
          ? existing.mtime
          : new Date(),
    });
  };

  exists = (p, cb) => cb(this.existsSync(p));

  existsSync = p => this.paths.has(path.normalize(p));

  statSync = p => {
    const file = this.paths.get(path.normalize(p));
    if (file)
      return {
        mtime: file.mtime,
        atime: file.atime,
        ctime: file.ctime,
        birthtime: file.birthtime,

        mtimeMs: file.mtime.getTime(),
        atimeMs: file.atime.getTime(),
        ctimeMs: file.ctime.getTime(),
        birthtimeMs: file.birthtime.getTime(),

        // birthtime: file.birthtime,
        isFile: returnsTrue,
        isDirectory: returnsFalse,
        isBlockDevice: returnsFalse,
        isCharacterDevice: returnsFalse,
        isSymbolicLink: returnsFalse,
        isFIFO: returnsFalse,
        isSocket: returnsFalse,
      };

    throw new MemoryFileSystemError(errors.code.ENOENT, p, 'stat');
  };

  readFileSync = (p, optsOrEncoding) => {
    p = path.normalize(p);

    if (!this.existsSync(p))
      throw new MemoryFileSystemError(errors.code.ENOENT, p, 'readFile');

    return read(this.paths.get(p), optsOrEncoding);
  };

  readdirSync = p => {
    const results = [];
    p = path.normalize(p);
    this.paths.forEach((_, key) => {
      if (key.startsWith(p)) results.push(key);
    });
  };

  rmdirSync = p => {
    p = path.normalize(p);

    this.paths.forEach((_, key) => {
      if (p.startsWith(key)) this.unlinkSync(key);
    });
  };

  unlinkSync = p => this.paths.delete(p);

  writeFileSync = (p, data) => {
    this.addFile(p, data, true);
  };

  /** stream methods taken from memory-fs */
  createReadStream(p, options) {
    const stream = new ReadableStream();
    let done = false;
    let data;
    try {
      data = this.readFileSync(p);
    } catch (e) {
      // eslint-disable-next-line no-underscore-dangle
      stream._read = function $read() {
        if (done) return;
        done = true;
        this.emit('error', e);
        this.push(null);
      };
      return stream;
    }

    options = options || {};
    options.start = options.start || 0;
    options.end = options.end || data.length;

    // eslint-disable-next-line no-underscore-dangle
    stream._read = function $read() {
      if (done) return;
      done = true;
      this.push(data.slice(options.start, options.end));
      this.push(null);
    };
    return stream;
  }

  createWriteStream(p) {
    const stream = new WritableStream();
    try {
      this.writeFileSync(p, Buffer.from(0));
    } catch (e) {
      stream.once('prefinish', () => {
        stream.emit('error', e);
      });
      return stream;
    }
    const bl = [];
    let len = 0;

    // eslint-disable-next-line no-underscore-dangle
    stream._write = (chunk, encoding, callback) => {
      bl.push(chunk);
      len += chunk.length;
      this.writeFile(p, Buffer.concat(bl, len), callback);
    };
    return stream;
  }
}

module.exports = MemoryFs;
