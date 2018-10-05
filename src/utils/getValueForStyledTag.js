import { SourceMapGenerator } from 'source-map';

function evaluate(path) {
  const { confident, value } = path.evaluate();

  if (!confident) {
    throw path.buildCodeFrameError(
      'Could not evaluate css. Inline styles must be statically analyzable',
    );
  }
  return value;
}

const findImport = lines =>
  lines.findIndex(l => l.match(/@import.*?(?:$|;)/g));

function extractImports(value) {
  const imports = [];

  let match;
  const matcher = /@import.*?(?:$|;)/g;

  // eslint-disable-next-line no-cond-assign
  while ((match = matcher.exec(value))) imports.push(match[0]);

  return imports;
}

export default function getValueForStyledTag(quasi, style, file, kebabName) {
  const map = new SourceMapGenerator({ file: style.absoluteFilePath });

  const { node } = quasi;
  const srcFile = file.opts.filename;
  const srcLines = file.code.slice(node.start, node.end).split(/\n/);

  const rawValue = evaluate(quasi);

  const imports = extractImports(rawValue);
  // remove import line
  let value = rawValue.replace(/\n\s*@import.*?(?:$|;)/gm, ''); // remove the entire line

  // source code line start line
  const srcOffset = node.loc.start.line;

  value = `${imports.join('\n')}\n.${kebabName} {${value}}`;

  value.split(/\n/).forEach((code, idx, lines) => {
    // no mapping for the opening class wrapper or ending bracket
    if (idx === imports.length || idx === lines.length - 1) return;

    console.log(idx + srcOffset, ' => ', idx + 1, code);

    map.addMapping({
      source: srcFile,
      generated: { line: idx + 1, column: 0 },
      original: {
        line: code.match(/@import.*?(?:$|;)/g)
          ? findImport(srcLines) + srcOffset
          : idx + srcOffset,
        column: 0,
      },
    });
  });

  map.setSourceContent(srcFile, file.code);

  const content = Buffer.from(map.toString()).toString('base64');
  return `${value}\n/*# sourceMappingURL=data:application/json;base64,${content} */`;
}
