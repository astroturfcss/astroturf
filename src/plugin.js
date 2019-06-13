import { basename, dirname, extname, join, relative } from 'path';
import { stripIndent } from 'common-tags';
import { outputFileSync } from 'fs-extra';
import camelCase from 'lodash/camelCase';
import defaults from 'lodash/defaults';
import get from 'lodash/get';
import kebabCase from 'lodash/kebabCase';
import generate from '@babel/generator';
import template from '@babel/template';
import * as t from '@babel/types';

import buildTaggedTemplate from './utils/buildTaggedTemplate';
import getNameFromPath from './utils/getNameFromPath';
import normalizeAttrs from './utils/normalizeAttrs';
import pascalCase from './utils/pascalCase';
import wrapInClass from './utils/wrapInClass';

const buildImport = template('require(FILENAME);');
const buildComponent = template(
  `styled(ELEMENTTYPE, OPTIONS, {
    displayName: DISPLAYNAME,
    styles: IMPORT,
    attrs: ATTRS,
    kebabName: KEBABNAME,
    camelName: CAMELNAME
  })`,
);

const STYLES = Symbol('Astroturf');
const COMPONENTS = Symbol('Astroturf components');
const IMPORTS = Symbol('Astroturf imports');

function getNameFromFile(fileName) {
  const name = basename(fileName, extname(fileName));
  if (name !== 'index') return pascalCase(name);
  return pascalCase(basename(dirname(fileName)));
}

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

function createFileName(hostFile, { extension = '.css' }, id) {
  let base;

  if (getNameFromFile(hostFile) === id) base = id;
  else base = `${basename(hostFile, extname(hostFile))}-${id}`;

  return join(dirname(hostFile), base + extension);
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

export default function plugin() {
  function evaluate(path) {
    const { confident, value } = path.evaluate();

    if (!confident) {
      throw path.buildCodeFrameError(
        'Could not evaluate css. Inline styles must be statically analyzable',
      );
    }
    return value;
  }

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
    const quasiPath = path.get('quasi');
    const style = createStyleNode(path, getDisplayName(path, opts), opts);
    style.value = evaluate(quasiPath);

    style.code = `require('${style.relativeFilePath}')`;

    if (styles.has(style.absoluteFilePath))
      throw path.buildCodeFrameError(
        path.findParent(p => p.isExpressionStatement())
          ? `There are multiple anonymous ${tagName} tags that would conflict. Differentiate each tag by assigning the output to a unique identifier`
          : `There are multiple ${tagName} tags with the same inferred identifier. Differentiate each tag by assigning the output to a unique identifier`,
      );

    styles.set(style.absoluteFilePath, style);
    return buildImport({ FILENAME: t.StringLiteral(style.relativeFilePath) }); // eslint-disable-line new-cap
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

    const { text, imports } = buildTaggedTemplate(
      path,
      nodeMap,
      style,
      opts.pluginOptions,
    );

    const kebabName = kebabCase(displayName);
    style.name = kebabName;
    style.value = imports + wrapInClass(`.${style.name}`, text);

    const runtimeNode = buildComponent({
      ELEMENTTYPE: elementType,
      ATTRS: normalizeAttrs(styledAttrs),
      OPTIONS: styledOptions || t.NullLiteral(),
      DISPLAYNAME: t.StringLiteral(displayName),
      IMPORT: buildImport({
        FILENAME: t.StringLiteral(style.relativeFilePath),
      }).expression,
      KEBABNAME: t.StringLiteral(kebabName),
      CAMELNAME: t.StringLiteral(camelCase(kebabName)),
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
          styles: new Map(),
        });
      }

      if (!file.has(COMPONENTS)) {
        file.set(COMPONENTS, new Map());
      }
    },

    post(file) {
      const { opts } = this;
      const importNodes = file.get(IMPORTS);
      const imports = [];

      importNodes.forEach(path => {
        const decl = !path.isImportDeclaration()
          ? path.findParent(p => p.isImportDeclaration())
          : path;

        if (!decl) return;

        const { start, end } = decl.node;

        path.remove();

        if (opts.generateInterpolations)
          imports.push({
            start,
            end,
            // if the path is just a removed specifier we need to regenerate
            // the import statement otherwise we remove the entire declaration
            code: !path.isImportDeclaration() ? generate(decl.node).code : '',
          });
      });

      let { styles } = file.get(STYLES);
      styles = Array.from(styles.values());

      file.metadata.astroturf = { styles, imports };

      if (opts.writeFiles !== false) {
        styles.forEach(({ absoluteFilePath, value }) => {
          outputFileSync(absoluteFilePath, stripIndent([value]));
        });
      }
    },

    visitor: {
      TaggedTemplateExpression(path, state) {
        const pluginOptions = defaults(state.opts, {
          tagName: 'css',
          allowGlobal: true,
          styledTag: 'styled',
        });

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
          const { tagName = 'css' } = state.opts;
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
