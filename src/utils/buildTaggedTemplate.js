import { dirname, relative } from 'path';
import { stripIndent } from 'common-tags';

function resolveInterpolation(path, nodeMap, localStyle) {
  let nextPath = path.resolve();
  while (nextPath && nextPath.isMemberExpression()) {
    nextPath = nextPath.get('object').resolve();
  }
  const style = nextPath && nodeMap.get(nextPath.node);
  if (!style) return null;

  return {
    externalName: style.isClassNames
      ? path.get('property').node.name
      : style.name,
    importName: relative(
      dirname(localStyle.absoluteFilePath),
      style.absoluteFilePath,
    ),
  };
}

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
        const interpolation = resolveInterpolation(expr, nodeMap, localStyle);

        if (interpolation) {
          const localName = `a${id++}`;

          interpolations.set(localName, interpolation);
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
    interpolations.forEach(({ importName, externalName }, localName) => {
      imports += stripIndent`
        :import("${importName}") {
          ${localName}: ${externalName};
        }\n
      `;
    });

    imports += '\n\n';
  }

  return {
    text,
    imports,
  };
};
