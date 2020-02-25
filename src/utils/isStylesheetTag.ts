import { ResolvedOptions } from '../types';

export default function isStylesheetTag(
  tagPath: any,
  { stylesheetTagName, allowGlobal }: ResolvedOptions,
): boolean {
  return (
    stylesheetTagName !== false &&
    tagPath.node.name === stylesheetTagName &&
    (tagPath.referencesImport('astroturf') ||
      tagPath.referencesImport('astroturf/react') ||
      (allowGlobal && tagPath.scope.hasGlobal(stylesheetTagName)))
  );
}
