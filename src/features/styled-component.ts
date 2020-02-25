import get from 'lodash/get';
import { NodePath } from '@babel/core';
import generate from '@babel/generator';
import * as t from '@babel/types';

import {
  DynamicStyle,
  NodeStyleMap,
  PluginState,
  ResolvedOptions,
  StyleState,
} from '../types';
import buildTaggedTemplate from '../utils/buildTaggedTemplate';
import createStyleNode from '../utils/createStyleNode';
import getDisplayName from '../utils/getDisplayName';
import hasAttrs from '../utils/hasAttrs';
import StyleImportInjector from '../utils/ImportInjector';
import isStyledTag from '../utils/isStyledTag';
import isStyledTagShorthand from '../utils/isStyledTagShorthand';
import normalizeAttrs from '../utils/normalizeAttrs';
import { COMPONENTS, STYLES } from '../utils/Symbols';
import truthy from '../utils/truthy';

const PURE_COMMENT = '/*#__PURE__*/';

const buildComponent = (nodes: any) =>
  t.callExpression(nodes.TAG, [
    nodes.ELEMENTTYPE,
    nodes.OPTIONS,
    t.objectExpression(
      [
        t.objectProperty(t.identifier('displayName'), nodes.DISPLAYNAME),
        t.objectProperty(t.identifier('styles'), nodes.IMPORT),
        !t.isNullLiteral(nodes.ATTRS) &&
          t.objectProperty(t.identifier('attrs'), nodes.ATTRS),
        nodes.VARS.elements.length &&
          t.objectProperty(t.identifier('vars'), nodes.VARS),
        nodes.VARIANTS.elements.length &&
          t.objectProperty(t.identifier('variants'), nodes.VARIANTS),
      ].filter(truthy),
    ),
  ]);

interface Options {
  pluginOptions: ResolvedOptions;
  styledAttrs?: t.Node;
  styledOptions?: t.Node;
  styleImports: StyleImportInjector;
  file: any;
}

function buildStyledComponent(
  path: NodePath<t.TaggedTemplateExpression>,
  elementType: t.Node,
  opts: Options,
) {
  const {
    file,
    pluginOptions,
    styledAttrs,
    styledOptions,
    styleImports,
  } = opts;
  const cssState = file.get(STYLES) as StyleState;
  const nodeMap = file.get(COMPONENTS) as NodeStyleMap;
  const displayName = getDisplayName(path, opts, null);

  if (!displayName)
    throw path.buildCodeFrameError(
      // the expression case should always be the problem but just in case, let's avoid a potentially weird error.
      path.findParent(p => p.isExpressionStatement())
        ? 'The output of this styled component is never used. Either assign it to a variable or export it.'
        : 'Could not determine a displayName for this styled component. Each component must be uniquely identifiable, either as the default export of the module or by assigning it to a unique identifier',
    );

  const baseStyle = createStyleNode(path, displayName, opts);
  const style: DynamicStyle = {
    ...baseStyle,
    type: 'styled',
    interpolations: [],
    imports: '',
    value: '',
  };

  const importId = styleImports.add(style);

  const { css, vars, variants, interpolations } = buildTaggedTemplate({
    style,
    nodeMap,
    importId,
    location: 'COMPONENT',
    quasiPath: path.get('quasi'),
    pluginOptions: opts.pluginOptions,
  });

  style.interpolations = interpolations;
  style.value = css;

  const runtimeNode = buildComponent({
    TAG: t.identifier(pluginOptions.styledTagName),
    ELEMENTTYPE: elementType,
    ATTRS: normalizeAttrs(styledAttrs),
    OPTIONS: styledOptions || t.nullLiteral(),
    DISPLAYNAME: t.stringLiteral(displayName),
    VARS: vars,
    VARIANTS: variants,
    IMPORT: importId,
  });

  if (pluginOptions.generateInterpolations) {
    style.code = `${PURE_COMMENT}${generate(runtimeNode).code}`;
  }

  cssState.styles.set(style.absoluteFilePath, style);
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
          styleImports: state.styleImports,
        }),
      );
      path.addComment('leading', '#__PURE__');

      // styled.button` ... `
    } else if (isStyledTagShorthand(tagPath, pluginOptions)) {
      const prop = tagPath.get('property') as NodePath<t.Identifier>;
      const componentType = t.stringLiteral(prop.node.name);

      path.replaceWith(
        buildStyledComponent(path, componentType, {
          pluginOptions,
          file: state.file,
          styleImports: state.styleImports,
        }),
      );
      path.addComment('leading', '#__PURE__');
    }
  },
};
