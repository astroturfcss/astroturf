import { outputFileSync } from 'fs-extra';
import kebabCase from 'lodash/kebabCase';
import { dirname, extname, basename, relative } from 'path';

import * as t from '@babel/types';
import template from '@babel/template';
import generate from '@babel/generator';
import Stylis from 'stylis';
import { stripIndent } from 'common-tags';
import get from 'lodash/get';

const buildImport = template('require(FILENAME);');
const buildComponent = template(
  `styled(TAGNAME, DISPLAYNAME, IMPORT, INTERPOLATION)`,
);

const STYLES = Symbol('CSSLiteralLoader');

const buildStyleExpression = className =>
  t.memberExpression(t.identifier('s'), t.StringLiteral(className), true);

function createFileName(hostFile, { extension = '.css' }, id) {
  const base = basename(hostFile, extname(hostFile));
  return `${dirname(hostFile)}/__extracted_styles__/${base}_${id}${extension}`;
}

function isTag(path, tagName) {
  return (
    path.get('tag.name').node !== tagName || path.scope.hasGlobal(tagName)
  );
}

export default function plugin() {
  let stylis;

  function evaluate(path) {
    const { confident, value } = path.evaluate();
    if (!confident) {
      throw path.buildCodeFrameError(
        'Could not evaluate css. Inline css must be statically analyzable',
      );
    }
    return value;
  }

  function createStyleNode(path, { opts, file }) {
    const { start, end } = path.node;
    const style = { start, end };
    const getFileName = opts.getFileName || createFileName;

    const hostFile = file.opts.filename;
    style.path = getFileName(hostFile, opts, file.get(STYLES).id++);

    let filename = relative(dirname(hostFile), style.path);
    if (!filename.startsWith('.')) {
      filename = `./${filename}`;
    }
    style.filename = filename;
    return style;
  }

  function extractNestedClasses(path, className, cssState) {
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
      { value: stylis(className, evaluate(quasiPath)), className },
      ...classNodes,
    ];
  }

  function buildStyleRequire(path, state) {
    const styles = state.file.get(STYLES);
    const quasiPath = path.get('quasi');
    const style = createStyleNode(path, state);
    style.value = evaluate(quasiPath);
    styles.add(style);
    return buildImport({ FILENAME: t.StringLiteral(style.filename) }); // eslint-disable-line new-cap
  }

  function buildStyledComponent(path, state) {
    const cssState = state.file.get(STYLES);

    const tagName = get(path.get('tag'), 'node.arguments[0]');
    const displayName = path.parentPath.get('id.name').node;

    const className = `.${kebabCase(displayName || tagName.value)}`;
    const classNodes = extractNestedClasses(path, className, cssState);

    const style = createStyleNode(path, state);
    style.displayName = displayName;
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
      stylis = new Stylis({
        global: false,
        compress: false,
        semicolon: true,
        cascade: true,
        preserve: true,
        prefix: false,
        ...this.opts.stylis,
      });

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
        const { tagName = 'css' } = state.opts;
        const { node } = path;

        if (
          t.isCallExpression(node.tag) &&
          path.get('tag.callee').referencesImport('css-literal-loader/styled')
        ) {
          path.replaceWith(buildStyledComponent(path, state));
        } else if (
          node.tag.name === tagName &&
          path.scope.hasGlobal(tagName)
        ) {
          path.replaceWith(buildStyleRequire(path, state));
        }
      },
    },
  };
}
