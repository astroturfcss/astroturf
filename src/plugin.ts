import { mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';

import { PluginObj } from '@babel/core';
import generate from '@babel/generator';
// @ts-ignore
import { NodePath, visitors } from '@babel/traverse';
import * as t from '@babel/types';
import { stripIndent } from 'common-tags';
import defaults from 'lodash/defaults';

import cssProp from './features/css-prop';
import styledComponent from './features/styled-component';
import stylesheet from './features/stylesheet';
import { PluginState, ResolvedOptions, StyleState } from './types';
import ImportInjector from './utils/ImportInjector';
import { COMPONENTS, IMPORTS, JSX_IDENTS, STYLES } from './utils/Symbols';
import getName from './utils/getName';

export default function plugin(): PluginObj<PluginState> {
  return {
    pre(file: any) {
      file.set(IMPORTS, []);

      if (!file.has(STYLES)) {
        file.set(STYLES, {
          id: 0,
          changeset: [],
          styles: new Map(),
        });
      }

      if (!file.has(COMPONENTS)) {
        file.set(COMPONENTS, new Map());
      }
    },

    post(file: any) {
      const { opts } = this;
      // eslint-disable-next-line prefer-const
      let { styles, changeset } = file.get(STYLES) as StyleState;

      const styleList = Array.from(styles.values());

      changeset = changeset.concat(styleList);

      file.metadata.astroturf = { styles: styleList, changeset };

      if (opts.writeFiles !== false) {
        styles.forEach(({ absoluteFilePath, value }) => {
          // @ts-ignore
          mkdirSync(dirname(absoluteFilePath), { recursive: true });
          writeFileSync(absoluteFilePath, stripIndent([value] as any));
        });
      }
    },

    visitor: visitors.merge([
      {
        Program: {
          enter(path: NodePath<t.Program>, state: any) {
            state.styleImports = new ImportInjector(path);
            state.defaultedOptions = defaults(state.opts, {
              nesting: 'auto',
              extension: '.module.css',
              cssTagName: 'css',
              styledTagName: 'styled',
              stylesheetTagName: 'stylesheet',
              allowGlobal: false,
              enableCssProp: true,
              jsxPragma: true,
              enableDynamicInterpolations: 'cssProp',
              experiments: {},
            }) as ResolvedOptions;

            const pragma = state.defaultedOptions.jsxPragma;

            // We need to re-export Fragment because of
            // https://github.com/babel/babel/pull/7996#issuecomment-519653431
            state[JSX_IDENTS] = {
              jsx:
                typeof pragma === 'string'
                  ? t.identifier(pragma)
                  : path.scope.generateUidIdentifier('j'),
            };
          },
        },

        ImportDeclaration: {
          exit(path: NodePath<t.ImportDeclaration>, state: PluginState) {
            const { cssTagName, stylesheetTagName } = state.defaultedOptions;
            const specifiers = path.get('specifiers');
            const tagImports = path
              .get('specifiers')
              .filter(
                (p) =>
                  p.isImportSpecifier() &&
                  ['css', 'stylesheet'].includes(getName(p.node.imported)) &&
                  [cssTagName, stylesheetTagName].includes(p.node.local.name),
              );

            if (!tagImports.length) return;
            // if the tagImports are ALL of the imported values then we want
            // to pass the entire import to be removed.

            state.file.get(IMPORTS).push({
              path,
              specifiers:
                specifiers.length === tagImports.length ? null : tagImports,
            });
          },
        },
      },
      cssProp,
      styledComponent,
      stylesheet,
      {
        Program: {
          exit(_, { opts, file, styleImports }) {
            // eslint-disable-next-line prefer-const
            let { changeset } = file.get(STYLES) as StyleState;

            const importNodes: Array<{
              path: NodePath;
              specifiers: null | NodePath[];
            }> = file.get(IMPORTS);

            importNodes.forEach(({ path, specifiers }) => {
              if (!path) return;

              const { start, end } = path.node;

              if (specifiers) {
                specifiers.forEach((s) => s.remove());
              } else {
                path.remove();
              }

              if (opts.generateInterpolations)
                changeset.push({
                  type: 'import-optimization',
                  start: start!,
                  end: end!,
                  // if the path is just a removed specifier we need to regenerate
                  // the import statement otherwise we remove the entire declaration
                  code: specifiers ? generate(path.node).code : '',
                });
            });

            changeset.push(styleImports.inject());
          },
        },
      },
    ]),
  };
}
