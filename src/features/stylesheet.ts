import { NodePath } from '@babel/core';
import * as t from '@babel/types';

import { NodeStyleMap, PluginState, StaticStyle, StyleState } from '../types';
import buildTaggedTemplate from '../utils/buildTaggedTemplate';
import createStyleNode from '../utils/createStyleNode';
import getDisplayName from '../utils/getDisplayName';
import isCssTag from '../utils/isCssTag';
import isStylesheetTag from '../utils/isStylesheetTag';
import { COMPONENTS, STYLES } from '../utils/Symbols';
import wrapInClass from '../utils/wrapInClass';

function buildStyleRequire(
  path: NodePath<t.TaggedTemplateExpression>,
  opts: PluginState,
  isSingleClass: boolean,
) {
  const { cssTagName, stylesheetTagName } = opts.defaultedOptions;
  const { styles } = opts.file.get(STYLES) as StyleState;
  const nodeMap: NodeStyleMap = opts.file.get(COMPONENTS);

  const tagName = isSingleClass ? cssTagName : stylesheetTagName;
  const baseStyle = createStyleNode(
    path,
    getDisplayName(path, opts) || undefined,
    {
      pluginOptions: opts.defaultedOptions,
      file: opts.file,
    },
  );
  const style: StaticStyle = {
    ...baseStyle,
    type: isSingleClass ? 'class' : 'stylesheet',
    code: '',
    value: '',
  };

  const { text, imports } = buildTaggedTemplate({
    quasiPath: path.get('quasi'),
    nodeMap,
    style,
    location: 'STYLESHEET',
    pluginOptions: opts.defaultedOptions,
  });

  style.value = isSingleClass
    ? imports + wrapInClass(text)
    : `${imports}${text}`;

  if (styles.has(style.absoluteFilePath))
    throw path.buildCodeFrameError(
      path.findParent(p => p.isExpressionStatement())
        ? `There are multiple anonymous ${tagName} tags that would conflict. Differentiate each tag by assigning the output to a unique identifier`
        : `There are multiple ${tagName} tags with the same inferred identifier. Differentiate each tag by assigning the output to a unique identifier`,
    );

  styles.set(style.absoluteFilePath, style);

  let runtimeNode: t.Node = opts.styleImports.add(style);
  style.code = runtimeNode.name;

  if (isSingleClass) {
    runtimeNode = t.memberExpression(runtimeNode, t.identifier('cls1'));

    style.code += '.cls';
  }

  nodeMap.set(runtimeNode, style);
  return runtimeNode;
}

export default {
  TaggedTemplateExpression(
    path: NodePath<t.TaggedTemplateExpression>,
    state: PluginState,
  ) {
    const pluginOptions = state.defaultedOptions;

    const tagPath = path.get('tag');
    const isCss = isCssTag(tagPath, pluginOptions);
    const isStyleSheet = !isCss && isStylesheetTag(tagPath, pluginOptions);
    if (isCss || isStyleSheet) {
      path.replaceWith(buildStyleRequire(path, state, isCss));
    }
  },
};
