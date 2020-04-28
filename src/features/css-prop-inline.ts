import { NodePath } from '@babel/core';
import generate from '@babel/generator';
import * as t from '@babel/types';
import chalk from 'chalk';

import { DynamicStyle, PluginState } from '../types';
import { COMPONENTS, HAS_CSS_PROP, STYLES } from '../utils/Symbols';
import addPragma from '../utils/addPragma';
import buildTaggedTemplate from '../utils/buildTaggedTemplate';
import createStyleNode from '../utils/createStyleNode';
import getNameFromPath from '../utils/getNameFromPath';
import isCreateElementCall from '../utils/isCreateElementCall';
import isCssTag from '../utils/isCssTag';
import truthy from '../utils/truthy';
import wrapInClass from '../utils/wrapInClass';

const JSX_IDENTS = Symbol('Astroturf jsx identifiers');

type Var = [t.StringLiteral, t.Expression, t.StringLiteral | undefined];

type CssPropPluginState = PluginState & {
  [JSX_IDENTS]: {
    jsx: t.Identifier;
    jsxFrag: t.Identifier;
  };
};

const isSpread = (p: NodePath<any>): p is NodePath<t.JSXSpreadAttribute> =>
  p.isJSXSpreadAttribute();

const assign = (...nodes: t.Expression[]) =>
  t.callExpression(
    t.memberExpression(t.identifier('Object'), t.identifier('assign')),
    nodes,
  );

const findPropIndex = <T extends NodePath<any>>(attrs: T[], key: string) =>
  attrs.findIndex((a) => a.isJSXAttribute() && a.node.name.name === key);

const unwrapValue = (attr: NodePath<t.JSXAttribute>) => {
  const value = attr.get('value');
  return value.isJSXExpressionContainer()
    ? value.get('expression')
    : (value as NodePath<t.StringLiteral>);
};

function buildStyleAttribute(
  attrs: NodePath<t.JSXAttribute | t.JSXSpreadAttribute>[],
  vars: t.ArrayExpression,
) {
  const idx = findPropIndex(attrs, 'style');
  const style = idx === -1 ? null : (attrs[idx] as NodePath<t.JSXAttribute>);
  const spreads: any = (idx === -1 ? attrs : attrs.slice(idx))
    .filter(isSpread)
    .map(({ node }) =>
      t.memberExpression(node.argument, t.identifier('style')),
    );

  if (style) {
    spreads.unshift(unwrapValue(style).node);
    style.remove();
  }

  const props = vars.elements.map((el: t.ArrayExpression) => {
    const [id, value, unit] = el.elements as Var;
    return t.objectProperty(
      t.stringLiteral(`--${id.value}`),
      unit
        ? t.binaryExpression(
            '+',
            t.callExpression(t.identifier('String'), [value]),
            unit,
          )
        : value,
    );
  });

  const varObj = t.objectExpression(props);

  if (!spreads.length) return varObj;

  const values = spreads.reduce((curr: any, next: any) =>
    t.logicalExpression('||', next!, curr),
  );

  console.log(spreads);
  return assign(t.objectExpression(props), values);
}

function buildClassNameAttribute(
  attrs: NodePath<t.JSXAttribute | t.JSXSpreadAttribute>[],
  rootId: t.Identifier,
) {
  const idx = findPropIndex(attrs, 'className');
  const className =
    idx === -1 ? null : (attrs[idx] as NodePath<t.JSXAttribute>);

  const values: any = (idx === -1 ? attrs : attrs.slice(idx))
    .filter(isSpread)
    .map(({ node }) =>
      t.logicalExpression(
        '||',
        t.memberExpression(node.argument, t.identifier('className')),
        t.stringLiteral(''),
      ),
    );

  if (className) {
    values.unshift(unwrapValue(className).node);
    className.remove();
  }

  values.push(t.memberExpression(rootId, t.identifier('cls1')));

  return values.reduce((curr: any, next: any) =>
    t.binaryExpression(
      '+',
      next!,
      t.binaryExpression('+', t.stringLiteral(' '), curr),
    ),
  );
}

