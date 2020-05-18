import { createHash } from 'crypto';
import path from 'path';
import Stream from 'stream';
import util from 'util';

import errors from 'errno';
import MemoryFileSystemError from 'memory-fs/lib/MemoryFileSystem';

const debug = util.debuglog('astroturf:memory-fs');

const returnsTrue = () => true;
const returnsFalse = () => false;

const md5 = (input: string) => {
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
  private paths = new Map<string, any>();

  constructor() {
    ['stat', 'readdir', 'rmdir', 'unlink', 'readFile', 'writeFile'].forEach(
      (fn) => {
        this[fn] = (...args: any[]) => {
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

  addFile = (p: string, data: any, forceTimeUpdate = false) => {
    p = path.normalize(p);
    const hash = md5(data);
    const existing = this.paths.get(p);

    const keepTime = !forceTimeUpdate && existing && existing.hash === hash;
    if (!keepTime)
      debug(
        `${existing ? 'modifying' : 'writing'} file ${path.relative(
          process.cwd(),
          p,
        )} [${hash}]`,
      );

    const now = new Date();

    const mtime = keepTime ? existing.mtime : now;

    const stats = {
      hash,
      path: p,
      contents: Buffer.isBuffer(data) ? data : Buffer.from(data),

      birthtime: existing ? existing.birthtime : now,
      ctime: existing ? existing.ctime : now,
      atime: existing ? existing.atime : now,
      mtime,
    };

    this.paths.set(p, stats);

    return [stats, !keepTime] as const;
  };

  getPaths = () => this.paths;

  exists = (p: any, cb: (exists: boolean) => void) => cb(this.existsSync(p));

  existsSync = (p: string) => this.paths.has(path.normalize(p));

  statSync = (p: string) => {
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

  readFileSync = (p: string, optsOrEncoding?: any) => {
    p = path.normalize(p);

    if (!this.existsSync(p))
      throw new MemoryFileSystemError(errors.code.ENOENT, p, 'readFile');

    return read(this.paths.get(p), optsOrEncoding);
  };

  readdirSync = (p: string) => {
    const results = [] as string[];
    p = path.normalize(p);
    this.paths.forEach((_, key) => {
      if (key.startsWith(p)) results.push(key);
    });
    return results;
  };

  rmdirSync = (p: string) => {
    p = path.normalize(p);

    this.paths.forEach((_, key) => {
      if (p.startsWith(key)) this.unlinkSync(key);
    });
  };

  unlinkSync = (p: string) => this.paths.delete(p);

  writeFileSync = (p: string, data: any) => {
    this.addFile(p, data, true);
  };

  /** stream methods taken from memory-fs */
  createReadStream(p, options) {
    const stream = new Stream.Readable();
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
    const stream = new Stream.Writable();
    try {
      // @ts-ignore
      this.writeFileSync(p, Buffer.from(0));
    } catch (e) {
      stream.once('prefinish', () => {
        stream.emit('error', e);
      });
      return stream;
    }
    const bl = [] as any[];
    let len = 0;

    // eslint-disable-next-line no-underscore-dangle
    stream._write = (chunk, _, callback) => {
      bl.push(chunk);
      len += chunk.length;
      this.writeFile(p, Buffer.concat(bl, len), callback);
    };
    return stream;
  }

  writeFile(
    _p: string,
    _data: any,
    _callback: (error?: Error | null | undefined) => void,
  ) {
    throw new Error('Method not implemented.');
  }
}

export default MemoryFs;
