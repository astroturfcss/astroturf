import generate from '@babel/generator';
import template from '@babel/template';
import * as t from '@babel/types';
import get from 'lodash/get';

import { COMPONENTS, STYLES } from '../utils/Symbols';
import buildTaggedTemplate from '../utils/buildTaggedTemplate';
import createStyleNode from '../utils/createStyleNode';
import getDisplayName from '../utils/getDisplayName';
import hasAttrs from '../utils/hasAttrs';
import isStyledTag from '../utils/isStyledTag';
import isStyledTagShorthand from '../utils/isStyledTagShorthand';
import normalizeAttrs from '../utils/normalizeAttrs';
import toVarsArray from '../utils/toVarsArray';
import trimExpressions from '../utils/trimExpressions';
import wrapInClass from '../utils/wrapInClass';

const PURE_COMMENT = '/*#__PURE__*/';

const buildImport = template('require(FILENAME);');

const buildComponent = template(
  `TAG(ELEMENTTYPE, OPTIONS, {
    displayName: DISPLAYNAME,
    styles: IMPORT,
    attrs: ATTRS,
    vars: VARS
  })`,
);

function buildStyledComponent(path, elementType, opts) {
  const { file, pluginOptions, styledAttrs, styledOptions } = opts;
  const cssState = file.get(STYLES);
  const nodeMap = file.get(COMPONENTS);
  const displayName = getDisplayName(path, opts, null);

  if (!displayName)
    throw path.buildCodeFrameError(
      // the expression case should always be the problem but just in case, let's avoid a potentially weird error.
      path.findParent(p => p.isExpressionStatement())
        ? 'The output of this styled component is never used. Either assign it to a variable or export it.'
        : 'Could not determine a displayName for this styled component. Each component must be uniquely identifiable, either as the default export of the module or by assigning it to a unique identifier',
    );

  const style = createStyleNode(path, displayName, opts);

  style.isStyledComponent = true;

  const { text, dynamicInterpolations, imports } = buildTaggedTemplate({
    style,
    nodeMap,
    ...opts.pluginOptions,
    quasiPath: path.get('quasi'),
    useCssProperties: pluginOptions.customCssProperties === true,
  });

  style.imports = imports;
  style.interpolations = trimExpressions(dynamicInterpolations);
  style.value = imports + wrapInClass(text);

  const runtimeNode = buildComponent({
    TAG: pluginOptions.styledTag,
    ELEMENTTYPE: elementType,
    ATTRS: normalizeAttrs(styledAttrs),
    OPTIONS: styledOptions || t.NullLiteral(),
    DISPLAYNAME: t.StringLiteral(displayName),
    VARS: toVarsArray(dynamicInterpolations),
    IMPORT: buildImport({
      FILENAME: t.StringLiteral(style.relativeFilePath),
    }).expression,
  });

  if (pluginOptions.generateInterpolations) {
    style.code = `${PURE_COMMENT}${generate(runtimeNode).code}`;
  }

  cssState.styles.set(style.absoluteFilePath, style);
  nodeMap.set(runtimeNode.expression, style);
  return runtimeNode;
}

export default {
  TaggedTemplateExpression(path, state) {
    const pluginOptions = state.defaultedOptions;

    const tagPath = path.get('tag');

    if (isStyledTag(tagPath, pluginOptions)) {
      let styledOptions, componentType, styledAttrs;

      if (hasAttrs(tagPath.get('callee'))) {
        styledAttrs = get(tagPath, 'node.arguments[0]');

        const styled = tagPath.get('callee.object');
        componentType = get(styled, 'node.arguments[0]');
        styledOptions = get(styled, 'node.arguments[1]');
      } else {
        componentType = get(tagPath, 'node.arguments[0]');
        styledOptions = get(tagPath, 'node.arguments[1]');
      }

      path.replaceWith(
        buildStyledComponent(path, componentType, {
          pluginOptions,
          styledAttrs,
          styledOptions,
          file: state.file,
        }),
      );
      path.addComment('leading', '#__PURE__');

      // styled.button` ... `
    } else if (isStyledTagShorthand(tagPath, pluginOptions)) {
      const componentType = t.StringLiteral(tagPath.get('property').node.name);

      path.replaceWith(
        buildStyledComponent(path, componentType, {
          pluginOptions,
          file: state.file,
        }),
      );
      path.addComment('leading', '#__PURE__');
    }
  },
};
