import * as t from '@babel/types';

export default function normalizeAttrs(node) {
  if (!node) return t.NullLiteral();
  if (!t.isObjectExpression(node)) return node;

  const { properties } = node;

  const propsIdent = t.Identifier('props');
  return t.ArrowFunctionExpression(
    [propsIdent],
    t.ObjectExpression([t.SpreadElement(propsIdent), ...properties]),
  );
}
