import { stripIndent } from 'common-tags';
import { outputFileSync } from 'fs-extra';
import camelCase from 'lodash/camelCase';
import get from 'lodash/get';
import kebabCase from 'lodash/kebabCase';
import { dirname, extname, basename, join, relative } from 'path';
import * as t from '@babel/types';
import template from '@babel/template';
import generate from '@babel/generator';
import pascalCase from './utils/pascalCase';
import getNameFromPath from './utils/getNameFromPath';
import wrapInClass from './utils/wrapInClass';

const buildImport = template('require(FILENAME);');
const buildComponent = template(
  `styled(TAGNAME, OPTIONS, DISPLAYNAME, IMPORT, KEBABNAME, CAMELNAME)`,
);

const STYLES = Symbol('Astroturf');

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

function isCssTag(path, tagName, allowGlobal = false) {
  return (
    path.get('tag').node.name === tagName &&
    (path.get('tag').referencesImport('astroturf') ||
      (allowGlobal && path.scope.hasGlobal(tagName)))
  );
}

const isStyledTag = (path, styledTag, allowGlobal) => {
  const { node } = path.get('tag');
  return (
    t.isCallExpression(node) &&
    node.callee.name === styledTag &&
    (allowGlobal || path.get('tag.callee').referencesImport('astroturf'))
  );
};

const isStyledTagShorthand = (path, styledTag, allowGlobal) =>
  t.isMemberExpression(path.get('tag').node) &&
  t.isIdentifier(path.get('tag.property').node) &&
  path.get('tag.object').node.name === styledTag &&
  (allowGlobal || path.get('tag.object').referencesImport('astroturf'));

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

  function createStyleNode(path, { opts, file }, identifier) {
    const { start, end } = path.node;
    const style = { start, end };
    const getFileName = opts.getFileName || createFileName;

    const hostFile = file.opts.filename;
    style.absoluteFilePath = getFileName(hostFile, opts, identifier);

    let filename = relative(dirname(hostFile), style.absoluteFilePath);
    if (!filename.startsWith('.')) {
      filename = `./${filename}`;
    }
    style.relativeFilePath = filename;
    style.identifier = identifier;

    return style;
  }

  function buildStyleRequire(path, state, tagName) {
    const { styles } = state.file.get(STYLES);
    const quasiPath = path.get('quasi');
    const style = createStyleNode(path, state, getDisplayName(path, state));
    style.value = evaluate(quasiPath);

    style.code = `require('${style.relativeFileName}')`;

    if (styles.has(style.absoluteFilePath))
      throw path.buildCodeFrameError(
        path.findParent(p => p.isExpressionStatement())
          ? `There are multiple anonymous ${tagName} tags that would conflict. Differentiate each tag by assigning the output to a unique identifier`
          : `There are multiple ${tagName} tags with the same inferred identifier. Differentiate each tag by assigning the output to a unique identifier`,
      );

    styles.set(style.absoluteFilePath, style);
    return buildImport({ FILENAME: t.StringLiteral(style.relativeFilePath) }); // eslint-disable-line new-cap
  }

  function buildStyledComponent(path, tagName, options, state) {
    const cssState = state.file.get(STYLES);
    const displayName = getDisplayName(path, state, null);

    if (!displayName)
      throw path.buildCodeFrameError(
        // the expression case should always be the problem but just in case, let's avoid a potentially weird error.
        path.findParent(p => p.isExpressionStatement())
          ? 'The output of this styled component is never used. Either assign it to a variable or export it.'
          : 'Could not determine a displayName for this styled component. Each component must be uniquely identifiable, either as the default export of the module or by assigning it to a unique identifier',
      );

    const style = createStyleNode(path, state, displayName);

    const kebabName = kebabCase(displayName);
    style.value = wrapInClass(`.${kebabName}`, evaluate(path.get('quasi')));

    const runtimeNode = buildComponent({
      TAGNAME: tagName,
      OPTIONS: options || t.NullLiteral(),
      DISPLAYNAME: t.StringLiteral(displayName),
      IMPORT: buildImport({
        FILENAME: t.StringLiteral(style.relativeFilePath),
      }).expression,
      KEBABNAME: t.StringLiteral(kebabName),
      CAMELNAME: t.StringLiteral(camelCase(kebabName)),
    });

    if (state.opts.generateInterpolations)
      style.code = generate(runtimeNode).code;

    cssState.styles.set(style.absoluteFilePath, style);
    return runtimeNode;
  }

  return {
    pre(file) {
      if (!file.has(STYLES)) {
        file.set(STYLES, {
          id: 0,
          styles: new Map(),
        });
      }
    },

    post(file) {
      const { opts } = this;

      let { styles } = file.get(STYLES);
      styles = Array.from(styles.values());

      file.metadata.astroturf = { styles };

      if (opts.writeFiles !== false) {
        styles.forEach(({ absoluteFilePath, value }) => {
          outputFileSync(absoluteFilePath, stripIndent([value]));
        });
      }
    },

    visitor: {
      TaggedTemplateExpression(path, state) {
        const {
          tagName = 'css',
          allowGlobal = true,
          styledTag = 'styled',
        } = state.opts;

        if (isStyledTag(path, styledTag, allowGlobal)) {
          const componentType = get(path.get('tag'), 'node.arguments[0]');
          const options = get(path.get('tag'), 'node.arguments[1]');

          path.replaceWith(
            buildStyledComponent(path, componentType, options, state),
          );
          path.addComment('leading', '#__PURE__');

          // styled.button` ... `
        } else if (isStyledTagShorthand(path, styledTag, allowGlobal)) {
          const componentType = t.StringLiteral(
            path.get('tag.property').node.name,
          );

          path.replaceWith(
            buildStyledComponent(path, componentType, null, state),
          );
          path.addComment('leading', '#__PURE__');

          // lone css`` tag
        } else if (isCssTag(path, tagName, allowGlobal)) {
          path.replaceWith(buildStyleRequire(path, state, tagName));
          path.addComment('leading', '#__PURE__');
        }
      },
    },
  };
}
