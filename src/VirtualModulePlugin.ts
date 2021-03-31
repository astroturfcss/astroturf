/* eslint-disable no-underscore-dangle */
// taken from https://github.com/sysgears/webpack-virtual-modules/commit/ace8630bae211e297d1de0408c65c4d54f41b187

import path from 'path';
import util from 'util';

import webpack from 'webpack';
import VirtualStats from 'webpack-virtual-modules/virtual-stats';

const debug = util.debuglog('webpack-virtual-modules');
let inode = 45000000;

function createWebpackData(result: any) {
  return (backendOrStorage: any) => {
    // In Webpack v5, this variable is a "Backend", and has the data stored in a field
    // _data. In V4, the `_` prefix isn't present.
    if (backendOrStorage._data) {
      return {
        result,
        level: backendOrStorage._levels[backendOrStorage._currentLevel],
      };
    }
    // Webpack 4
    return [null, result];
  };
}

function getData(storage, key) {
  // Webpack 5
  if (storage._data instanceof Map) {
    return storage._data.get(key);
  }
  if (storage._data) {
    return storage.data[key];
  }
  if (storage.data instanceof Map) {
    // Webpack v4
    return storage.data.get(key);
  }
  return storage.data[key];
}

function setData(backendOrStorage, key, valueFactory) {
  const value = valueFactory(backendOrStorage);

  // Webpack v5
  if (backendOrStorage._data instanceof Map) {
    backendOrStorage._data.set(key, value);
  } else if (backendOrStorage._data) {
    backendOrStorage.data[key] = value;
  } else if (backendOrStorage.data instanceof Map) {
    // Webpack 4
    backendOrStorage.data.set(key, value);
  } else {
    backendOrStorage.data[key] = value;
  }
}

function getStatStorage(fileSystem) {
  if (fileSystem._statStorage) {
    // Webpack v4
    return fileSystem._statStorage;
  }
  if (fileSystem._statBackend) {
    // webpack v5
    return fileSystem._statBackend;
  }
  // Unknown version?
  throw new Error("Couldn't find a stat storage");
}

function getFileStorage(fileSystem) {
  if (fileSystem._readFileStorage) {
    // Webpack v4
    return fileSystem._readFileStorage;
  }
  if (fileSystem._readFileBackend) {
    // Webpack v5
    return fileSystem._readFileBackend;
  }
  throw new Error("Couldn't find a readFileStorage");
}

function getReadDirBackend(fileSystem) {
  if (fileSystem._readdirBackend) {
    return fileSystem._readdirBackend;
  }
  if (fileSystem._readdirStorage) {
    return fileSystem._readdirStorage;
  }
  throw new Error("Couldn't find a readDirStorage from Webpack Internals");
}

class VirtualModulesPlugin {
  private watcher: any;

  private compiler: any;

  static bootstrap(compilation) {
    const { compiler } = compilation;
    const plugin = new VirtualModulesPlugin();

    VirtualModulesPlugin.augmentFileSystem(compiler);

    plugin.apply(compiler);

    return plugin;
  }

  addFile = (filePath: string, contents: string) => {
    return this.writeModule(filePath, contents);
  };

  writeModule(filePath: string, contents: string) {
    if (!this.compiler) {
      throw new Error(
        'You must use this plugin only after creating webpack instance!',
      );
    }

    const len = contents ? contents.length : 0;
    const time = Date.now();
    const date = new Date(time);

    const stats = new VirtualStats({
      dev: 8675309,
      nlink: 0,
      uid: 1000,
      gid: 1000,
      rdev: 0,
      blksize: 4096,
      ino: inode++,
      mode: 33188,
      size: len,
      blocks: Math.floor(len / 4096),
      atime: date,
      mtime: date,
      ctime: date,
      birthtime: date,
    });

    debug(this.compiler.name, 'Write module:', filePath, contents);

    // When using the WatchIgnorePlugin (https://github.com/webpack/webpack/blob/52184b897f40c75560b3630e43ca642fcac7e2cf/lib/WatchIgnorePlugin.js),
    // the original watchFileSystem is stored in `wfs`. The following "unwraps" the ignoring
    // wrappers, giving us access to the "real" watchFileSystem.
    let finalWatchFileSystem = this.watcher && this.watcher.watchFileSystem;

    while (finalWatchFileSystem && finalWatchFileSystem.wfs) {
      finalWatchFileSystem = finalWatchFileSystem.wfs;
    }

    let finalInputFileSystem = this.compiler.inputFileSystem;
    while (finalInputFileSystem && finalInputFileSystem._inputFileSystem) {
      finalInputFileSystem = finalInputFileSystem._inputFileSystem;
    }

    finalInputFileSystem._writeVirtualFile(filePath, stats, contents);
    if (
      finalWatchFileSystem &&
      (finalWatchFileSystem.watcher.fileWatchers.size ||
        finalWatchFileSystem.watcher.fileWatchers.length)
    ) {
      const fileWatchers =
        'size' in finalWatchFileSystem.watcher.fileWatchers
          ? Array.from(finalWatchFileSystem.watcher.fileWatchers.values())
          : finalWatchFileSystem.watcher.fileWatchers;

      fileWatchers.forEach((fileWatcher) => {
        if (fileWatcher.path === filePath) {
          debug(this.compiler.name, 'Emit file change:', filePath, time);
          // delete fileWatcher.directoryWatcher._cachedTimeInfoEntries;
          fileWatcher.directoryWatcher.setFileTime(
            filePath,
            time,
            false,
            false,
            null,
          );
          // fileWatcher.emit('change', time, null);
        }
      });
    }
  }

