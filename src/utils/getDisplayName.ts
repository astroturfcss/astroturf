import { NodePath } from '@babel/core';

import { getNameFromFile } from './createFilename';
import getNameFromPath from './getNameFromPath';

export default function getDisplayName(
  path: NodePath,
  { file }: { file: any },
  defaultName: string | null = getNameFromFile(file.opts.filename),
) {
  // eslint-disable-next-line no-cond-assign
  while ((path = path.parentPath)) {
    if (path.isVariableDeclarator()) return getNameFromPath(path.get('id'));
    if (path.isAssignmentExpression())
      return getNameFromPath(path.get('left'));
    if (path.isExportDefaultDeclaration())
      return getNameFromFile(file.opts.filename);
  }
  return defaultName || null;
}
