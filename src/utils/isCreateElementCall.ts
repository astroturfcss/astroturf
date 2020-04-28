import * as T from '@babel/types';
import { NodePath } from '@babel/core';

export default function isCreateElementCall(
  p: NodePath,
): p is NodePath<T.CallExpression> {
  return (
    p.isCallExpression() &&
    (p.get('callee.property') as any).node &&
    (p.get('callee.property') as any).node.name === 'createElement'
  );
}
