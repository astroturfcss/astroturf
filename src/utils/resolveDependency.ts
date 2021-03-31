import { dirname } from 'path';

import { NodePath } from '@babel/core';
import * as t from '@babel/types';
import resolve from 'resolve';

import {
  NodeStyleMap,
  ResolvedImport,
  ResolvedOptions,
  Style,
  StyleType,
  UserDependency,
} from '../types';
import { createRequirePath } from './createFilename';
import getNameFromPath from './getNameFromPath';

export interface Dependency {
  imported: string;
  source: string;
  type?: StyleType;
}

function defaultResolver(
  { request }: ResolvedImport,
  localStyle: Style,
  _node: t.Node,
): UserDependency {
  const source = resolve.sync(request, {
    basedir: dirname(localStyle.absoluteFilePath),
  });

  return { source };
}

function getImported(
  path: NodePath<t.Expression>,
  dependency: UserDependency,
) {
  const { type } = dependency;
  if (!type) {
    if (!path.isMemberExpression()) return 'cls1';
    return (path.get('property') as any).node.name;
  }

  return type === 'stylesheet'
    ? (path.get('property') as any).node.name
    : 'cls1';
}

function resolveMemberExpression(path: NodePath<any>) {
  let nextPath: NodePath = (path as any).resolve();
  while (nextPath && nextPath.isMemberExpression()) {
    nextPath = (nextPath.get('object') as any).resolve();
  }
  return nextPath;
}

function resolveImport(path: NodePath<any>): ResolvedImport | null {
  const resolvedPath = resolveMemberExpression(path);
  const binding =
    'name' in resolvedPath.node &&
    typeof resolvedPath.node.name === 'string' &&
    resolvedPath.scope.getBinding(resolvedPath.node.name);

  if (!binding || binding.kind !== 'module') return null;

  const importPath = binding.path;
  const parent = importPath.parentPath;
  if (!parent.isImportDeclaration()) return null;

  const request = parent.node.source.value;
  let identifier = '';

  if (importPath.isImportNamespaceSpecifier()) {
    if (!path.isMemberExpression()) throw new Error('this is weird');
    identifier = getNameFromPath(path.get('property') as NodePath)!;
  } else if (importPath.isImportDefaultSpecifier()) {
    identifier = getNameFromPath(resolvedPath)!;
  } else if (importPath.isImportSpecifier()) {
    // TODO: this isn't correct doesn't do member expressions
    identifier = getNameFromPath(importPath.get('imported') as NodePath<any>)!;
  }

  return { identifier, request, type: importPath.node.type };
}

export default function resolveDependency(
  path: NodePath<t.Expression>,
  nodeMap: NodeStyleMap,
  localStyle: Style,
  pluginOptions: ResolvedOptions,
): Dependency | null {
  const {
    getRequirePath = createRequirePath,
    resolveDependency: resolver = defaultResolver,
  } = pluginOptions;
  const resolvedPath = resolveMemberExpression(path);

  const style = resolvedPath && nodeMap.get(resolvedPath.node);

  if (style) {
    return {
      type: style.type,
      imported:
        style.type === 'stylesheet'
          ? (path.get('property') as any).node.name
          : 'cls1',
      source: getRequirePath(
        localStyle.hostFilePath!,
        style.absoluteFilePath,
        style.identifier || '',
      ),
    };
  }

  if (resolver) {
    const resolvedImport = resolveImport(path);

    if (resolvedImport) {
      const dep: UserDependency | null =
        resolver(resolvedImport, localStyle, path.node) ?? null;

      if (!dep) return null;

      return {
        ...dep,
        imported: dep.imported || getImported(path, dep),
      };
    }
  }
  return null;
}
