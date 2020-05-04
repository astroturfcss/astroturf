import { basename, dirname, extname, join, relative } from 'path';

import { ResolvedOptions } from '../types';
import pascalCase from './pascalCase';

export function getNameFromFile(fileName: string) {
  const name = basename(fileName, extname(fileName));

  if (name !== 'index') return pascalCase(name);
  return pascalCase(basename(dirname(fileName)));
}

export function createRequirePath(from: string, to: string) {
  let relativePath = relative(dirname(from), to);

  if (!relativePath.startsWith('.')) {
    relativePath = `./${relativePath}`;
  }
  return relativePath;
}

export default function createFilename(
  hostFile: string,
  { extension = '.css' }: ResolvedOptions,
  id?: string,
) {
  let base;

  if (getNameFromFile(hostFile) === id) base = id;
  else base = `${basename(hostFile, extname(hostFile))}-${id}`;

  return join(dirname(hostFile), base + extension);
}
