import { transformSync } from '@babel/core';

import plugin from './plugin';

export default function traverse(source, filename, opts) {
  return transformSync(source, {
    filename,
    babelrc: false,
    code: false,
    ast: false,
    plugins: [[plugin, opts]],
    parserOpts: {
      allowImportExportEverywhere: true,
      allowReturnOutsideFunction: true,
      allowSuperOutsideMethod: true,
      sourceType: 'unambigious',
      sourceFilename: true,
      plugins: [
        'jsx',
        'flow',
        'doExpressions',
        'objectRestSpread',
        'decorators',
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
        'pipelineOperator',
        'nullishCoalescingOperator',
      ],
    },
  });
}
