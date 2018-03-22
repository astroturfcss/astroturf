import { outputFileSync } from 'fs-extra';
import kebabCase from 'lodash/kebabCase';
import { dirname, extname, basename, join, relative } from 'path';

import * as t from '@babel/types';
import template from '@babel/template';
import generate from '@babel/generator';
import { stripIndent } from 'common-tags';
import get from 'lodash/get';
import camelCase from 'lodash/camelCase';

const buildImport = template('require(FILENAME);');
const buildComponent = template(
  `styled(TAGNAME, DISPLAYNAME, IMPORT, INTERPOLATION)`,
);

const STYLES = Symbol('CSSLiteralLoader');

/**
 * Build a logical expression returning a class, trying both the
 * kebab and camel case names: `s['fooBar'] || s['foo-bar']
 *
 * @param {String} className
 */
const buildStyleExpression = className =>
  t.logicalExpression(
    '||',
    t.memberExpression(
      t.identifier('s'),
      t.StringLiteral(camelCase(className.slice(1))), // remove the `.`
      true,
    ),
    t.memberExpression(
      t.identifier('s'),
      t.StringLiteral(className.slice(1)), // remove the `.`
      true,
    ),
  );

function getIdentifier(path) {
  const parent = path.findParent(p => p.isVariableDeclarator());
  return parent && t.isIdentifier(parent.node.id) ? parent.node.id.name : '';
}

function wrapInClass(className, value, hoistImports) {
  const imports = [];
  if (hoistImports) {
    let match;
    const matcher = /@import.*?(?:$|;)/g;
    // eslint-disable-next-line
    while ((match = matcher.exec(value))) imports.push(match[0]);
    value = value.replace(matcher, '');
  }

  let val = `${className} {\n${value}\n}`;
  if (imports.length) val = `${imports.join('\n')}\n${val}`;
  return val;
}

function createFileName(hostFile, { extension = '.css' }, id) {
  const base = basename(hostFile, extname(hostFile));
  return join(dirname(hostFile), `${base}-${id}${extension}`);
}

function isTag(path, tagName, allowGlobal = false) {
  return (
    path.get('tag.name').node === tagName &&
    (allowGlobal
      ? path.scope.hasGlobal(tagName)
      : path.get('tag').referencesImport('css-literal-loader/styled'))
  );
}

export default function plugin() {
  function evaluate(path) {
    const { confident, value } = path.evaluate();
    if (!confident) {
      throw path.buildCodeFrameError(
        'Could not evaluate css. Inline css must be statically analyzable',
      );
    }
    return value;
  }

  function createStyleNode(path, { opts, file }, identifier) {
    const { start, end } = path.node;
    const style = { start, end };
    const getFileName = opts.getFileName || createFileName;

    const hostFile = file.opts.filename;
    style.path = getFileName(hostFile, opts, identifier);

    let filename = relative(dirname(hostFile), style.path);
    if (!filename.startsWith('.')) {
      filename = `./${filename}`;
    }
    style.filename = filename;
    style.identifier = identifier;

    return style;
  }

  function extractNestedClasses(path, className, cssState, hoistImport) {
    const classNodes = [];
    const quasiPath = path.get('quasi');

    quasiPath.get('expressions').forEach(exprPath => {
      if (!t.isArrowFunctionExpression(exprPath.node)) return;
      exprPath.traverse({
        TaggedTemplateExpression(innerPath) {
          if (!isTag(innerPath, 'css')) return;

          const innerClass = `${className}-variant-${cssState.id++}`;
          const [classNode] = extractNestedClasses(innerPath, innerClass);
          const { node } = exprPath;
          exprPath.remove();

          innerPath.replaceWith(buildStyleExpression(innerClass));

          classNodes.push({ ...classNode, node });
        },
      });
    });

    return [
      {
        value: wrapInClass(className, evaluate(quasiPath), hoistImport),
        className,
      },
      ...classNodes,
    ];
  }

  function buildStyleRequire(path, state) {
    const { styles } = state.file.get(STYLES);
    const quasiPath = path.get('quasi');
    const style = createStyleNode(path, state, getIdentifier(path));
    style.value = evaluate(quasiPath);
    styles.add(style);
    return buildImport({ FILENAME: t.StringLiteral(style.filename) }); // eslint-disable-line new-cap
  }

  function buildStyledComponent(path, state) {
    const cssState = state.file.get(STYLES);

    const tagName = get(path.get('tag'), 'node.arguments[0]');
    const displayName = getIdentifier(path) || tagName.value;

    const className = `.${kebabCase(displayName)}`;

    const classNodes = extractNestedClasses(path, className, cssState, true);

    const style = createStyleNode(path, state, displayName);
    style.tagName = t.isStringLiteral(tagName)
      ? `"${tagName.value}"`
      : tagName;

    style.value = classNodes.map(f => f.value).join('\n');
    let interpolations = classNodes.map(v => v.node).filter(Boolean);

    interpolations = t.ArrowFunctionExpression(
      [t.Identifier('s')],
      t.ArrayExpression([buildStyleExpression(className), ...interpolations]),
    );

    if (state.opts.generateInterpolations)
      style.interpolations = generate(interpolations).code;

    cssState.styles.add(style);

    return buildComponent({
      TAGNAME: tagName,
      DISPLAYNAME: t.stringLiteral(displayName),
      IMPORT: buildImport({
        FILENAME: t.StringLiteral(style.filename),
      }).expression,
      INTERPOLATION: interpolations,
    });
  }

  return {
    pre(file) {
      if (!file.has(STYLES)) {
        file.set(STYLES, {
          id: 0,
          styles: new Set(),
        });
      }
    },

    post(file) {
      const { opts } = this;

      let { styles } = file.get(STYLES);
      styles = Array.from(styles.values());

      file.metadata['css-literal-loader'] = { styles };

      if (opts.writeFiles !== false) {
        styles.forEach(({ path, value }) => {
          outputFileSync(path, stripIndent([value]));
        });
      }
    },

    visitor: {
      TaggedTemplateExpression(path, state) {
        const { tagName = 'css', allowGlobal } = state.opts;
        const { node } = path;

        if (
          t.isCallExpression(node.tag) &&
          path.get('tag.callee').referencesImport('css-literal-loader/styled')
        ) {
          path.replaceWith(buildStyledComponent(path, state));
          path.addComment('leading', '#__PURE__');
        } else if (isTag(path, tagName, allowGlobal)) {
          path.replaceWith(buildStyleRequire(path, state));
          path.addComment('leading', '#__PURE__');
        }
      },
    },
  };
}
