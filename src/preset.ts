import type { NodePath } from '@babel/core';
import jsx from '@babel/plugin-transform-react-jsx';
import type { Program } from '@babel/types';

import astroturf from './plugin';
import addPragma from './utils/addPragma';

const pragma = '__AstroturfJSX';

function pragmaPlugin() {
  return {
    visitor: {
      Program: {
        exit(path: NodePath<Program>, state: any) {
          if (!state.file.get('jsxDetected')) return;
          addPragma(path, state.opts.import, false);
        },
      },
      JSXElement(_, state: any) {
        state.file.set('jsxDetected', true);
      },
      JSXFragment(_, state: any) {
        state.file.set('jsxDetected', true);
      },
    },
  };
}

export default (_, { jsxOptions, ...options }: any = {}) => {
  return {
    plugins: [
      [pragmaPlugin, { import: pragma }],
      [
        jsx,
        {
          ...jsxOptions,
          pragma,
          pragmaFrag: `React.Fragment`,
        },
      ],
      [
        astroturf,
        {
          ...options,
          jsxPragma: false,
        },
      ],
    ],
  };
};
