import { relative, dirname } from 'path';
import * as t from 'babel-types';
import template from 'babel-template';

const buildImport = template('require(FILENAME);');

export default function cssLiteralVisitor(
  styles = [], getFilename
) {
  return {
    TaggedTemplateExpression(path, { opts, file }) {
      const { tagName = 'css' } = opts;
      const node = path.node;

      if (node.tag.name !== tagName || !path.scope.hasGlobal(tagName)) {
        return;
      }

      const parseError = path.buildCodeFrameError(
        'Could not evaluate css. inline css must be statically analyzable'
      );

      const { start, end } = node;

      // remove the tag and evaluate as a plain template;
      path.replaceWith(node.quasi);

      const { confident, value } = path.evaluate();

      if (!confident) {
        throw parseError;
      }

      const style = { value, start, end };

      if (getFilename) {
        const hostFile = file.opts.filename;
        style.path = getFilename(opts, hostFile);

        let filename = relative(dirname(hostFile), style.path);

        if (!filename.startsWith('.')) {
          filename = `./${filename}`;
        }

        path.replaceWith(
          buildImport({ FILENAME: t.StringLiteral(filename) }) // eslint-disable-line new-cap
        );
      }

      styles.push(style);
    },
  };
}
