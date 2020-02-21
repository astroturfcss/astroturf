import { stripIndents } from 'common-tags';

export function hoistImports(text: string) {
  const imports = [];

  let match;
  const rImports = /@import.*?(?:$|;)/g;

  // eslint-disable-next-line no-cond-assign
  while ((match = rImports.exec(text))) {
    imports.push(match[0]);
  }

  text = text.replace(rImports, '').trim();
  return [text, imports] as const;
}

export default function wrapInClass(text: string) {
  const [ruleset, imports] = hoistImports(text);

  // Components need two css classes, the actual style declarations and a hook class.
  // We need both so that that interpolations have a class that is _only_
  // the single class, e.g. no additional classes composed in so that it can be used
  // as a selector
  //
  // comment prevents Sass from removing the empty class
  let val = stripIndents`
    .cls1 { /*!*/ }
    .cls2 {
      composes: cls1;

      ${ruleset}
    }`;

  if (imports.length) val = `${imports.join('\n')}\n${val}`;
  return val;
}
