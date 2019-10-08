import hasAttrs from './hasAttrs';

const isAttrsExpression = (calleePath, pluginOptions) =>
  hasAttrs(calleePath) &&
  // eslint-disable-next-line no-use-before-define
  isStyledTag(calleePath.get('object'), pluginOptions);

const isStyledExpression = (calleePath, { styledTag, allowGlobal }) =>
  calleePath.node.name === styledTag &&
  (allowGlobal || calleePath.referencesImport('astroturf'));

export default function isStyledTag(tagPath, pluginOptions) {
  const callee = tagPath.get('callee');
  return (
    tagPath.isCallExpression() &&
    (isAttrsExpression(callee, pluginOptions) ||
      isStyledExpression(callee, pluginOptions))
  );
}
