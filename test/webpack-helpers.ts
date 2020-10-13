import path from 'path';

import MemoryFS from 'memory-fs';
import webpack from 'webpack';

export function readAsset(
  asset: string,
  compiler: webpack.Compiler,
  stats: webpack.Stats,
) {
  const usedFs = compiler.outputFileSystem;
  const outputPath = stats.compilation.outputOptions.path;

  let data = '';
  let targetFile = asset;

  const queryStringIdx = targetFile.indexOf('?');

  if (queryStringIdx >= 0) {
    targetFile = targetFile.substr(0, queryStringIdx);
  }

  try {
    data = (usedFs as any)
      .readFileSync(path.join(outputPath, targetFile))
      .toString();
  } catch (error) {
    data = error.toString();
  }

  return data;
}

export function readAssets(compiler: webpack.Compiler, stats: webpack.Stats) {
  const assets: Record<string, string> = {};

  Object.keys(stats.compilation.assets).forEach((asset) => {
    assets[asset] = readAsset(asset, compiler, stats);
  });

  return assets;
}

export function getModuleSource(id: string, stats: webpack.Stats) {
  const { modules } = stats.toJson({ source: true });
  const module = modules.find((m: any) => m.name.endsWith(id));
  let { source } = module;

  // Todo remove after drop webpack@4 support
  source = source.replace(/\?\?.*!/g, '??[ident]!');

  return source;
}

export function runWebpack(config: webpack.Configuration) {
  const compiler = webpack({
    ...config,
    output: {
      filename: '[name].js',
      path: '/build',
    },
    optimization: {
      ...config.optimization,
      runtimeChunk: true,
      splitChunks: {
        chunks: 'initial',
      },
    },
  });
  compiler.outputFileSystem = new MemoryFS();

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
        return;
      }

      if (stats!.hasErrors()) {
        const { errors, warnings } = stats!.toJson();

        reject(
          Object.assign(new Error(), {
            errors,
            warnings,
            framesToPop: 1,
            ...errors[0],
          }),
        );
        return;
      }
      resolve(readAssets(compiler, stats!));
    });
  });
}
