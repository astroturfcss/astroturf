import { NodePath } from '@babel/core';

import getMembers from './getMembers';
import pascalCase from './pascalCase';
import truthy from './truthy';

const getLiteralValue = (node: any): string => node.raw || node.value;

export default function getNameFromPath(path: NodePath<any>): string | null {
  if (path.isIdentifier() || path.isJSXIdentifier()) return path.node.name;
  if (path.isLiteral()) return getLiteralValue(path.node);
  if (path.isMemberExpression() || path.isJSXMemberExpression()) {
    return pascalCase(
      getMembers(path)
        .map((m) => getNameFromPath(m.path))
        .filter(truthy)
        .join('-'),
    );
  }
  return null;
}
