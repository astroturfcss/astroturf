import { parse } from 'babylon';
import { codeFrameColumns } from '@babel/code-frame';
import _traverse, { Hub, NodePath } from '@babel/traverse';

function parseSource(src) {
  return parse(src, {
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
  });
}

export default function traverse(source, visitors, opts) {
  const ast = parseSource(source);

  // https://github.com/babel/babel/issues/4640 (closed but reverted)
  const hub = new Hub({
    buildCodeFrameError(node, message) {
      let msg = `[css-literal-loader] ${message}`;
      // eslint-disable-next-line no-underscore-dangle
      const loc = node && (node.loc || node._loc);
      if (loc) {
        msg = `${msg} (${loc.start.line}:${loc.start.column})\n`;
        msg += codeFrameColumns(source, loc);
      }
      return new Error(msg);
    },
  });

  const path = NodePath.get({
    hub,
    parentPath: null,
    parent: ast,
    container: ast,
    key: 'program',
  });

  try {
    return _traverse(ast, visitors, path.setContext().scope, { opts });
  } catch (err) {
    if (!err.message || !err.message.includes('[css-literal-loader]')) {
      err.message += `[css-literal-loader] ${err.message || ''}`;
    }
    throw err;
  }
}
