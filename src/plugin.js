import { writeFileSync } from 'fs';
import { stripIndent } from 'common-tags';
import { join, dirname, extname, basename } from 'path';

import visitor from './visitor';

let idx = 0;
function createFilename({ extension = '.css' }, hostFile) {
  const basepath = join(
    dirname(hostFile),
    basename(hostFile, extname(hostFile)),
  );
  return `${basepath}__${idx++}_extracted_style${extension}`;
}

export default function plugin() {
  const styles = [];

  return {
    visitor: {
      ...visitor(styles, createFilename),

      Program: {
        exit() {
          styles.forEach(({ path, value }) => {
            writeFileSync(path, stripIndent([value]));
          });
        },
      },
    },
  };
}
