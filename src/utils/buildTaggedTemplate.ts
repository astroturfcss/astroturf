import { NodePath } from '@babel/core';
import * as t from '@babel/types';
import camelCase from 'lodash/camelCase';
import groupBy from 'lodash/groupBy';
import uniq from 'lodash/uniq';

import { NodeStyleMap, ResolvedOptions, Style } from '../types';
import cssUnits from './cssUnits';
import isCssTag from './isCssTag';
import hash from './murmurHash';
import processCss from './processCss';
import replaceComposes from './replaceComposes';
import resolveDependency, { Dependency } from './resolveDependency';
import trimEnd from './trimEnd';
import truthy from './truthy';
import wrapInClass, { hoistImports } from './wrapInClass';

const rPlaceholder = /###ASTROTURF_PLACEHOLDER_\d*?###/g;
// Match any valid CSS units followed by a separator such as ;, newline etc.
const rUnit = new RegExp(`^(${cssUnits.join('|')})(;|,|\n| |\\))`);

const getPlaceholder = (idx: number) => `###ASTROTURF_PLACEHOLDER_${idx}###`;

const toVarsArray = (interpolations: DynamicInterpolation[]) => {
  const vars = interpolations.map((i) =>
    t.arrayExpression(
      trimEnd([
        t.stringLiteral(i.id),
        i.expr.node,
        i.unit ? t.stringLiteral(i.unit) : null,
      ]),
    ),
  );
  return t.arrayExpression(vars);
};

/**
 * Build a logical expression returning a class, trying both the
 * kebab and camel case names: `s['fooBar']`
 *
 * @param {String} className
 */
const buildStyleExpression = (id: t.Identifier, className: string) =>
  t.memberExpression(
    id,
    t.stringLiteral(className), // remove the `.`
    true,
  );

export type Vars = t.ArrayExpression[];

export type Variants = t.Expression[];

export type TagLocation = 'STYLESHEET' | 'RULE' | 'COMPONENT' | 'PROP';

export interface DynamicInterpolation {
  id: string;
  unit: string;
  expr: NodePath<t.Expression>;
}

function assertDynamicInterpolationsLocation(
  expr: NodePath<t.Expression>,
  location: TagLocation,
  opts: ResolvedOptions,
) {
  const parent = expr.findParent((p) => p.isTaggedTemplateExpression()) as any;
  // may be undefined in the `styled.button` case, or plain css prop case
  const tagName = parent?.node.tag?.name;

  const validLocation = location === 'COMPONENT' || location === 'PROP';

  if (!validLocation) {
    const jsxAttr = expr.findParent((p) => p.isJSXAttribute()) as any;

    if (jsxAttr) {
      const propName = jsxAttr.node.name.name;
      throw jsxAttr.buildCodeFrameError(
        `This ${tagName} tag with dynamic expressions cannot be used with \`${propName}\` prop. ` +
          `Dynamic styles can only be passed to the \`css\` prop. Move the style to css={...} to fix the issue${
            !opts.enableCssProp
              ? ' (and set the `enableCssProp` to `true` or `"cssProp"` in your astroturf options to allow this feature)'
              : '.'
          }`,
      );
    }

    throw expr.buildCodeFrameError(
      'The following expression could not be evaluated during compilation. ' +
        'Dynamic expressions can only be used in the context of a component, ' +
        'in a `css` prop, or styled() component helper',
    );
  }

  // valid but not configured for this location
  if (validLocation) {
    if (!opts.enableDynamicInterpolations)
      throw expr.buildCodeFrameError(
        'Dynamic expression compilation is not enabled. ' +
          'To enable this usage set the the `enableDynamicInterpolations` to `true` or `"cssProp"` in your astroturf options',
      );

    if (
      opts.enableDynamicInterpolations === 'cssProp' &&
      location === 'COMPONENT'
    )
      throw expr.buildCodeFrameError(
        'Dynamic expression compilation is not enabled. ' +
          'To enable this usage set the `enableDynamicInterpolations` from `"cssProp"` to `true` in your astroturf options.',
      );
  }
}

/**
 * Traverses an expression in a template string looking for additional astroturf
 * styles. Inline css tags are replaced with an identifier to the class name
 */
function resolveVariants(
  exprPath: NodePath<t.Expression>,
  opts: Options,
  state: any,
) {
  const { importId } = opts;
  const templates = [] as any[];

  exprPath.traverse({
    TaggedTemplateExpression(innerPath) {
      if (!isCssTag(innerPath.get('tag'), opts.pluginOptions)) {
        return;
      }

      if (opts.allowVariants === false) {
        throw innerPath.buildCodeFrameError(
          'Nested Variants are not allowed here',
        );
      }

      if (opts.location !== 'PROP') {
        throw exprPath.buildCodeFrameError(
          'Dynamic variants are only allowed in css props',
        );
      }

      // camel case so we don't need to check multiple cases at runtime
      const classId = camelCase(
        `${opts.style.identifier}-variant-${state.id++}`,
      );

      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const { text, ...rest } = buildTemplateImpl(
        {
          ...opts,
          quasiPath: innerPath.get('quasi'),
          allowVariants: false,
        },
        state,
      );

      innerPath.replaceWith(buildStyleExpression(importId!, classId));

      templates.push({
        text: `.${classId} {\n${text}\n}`,
        ...rest,
      });
    },
  });
  return templates;
}

