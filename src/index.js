import { join, dirname, extname, basename } from 'path'
import { parse } from 'babylon';

import traverse from './traverse';

function parseSource(src) {
  return parse(src, {
    sourceType: 'module',
    plugins: [
      'asyncFunctions',
      'jsx',
      'flow',
      'classConstructorCall',
      'doExpressions',
      'trailingFunctionCommas',
      'objectRestSpread',
      'decorators',
      'classProperties',
      'exportExtensions',
      'exponentiationOperator',
      'asyncGenerators',
      'functionBind',
      'functionSent'
    ]
  })
}

function collectStyles(src) {
  let styles = [];

  // quick regex as an optimization to avoid parsing each file
  if (!src.match(/css`([\s\S]*?)`/gmi)) {
    return styles;
  }

  let ast = parseSource(src);
  traverse(ast, {
    TaggedTemplateExpression(path) {
      let node = path.node;

      if (node.tag.name !== 'css' || !path.scope.hasGlobal('css'))
        return

      let parseError = path.buildCodeFrameError(
        'Could not evaluate css. inline css must be statically analyzable'
      );

      let { start, end } = node

      // remove the tag and evaluate as a plain template;
      path.replaceWith(node.quasi)

      let { confident, value } = path.evaluate()

      if (!confident) {
        throw parseError
      }

      styles.push({ value, start, end })
    }
  })

  return styles
}

function replaceStyleTemplates(src, styles) {
  let offset = 0;

  function splice(str, start, end, replace) {
    let result = str.slice(0, start + offset) + replace + str.slice(end + offset);
    offset += replace.length - (end - start)
    return result;
  }

  styles.forEach(({ start, end, path }) => {
    src = splice(src, start, end, `require('${path}')`)
  })

  return src;
}

module.exports = function loader(content) {
  if (this.cacheable) this.cacheable();

  let styles = collectStyles(content);

  if (!styles.length) return content;

  let basepath = join(
    dirname(this.resource),
    basename(this.resource, extname(this.resource))
  )

  styles.forEach((style, idx) => {
    style.path = `${basepath}__extracted_styles_${idx++}.css`;
    this.emitVirtualFile(style.path, style.value)
  })

  return replaceStyleTemplates(content, styles)
}
