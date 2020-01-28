import { ResolvedOptions } from '../types';

export default function isCssTag(
  tagPath: any,
  { cssTagName, allowGlobal }: ResolvedOptions,
): boolean {
  return (
    tagPath.node.name === cssTagName &&
    (tagPath.referencesImport('astroturf') ||
      (allowGlobal && tagPath.scope.hasGlobal(cssTagName)))
  );
}