function tryToInlineJsx(
  path: NodePath<t.JSXAttribute>,
  node: t.ArrayExpression,
  state: PluginState,
) {
  const parent = path.parentPath as NodePath<t.JSXOpeningElement>;
  const attrs = parent.get('attributes');

  const [rootId, vars] = node.elements as [t.Identifier, t.ArrayExpression];

  const style = buildStyleAttribute(attrs, vars);
  const className = buildClassNameAttribute(attrs, rootId);
  // @ts-ignore
  parent.pushContainer('attributes', [
    t.jsxAttribute(t.jsxIdentifier('style'), t.jsxExpressionContainer(style)),
    t.jsxAttribute(
      t.jsxIdentifier('className'),
      t.jsxExpressionContainer(className),
    ),
  ]);

  // const nextClassName = className
  //   ? t.jsxExpressionContainer(
  //       t.binaryExpression(
  //         '+',
  //         unwrapValue(className).node as any,
  //         t.memberExpression(rootId, t.identifier('cls1')),
  //       ),
  //     )
  //   : t.memberExpression(rootId, t.identifier('cls1'));

  // const nextStyle = style
  //   ? t.jsxExpressionContainer(
  //       t.binaryExpression(
  //         '+',
  //         unwrapValue(className).node as any,
  //         t.memberExpression(rootId, t.identifier('cls1')),
  //       ),
  //     )
  //   : t.memberExpression(rootId, t.identifier('cls1'));

  // if (className) {
  //   const value = unwrapValue(className).node!;
  //   className
  //     .get('value')
  //     .replaceWith(
  //       t.jsxExpressionContainer(
  //         t.binaryExpression(
  //           '+',
  //           value as any,
  //           t.memberExpression(rootId, t.identifier('cls1')),
  //         ),
  //       ),
  //     );
  // } else {
  //   path.replaceWithMultiple([]);
  // }
}

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

  let vars: t.ArrayExpression, variants: t.ArrayExpression;

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
      ? valuePath.get('expression')
      : valuePath;

    if (
      exprPath.isTemplateLiteral() ||
      (exprPath.isTaggedTemplateExpression() &&
        isCssTag(exprPath.get('tag'), pluginOptions))
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

      vars = template.vars;
      variants = template.variants;

      style.interpolations = template.interpolations;
      style.value = template.css;
    }
  }

  if (!importId) {
    return null;
  }

  const importId = options.styleImports.add(style);

  let runtimeNode:
    | t.ArrayExpression
    | t.JSXExpressionContainer = t.arrayExpression(
    [importId, vars!].filter(truthy),
  );

  // FIXME?
  // @ts-ignore
  nodeMap.set(runtimeNode.expression, style);
  cssState.styles.set(style.absoluteFilePath, style);

  if (isJsx) {
    runtimeNode = t.jsxExpressionContainer(runtimeNode);
  }

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
};

export default {
  Program: {
    enter(path: NodePath<t.Program>, state: any) {
      // We need to re-export Fragment because of
      // https://github.com/babel/babel/pull/7996#issuecomment-519653431
      state[JSX_IDENTS] = {
        jsx: path.scope.generateUidIdentifier('j'),
        jsxFrag: path.scope.generateUidIdentifier('f'),
      };
    },

    exit(path: NodePath<t.Program>, state: CssPropPluginState) {
      if (!state.file.get(HAS_CSS_PROP)) return;

      const { jsx, jsxFrag } = state[JSX_IDENTS];

      const changes = addPragma(path, jsx, jsxFrag);

      state.file.get(STYLES).changeset.unshift(...changes);
    },
  },

  CallExpression(path: NodePath<t.CallExpression>, state: CssPropPluginState) {
    const { file } = state;
    const pluginOptions = state.defaultedOptions;

    if (!isCreateElementCall(path)) return;

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
    if (propsPath) {
      propsPath.traverse(cssPropertyVisitors, innerState);
    }

    if (innerState.processed) {
      const { jsx } = state[JSX_IDENTS];
      const { changeset } = file.get(STYLES);
      const callee = path.get('callee');

      changeset.push({
        code: jsx.name,
        start: callee.node.start,
        end: callee.node.end,
      });

      callee.replaceWith(jsx);
      file.set(HAS_CSS_PROP, true);
    }
  },

  JSXAttribute(path: NodePath<t.JSXAttribute>, state: CssPropPluginState) {
    const { file } = state;

    if (path.node.name.name !== 'css') return;

    const valuePath = path.get('value');
    const parentPath = path.findParent((p) => p.isJSXOpeningElement());

    const compiledNode: any = buildCssProp(
      valuePath,
      parentPath && getNameFromPath(parentPath.get('name') as NodePath),
      state,
      true,
    );

    if (compiledNode) {
      tryToInlineJsx(path, compiledNode.expression, state);
      valuePath.replaceWith(compiledNode);
      file.set(HAS_CSS_PROP, true);
    }
  },
};
