import _traverse, { Hub, NodePath } from 'babel-traverse';

function buildCodeFrameError(node, message, Error) {
  let loc = node && (node.loc || node._loc);
  if (loc) {
    return new Error(`${message} (${loc.start.line}:${loc.start.column})`)
  }
  return  new Error(message)
}

export default function traverse(ast, visitors) {
  // https://github.com/babel/babel/issues/4640
  let hub = new Hub({ buildCodeFrameError })
  let path = NodePath.get({
    hub,
    parentPath: null,
    parent: ast,
    container: ast,
    key: 'program'
  });

  return _traverse(ast, visitors, path.setContext().scope)
}
