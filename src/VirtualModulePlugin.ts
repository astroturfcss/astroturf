import MemoryFs from './memory-fs';
import proxyFileSystem from './proxyFileSystem';

const PLUGIN = 'css-literal-loader';

class VirtualModulePlugin {
  augmented = false;

  fs: MemoryFs;

  private watcher: any;

  /**
   * Apply an instance of the plugin to compilation.
   * helpful for adding the plugin inside a loader.
   */
  static bootstrap(compilation: any, files?: any) {
    const { compiler } = compilation;
    const plugin = new VirtualModulePlugin(files);

    plugin.augmentCompilerFileSystem(compiler);
    compilation.inputFileSystem = compiler.inputFileSystem;

    // v3
    if (!compiler.resolverFactory) return plugin;

    // this is suuuch a hack
    // we need to ensure that resolvers are rebuilt with the new filesystem, and
    // I don't know the right way to do that.

    // pre 4.36.1 this cache also existed
    if (compiler.resolverFactory.cache1)
      compiler.resolverFactory.cache1 = new WeakMap();

    // >=4.36.1 this one is needed
    if (compiler.resolverFactory.cache2)
      compiler.resolverFactory.cache2.clear();

    // >=5
    if (compiler.resolverFactory.cache) {
      compiler.resolverFactory.cache.clear();
    }

    return plugin;
  }

  constructor(files) {
    this.fs = new MemoryFs();

    if (files) {
      Object.keys(files).forEach((key) => {
        this.addFile(key, files[key]);
      });
    }
  }

  addFile = (virtualPath: string, content: any) => {
    const [{ path, mtime }, changed] = this.fs.addFile(virtualPath, content);

    if (changed) {
      this.watcher?._onChange(path, mtime, path, 'astroturf changed');
    }
  };

  getWatcher(compiler: any) {
    // https://github.com/sysgears/webpack-virtual-modules/blob/5e3ddccb5e09a1234ec53e94bd080cc979ae3ef4/index.js#L96
    //
    // When using the WatchIgnorePlugin (https://github.com/webpack/webpack/blob/52184b897f40c75560b3630e43ca642fcac7e2cf/lib/WatchIgnorePlugin.js),
    // the original watchFileSystem is stored in `wfs`. The following "unwraps" the ignoring
    // wrappers, giving us access to the "real" watchFileSystem.
    let finalWatchFileSystem = compiler.watchFileSystem;
    while (finalWatchFileSystem && finalWatchFileSystem.wfs) {
      finalWatchFileSystem = finalWatchFileSystem.wfs;
    }
    return finalWatchFileSystem?.watcher;
  }

  augmentCompilerFileSystem(compiler: any) {
    if (this.augmented === true) {
      return;
    }

    const fs = proxyFileSystem(compiler.inputFileSystem, this.fs);

    this.watcher = this.getWatcher(compiler);

    compiler.inputFileSystem = fs;

    if (!compiler.hooks) {
      compiler.resolvers.normal.fileSystem = fs;
      compiler.resolvers.context.fileSystem = fs;
      compiler.resolvers.loader.fileSystem = fs;
    } else {
      /**
       * When webpack is in watch mode, the map of file timestamps is computed
       * from the watcher instance, which uses the real filesystem and as a
       * result the virtual css files are not found in this map.
       * To correct this, we manually add these files to the map here.
       * @see https://github.com/4Catalyzer/astroturf/pull/381
       */
      compiler.hooks.watchRun.tapAsync(
        'astroturf',
        (nextCompiler, callback) => {
          this.watcher = this.getWatcher(nextCompiler);
          this.fs.getPaths().forEach((value, key) => {
            const mtime = +value.mtime;
            nextCompiler.fileTimestamps.set(key, mtime);
          });
          callback();
        },
      );
    }

    this.augmented = true;
  }

  apply(compiler) {
    const augmentOnCompile = () => {
      this.augmentCompilerFileSystem(compiler);
    };
    const augmentLoaderContext = (loaderContext) => {
      loaderContext.emitVirtualFile = this.addFile;
    };

    // if the fs is already present then immediately augment it
    if (compiler.inputFileSystem) this.augmentCompilerFileSystem(compiler);

    if (compiler.hooks) {
      compiler.hooks.compile.tap(PLUGIN, augmentOnCompile);
      compiler.hooks.compilation.tap(PLUGIN, (compilation) => {
        compilation.hooks.normalModuleLoader.tap(PLUGIN, augmentLoaderContext);
      });
    } else {
      compiler.plugin('compile', augmentOnCompile);
      compiler.plugin('compilation', (compilation) => {
        compilation.plugin('normal-module-loader', augmentLoaderContext);
      });
    }
  }
}

export default VirtualModulePlugin;
