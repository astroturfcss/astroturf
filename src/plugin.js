import { dirname, relative } from 'path';
import chalk from 'chalk';
import { stripIndent } from 'common-tags';
import { outputFileSync } from 'fs-extra';
import defaults from 'lodash/defaults';
import get from 'lodash/get';
import generate from '@babel/generator';
import { addDefault, addNamed } from '@babel/helper-module-imports';
import template from '@babel/template';
import * as t from '@babel/types';

import buildTaggedTemplate from './utils/buildTaggedTemplate';
import createFileName, { getNameFromFile } from './utils/createFilename';
import getNameFromPath from './utils/getNameFromPath';
import normalizeAttrs from './utils/normalizeAttrs';
import wrapInClass from './utils/wrapInClass';

const buildImport = template('require(FILENAME);');
const buildComponent = template(
  `styled(ELEMENTTYPE, OPTIONS, {
    displayName: DISPLAYNAME,
    styles: IMPORT,
    attrs: ATTRS,
    vars: VARS
  })`,
);

const STYLES = Symbol('Astroturf');
const COMPONENTS = Symbol('Astroturf components');
const IMPORTS = Symbol('Astroturf imports');
const HAS_CSS_PROP = Symbol('Astroturf has css prop');

function getDisplayName(
  path,
  { file },
  defaultName = getNameFromFile(file.opts.filename),
) {
  // eslint-disable-next-line no-cond-assign
  while ((path = path.parentPath)) {
    if (path.isVariableDeclarator()) return getNameFromPath(path.get('id'));
    if (path.isAssignmentExpression())
      return getNameFromPath(path.get('left'));
    if (path.isExportDefaultDeclaration())
      return getNameFromFile(file.opts.filename);
  }
  return defaultName || null;
}

function isCssTag(tagPath, { tagName, allowGlobal }) {
  return (
    tagPath.node.name === tagName &&
    (tagPath.referencesImport('astroturf') ||
      (allowGlobal && tagPath.scope.hasGlobal(tagName)))
  );
}

const hasAttrs = calleePath =>
  calleePath.isMemberExpression() &&
  calleePath.get('property').node.name === 'attrs';

const isAttrsExpression = (calleePath, pluginOptions) =>
  hasAttrs(calleePath) &&
  // eslint-disable-next-line no-use-before-define
  isStyledTag(calleePath.get('object'), pluginOptions);

const isStyledExpression = (calleePath, { styledTag, allowGlobal }) =>
  calleePath.node.name === styledTag &&
  (allowGlobal || calleePath.referencesImport('astroturf'));

const isStyledTag = (tagPath, pluginOptions) => {
  const callee = tagPath.get('callee');
  return (
    tagPath.isCallExpression() &&
    (isAttrsExpression(callee, pluginOptions) ||
      isStyledExpression(callee, pluginOptions))
  );
};

const isStyledTagShorthand = (tagPath, { styledTag, allowGlobal }) => {
  return (
    tagPath.isMemberExpression() &&
    tagPath.get('property').isIdentifier() &&
    tagPath.get('object').node.name === styledTag &&
    (allowGlobal || tagPath.get('object').referencesImport('astroturf'))
  );
};

const trimExprs = interpolations =>
  Array.from(interpolations, ({ expr: _, ...i }) => i);

const toVarsArray = interpolations =>
  t.ArrayExpression(
    Array.from(interpolations, i =>
      t.ArrayExpression(
        [
          t.StringLiteral(i.id),
          i.expr.node,
          i.unit && t.StringLiteral(i.unit),
        ].filter(Boolean),
      ),
    ),
  );

