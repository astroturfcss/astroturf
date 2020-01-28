import chalk from 'chalk';
import { NodePath } from '@babel/core';
import generate from '@babel/generator';
import { addNamed } from '@babel/helper-module-imports';
import template from '@babel/template';
import * as t from '@babel/types';

import { DynamicStyle, PluginState, ResolvedOptions } from '../types';
import buildTaggedTemplate from '../utils/buildTaggedTemplate';
import createStyleNode from '../utils/createStyleNode';
import getNameFromPath from '../utils/getNameFromPath';
import isCssTag from '../utils/isCssTag';
import { COMPONENTS, HAS_CSS_PROP, STYLES } from '../utils/Symbols';
import toVarsArray from '../utils/toVarsArray';
import trimExpressions from '../utils/trimExpressions';
import wrapInClass from '../utils/wrapInClass';

const JSX_IDENTS = Symbol('Astroturf jsx identifiers');

type CssPropPluginState = PluginState & {
  [JSX_IDENTS]: {
    jsx: t.Identifier;
    jsxFrag: t.Identifier;
  };
};
const buildImport = template('require(FILENAME);');

const isCreateElementCall = (p: NodePath) =>
  p.isCallExpression() &&
  (p.get('callee.property') as any).node &&
  (p.get('callee.property') as any).node.name === 'createElement';

function buildCssProp(
  valuePath: NodePath<any>,
  name: string | null,
  options: { file: any; pluginOptions: ResolvedOptions; isJsx?: boolean },
) {
  const { file, pluginOptions, isJsx } = options;
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

  let vars;
  const baseStyle = createStyleNode(valuePath, displayName, {
    file,
    pluginOptions,
  });

  const style: DynamicStyle = {
    ...baseStyle,
    isStyledComponent: false,
    interpolations: [],
    imports: '',
    value: '',
  };

  if (valuePath.isStringLiteral()) {
    style.value = wrapInClass(valuePath.node.value);
  } else {
    const exprPath = valuePath.isJSXExpressionContainer()
      ? valuePath.get('expression')
      : valuePath;

    if (
      exprPath.isTemplateLiteral() ||
      (exprPath.isTaggedTemplateExpression() &&
        isCssTag(exprPath.get('tag'), pluginOptions))
    ) {
      const { text, imports, dynamicInterpolations } = buildTaggedTemplate({
        style,
        nodeMap,
        ...pluginOptions,
        quasiPath: exprPath.isTemplateLiteral()
          ? exprPath
          : exprPath.get('quasi'),
        useCssProperties: !!pluginOptions.customCssProperties,
      });

      vars = toVarsArray(dynamicInterpolations);

      style.imports = imports;
      style.interpolations = trimExpressions(dynamicInterpolations);
      style.value = imports + wrapInClass(text);
    }
  }

  if (!style.value) {
    return null;
  }

  let runtimeNode: t.Node = t.arrayExpression(
    [
      (buildImport({
        FILENAME: t.stringLiteral(style.relativeFilePath),
      }) as any).expression,
      vars,
    ].filter(Boolean),
  );
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
  if (keyPath.isIdentifier()) keyPath.node.name;
  return (keyPath.node as any).name;
};

interface InnerVisitorState {
  typeName: string | null;
  pluginOptions: ResolvedOptions;
  file: any;
  processed?: boolean;
}

const cssPropertyVisitors = {
  ObjectProperty(path: NodePath<t.ObjectProperty>, state: InnerVisitorState) {
    const { file, pluginOptions, typeName } = state;

    if (getObjectKey(path.get('key') as NodePath) !== 'css') return;

    const valuePath = path.get('value');

    const compiledNode = buildCssProp(valuePath, typeName, {
      file,
      pluginOptions,
    });

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

      const jsxPrgama = `* @jsx ${jsx.name} *`;
      const jsxFragPrgama = `* @jsxFrag ${jsxFrag.name} *`;

      path.addComment('leading', jsxPrgama);
      path.addComment('leading', jsxFragPrgama);

      addNamed(path, 'jsx', 'astroturf', { nameHint: jsx.name });
      addNamed(path, 'F', 'astroturf', { nameHint: jsxFrag.name });

      state.file.get(STYLES).changeset.unshift(
        { code: `/*${jsxPrgama}*/\n` },
        { code: `/*${jsxFragPrgama}*/\n\n` },
        {
          code: `const { jsx: ${jsx.name}, F: ${jsxFrag.name} } = require('astroturf');\n`,
        },
      );
    },
  },

  CallExpression(path: NodePath<t.CallExpression>, state: CssPropPluginState) {
    const { file } = state;
    const pluginOptions = state.defaultedOptions;

    if (!isCreateElementCall(path)) return;

    const typeName = getNameFromPath(path.get('arguments')[0]);

    const propsPath = path.get('arguments')[1];

    const innerState = { pluginOptions, file, processed: false, typeName };

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
    const pluginOptions = state.defaultedOptions;

    if (path.node.name.name !== 'css') return;

    const valuePath = path.get('value');
    const parentPath = path.findParent(p => p.isJSXOpeningElement());

    const compiledNode = buildCssProp(
      valuePath,
      parentPath && getNameFromPath(parentPath.get('name') as NodePath),
      {
        file,
        pluginOptions,
        isJsx: true,
      },
    );

    if (compiledNode) {
      valuePath.replaceWith(compiledNode);
      file.set(HAS_CSS_PROP, true);
    }
  },
};
