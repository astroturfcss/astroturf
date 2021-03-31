import { NodePath } from '@babel/core';
import { AssignmentExpression, VariableDeclarator } from '@babel/types';

import { getNameFromFile } from './createFilename';
import getNameFromPath from './getNameFromPath';

export default function getDisplayName(
  path: NodePath<any>,
  { file }: { file: any },
  defaultName: string | null = getNameFromFile(file.opts.filename),
) {
  // eslint-disable-next-line no-cond-assign
  while ((path = path.parentPath)) {
    if (path.isVariableDeclarator())
      return getNameFromPath(
        (path as NodePath<VariableDeclarator>).get('id') as any,
      );
    if (path.isAssignmentExpression())
      return getNameFromPath(
        (path as NodePath<AssignmentExpression>).get('left'),
      );
    if (path.isExportDefaultDeclaration())
      return getNameFromFile(file.opts.filename);
  }
  return defaultName || null;
}
