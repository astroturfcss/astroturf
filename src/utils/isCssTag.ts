import { ResolvedOptions } from '../types';

export default function isCssTag(
  tagPath: any,
  { tagName, allowGlobal }: ResolvedOptions,
): boolean {
  return (
    tagPath.node.name === tagName &&
    (tagPath.referencesImport('astroturf') ||
      (allowGlobal && tagPath.scope.hasGlobal(tagName)))
  );
}
