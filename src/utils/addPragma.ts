import { NodePath } from '@babel/core';
import { isModule } from '@babel/helper-module-imports';
import template, { TemplateBuilderOptions } from '@babel/template';
import * as t from '@babel/types';

import { Change } from '../types';

const opts: TemplateBuilderOptions = {
  placeholderPattern: false,
  placeholderWhitelist: new Set(['JSX', 'JSX_FRAG']),
};

const importPattern =
  'import { jsx as JSX, F as JSX_FRAG } from "astroturf/jsx";';

const buildImport = template(importPattern, opts);

const requirePattern =
  'const { jsx: JSX, F: JSX_FRAG } = require("astroturf/jsx");';

const buildRequire = template(requirePattern, opts);

export default function addPragma(
  path: NodePath<t.Program>,
  JSX: t.Identifier,
  JSX_FRAG: t.Identifier,
): Change[] {
  const [builder, pattern] = isModule(path)
    ? [buildImport, importPattern]
    : [buildRequire, requirePattern];

  const importNode = builder({ JSX, JSX_FRAG }) as t.Node;

  // see importInjector for note about blockHoist
  const targetPath = path.get('body').find(p => {
    // @ts-ignore
    const blockHoist = p.node._blockHoist; // eslint-disable-line no-underscore-dangle
    return blockHoist != null && blockHoist < 4;
  });

  if (targetPath) targetPath.insertBefore(importNode);
  else (path as any).unshiftContainer('body', importNode);

  const jsxPrgama = `* @jsx ${JSX.name} *`;
  const jsxFragPrgama = `* @jsxFrag ${JSX_FRAG.name} *`;

  path.addComment('leading', jsxPrgama);
  path.addComment('leading', jsxFragPrgama);

  return [
    { code: `/*${jsxPrgama}*/\n`, start: 0, end: 0 },
    { code: `/*${jsxFragPrgama}*/\n\n`, start: 0, end: 0 },
    {
      start: 0,
      end: 0,
      code: `${pattern
        .replace('JSX', JSX.name)
        .replace('JSX_FRAG', JSX_FRAG.name)}\n`,
    },
  ];
}
