import { parse } from 'babylon';
import _traverse, { Hub, NodePath } from 'babel-traverse';


function buildCodeFrameError(node, message, Error) {
  // eslint-disable-next-line no-underscore-dangle
  const loc = node && (node.loc || node._loc);
  if (loc) {
    return new Error(`${message} (${loc.start.line}:${loc.start.column})`);
  }
  return new Error(message);
}

function parseSource(src) {
  return parse(src, {
    sourceType: 'module',
    plugins: [
      'asyncFunctions',
      'jsx',
      'flow',
      'classConstructorCall',
      'doExpressions',
      'trailingFunctionCommas',
      'objectRestSpread',
      'decorators',
      'classProperties',
      'exportExtensions',
      'exponentiationOperator',
      'asyncGenerators',
      'functionBind',
      'functionSent',
    ],
  });
}


export default function traverse(source, visitors) {
  const ast = parseSource(source);
  // https://github.com/babel/babel/issues/4640
  const hub = new Hub({ buildCodeFrameError });
  const path = NodePath.get({
    hub,
    parentPath: null,
    parent: ast,
    container: ast,
    key: 'program',
  });

  return _traverse(ast, visitors, path.setContext().scope);
}
