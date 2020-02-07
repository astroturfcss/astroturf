import { NodePath } from '@babel/core';
import * as t from '@babel/types';

import { Change } from '../types';

function findLast<T>(
  array: T[],
  predicate: (item: T, idx: number, list: T[]) => boolean,
): T | undefined {
  for (let i = array.length - 1; i >= 0; --i) {
    if (predicate(array[i], i, array)) return array[i];
  }
  return undefined;
}

export default class StyleImportInjector {
  private nodes = new Set<t.ImportDeclaration>();

  private code = new WeakMap<t.ImportDeclaration, string>();

  constructor(private program: NodePath<t.Program>) {}

  addDefaultImport(source: string, nameHint?: string) {
    const { scope } = this.program;

    const ident = scope.generateUidIdentifier(nameHint);
    const importNode = t.importDeclaration(
      [t.importDefaultSpecifier(ident)],
      t.stringLiteral(source),
    );

    this.nodes.add(importNode);
    this.code.set(importNode, `import ${ident.name} from "${source}";`);

    return ident;
  }

  inject() {
    const targetPath = findLast(this.program.get('body'), p => {
      // this is a babel mechanism for sorting body blocks
      // I don't want to rely on it, but do want to respect < 1 values as neededing to go on the bottom
      // we should not insert below those if possible
      // https://github.com/babel/babel/blob/v7.8.5/packages/babel-core/src/transformation/block-hoist-plugin.js
      //
      // @ts-ignore
      const blockHoist = p.node._blockHoist ?? 1; // eslint-disable-line no-underscore-dangle
      return blockHoist > 0 && p.isImportDeclaration();
    });

    const nodes = Array.from(this.nodes).reverse();
    const end = (targetPath?.node?.end || 0) + 1;
    const changes: Change = {
      end,
      start: end,
      code: Array.from(this.nodes, n => this.code.get(n))
        .filter(Boolean)
        .join('\n'),
    };

    if (!targetPath) {
      // @ts-ignore
      this.program.unshiftContainer('body', nodes);
    } else {
      for (const node of nodes) {
        targetPath!.insertAfter(node);
      }
    }

    this.code = new WeakMap();
    this.nodes.clear();

    return changes;
  }
}
