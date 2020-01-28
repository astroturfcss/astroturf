import { NodePath } from '@babel/core';
import template from '@babel/template';
import * as t from '@babel/types';

import {
  NodeStyleMap,
  PluginState,
  ResolvedOptions,
  StaticStyle,
  StyleState,
} from '../types';
import buildTaggedTemplate from '../utils/buildTaggedTemplate';
import createStyleNode from '../utils/createStyleNode';
import getDisplayName from '../utils/getDisplayName';
import isCssTag from '../utils/isCssTag';
import { COMPONENTS, STYLES } from '../utils/Symbols';

const buildImport = template('require(FILENAME);');

interface Options {
  pluginOptions: ResolvedOptions;
  file: any;
}

function buildStyleRequire(
  path: NodePath<t.TaggedTemplateExpression>,
  opts: Options,
) {
  const { tagName } = opts.pluginOptions;
  const { styles } = opts.file.get(STYLES) as StyleState;
  const nodeMap: NodeStyleMap = opts.file.get(COMPONENTS);

  const baseStyle = createStyleNode(
    path,
    getDisplayName(path, opts) || undefined,
    opts,
  );
  const style: StaticStyle = {
    ...baseStyle,
    isStyledComponent: false,
    code: `require('${baseStyle.relativeFilePath}')`,
    value: '',
  };

  const { text, imports } = buildTaggedTemplate({
    quasiPath: path.get('quasi'),
    nodeMap,
    style,
    useCssProperties: false,
    ...opts.pluginOptions,
  });

  style.value = `${imports}${text}`;

  if (styles.has(style.absoluteFilePath))
    throw path.buildCodeFrameError(
      path.findParent(p => p.isExpressionStatement())
        ? `There are multiple anonymous ${tagName} tags that would conflict. Differentiate each tag by assigning the output to a unique identifier`
        : `There are multiple ${tagName} tags with the same inferred identifier. Differentiate each tag by assigning the output to a unique identifier`,
    );

  styles.set(style.absoluteFilePath, style);
  const runtimeNode = buildImport({
    FILENAME: t.stringLiteral(style.relativeFilePath),
  }) as t.ExpressionStatement;

  nodeMap.set(runtimeNode.expression, style);
  return runtimeNode;
}

export default {
  TaggedTemplateExpression(
    path: NodePath<t.TaggedTemplateExpression>,
    state: PluginState,
  ) {
    const pluginOptions = state.defaultedOptions;

    const tagPath = path.get('tag');

    if (isCssTag(tagPath, pluginOptions)) {
      path.replaceWith(
        buildStyleRequire(path, {
          pluginOptions,
          file: state.file,
        }),
      );
    }
  },
};