function replaceDependencyPlaceholders(
  depInterpolations: Map<string, DependencyWithExpr>,
  text: string,
  dependencyImports: string,
  id: number,
  opts: ResolvedOptions,
) {
  text = replaceComposes(text, (composes, classList, fromPart) => {
    const composed = classList
      .map((className) => depInterpolations.get(className))
      .filter(truthy);

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

    return Object.entries(groupBy(composed, (i) => i.source)).reduce(
      (acc, [source, values]) => {
        const classes = uniq(
          // We need to to use the class with the styles for composes
          values.map((v) => (v.imported === 'cls1' ? 'cls2' : v.imported)),
        ).join(' ');
        return `${
          acc ? `${acc};\n` : ''
        }composes: ${classes} from "${source}"`;
      },
      '',
    );
  });

  text = text.replace(rPlaceholder, (match) => {
    const { imported, source } = depInterpolations.get(match)!;
    const localName = `a${id++}`;

    if (opts.experiments.modularCssExternals) {
      return `:external(${imported} from "${source}")`;
    }

    dependencyImports += `@value ${imported} as ${localName} from "${source}";\n`;

    return `.${localName}`;
  });

  return [text, dependencyImports];
}

interface Options {
  quasiPath: NodePath<t.TemplateLiteral>;
  importId?: t.Identifier;
  nodeMap: NodeStyleMap;
  location: TagLocation;
  allowVariants?: boolean;
  pluginOptions: ResolvedOptions;
  style: Style;
}

interface Rule {
  text: string;
  imports: string;
  vars: DynamicInterpolation[];
  variants: Array<{ expr: any; rules: Rule[] }>;
}

type DependencyWithExpr = Dependency & {
  expr: NodePath<t.Expression>;
};

function buildTemplateImpl(opts: Options, state = { id: 0 }) {
  const {
    quasiPath,
    nodeMap,
    pluginOptions,
    location,
    style: localStyle,
  } = opts;
  const quasi = quasiPath.node;

  const variants: Rule['variants'] = [];
  const depInterpolations = new Map<string, DependencyWithExpr>();
  const dynamicInterpolations = new Set<DynamicInterpolation>();
  const expressions = quasiPath.get('expressions');

  let text = '';
  let dependencyImports = '';
  let lastDynamic: DynamicInterpolation | null = null;

  quasi.quasis.forEach((tmplNode, idx) => {
    const { raw } = tmplNode.value;
    const expr = expressions[idx] as NodePath<t.Expression>;

    let matches;

    // If the last quasi is a replaced dynamic import then see if there
    // was a trailing css unit and extract it as part of the interpolation
    if (
      lastDynamic &&
      text.endsWith(`var(--${lastDynamic.id})`) &&
      // eslint-disable-next-line no-cond-assign
      (matches = raw.match(rUnit))
    ) {
      const [, unit] = matches;

      lastDynamic.unit = unit;
      text += raw.replace(rUnit, '$2');
    } else {
      text += raw;
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
    const resolvedDep = resolveDependency(
      expr,
      nodeMap,
      localStyle,
      pluginOptions.resolveDependency,
    );

    if (resolvedDep) {
      const ph = getPlaceholder(idx);
      depInterpolations.set(ph, { ...resolvedDep, expr });
      text += ph;

      return;
    }

    const exprNode = expr.node;
    const resolvedInnerTemplates = resolveVariants(expr, opts, state);
    if (resolvedInnerTemplates.length) {
      variants.push({ expr: exprNode, rules: resolvedInnerTemplates });
      return;
    }

    assertDynamicInterpolationsLocation(expr, location, pluginOptions);

    // custom properties need to start with a letter
    const id = `a${hash(`${localStyle.identifier}-${state.id++}`)}`;

    lastDynamic = { id, expr, unit: '' };
    dynamicInterpolations.add(lastDynamic);

    text += `var(--${id})`;
  });

  [text, dependencyImports] = replaceDependencyPlaceholders(
    depInterpolations,
    text,
    dependencyImports,
    state.id,
    opts.pluginOptions,
  );

  if (dependencyImports) dependencyImports += '\n\n';

  const [rule, imports] = hoistImports(text);

  return {
    variants,
    text: rule,
    imports: `${dependencyImports}${imports.join('\n')}`,
    vars: Array.from(dynamicInterpolations),
  };
}

export default function buildTaggedTemplate(opts: Options) {
  const { location } = opts;
  const { text, vars, imports, variants } = buildTemplateImpl(opts, { id: 0 });

  const allVars = vars;
  const allVariants = [] as any[];
  let allImports = imports;
  let css = location === 'STYLESHEET' ? text : wrapInClass(text);

  for (const variant of variants) {
    allVariants.push(variant.expr);
    for (const rule of variant.rules) {
      allImports += rule.imports;
      allVars.push(...rule.vars);
      css += `\n${rule.text}`;
    }
  }

  css = `${allImports.trim()}\n\n${css}`.trim();

  if (
    location !== 'STYLESHEET' &&
    opts.style.absoluteFilePath.endsWith('.css')
  ) {
    // console.log(css);
    css = processCss(css, opts.style.absoluteFilePath).css;
  }

  return {
    css,
    interpolations: allVars.map(({ expr: _, ...i }) => i),
    vars: toVarsArray(allVars),
    variants: t.arrayExpression(allVariants),
  };
}
