import * as t from '@babel/types';

export function isCssTag(tagPath, tagName, allowGlobal = false) {
  return (
    tagPath.node.name === tagName &&
    (tagPath.referencesImport('astroturf') ||
      (allowGlobal && tagPath.parentPath.scope.hasGlobal(tagName)))
  );
}

export const isStyledTag = (tagPath, styledTag, allowGlobal) => {
  const { node } = tagPath;
  return (
    t.isCallExpression(node) &&
    node.callee.name === styledTag &&
    (allowGlobal || tagPath.get('callee').referencesImport('astroturf'))
  );
};

export const isStyledTagShorthand = (tagPath, styledTag, allowGlobal) =>
  t.isMemberExpression(tagPath.node) &&
  t.isIdentifier(tagPath.get('property').node) &&
  tagPath.get('object').node.name === styledTag &&
  (allowGlobal || tagPath.get('object').referencesImport('astroturf'));
