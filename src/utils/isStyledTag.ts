import { NodePath } from '@babel/core';
import * as t from '@babel/types';

import { ResolvedOptions } from '../types';
import hasAttrs from './hasAttrs';

const isAttrsExpression = (calleePath: any, pluginOptions: ResolvedOptions) =>
  hasAttrs(calleePath) &&
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  isStyledTag(calleePath.get('object'), pluginOptions);

const isStyledExpression = (
  calleePath: any,
  { styledTagName, allowGlobal }: ResolvedOptions,
) =>
  calleePath.node.name === styledTagName &&
  (allowGlobal || calleePath.referencesImport('astroturf'));

export default function isStyledTag(
  tagPath: NodePath,
  pluginOptions: ResolvedOptions,
): tagPath is NodePath<t.CallExpression> {
  const callee = tagPath.get('callee');
  return (
    tagPath.isCallExpression() &&
    (isAttrsExpression(callee, pluginOptions) ||
      isStyledExpression(callee, pluginOptions))
  );
}
