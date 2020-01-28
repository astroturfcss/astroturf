import { stripIndent } from 'common-tags';
import { outputFileSync } from 'fs-extra';
import defaults from 'lodash/defaults';
import { PluginObj } from '@babel/core';
import generate from '@babel/generator';
// @ts-ignore
import { NodePath, visitors } from '@babel/traverse';
import * as t from '@babel/types';

import cssProp from './features/css-prop';
import styledComponent from './features/styled-component';
import stylesheet from './features/stylesheet';
import { PluginState, StyleState, ResolvedOptions } from './types';
import ImportInjector from './utils/ImportInjector';
import { COMPONENTS, IMPORTS, STYLES } from './utils/Symbols';

export default function plugin(): PluginObj<PluginState> {
  return {
    pre(file) {
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

    post(file) {
      const { opts, styleImports } = this;
      // eslint-disable-next-line prefer-const
      let { styles, changeset } = file.get(STYLES) as StyleState;
      const importNodes: NodePath[] = file.get(IMPORTS);

      importNodes.forEach(path => {
        const decl = !path.isImportDeclaration()
          ? path.findParent(p => p.isImportDeclaration())
          : path;

        if (!decl) return;

        const { start, end } = decl.node;

        path.remove();

        if (opts.generateInterpolations)
          changeset.push({
            start: start!,
            end: end!,
            // if the path is just a removed specifier we need to regenerate
            // the import statement otherwise we remove the entire declaration
            code: !path.isImportDeclaration() ? generate(decl.node).code : '',
          });
      });

      const importAdditions = styleImports.inject();

      const styleList = Array.from(styles.values());

      changeset = changeset.concat(importAdditions, styleList);

      file.metadata.astroturf = { styles: styleList, changeset };

      if (opts.writeFiles !== false) {
        styles.forEach(({ absoluteFilePath, value }) => {
          // @ts-ignore
          outputFileSync(absoluteFilePath, stripIndent([value]));
        });
      }
    },

    visitor: visitors.merge([
      {
        Program: {
          enter(path: NodePath<t.Program>, state: any) {
            state.styleImports = new ImportInjector(path);
            state.defaultedOptions = defaults(state.opts, {
              cssTagName: 'css',
              styledTagName: 'styled',
              stylesheetTagName: 'stylesheet',
              allowGlobal: false,
              customCssProperties: 'cssProp',
            }) as ResolvedOptions;
          },
        },

        ImportDeclaration: {
          exit(path: NodePath<t.ImportDeclaration>, state: PluginState) {
            const { cssTagName } = state.defaultedOptions;
            const specifiers = path.get('specifiers');
            const tagImport = path
              .get('specifiers')
              .find(
                p =>
                  p.isImportSpecifier() &&
                  p.node.imported.name === 'css' &&
                  p.node.local.name === cssTagName,
              );

            if (tagImport) {
              state.file
                .get(IMPORTS)
                .push(specifiers.length === 1 ? path : tagImport);
            }
          },
        },
      },
      cssProp,
      styledComponent,
      stylesheet,
    ]),
  };
}
