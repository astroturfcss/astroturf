import path from 'path';

import { transformSync } from '@babel/core';

import plugin from './plugin';
import { ResolvedOptions } from './types';

export default function traverse(
  source: string,
  filename: string,
  opts: Partial<ResolvedOptions>,
) {
  const extname = path.extname(filename);

  return transformSync(source, {
    filename,
    babelrc: false,
    configFile: false,
    code: false,
    ast: false,
    plugins: [[plugin, opts]],
    sourceType: 'unambiguous',
    parserOpts: {
      allowImportExportEverywhere: true,
      allowReturnOutsideFunction: true,
      allowSuperOutsideMethod: true,
      sourceType: 'unambiguous',
      sourceFilename: filename,

      plugins: [
        'jsx',
        extname === '.ts' || extname === '.tsx' ? 'typescript' : 'flow',
        'doExpressions',
        'objectRestSpread',
        'decorators-legacy',
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
