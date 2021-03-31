import { PluginObj } from '@babel/core';
import * as t from '@babel/types';

import getName from '../utils/getName';

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
            (s) =>
              s.isImportDefaultSpecifier() ||
              (s.isImportSpecifier() && getName(s.node.imported) === 'styled'),
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
