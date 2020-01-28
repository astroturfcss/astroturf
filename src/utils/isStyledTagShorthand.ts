import { NodePath } from '@babel/core';
import * as t from '@babel/types';

import { ResolvedOptions } from '../types';

export default function isStyledTagShorthand(
  tagPath: any,
  { styledTag, allowGlobal }: ResolvedOptions,
): tagPath is NodePath<t.MemberExpression> {
  return (
    tagPath.isMemberExpression() &&
    tagPath.get('property').isIdentifier() &&
    tagPath.get('object').node.name === styledTag &&
    (allowGlobal || tagPath.get('object').referencesImport('astroturf'))
  );
}
