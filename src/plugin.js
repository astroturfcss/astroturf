import { writeFileSync } from 'fs';
import { join, dirname, extname, basename, relative } from 'path';

import * as t from '@babel/types';
import template from '@babel/template';
import { stripIndent } from 'common-tags';

const buildImport = template('require(FILENAME);');

const STYLES = Symbol('CSSLiteralLoader');

let idx = 0;
function createFilename(hostFile, { extension = '.css' }) {
  const basepath = join(
    dirname(hostFile),
    basename(hostFile, extname(hostFile)),
  );
  return `${basepath}__${idx++}_extracted_style${extension}`;
}

export default function plugin() {
  return {
    pre(file) {
      if (!file.has(STYLES)) {
        file.set(STYLES, new Set());
      }
    },

    post(file) {
      const { opts } = this;

      let styles = file.get(STYLES);
      styles = Array.from(styles.values());

      file.metadata['css-literal-loader'] = { styles };

      if (opts.writeFiles) {
        styles.forEach(({ path, value }) => {
          writeFileSync(path, stripIndent([value]));
        });
      }
    },

    visitor: {
      TaggedTemplateExpression(path, { opts, file }) {
        const styles = file.get(STYLES);
        const { tagName = 'css' } = opts;
        const { node } = path;

        if (node.tag.name !== tagName || !path.scope.hasGlobal(tagName)) {
          return;
        }

        const parseError = path.buildCodeFrameError(
          'Could not evaluate css. inline css must be statically analyzable',
        );

        const { start, end } = node;

        // remove the tag and evaluate as a plain template;
        path.replaceWith(node.quasi);

        const { confident, value } = path.evaluate();

        if (!confident) {
          throw parseError;
        }

        const style = { value, start, end };
        const getFilename = opts.getFilename || createFilename;

        const hostFile = file.opts.filename;
        style.path = getFilename(hostFile, opts);

        let filename = relative(dirname(hostFile), style.path);

        if (!filename.startsWith('.')) {
          filename = `./${filename}`;
        }

        path.replaceWith(
          buildImport({ FILENAME: t.StringLiteral(filename) }), // eslint-disable-line new-cap
        );

        styles.add(style);
      },
    },
  };
}
