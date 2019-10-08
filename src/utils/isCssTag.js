export default function isCssTag(tagPath, { tagName, allowGlobal }) {
  return (
    tagPath.node.name === tagName &&
    (tagPath.referencesImport('astroturf') ||
      (allowGlobal && tagPath.scope.hasGlobal(tagName)))
  );
}
