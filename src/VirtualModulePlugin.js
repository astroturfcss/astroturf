import path from 'path';
import MemoryFileSystem from 'memory-fs';

import proxyFileSystem from './proxyFileSystem';


class VirtualModulePlugin {
  /**
   * Apply an instance of the plugin to compilation.
   * helpful for adding hte plugin inside a loader.
   */
  static bootstrap(compilation, files) {
    const { compiler } = compilation;
    const plugin = new VirtualModulePlugin(files);

    plugin.augmentCompilerFileSystem(compiler);
    compilation.inputFileSystem = compiler.inputFileSystem;

    return plugin;
  }

  constructor(files) {
    this.fs = new MemoryFileSystem();

    if (files) {
      Object.keys(files).forEach(key => this.addFile(key, files[key]));
    }
  }

  addFile = (virtualPath, content) => {
    this.fs.mkdirpSync(path.dirname(virtualPath));
    this.fs.writeFileSync(virtualPath, content);
  }

  augmentCompilerFileSystem(compiler) {
    if (this.augmented === true) {
      return;
    }

    const fs = proxyFileSystem(compiler.inputFileSystem, this.fs);

    compiler.inputFileSystem = fs;
    compiler.resolvers.normal.fileSystem = fs;
    compiler.resolvers.context.fileSystem = fs;
    compiler.resolvers.loader.fileSystem = fs;
    this.augmented = true;
  }

  apply(compiler) {
    // if the fs is already present then immediately augment it
    if (compiler.inputFileSystem) {
      this.augmentCompilerFileSystem(compiler);
    }

    compiler.plugin('compile', () => {
      this.augmentCompilerFileSystem(compiler);
    });

    // Augment the loader context so that loaders can neatly
    // extract source strings to virtual files.
    compiler.plugin('compilation', compilation => compilation
      .plugin('normal-module-loader', (loaderContext) => {
        loaderContext.emitVirtualFile = this.addFile;
      })
    );
  }
}

export default VirtualModulePlugin;
