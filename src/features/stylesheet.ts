import { NodePath } from '@babel/core';
import * as t from '@babel/types';

import { NodeStyleMap, PluginState, StaticStyle, StyleState } from '../types';
import buildTaggedTemplate from '../utils/buildTaggedTemplate';
import createStyleNode from '../utils/createStyleNode';
import getDisplayName from '../utils/getDisplayName';
import isCssTag from '../utils/isCssTag';
import { COMPONENTS, STYLES } from '../utils/Symbols';

function buildStyleRequire(
  path: NodePath<t.TaggedTemplateExpression>,
  opts: PluginState,
) {
  const { tagName } = opts.defaultedOptions;
  const { styles } = opts.file.get(STYLES) as StyleState;
  const nodeMap: NodeStyleMap = opts.file.get(COMPONENTS);

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
    isStyledComponent: false,
    code: ``,
    value: '',
  };

  const { text, imports } = buildTaggedTemplate({
    quasiPath: path.get('quasi'),
    nodeMap,
    style,
    useCssProperties: false,
    ...opts.defaultedOptions,
  });

  style.value = `${imports}${text}`;

  if (styles.has(style.absoluteFilePath))
    throw path.buildCodeFrameError(
      path.findParent(p => p.isExpressionStatement())
        ? `There are multiple anonymous ${tagName} tags that would conflict. Differentiate each tag by assigning the output to a unique identifier`
        : `There are multiple ${tagName} tags with the same inferred identifier. Differentiate each tag by assigning the output to a unique identifier`,
    );

  styles.set(style.absoluteFilePath, style);

  const runtimeNode = opts.styleImports.add(style);

  style.code = runtimeNode.name;

  nodeMap.set(runtimeNode, style);
  return runtimeNode;
}

export default {
  TaggedTemplateExpression(
    path: NodePath<t.TaggedTemplateExpression>,
    state: PluginState,
  ) {
    const tagPath = path.get('tag');

    if (isCssTag(tagPath, state.defaultedOptions)) {
      path.replaceWith(buildStyleRequire(path, state));
    }
  },
};
