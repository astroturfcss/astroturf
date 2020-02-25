import { NodePath } from '@babel/core';
import { isModule } from '@babel/helper-module-imports';
import * as t from '@babel/types';

// eslint-disable-next-line import/no-cycle
import { Change } from '../types';
import truthy from './truthy';

function findLast<T>(
  array: T[],
  predicate: (item: T, idx: number, list: T[]) => boolean,
): T | undefined {
  for (let i = array.length - 1; i >= 0; --i) {
    if (predicate(array[i], i, array)) return array[i];
  }
  return undefined;
}

function isRequire(path: NodePath) {
  const isRequireExpression = (p: NodePath<any>) =>
    p.isCallExpression() &&
    p.get('callee').isIdentifier() &&
    (p.get('callee').node as any).name === 'require';

  if (!path) return false;
  if (path.isVariableDeclaration()) {
    return path
      .get('declarations')
      .some(d => d && isRequireExpression(d.get('init')));
  }
  return isRequireExpression(path);
}

export default class StyleImportInjector {
  private nodes = new Set<t.ImportDeclaration | t.VariableDeclaration>();

  private code = new WeakMap<
    t.ImportDeclaration | t.VariableDeclaration,
    string
  >();

  constructor(private program: NodePath<t.Program>) {}

  add(style: { identifier?: string; requirePath: string }) {
    const { scope } = this.program;
    const source = style.requirePath;

    const useEsm = isModule(this.program);
    const ident = scope.generateUidIdentifier(style.identifier);

    if (useEsm) {
      const importNode = t.importDeclaration(
        [t.importDefaultSpecifier(ident)],
        t.stringLiteral(source),
      );

      this.nodes.add(importNode);
      this.code.set(importNode, `import ${ident.name} from "${source}";`);
    } else {
      const importNode = t.variableDeclaration('const', [
        t.variableDeclarator(
          ident,
          t.callExpression(t.identifier('require'), [t.stringLiteral(source)]),
        ),
      ]);
      this.nodes.add(importNode);
      this.code.set(importNode, `const ${ident.name} = require("${source}");`);
    }

    return ident;
  }

  inject() {
    const targetPath = findLast(this.program.get('body'), p => {
      // this is a babel mechanism for sorting body blocks
      // I don't want to rely on it, but do want to respect < 1 values as needing to go on the bottom
      // we should not insert below those if possible
      // https://github.com/babel/babel/blob/v7.8.5/packages/babel-core/src/transformation/block-hoist-plugin.js
      //
      // @ts-ignore
      const blockHoist = p.node._blockHoist ?? 1; // eslint-disable-line no-underscore-dangle
      return blockHoist > 0 && (p.isImportDeclaration() || isRequire(p));
    });

    const nodes = Array.from(this.nodes).reverse();
    const end = targetPath?.node?.end || 0;
    const changes: Change = {
      end,
      start: end,
      code: `\n${Array.from(this.nodes, n => this.code.get(n))
        .filter(truthy)
        .join('\n')}\n`,
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
