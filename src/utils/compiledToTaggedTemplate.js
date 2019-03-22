import * as t from '@babel/types';

import { isCssTag, isStyledTag, isStyledTagShorthand } from './Tags';

export default function compiledToTaggedTemplate(
  path,
  tagName,
  allowGlobal = false,
) {
  const subject = path.get('callee');
  //console.log(parent.node);
  if (
    !isCssTag(subject, tagName, allowGlobal) &&
    !isStyledTag(subject, tagName, allowGlobal) &&
    !isStyledTagShorthand(subject, tagName, allowGlobal)
  ) {
    return null;
  }

  const [call, ...values] = path.get('arguments');
  const callee = call.get('callee');
  const templateObject = callee.scope
    .getBinding(callee.node.name)
    .path.resolve();

  if (!templateObject) return null;
  let tag;
  templateObject.traverse({
    VariableDeclarator(innerPath) {
      if (tag) return;

      const init = innerPath.get('init');

      if (init.isCallExpression()) {
        const arg = init.get('arguments')[0];
        const evaled = arg && arg.evaluate();

        if (
          evaled &&
          evaled.confident &&
          evaled.value.every(s => typeof s === 'string')
        ) {
          tag = evaled;
        }
      }
    },
  });

  if (!tag) return null;

  return t.TaggedTemplateExpression(
    path.get('callee').node,
    t.TemplateLiteral(
      tag.value.map(quasi => ({
        type: 'TemplateElement',
        value: { raw: quasi, value: quasi },
      })),
      values.map(v => v.node),
    ),
  );
}
