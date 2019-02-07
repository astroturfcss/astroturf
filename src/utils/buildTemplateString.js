import hash from './murmur';
import units from './units';
import { getDefaults } from './defaults';

// Match any valid CSS units followed by a separator such as ;, newline etc.
const unitRegex = new RegExp(`^(${units.join('|')})(;|,|\n| |\\))`);
const toValidCSSIdentifier = s => s.replace(/[^_0-9a-z]/gi, '_');

export default (path, displayName, options) => {
  const { allowInterpolation, cssTag, styledTag } = getDefaults(options);
  const { quasi, tag } = path.node;

  const interpolations = [];
  const expressions = path.get('quasi').get('expressions');

  let text = '';

  quasi.quasis.forEach((tmplNode, idx) => {
    const { cooked } = tmplNode.value;
    const expr = expressions[idx];
    const last = interpolations[interpolations.length - 1];

    let matches;

    // eslint-disable-next-line no-cond-assign
    if (
      last &&
      text.endsWith(`var(--${last.id})`) &&
      (matches = cooked.match(unitRegex))
    ) {
      const [, unit] = matches;

      last.unit = unit;
      text += cooked.replace(unitRegex, '$2');
    } else {
      text += cooked;
    }

    if (expr) {
      const { node } = expr;
      const result = expr.evaluate();

      if (result.confident) {
        text += result.value;
        return;
      }

      const isCssTag = tag.name === cssTag;
      if (allowInterpolation && !isCssTag) {
        // custom properties need to start with a letter
        const id =
          toValidCSSIdentifier(displayName[0].toLowerCase()) +
          hash(`${displayName}-${idx}`);

        interpolations.push({ id, node, unit: '' });
        text += `var(--${id})`;

        return;
      }

      throw expr.buildCodeFrameError(
        isCssTag
          ? `Dynamic interpolations are not allowed in ${cssTag} template tags. ` +
              'All interpolations must be statically determinable at compile time.'
          : `Dynamic ${styledTag} tag interpolations are not enabled. ` +
              'To allow compiling dynamic interpolations to CSS custom ' +
              "properties set the 'allowInterpolations` option to true.",
      );
    }
  });

  return {
    text,
    interpolations,
  };
};
