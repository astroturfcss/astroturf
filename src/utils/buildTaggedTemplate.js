import { dirname, relative } from 'path';
import { stripIndent } from 'common-tags';

export default (path, nodeMap, localStyle, { tagName, styledTag }) => {
  const { quasi, tag } = path.node;

  const interpolations = new Map();
  const expressions = path.get('quasi.expressions');

  let text = '';
  let id = 1;

  quasi.quasis.forEach((tmplNode, idx) => {
    const { cooked } = tmplNode.value;
    const expr = expressions[idx];

    text += cooked;

    if (expr) {
      const result = expr.evaluate();

      if (result.confident) {
        text += result.value;
        return;
      }

      const isCssTag = tag.name === tagName;
      if (!isCssTag) {
        const resolved = expr.resolve();
        const styles = resolved && nodeMap.get(resolved.node);
        if (styles) {
          const localName = `a${id++}`;
          // console.log(resolved.node, styles);
          interpolations.set(localName, styles);
          text += `.${localName}`;
          return;
        }
      }

      throw expr.buildCodeFrameError(
        isCssTag
          ? `Dynamic interpolations are not allowed in ${tagName} template tags. ` +
              'All interpolations must be statically determinable at compile time.'
          : `Dynamic ${styledTag} tag interpolations are not enabled. ` +
              'To allow compiling dynamic interpolations to CSS custom ' +
              "properties set the 'allowInterpolations` option to true.",
      );
    }
  });

  let imports = '';
  if (interpolations.size) {
    interpolations.forEach((style, localName) => {
      imports += stripIndent`
        :import("${relative(
          dirname(localStyle.absoluteFilePath),
          style.absoluteFilePath,
        )}") {
          ${localName}: ${style.name};
        }
      `;
    });

    imports += '\n\n';
  }
  return {
    text,
    imports,
  };
};