  static augmentFileSystem(compiler: webpack.Compiler) {
    let finalInputFileSystem = compiler.inputFileSystem as any;
    while (finalInputFileSystem && finalInputFileSystem._inputFileSystem) {
      finalInputFileSystem = finalInputFileSystem._inputFileSystem;
    }

    if (!finalInputFileSystem._writeVirtualFile) {
      const originalPurge = finalInputFileSystem.purge;

      finalInputFileSystem.purge = function purge(...args) {
        originalPurge.apply(this, args);
        if (this._virtualFiles) {
          Object.keys(this._virtualFiles).forEach((file) => {
            const data = this._virtualFiles[file];
            this._writeVirtualFile(file, data.stats, data.contents);
          });
        }
      };

      finalInputFileSystem._writeVirtualFile = function writeVirtualFile(
        file: string,
        stats: any,
        contents: string,
      ) {
        const statStorage = getStatStorage(this);
        const fileStorage = getFileStorage(this);
        const readDirStorage = getReadDirBackend(this);
        this._virtualFiles = this._virtualFiles || {};
        this._virtualFiles[file] = { stats, contents };

        setData(statStorage, file, createWebpackData(stats));
        setData(fileStorage, file, createWebpackData(contents));

        if (compiler.fileTimestamps instanceof Map) {
          // FIXME
          compiler.fileTimestamps.set(file, +stats.mtime as any);
        }

        const segments = file.split(/[\\/]/);
        let count = segments.length - 1;
        const minCount = segments[0] ? 1 : 0;
        while (count > minCount) {
          const dir = segments.slice(0, count).join(path.sep) || path.sep;
          try {
            finalInputFileSystem.readdirSync(dir);
          } catch (e) {
            const time = Date.now();
            const dirStats = new VirtualStats({
              dev: 8675309,
              nlink: 0,
              uid: 1000,
              gid: 1000,
              rdev: 0,
              blksize: 4096,
              ino: inode++,
              mode: 16877,
              size: stats.size,
              blocks: Math.floor(stats.size / 4096),
              atime: time,
              mtime: time,
              ctime: time,
              birthtime: time,
            });

            setData(readDirStorage, dir, createWebpackData([]));
            setData(statStorage, dir, createWebpackData(dirStats));
          }
          let dirData = getData(readDirStorage, dir);
          // Webpack v4 returns an array, webpack v5 returns an object
          dirData = dirData[1] || dirData.result;
          const filename = segments[count];
          if (dirData.indexOf(filename) < 0) {
            const files = dirData.concat([filename]).sort();
            setData(getReadDirBackend(this), dir, createWebpackData(files));
          } else {
            break;
          }
          count--;
        }
      };
    }
  }

  apply(compiler: webpack.Compiler) {
    this.compiler = compiler;

    const watchRunHook = (watcher, callback) => {
      this.watcher = watcher.compiler || watcher;

      if (webpack.version.startsWith('4')) {
        const virtualFiles = (compiler.inputFileSystem as any)._virtualFiles;
        if (virtualFiles) {
          Object.keys(virtualFiles).forEach((file) => {
            if (compiler.fileTimestamps instanceof Map)
              compiler.fileTimestamps.set(
                file,
                +virtualFiles[file].stats.mtime as any,
              );
          });
        }
      }
      callback();
    };

    // compiler.hooks.afterEnvironment.tap('VirtualModulesPlugin', () => {
    //   VirtualModulesPlugin.afterEnvironmentHook(compiler);
    // });

    compiler.hooks.watchRun.tapAsync('VirtualModulesPlugin', watchRunHook);
  }
}

export default VirtualModulesPlugin;
