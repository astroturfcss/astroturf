import generate from '@babel/generator';
import { visitors } from '@babel/traverse';
import { stripIndent } from 'common-tags';
import { outputFileSync } from 'fs-extra';
import defaults from 'lodash/defaults';

import cssProp from './features/css-prop';
import styledComponent from './features/styled-component';
import stylesheet from './features/stylesheet';
import { COMPONENTS, IMPORTS, STYLES } from './utils/Symbols';

export default function plugin() {
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
      const { opts } = this;
      let { styles, changeset } = file.get(STYLES);
      const importNodes = file.get(IMPORTS);

      importNodes.forEach((path) => {
        const decl = !path.isImportDeclaration()
          ? path.findParent((p) => p.isImportDeclaration())
          : path;

        if (!decl) return;

        const { start, end } = decl.node;

        path.remove();

        if (opts.generateInterpolations)
          changeset.push({
            start,
            end,
            // if the path is just a removed specifier we need to regenerate
            // the import statement otherwise we remove the entire declaration
            code: !path.isImportDeclaration() ? generate(decl.node).code : '',
          });
      });

      styles = Array.from(styles.values());

      changeset = changeset.concat(styles);

      file.metadata.astroturf = { styles, changeset };

      if (opts.writeFiles !== false) {
        styles.forEach(({ absoluteFilePath, value }) => {
          outputFileSync(absoluteFilePath, stripIndent([value]));
        });
      }
    },

    visitor: visitors.merge([
      {
        Program: {
          enter(_, state) {
            state.defaultedOptions = defaults(state.opts, {
              tagName: 'css',
              allowGlobal: true,
              styledTag: 'styled',
              customCssProperties: 'cssProp', // or: true, false
            });
          },
        },

        ImportDeclaration: {
          exit(path, state) {
            const { tagName } = state.defaultedOptions;
            const specifiers = path.get('specifiers');
            const tagImport = path
              .get('specifiers')
              .find(
                (p) =>
                  p.isImportSpecifier() &&
                  p.node.imported.name === 'css' &&
                  p.node.local.name === tagName,
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
