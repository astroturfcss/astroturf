import path from 'path';
import MemoryFileSystem from 'memory-fs';

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
    if (compiler.resolverFactory.cache1)
      compiler.resolverFactory.cache1 = new WeakMap();
    if (compiler.resolverFactory.cache1)
      compiler.resolverFactory.cache2.clear();

    return plugin;
  }

  constructor(files) {
    this.fs = new MemoryFileSystem();

    if (files) {
      Object.keys(files).forEach(key => {
        this.addFile(key, files[key]);
      });
    }
  }

  addFile = (virtualPath, content) => {
    this.fs.mkdirpSync(path.dirname(virtualPath));
    this.fs.writeFileSync(virtualPath, content);
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
    }

    this.augmented = true;
  }

  apply(compiler) {
    const augmentOnCompile = () => {
      this.augmentCompilerFileSystem(compiler);
    };
    const augmentLoaderCOntext = loaderContext => {
      loaderContext.emitVirtualFile = this.addFile;
    };

    // if the fs is already present then immediately augment it
    if (compiler.inputFileSystem) this.augmentCompilerFileSystem(compiler);

    if (compiler.hooks) {
      compiler.hooks.compile.tap(PLUGIN, augmentOnCompile);
      compiler.hooks.compilation.tap(PLUGIN, compilation => {
        compilation.hooks.normalModuleLoader.tap(PLUGIN, augmentLoaderCOntext);
      });
    } else {
      compiler.plugin('compile', augmentOnCompile);
      compiler.plugin('compilation', compilation => {
        compilation.plugin('normal-module-loader', augmentLoaderCOntext);
      });
    }
  }
}

export default VirtualModulePlugin;
