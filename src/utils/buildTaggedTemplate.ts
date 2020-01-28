import { dirname, relative } from 'path';
import groupBy from 'lodash/groupBy';
import uniq from 'lodash/uniq';
import resolve from 'resolve';
import { NodePath } from '@babel/core';
import * as t from '@babel/types';

import { NodeStyleMap, Style } from '../types';
import cssUnits from './cssUnits';
import getNameFromPath from './getNameFromPath';
import hash from './murmurHash';

const rComposes = /\b(?:composes\s*?:\s*([^;>]*?)(?:from\s(.+?))?(?=[;}/\n\r]))/gim;
const rPlaceholder = /###ASTROTURF_PLACEHOLDER_\d*?###/g;
// Match any valid CSS units followed by a separator such as ;, newline etc.
const rUnit = new RegExp(`^(${cssUnits.join('|')})(;|,|\n| |\\))`);

export interface ResolvedImport {
  identifier: string;
  request: string;
  type: string;
}

interface UserInterpolation {
  source: string;
  imported?: string;
  isStyledComponent?: boolean;
}

export interface Interpolation {
  imported: string;
  source: string;
  isStyledComponent?: boolean;
}

function defaultResolveDependency(
  { request }: ResolvedImport,
  localStyle: Style,
  _node: t.Node,
): UserInterpolation {
  const source = resolve.sync(request, {
    basedir: dirname(localStyle.absoluteFilePath),
  });

  return { source };
}

function resolveMemberExpression(path: NodePath) {
  let nextPath: NodePath = (path as any).resolve();
  while (nextPath && nextPath.isMemberExpression()) {
    nextPath = (nextPath.get('object') as any).resolve();
  }
  return nextPath;
}

function resolveImport(path: NodePath): ResolvedImport | null {
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
    identifier = getNameFromPath(importPath.get('imported'))!;
  }

  return { identifier, request, type: importPath.node.type };
}

function resolveStyleInterpolation(
  path: NodePath<t.Expression>,
  nodeMap: NodeStyleMap,
  localStyle: any,
  resolveDependency = defaultResolveDependency,
): Interpolation | null {
  const resolvedPath = resolveMemberExpression(path);

  const style = resolvedPath && nodeMap.get(resolvedPath.node);

  if (style) {
    return {
      imported: !style.isStyledComponent
        ? (path.get('property') as any).node.name
        : 'cls1',
      source: relative(
        dirname(localStyle.absoluteFilePath),
        style.absoluteFilePath,
      ),
    };
  }

  if (resolveDependency) {
    const resolvedImport = resolveImport(path);

    if (resolvedImport) {
      const { identifier } = resolvedImport;
      const interpolation: UserInterpolation | null =
        resolveDependency(resolvedImport, localStyle, path.node) ?? null;

      if (!interpolation) return null;

      const isStyledComponent =
        interpolation.isStyledComponent == null
          ? identifier.toLowerCase()[0] !== identifier[0]
          : interpolation.isStyledComponent;

      return {
        imported: !isStyledComponent
          ? (path.get('property') as any).node.name
          : 'cls1',
        ...interpolation,
      };
    }
  }
  return null;
}

const getPlaceholder = (idx: number) => `###ASTROTURF_PLACEHOLDER_${idx}###`;

export interface DynamicInterpolation {
  id: string;
  unit: string;
  expr: NodePath<t.Expression>;
}

interface Options {
  quasiPath: NodePath<t.TemplateLiteral>;
  nodeMap: NodeStyleMap;
  tagName: string;
  resolveDependency?: (imp: ResolvedImport, style: Style, node: t.Node) => any;
  useCssProperties: boolean;
  style: Style;
}

export default ({
  quasiPath,
  nodeMap,
  tagName,
  resolveDependency,
  useCssProperties,
  style: localStyle,
}: Options) => {
  const quasi = quasiPath.node;

  const styleInterpolations = new Map();
  const dynamicInterpolations = new Set<DynamicInterpolation>();
  const expressions = quasiPath.get('expressions');

  let text = '';
  let lastDynamic: DynamicInterpolation | null = null;

  quasi.quasis.forEach((tmplNode, idx) => {
    const { cooked } = tmplNode.value;
    const expr = expressions[idx];

    let matches;

    // If the last quasi is a replaced dynamic import then see if there
    // was a trailing css unit and extract it as part of the interpolation
    if (
      lastDynamic &&
      text.endsWith(`var(--${lastDynamic.id})`) &&
      // eslint-disable-next-line no-cond-assign
      (matches = cooked!.match(rUnit))
    ) {
      const [, unit] = matches;

      lastDynamic.unit = unit;
      text += cooked!.replace(rUnit, '$2');
    } else {
      text += cooked;
    }

    if (!expr) {
      return;
    }

    const result = expr.evaluate();
    if (result.confident) {
      text += result.value;
      return;
    }

    // TODO: dedupe the same expressions in a tag
    const interpolation = resolveStyleInterpolation(
      expr,
      nodeMap,
      localStyle,
      resolveDependency,
    );

    if (interpolation) {
      const ph = getPlaceholder(idx);
      styleInterpolations.set(ph, { ...interpolation, expr });
      text += ph;

      return;
    }

    if (!useCssProperties) {
      throw expr.buildCodeFrameError(
        `Could not resolve interpolation to a value, ${tagName} returned class name, or styled component. ` +
          'All interpolated styled components must be in the same file and values must be statically determinable at compile time.',
      );
    }

    // custom properties need to start with a letter
    const id = `a${hash(`${localStyle.identifier}-${idx}`)}`;

    lastDynamic = { id, expr, unit: '' };
    dynamicInterpolations.add(lastDynamic);

    text += `var(--${id})`;
  });

  // Replace references in `composes` rules
  text = text.replace(rComposes, (composes, classNames: string, fromPart) => {
    const classList = classNames.replace(/(\n|\r|\n\r)/, '').split(/\s+/);

    const composed = classList
      .map(className => styleInterpolations.get(className))
      .filter(Boolean);

    if (!composed.length) return composes;

    if (fromPart) {
      // don't want to deal with this case right now
      throw composed[0].expr.buildCodeFrameError(
        'A styled interpolation found inside a `composes` rule with a "from". ' +
          'Interpolated values should be in their own `composes` without specifying the file.',
      );
    }
    if (composed.length < classList.length) {
      throw composed[0].expr.buildCodeFrameError(
        'Mixing interpolated and non-interpolated classes in a `composes` rule is not allowed.',
      );
    }

    return Object.entries(groupBy(composed, i => i.source)).reduce(
      (acc, [source, values]) => {
        const classes = uniq(values.map(v => v.imported)).join(' ');
        return `${
          acc ? `${acc};\n` : ''
        }composes: ${classes} from "${source}"`;
      },
      '',
    );
  });

  let id = 0;
  let imports = '';
  text = text.replace(rPlaceholder, match => {
    const { imported, source } = styleInterpolations.get(match);
    const localName = `a${id++}`;

    imports += `@value ${imported} as ${localName} from "${source}";\n`;
    return `.${localName}`;
  });

  if (imports) imports += '\n\n';

  return {
    text,
    imports,
    dynamicInterpolations,
  };
};
