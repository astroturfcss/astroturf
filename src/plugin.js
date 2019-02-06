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
import { getDefaults } from './utils/defaults';
import buildTemplateString from './utils/buildTemplateString';

const buildImport = template('require(FILENAME);');

const buildComponent = template(
  `styled(TAGNAME, OPTIONS, {
    styles: IMPORT,
    vars: VARS,
    displayName: DISPLAYNAME,
    kebabClass: KEBABNAME,
    camelClass: CAMELNAME
  })`,
);

const STYLES = Symbol('Astroturf');
const IMPORTS = Symbol('Astroturf imports');

function getNameFromFile(fileName) {
  const name = basename(fileName, extname(fileName));
  if (name !== 'index') return pascalCase(name);
  return pascalCase(basename(dirname(fileName)));
}

function getDisplayName(
  path,
  file,
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

function createFileName(hostFile, { extension }, id) {
  let base;

  if (getNameFromFile(hostFile) === id) base = id;
  else base = `${basename(hostFile, extname(hostFile))}-${id}`;

  return join(dirname(hostFile), base + extension);
}

function isCssTag(path, { cssTag, allowGlobal }) {
  return (
    path.get('tag').node.name === cssTag &&
    (path.get('tag').referencesImport('astroturf') ||
      (allowGlobal && path.scope.hasGlobal(cssTag)))
  );
}

const isStyledTag = (path, { styledTag, allowGlobal }) => {
  const { node } = path.get('tag');
  return (
    t.isCallExpression(node) &&
    node.callee.name === styledTag &&
    (allowGlobal || path.get('tag.callee').referencesImport('astroturf'))
  );
};

const isStyledTagShorthand = (path, { styledTag, allowGlobal }) =>
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

  function createStyleNode(path, identifier, { options, file }) {
    const { start, end } = path.node;
    const style = { start, end };
    const getFileName = options.getFileName || createFileName;

    const hostFile = file.opts.filename;
    style.absoluteFilePath = getFileName(hostFile, options, identifier);

    let filename = relative(dirname(hostFile), style.absoluteFilePath);
    if (!filename.startsWith('.')) {
      filename = `./${filename}`;
    }
    style.relativeFilePath = filename;
    style.identifier = identifier;

    return style;
  }

  function buildStyleRequire(path, args) {
    const { styles } = args.file.get(STYLES);
    const quasiPath = path.get('quasi');
    const style = createStyleNode(path, getDisplayName(path, args.file), args);
    style.value = evaluate(quasiPath);

    style.code = `require('${style.relativeFilePath}')`;

    if (styles.has(style.absoluteFilePath)) {
      const { cssTag } = args.options;
      throw path.buildCodeFrameError(
        path.findParent(p => p.isExpressionStatement())
          ? `There are multiple anonymous ${cssTag} tags that would conflict. Differentiate each tag by assigning the output to a unique identifier`
          : `There are multiple ${cssTag} tags with the same inferred identifier. Differentiate each tag by assigning the output to a unique identifier`,
      );
    }

    styles.set(style.absoluteFilePath, style);
    return buildImport({ FILENAME: t.StringLiteral(style.relativeFilePath) }); // eslint-disable-line new-cap
  }

  function buildStyledComponent(path, tagName, args) {
    const cssState = args.file.get(STYLES);
    const displayName = getDisplayName(path, args.file, null);
    if (!displayName) {
      throw path.buildCodeFrameError(
        // the expression case should always be the problem but just in case, let's avoid a potentially weird error.
        path.findParent(p => p.isExpressionStatement())
          ? 'The output of this styled component is never used. Either assign it to a variable or export it.'
          : 'Could not determine a displayName for this styled component. Each component must be uniquely identifiable, either as the default export of the module or by assigning it to a unique identifier',
      );
    }

    const style = createStyleNode(path, displayName, args);

    const kebabName = kebabCase(displayName);
    const { text, interpolations } = buildTemplateString(
      path,
      displayName,
      args.options,
    );
    style.value = wrapInClass(`.${kebabName}`, text);

    const runtimeNode = buildComponent({
      TAGNAME: tagName,
      OPTIONS: get(path.get('tag'), 'node.arguments[1]', t.NullLiteral()),
      IMPORT: buildImport({
        FILENAME: t.StringLiteral(style.relativeFilePath),
      }).expression,
      VARS: t.ArrayExpression(
        interpolations.map(i => {
          const value = [t.StringLiteral(i.id), i.node];
          if (i.unit) value.push(t.StringLiteral(i.unit));

          return t.ArrayExpression(value);
        }),
      ),
      DISPLAYNAME: t.StringLiteral(displayName),
      KEBABNAME: t.StringLiteral(kebabName),
      CAMELNAME: t.StringLiteral(camelCase(kebabName)),
    });

    if (args.options.generateInterpolations)
      style.code = generate(runtimeNode).code;

    cssState.styles.set(style.absoluteFilePath, style);
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
    },

    post(file) {
      const { opts } = this;
      const importNodes = file.get(IMPORTS);
      const imports = [];

      importNodes.forEach(path => {
        const decl = !path.isImportDeclaration()
          ? path.findParent(p => p.isImportDeclaration())
          : path;

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
      TaggedTemplateExpression(path, { opts, file }) {
        const options = getDefaults(opts);
        const args = { file, options };

        if (isStyledTag(path, options)) {
          const componentType = get(path.get('tag'), 'node.arguments[0]');

          path.replaceWith(buildStyledComponent(path, componentType, args));
          path.addComment('leading', '#__PURE__');

          // styled.button` ... `
        } else if (isStyledTagShorthand(path, options)) {
          const componentType = t.StringLiteral(
            path.get('tag.property').node.name,
          );

          path.replaceWith(buildStyledComponent(path, componentType, args));
          path.addComment('leading', '#__PURE__');

          // lone css`` tag
        } else if (isCssTag(path, options)) {
          path.replaceWith(buildStyleRequire(path, args));
          path.addComment('leading', '#__PURE__');
        }
      },

      ImportDeclaration: {
        exit(path, state) {
          const { cssTag } = getDefaults(state.opts);
          const specifiers = path.get('specifiers');
          const tagImport = path
            .get('specifiers')
            .find(
              p =>
                p.isImportSpecifier() &&
                p.node.imported.name === 'css' &&
                p.node.local.name === cssTag,
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
