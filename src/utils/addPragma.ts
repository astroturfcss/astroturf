import { NodePath } from '@babel/core';
import { isModule } from '@babel/helper-module-imports';
import template, { TemplateBuilderOptions } from '@babel/template';
import * as t from '@babel/types';

import { Change } from '../types';

const opts: TemplateBuilderOptions = {
  placeholderPattern: false,
  placeholderWhitelist: new Set(['JSX', 'JSX_FRAG']),
};

const importPattern = 'import * as JSX from "astroturf/jsx";';

const buildImport = template(importPattern, opts);

const requirePattern = 'const JSX = require("astroturf/jsx");';

const buildRequire = template(requirePattern, opts);

export default function addPragma(
  path: NodePath<t.Program>,
  JSX: t.Identifier,
): Change[] {
  const [builder, pattern] = isModule(path)
    ? [buildImport, importPattern]
    : [buildRequire, requirePattern];

  const importNode = builder({ JSX }) as t.Node;

  // see importInjector for note about blockHoist
  const targetPath = path.get('body').find((p) => {
    // @ts-ignore
    const blockHoist = p.node._blockHoist; // eslint-disable-line no-underscore-dangle
    return blockHoist != null && blockHoist < 4;
  });

  if (targetPath) targetPath.insertBefore(importNode);
  else (path as any).unshiftContainer('body', importNode);

  const jsxPrgama = `* @jsx ${JSX.name}.jsx *`;
  const jsxFragPrgama = `* @jsxFrag ${JSX.name}.F *`;

  path.addComment('leading', jsxPrgama);
  path.addComment('leading', jsxFragPrgama);

  return [
    { code: `/*${jsxPrgama}*/\n`, start: 0, end: 0 },
    { code: `/*${jsxFragPrgama}*/\n\n`, start: 0, end: 0 },
    { code: `${pattern.replace('JSX', JSX.name)}\n`, start: 0, end: 0 },
  ];
}
