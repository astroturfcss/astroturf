export default function wrapInClass(className, value) {
  const imports = [];

  let match;
  const matcher = /@import.*?(?:$|;)/g;

  // eslint-disable-next-line no-cond-assign
  while ((match = matcher.exec(value))) {
    imports.push(match[0]);
  }

  value = value.replace(matcher, '');

  let val = `${className} {\n${value}\n}`;
  if (imports.length) val = `${imports.join('\n')}\n${val}`;
  return val;
}
