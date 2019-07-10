import { stripIndents } from 'common-tags';

export default function wrapInClass(text) {
  const imports = [];
  const composes = [];

  let match;
  const rImports = /@import.*?(?:$|;)/g;
  const rComposes = /\b(?:composes\s*?:\s*(.*?)(?:from\s(.+?))?(?=[}\n\r]))/gim;

  // eslint-disable-next-line no-cond-assign
  while ((match = rImports.exec(text))) {
    imports.push(match[0]);
  }
  match = null;
  // eslint-disable-next-line no-cond-assign
  while ((match = rComposes.exec(text))) {
    composes.push(match[0]);
  }

  text = text.replace(rImports, '').replace(rComposes, '');

  // comment prevents Sass from removing the empty class
  let val = stripIndents`
    .cls1 {
      ${text.trim() || '/*!*/'}
    }`;

  // Components need two css classes, the first being the single root
  // class with styles and the second is the exported name used in the Styled helper
  // We need both so that that interpolations have a class that is _only_
  // the single class, e.g. no additional classes composed in so that it can be used
  // as a selecto
  if (composes.length) {
    composes.unshift(`composes: cls1;`);
    val += `\n.cls2 {\n${composes.join('\n')}\n}`;
  }

  if (imports.length) val = `${imports.join('\n')}\n${val}`;
  return val;
}
