import { PluginObj } from '@babel/core';
import * as t from '@babel/types';

import { ResolvedOptions } from '../types';
import getName from '../utils/getName';
import isCssTag from '../utils/isCssTag';

type PluginState = Record<symbol, any> & {
  opts: Partial<ResolvedOptions>;
  file: any;
};

export default function plugin(): PluginObj<PluginState> {
  return {
    name: 'convert-css-to-stylesheet',

    visitor: {
      Program: {
        exit(program, state) {
          const { stylesheetTagName = 'stylesheet' } = state.opts;
          const safeToRemove = !state.file.get('HAS_LEGIT_CSS');

          const shouldAdd = state.file.get('HAS_STYLESHEET');

          program.traverse({
            ImportDeclaration(path) {
              if (
                path.get('source').node.value !== 'astroturf' &&
                path.get('source').node.value !== 'astroturf/react'
              )
                return;

              const cssImport = path
                .get('specifiers')
                .find(
                  (s) =>
                    s.isImportSpecifier() &&
                    getName(s.node.imported) === 'css',
                );

              if (shouldAdd) {
                // @ts-ignore
                path.unshiftContainer(
                  'specifiers',
                  t.importSpecifier(
                    t.identifier(stylesheetTagName as string),
                    t.identifier('stylesheet'),
                  ),
                );
              }

              if (safeToRemove) {
                if (cssImport) cssImport.remove();
              }
            },
          });
        },
      },

      TaggedTemplateExpression(path, state) {
        const {
          cssTagName = 'css',
          stylesheetTagName = 'stylesheet',
          allowGlobal = false,
        } = state.opts;
        const tagPath = path.get('tag');

        if (
          stylesheetTagName === false ||
          !isCssTag(tagPath, { cssTagName, allowGlobal })
        ) {
          return;
        }

        if (path.findParent((p) => p.isJSXAttribute())) {
          state.file.set('HAS_LEGIT_CSS', true);
          return;
        }

        state.file.set('HAS_STYLESHEET', true);
        tagPath.replaceWith(t.identifier(stylesheetTagName));
      },
    },
  };
}
