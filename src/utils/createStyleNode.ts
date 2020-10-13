import { NodePath } from '@babel/core';

import { ResolvedOptions } from '../types';
import createFileName, { createRequirePath } from './createFilename';

export interface IntermediateStyle {
  start: number;
  end: number;
  absoluteFilePath: string;
  requirePath: string;
  identifier: string;
}

export default function createStyleNode(
  path: NodePath<any>,
  identifier: string | undefined,
  { pluginOptions, file }: { pluginOptions: ResolvedOptions; file: any },
): IntermediateStyle {
  const { start, end } = path.node;
  const style: Partial<IntermediateStyle> = { start: start!, end: end! };
  const getFileName = pluginOptions.getFileName || createFileName;
  const getRequirePath = pluginOptions.getRequirePath || createRequirePath;

  const hostFile = file.opts.filename;
  style.absoluteFilePath = getFileName(hostFile, pluginOptions, identifier);
  style.requirePath = getRequirePath(hostFile, style.absoluteFilePath);
  style.identifier = identifier || '';

  return style as IntermediateStyle;
}
