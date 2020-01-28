import { dirname, relative } from 'path';
import { NodePath } from '@babel/core';

import { ResolvedOptions } from '../types';
import createFileName from './createFilename';

export interface IntermediateStyle {
  start: number;
  end: number;
  absoluteFilePath: string;
  relativeFilePath: string;
  identifier: string;
}

export default function createStyleNode(
  path: NodePath,
  identifier: string | undefined,
  { pluginOptions, file }: { pluginOptions: ResolvedOptions; file: any },
): IntermediateStyle {
  const { start, end } = path.node;
  const style: Partial<IntermediateStyle> = { start: start!, end: end! };
  const getFileName = pluginOptions.getFileName || createFileName;

  const hostFile = file.opts.filename;
  style.absoluteFilePath = getFileName(hostFile, pluginOptions, identifier);

  let filename = relative(dirname(hostFile), style.absoluteFilePath);
  if (!filename.startsWith('.')) {
    filename = `./${filename}`;
  }
  style.relativeFilePath = filename;
  style.identifier = identifier || '';

  return style as IntermediateStyle;
}
