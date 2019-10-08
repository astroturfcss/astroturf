export default function isStyledTagShorthand(
  tagPath,
  { styledTag, allowGlobal },
) {
  return (
    tagPath.isMemberExpression() &&
    tagPath.get('property').isIdentifier() &&
    tagPath.get('object').node.name === styledTag &&
    (allowGlobal || tagPath.get('object').referencesImport('astroturf'))
  );
}
