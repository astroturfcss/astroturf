import MemoryFs from './memory-fs';
import proxyFileSystem from './proxyFileSystem';

const PLUGIN = 'css-literal-loader';

class VirtualModulePlugin {
  /**
   * Apply an instance of the plugin to compilation.
   * helpful for adding the plugin inside a loader.
   */
  static bootstrap(compilation, files) {
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

    return plugin;
  }

  constructor(files) {
    this.fs = new MemoryFs();

    if (files) {
      Object.keys(files).forEach(key => {
        this.addFile(key, files[key]);
      });
    }
  }

  addFile = (virtualPath, content) => {
    this.fs.addFile(virtualPath, content);
  };

  augmentCompilerFileSystem(compiler) {
    if (this.augmented === true) {
      return;
    }

    const fs = proxyFileSystem(compiler.inputFileSystem, this.fs);

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
        ({ fileTimestamps }, callback) => {
          this.fs.getPaths().forEach((value, key) => {
            const mtime = +value.mtime;
            fileTimestamps.set(key, mtime);
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
    const augmentLoaderContext = loaderContext => {
      loaderContext.emitVirtualFile = this.addFile;
    };

    // if the fs is already present then immediately augment it
    if (compiler.inputFileSystem) this.augmentCompilerFileSystem(compiler);

    if (compiler.hooks) {
      compiler.hooks.compile.tap(PLUGIN, augmentOnCompile);
      compiler.hooks.compilation.tap(PLUGIN, compilation => {
        compilation.hooks.normalModuleLoader.tap(PLUGIN, augmentLoaderContext);
      });
    } else {
      compiler.plugin('compile', augmentOnCompile);
      compiler.plugin('compilation', compilation => {
        compilation.plugin('normal-module-loader', augmentLoaderContext);
      });
    }
  }
}

export default VirtualModulePlugin;
