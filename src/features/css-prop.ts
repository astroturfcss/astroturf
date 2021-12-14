import { NodePath } from '@babel/core';
import generate from '@babel/generator';
import * as t from '@babel/types';
import chalk from 'chalk';

import { DynamicStyle, PluginState, ResolvedOptions } from '../types';
import { COMPONENTS, JSX_IDENTS, STYLES } from '../utils/Symbols';
import addPragma from '../utils/addPragma';
import buildTaggedTemplate from '../utils/buildTaggedTemplate';
import createStyleNode from '../utils/createStyleNode';
import getNameFromPath from '../utils/getNameFromPath';
import isCssTag from '../utils/isCssTag';
import isStylesheetTag from '../utils/isStylesheetTag';
import trimEnd from '../utils/trimEnd';
import wrapInClass from '../utils/wrapInClass';

const HAS_JSX = Symbol('Astroturf has jsx');
const HAS_CREATE_ELEMENT = Symbol('Astroturf has createElement call');
const IS_JSX = Symbol('Is a JSX call expression');

type CssPropPluginState = PluginState & {
  [JSX_IDENTS]: {
    jsx: t.Identifier;
    jsxFrag: t.Identifier;
  };
};

// XXX: if the single class cssProp is disabled fallback to the stylesheet tag
//  this enables pre v1 tag meaning for folks that want to do an incremental migration
const isCssPropTag = (tagPath: NodePath, options: ResolvedOptions) =>
  options.cssTagName === false
    ? isStylesheetTag(tagPath, options)
    : isCssTag(tagPath, options);

const isJsxCallExpression = (p: NodePath<any>) => {
  const result =
    p.isCallExpression() &&
    // @ts-ignore
    p.get('callee').referencesImport('react/jsx-runtime');

  return result;
};

export const isCreateElementCall = (p: NodePath<any>) =>
  p.isCallExpression() &&
  (p.get('callee.property') as any).node &&
  (p.get('callee.property') as any).node.name === 'createElement';

function buildCssProp(
  valuePath: NodePath<any>,
  name: string | null,
  options: PluginState,
  isJsx = false,
) {
  const { file, defaultedOptions: pluginOptions } = options;
  const cssState = file.get(STYLES);
  const nodeMap = file.get(COMPONENTS);

  if (!pluginOptions.enableCssProp) {
    if (!pluginOptions.noWarnings)
      // eslint-disable-next-line no-console
      console.warn(
        chalk.yellow(
          'It looks like you are trying to use the css prop with',
          chalk.bold('astroturf'),
          'but have not enabled it. add',
          chalk.bold('enableCssProp: true'),
          'to the loader or plugin options to compile the css prop.',
        ),
      );
    return null;
  }

  const displayName = `CssProp${++cssState.id}_${name}`;

  let vars: t.ArrayExpression | null = null;
  let variants: t.ArrayExpression | null = null;

  const baseStyle = createStyleNode(valuePath, displayName, {
    file,
    pluginOptions,
  });

  const style: DynamicStyle = {
    ...baseStyle,
    type: 'class',
    interpolations: [],
    imports: '',
    value: '',
  };

  let importId: t.Identifier | undefined;

  if (valuePath.isStringLiteral()) {
    style.value = wrapInClass(valuePath.node.value);
    importId = options.styleImports.add(style);
  } else {
    const exprPath = valuePath.isJSXExpressionContainer()
      ? (valuePath.get('expression') as NodePath)
      : valuePath;

    if (
      exprPath.isTemplateLiteral() ||
      (exprPath.isTaggedTemplateExpression() &&
        isCssPropTag(exprPath.get('tag') as NodePath, pluginOptions))
    ) {
      importId = options.styleImports.add(style);
      const template = buildTaggedTemplate({
        style,
        nodeMap,
        importId,
        pluginOptions,
        location: 'PROP',
        quasiPath: exprPath.isTemplateLiteral()
          ? exprPath
          : exprPath.get('quasi'),
      });

      vars = template.vars.elements.length ? template.vars : null;
      variants = template.variants.elements.length ? template.variants : null;

      style.interpolations = template.interpolations;
      style.value = template.css;
    }
  }

  if (!importId) {
    return null;
  }

  let runtimeNode: t.Node = t.arrayExpression(
    trimEnd([importId, vars!, variants!]).map((n) => n ?? t.nullLiteral()),
  );

  style.importIdentifier = importId.name;

  // FIXME?
  // @ts-ignore
  nodeMap.set(runtimeNode.expression, style);

  if (isJsx) {
    runtimeNode = t.jsxExpressionContainer(runtimeNode);
  }

  cssState.styles.set(style.absoluteFilePath, style);

  if (pluginOptions.generateInterpolations)
    style.code = generate(runtimeNode).code;

  return runtimeNode;
}

