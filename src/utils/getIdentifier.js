import * as t from '@babel/types';

export default function getIdentifier(path) {
  const parent = path.findParent(p => p.isVariableDeclarator());
  return parent && t.isIdentifier(parent.node.id) ? parent.node.id.name : '';
}