export default function plugin() {
  function createStyleNode(path, identifier, { pluginOptions, file }) {
    const { start, end } = path.node;
    const style = { start, end };
    const getFileName = pluginOptions.getFileName || createFileName;

    const hostFile = file.opts.filename;
    style.absoluteFilePath = getFileName(hostFile, pluginOptions, identifier);

    let filename = relative(dirname(hostFile), style.absoluteFilePath);
    if (!filename.startsWith('.')) {
      filename = `./${filename}`;
    }
    style.relativeFilePath = filename;
    style.identifier = identifier;

    return style;
  }

  function buildStyleRequire(path, opts) {
    const { tagName } = opts.pluginOptions;
    const { styles } = opts.file.get(STYLES);
    const nodeMap = opts.file.get(COMPONENTS);

    const style = createStyleNode(path, getDisplayName(path, opts), opts);

    style.code = `require('${style.relativeFilePath}')`;

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
      FILENAME: t.StringLiteral(style.relativeFilePath),
    }); // eslint-disable-line new-cap

    nodeMap.set(runtimeNode.expression, style);
    return runtimeNode;
  }

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
    style.interpolations = trimExprs(dynamicInterpolations);
    style.value = imports + wrapInClass(text);

    const runtimeNode = buildComponent({
      ELEMENTTYPE: elementType,
      ATTRS: normalizeAttrs(styledAttrs),
      OPTIONS: styledOptions || t.NullLiteral(),
      DISPLAYNAME: t.StringLiteral(displayName),
      VARS: toVarsArray(dynamicInterpolations),
      IMPORT: buildImport({
        FILENAME: t.StringLiteral(style.relativeFilePath),
      }).expression,
    });

    if (pluginOptions.generateInterpolations)
      style.code = generate(runtimeNode).code;

    cssState.styles.set(style.absoluteFilePath, style);
    nodeMap.set(runtimeNode.expression, style);
    return runtimeNode;
  }

  return {
    pre(file) {
      file.set(IMPORTS, []);

      if (!file.has(STYLES)) {
        file.set(STYLES, {
          id: 0,
          changeset: [],
          styles: new Map(),
        });
      }

      if (!file.has(COMPONENTS)) {
        file.set(COMPONENTS, new Map());
      }
    },

    post(file) {
      const { opts } = this;
      let { styles, changeset } = file.get(STYLES);
      const importNodes = file.get(IMPORTS);

      importNodes.forEach(path => {
        const decl = !path.isImportDeclaration()
          ? path.findParent(p => p.isImportDeclaration())
          : path;

        if (!decl) return;

        const { start, end } = decl.node;

        path.remove();

        if (opts.generateInterpolations)
          changeset.push({
            start,
            end,
            // if the path is just a removed specifier we need to regenerate
            // the import statement otherwise we remove the entire declaration
            code: !path.isImportDeclaration() ? generate(decl.node).code : '',
          });
      });

      styles = Array.from(styles.values());

      changeset = changeset.concat(styles);

      file.metadata.astroturf = { styles, changeset };

      if (opts.writeFiles !== false) {
        styles.forEach(({ absoluteFilePath, value }) => {
          outputFileSync(absoluteFilePath, stripIndent([value]));
        });
      }
    },

    visitor: {
      Program: {
        enter(_, state) {
          state.defaultedOptions = defaults(state.opts, {
            tagName: 'css',
            allowGlobal: true,
            styledTag: 'styled',
            customCssProperties: 'cssProp', // or: true, false
          });
        },
        exit(path, state) {
          if (!state.file.get(HAS_CSS_PROP)) return;

          // We need to re-export Fragment because of
          // https://github.com/babel/babel/pull/7996#issuecomment-519653431
          const jsx = path.scope.generateUidIdentifier('j');
          const jsxFrag = path.scope.generateUidIdentifier('f');

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

      JSXAttribute(path, state) {
        const { file } = state;
        const pluginOptions = state.defaultedOptions;
        const cssState = file.get(STYLES);
        const nodeMap = file.get(COMPONENTS);

        if (path.node.name.name !== 'css') return;

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
          return;
        }

        const valuePath = path.get('value');
        const displayName = `CssProp${++cssState.id}_${getNameFromPath(
          path.findParent(p => p.isJSXOpeningElement).get('name'),
        )}`;

        let vars;
        const style = createStyleNode(valuePath, displayName, {
          pluginOptions,
          file: state.file,
        });

        if (valuePath.isStringLiteral()) {
          style.value = wrapInClass(path.node.value.value);
        } else if (valuePath.isJSXExpressionContainer()) {
          const exprPath = valuePath.get('expression');

          if (
            exprPath.isTemplateLiteral() ||
            (exprPath.isTaggedTemplateExpression() &&
              isCssTag(exprPath.get('tag'), pluginOptions))
          ) {
            const {
              text,
              imports,
              dynamicInterpolations,
            } = buildTaggedTemplate({
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
            style.interpolations = trimExprs(dynamicInterpolations);
            style.value = imports + wrapInClass(text);
          }
        }

        if (style.value == null) return;

        const importId = addDefault(valuePath, style.relativeFilePath);
        const runtimeNode = t.jsxExpressionContainer(
          t.arrayExpression([importId, vars].filter(Boolean)),
        );

        cssState.styles.set(style.absoluteFilePath, style);

        if (pluginOptions.generateInterpolations)
          style.code = generate(runtimeNode).code;

        cssState.changeset.push({
          code: `const ${importId.name} = require('${style.relativeFilePath}');\n`,
        });

        nodeMap.set(runtimeNode.expression, style);

        valuePath.replaceWith(runtimeNode);
        file.set(HAS_CSS_PROP, true);
      },

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
          const componentType = t.StringLiteral(
            tagPath.get('property').node.name,
          );

          path.replaceWith(
            buildStyledComponent(path, componentType, {
              pluginOptions,
              file: state.file,
            }),
          );
          path.addComment('leading', '#__PURE__');

          // lone css`` tag
        } else if (isCssTag(tagPath, pluginOptions)) {
          path.replaceWith(
            buildStyleRequire(path, {
              pluginOptions,
              file: state.file,
            }),
          );
          path.addComment('leading', '#__PURE__');
        }
      },

      ImportDeclaration: {
        exit(path, state) {
          const { tagName } = state.defaultedOptions;
          const specifiers = path.get('specifiers');
          const tagImport = path
            .get('specifiers')
            .find(
              p =>
                p.isImportSpecifier() &&
                p.node.imported.name === 'css' &&
                p.node.local.name === tagName,
            );

          if (tagImport) {
            state.file
              .get(IMPORTS)
              .push(specifiers.length === 1 ? path : tagImport);
          }
        },
      },
    },
  };
}