const getObjectKey = (keyPath: NodePath) => {
  if (keyPath.isStringLiteral()) return keyPath.node.value;
  if (keyPath.isIdentifier()) return keyPath.node.name;
  return (keyPath.node as any).name;
};

interface InnerVisitorState extends PluginState {
  typeName: string | null;
  processed?: boolean;
}

const cssPropertyVisitors = {
  ObjectProperty(path: NodePath<t.ObjectProperty>, state: InnerVisitorState) {
    const { typeName } = state;

    if (getObjectKey(path.get('key') as NodePath) !== 'css') return;

    const valuePath = path.get('value');

    const compiledNode = buildCssProp(valuePath, typeName, state);

    if (compiledNode) {
      valuePath.replaceWith(compiledNode);
      state.processed = true;
    }
  },
  CallExpression(path: NodePath<t.CallExpression>) {
    // prevent the inner traversal from finding nested css props, on `children:` keys
    // but mark the path so we can skip the check when the outer traversal finds it
    if (isCreateElementCall(path) || isJsxCallExpression(path)) {
      path[IS_JSX] = true;
      path.skip();
    }
  },
};

export default {
  Program: {
    exit(path: NodePath<t.Program>, state: CssPropPluginState) {
      const hasJsx = !!state.file.get(HAS_JSX);
      const hasCreateElement = !!state.file.get(HAS_CREATE_ELEMENT);

      if (!hasJsx && !hasCreateElement) return;

      const { jsx } = state[JSX_IDENTS];

      const pragmaDisabled = !state.defaultedOptions.jsxPragma;

      // For createElement calls we still need to add an import
      // but we don't need to do pragma bits
      // if the pragma is disabled and there is no createElement call we are done
      if (pragmaDisabled && !hasCreateElement) return;

      const changes = addPragma(path, jsx, hasJsx && !pragmaDisabled);

      state.file.get(STYLES).changeset.unshift(...changes);
    },
  },

  CallExpression(path: NodePath<t.CallExpression>, state: CssPropPluginState) {
    const { file } = state;
    const pluginOptions = state.defaultedOptions;
    const isAutomaticRuntime = isJsxCallExpression(path);

    if (!path[IS_JSX] && !isCreateElementCall(path) && !isAutomaticRuntime)
      return;

    const typeName = getNameFromPath(path.get('arguments')[0]);

    const propsPath = path.get('arguments')[1];

    const innerState = {
      ...state,
      pluginOptions,
      file,
      processed: false,
      typeName,
    };

    // We aren't checking very hard that this is a React createElement call
    if (!propsPath) {
      return;
    }

    propsPath.traverse(cssPropertyVisitors, innerState);

    if (innerState.processed) {
      const { jsx } = state[JSX_IDENTS];
      const { changeset } = file.get(STYLES);
      const callee = path.get('callee');

      if (isAutomaticRuntime) {
        const end = path.get('arguments')[0]!.node!.start!;

        const calleeName = (callee.node as any).name;
        changeset.push({
          type: 'create-element',
          code: `${jsx.name}.jsx2(${calleeName}, `,
          start: callee.node.start,
          end,
        });

        path.unshiftContainer('arguments', t.identifier(calleeName));
        callee.replaceWith(
          t.memberExpression(t.identifier(jsx.name), t.identifier('jsx2')),
        );
      } else {
        changeset.push({
          type: 'create-element',
          code: jsx.name,
          start: callee.node.start,
          end: callee.node.end,
        });
        callee.replaceWith(t.identifier(jsx.name));
      }

      file.set(HAS_CREATE_ELEMENT, true);
    }
  },

  JSXAttribute(path: NodePath<t.JSXAttribute>, state: CssPropPluginState) {
    const { file } = state;

    if (path.node.name.name !== 'css') return;

    const valuePath = path.get('value');
    const parentPath = path.findParent((p) => p.isJSXOpeningElement());

    const compiledNode = buildCssProp(
      valuePath,
      parentPath && getNameFromPath(parentPath.get('name') as NodePath),
      state,
      true,
    );

    if (compiledNode) {
      valuePath.replaceWith(compiledNode);
      file.set(HAS_JSX, true);
    }
  },
};
