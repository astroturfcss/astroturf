import { dirname, relative } from 'path';
import { stripIndent } from 'common-tags';
import groupBy from 'lodash/groupBy';
import uniq from 'lodash/uniq';

const rComposes = /\b(?:composes\s*?:\s*([^;>]*?)(?:from\s(.+?))?(?=[;}/\n\r]))/gim;
const rPlaceholder = /###ASTROTURF_PLACEHOLDER_\d*?###/g;

function resolveInterpolation(path, nodeMap, localStyle) {
  let nextPath = path.resolve();
  while (nextPath && nextPath.isMemberExpression()) {
    nextPath = nextPath.get('object').resolve();
  }
  const style = nextPath && nodeMap.get(nextPath.node);
  if (!style) return null;

  return {
    isStyledComponent: style.isStyledComponent,
    externalName: !style.isStyledComponent
      ? path.get('property').node.name
      : style.name,
    importName: relative(
      dirname(localStyle.absoluteFilePath),
      style.absoluteFilePath,
    ),
  };
}

let id = 0;
const getPlaceholder = () => `###ASTROTURF_PLACEHOLDER_${id++}###`;

export default (path, nodeMap, localStyle, { tagName }) => {
  const { quasi } = path.node;

  const interpolations = new Map();
  const expressions = path.get('quasi.expressions');

  let text = '';
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

      // TODO: dedupe the same expressions in a tag
      const interpolation = resolveInterpolation(expr, nodeMap, localStyle);

      if (!interpolation) {
        throw expr.buildCodeFrameError(
          `Could not resolve interpolation to a value, ${tagName} returned class name, or styled component. ` +
            'All interpolated styled components must be in the same file and values must be statically determinable at compile time.',
        );
      }

      interpolation.expr = expr;
      const ph = getPlaceholder(idx);
      interpolations.set(ph, interpolation);
      text += ph;
    }
  });

  // Replace references in `composes` rules
  text = text.replace(rComposes, (composes, classNames, fromPart) => {
    const classList = classNames.replace(/(\n|\r|\n\r)/, '').split(/\s+/);

    const composed = classList
      .map(className => interpolations.get(className))
      .filter(Boolean);

    if (!composed.length) return composes;

    if (fromPart) {
      // don't want to deal with this case right now
      throw classList[0].expr.buildCodeFrameError(
        'A styled interpolation found inside a `composes` rule with a "from". ' +
          'Interpolated values should b in ther own `composes` without specifying the file.',
      );
    }
    if (composed.length < classList.length) {
      throw classList[0].expr.buildCodeFrameError(
        'Mixing interpolated and none interpolated classes in a `composes` rule is not allowed. ',
      );
    }

    return Object.entries(groupBy(composed, i => i.importName)).reduce(
      (acc, [importName, values]) => {
        const classes = uniq(values.map(v => v.externalName)).join(' ');
        return `${
          acc ? `${acc};\n` : ''
        }composes: ${classes} from "${importName}"`;
      },
      '',
    );
  });

  let imports = '';
  text = text.replace(rPlaceholder, match => {
    const { externalName, importName } = interpolations.get(match);
    const localName = `a${id++}`;

    imports += stripIndent`
        :import("${importName}") {
          ${localName}: ${externalName};
        }\n
      `;
    return `.${localName}`;
  });

  if (imports) imports += '\n\n';

  return {
    text,
    imports,
  };
};
