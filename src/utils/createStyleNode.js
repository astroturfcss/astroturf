import { dirname, relative } from 'path';

import createFileName from './createFilename';

export default function createStyleNode(
  path,
  identifier,
  { pluginOptions, file },
) {
  const { start, end } = path.node;
  const style = { start, end };
  const getFileName = pluginOptions.getFileName || createFileName;

  const hostFile = file.opts.filename;
  style.absoluteFilePath = getFileName(hostFile, pluginOptions, identifier);

  let filename = relative(dirname(hostFile), style.absoluteFilePath);
  if (!filename.startsWith('.')) {
    filename = `./${filename}`;
  }
  style.relativeFilePath = filename;
  style.identifier = identifier;

  return style;
}
