import { NodePath } from '@babel/core';
import * as t from '@babel/types';

import { ResolvedOptions } from '../types';

export default function isStyledTagShorthand(
  tagPath: any,
  { styledTagName, allowGlobal }: ResolvedOptions,
): tagPath is NodePath<t.MemberExpression> {
  return (
    styledTagName !== false &&
    tagPath.isMemberExpression() &&
    tagPath.get('property').isIdentifier() &&
    tagPath.get('object').node.name === styledTagName &&
    (allowGlobal || tagPath.get('object').referencesImport('astroturf'))
  );
}
