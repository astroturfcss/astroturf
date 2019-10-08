import template from '@babel/template';
import * as t from '@babel/types';

import buildTaggedTemplate from '../utils/buildTaggedTemplate';
import createStyleNode from '../utils/createStyleNode';
import getDisplayName from '../utils/getDisplayName';
import isCssTag from '../utils/isCssTag';
import { COMPONENTS, STYLES } from '../utils/Symbols';

const buildImport = template('require(FILENAME);');

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
  });

  nodeMap.set(runtimeNode.expression, style);
  return runtimeNode;
}

export default {
  TaggedTemplateExpression(path, state) {
    const pluginOptions = state.defaultedOptions;

    const tagPath = path.get('tag');

    if (isCssTag(tagPath, pluginOptions)) {
      path.replaceWith(
        buildStyleRequire(path, {
          pluginOptions,
          file: state.file,
        }),
      );
    }
  },
};
