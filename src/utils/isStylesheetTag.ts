import { ResolvedOptions } from '../types';

export default function isStylesheetTag(
  tagPath: any,
  { stylesheetTagName, allowGlobal }: ResolvedOptions,
): boolean {
  return (
    tagPath.node.name === stylesheetTagName &&
    (tagPath.referencesImport('astroturf') ||
      (allowGlobal && tagPath.scope.hasGlobal(stylesheetTagName)))
  );
}
