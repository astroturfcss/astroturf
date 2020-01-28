import { basename, dirname, extname, join } from 'path';

import { ResolvedOptions } from '../types';
import pascalCase from './pascalCase';

export function getNameFromFile(fileName: string) {
  const name = basename(fileName, extname(fileName));
  if (name !== 'index') return pascalCase(name);
  return pascalCase(basename(dirname(fileName)));
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
