import * as t from '@babel/types';
import { PluginObj } from '@babel/core';

export default function plugin(): PluginObj {
  return {
    name: 'rename-styled-import',
    visitor: {
      ImportDeclaration(path) {
        if (path.get('source').node.value !== 'astroturf') {
          return;
        }

        const styled = path
          .get('specifiers')
          .find(
            s =>
              s.isImportDefaultSpecifier() ||
              (s.isImportSpecifier() && s.node.imported.name === 'styled'),
          );

        if (!styled) return;

        // used to be exported as both a named and default
        if (styled.isImportSpecifier()) {
          // @ts-ignore
          path.unshiftContainer(
            'specifiers',
            t.importDefaultSpecifier(t.identifier(styled.node.local.name)),
          );
          styled.remove();
        }

        path.get('source').replaceWith(t.stringLiteral('astroturf/react'));
      },
    },
  };
}
