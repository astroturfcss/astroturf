import { NodePath } from '@babel/core';
import * as t from '@babel/types';

export default function hasAttrs(
  calleePath: NodePath,
): calleePath is NodePath<t.MemberExpression> {
  return (
    calleePath.isMemberExpression() &&
    (calleePath.get('property') as any).node.name === 'attrs'
  );
}
