import path from 'path';

import { transformSync } from '@babel/core';

import plugin from './plugin';

export default function traverse(source, map, filename, opts) {
  const extname = path.extname(filename);

  return transformSync(source, {
    filename,
    babelrc: false,
    code: true,
    ast: false,
    plugins: [[plugin, opts]],
    inputSourceMap: map || undefined,
    sourceMaps: true,
    parserOpts: {
      allowImportExportEverywhere: true,
      allowReturnOutsideFunction: true,
      allowSuperOutsideMethod: true,
      sourceType: 'unambiguous',
      filenameRelative: filename,

      plugins: [
        'jsx',
        extname === '.ts' || extname === '.tsx' ? 'typescript' : 'flow',
        'doExpressions',
        'objectRestSpread',
        ['decorators', { decoratorsBeforeExport: true }],
        'classProperties',
        'classPrivateProperties',
        'classPrivateMethods',
        'exportDefaultFrom',
        'exportNamespaceFrom',
        'asyncGenerators',
        'functionBind',
        'functionSent',
        'dynamicImport',
        'numericSeparator',
        'optionalChaining',
        'importMeta',
        'bigInt',
        'optionalCatchBinding',
        'throwExpressions',
        ['pipelineOperator', { proposal: 'minimal' }],
        'nullishCoalescingOperator',
      ],
    },
  });
}
