import * as t from '@babel/types';

export default function normalizeAttrs(node?: t.Node) {
  if (!node) return t.nullLiteral();
  if (!t.isObjectExpression(node)) return node;

  const { properties } = node;

  const propsIdent = t.identifier('props');
  return t.arrowFunctionExpression(
    [propsIdent],
    t.objectExpression([t.spreadElement(propsIdent), ...properties]),
  );
}
