import { NodePath } from '@babel/core';
import * as t from '@babel/types';

const TAG = Symbol('Astroturf import');

function findLast<T>(
  array: T[],
  predicate: (item: T, idx: number, list: T[]) => boolean,
): T | undefined {
  for (let i = array.length - 1; i >= 0; --i) {
    if (predicate(array[i], i, array)) return array[i];
  }
  return undefined;
}

function insertAfterImports(
  program: NodePath<t.Program>,
  importNode: t.ImportDeclaration,
) {
  const targetPath = findLast(program.get('body'), p => {
    // this is a babel mechanism for sorting body blocks
    // I don't want to rely on it, but do want to respect < 1 values as neededing to go on the bottom
    // we should not insert below those if possible
    // https://github.com/babel/babel/blob/v7.8.5/packages/babel-core/src/transformation/block-hoist-plugin.js
    //
    // @ts-ignore
    const blockHoist = p.node._blockHoist ?? 1; // eslint-disable-line no-underscore-dangle

    return p.node[TAG] || (blockHoist > 0 && p.isImportDeclaration());
  });

  targetPath.insertAfter(importNode);
}

function buildImport(
  path: NodePath<t.Program>,
  source: string,
  nameHint?: string,
) {
  const { scope } = path;

  const ident = scope.generateUidIdentifier(nameHint);
  const importNode = t.importDeclaration(
    [t.importDefaultSpecifier(ident)],
    t.stringLiteral(source),
  );
  importNode[TAG] = true;

  return [importNode, ident] as const;
}

export default function addDefaultImport(
  path: NodePath,
  source: string,
  nameHint: string,
) {
  const programPath = path.find(p => p.isProgram()) as NodePath<t.Program>;

  const [node, name] = buildImport(programPath, source, nameHint);
  insertAfterImports(programPath, node);
  return name;
}
