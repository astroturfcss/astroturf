import { NodePath } from '@babel/core';
import * as t from '@babel/types';

import { PluginState } from '../types';
import truthy from '../utils/truthy';

type Var = [t.StringLiteral, t.Expression, t.StringLiteral | undefined];

const isSpread = (p: NodePath<any>): p is NodePath<t.JSXSpreadAttribute> =>
  p.isJSXSpreadAttribute();

const assign = (...nodes: t.Expression[]) => {
  const objs = nodes.filter(truthy);
  if (!objs.length) return null;
  return objs.length === 1
    ? objs[0]
    : t.callExpression(
        t.memberExpression(t.identifier('Object'), t.identifier('assign')),
        objs,
      );
};

const findPropIndex = <T extends NodePath<any>>(attrs: T[], key: string) =>
  attrs.findIndex((a) => a.isJSXAttribute() && a.node.name.name === key);

const unwrapValue = (attr: NodePath<t.JSXAttribute>) => {
  const value = attr.get('value');
  return value.isJSXExpressionContainer()
    ? value.get('expression')
    : (value as NodePath<t.StringLiteral>);
};

function classNames(nodes: t.Expression[]) {
  const classes = nodes.filter(truthy);
  if (!classes.length) return null;
  return classes.length === 1
    ? classes[0]
    : t.callExpression(
        t.memberExpression(
          t.templateLiteral(
            Array.from({ length: classes.length + 1 }, (_, idx) =>
              t.templateElement({
                raw: idx === 0 || idx === classes.length ? '' : ' ',
              }),
            ),
            classes,
          ),
          t.identifier('trim'),
        ),
        [],
      );
}

const falsyToString = (value?: t.Expression, op: '||' | '??' = '||') =>
  value && t.logicalExpression(op, value, t.stringLiteral(''));

const pluckPropertyFromSpreads = (
  attrs: NodePath<t.JSXAttribute | t.JSXSpreadAttribute>[],
  start: number,
  property: string,
  op: '||' | '??' = '||',
) => {
  const spreads = (start === -1 ? attrs : attrs.slice(start))
    .filter(isSpread)
    .map(({ node }) =>
      t.memberExpression(node.argument, t.identifier(property)),
    );

  return spreads.length
    ? spreads
        .slice(1)
        .reduce(
          (curr: any, next: any) => t.logicalExpression(op, next!, curr),
          spreads[0],
        )
    : null;
};

function buildStyleAttribute(
  attrs: NodePath<t.JSXAttribute | t.JSXSpreadAttribute>[],
  vars: t.ArrayExpression,
) {
  const idx = findPropIndex(attrs, 'style');
  const style = idx === -1 ? null : (attrs[idx] as NodePath<t.JSXAttribute>);

  const props = vars.elements.map((el: t.ArrayExpression) => {
    const [id, value, unit] = el.elements as Var;
    return t.objectProperty(
      t.stringLiteral(`--${id.value}`),
      unit
        ? t.binaryExpression(
            '+',
            t.callExpression(t.identifier('String'), [value]),
            unit,
          )
        : value,
    );
  });
  const spreadsAfterStyle = pluckPropertyFromSpreads(attrs, idx, 'style');

  if (!style) {
    return assign(t.objectExpression(props), spreadsAfterStyle);
  }

  const styleValue = unwrapValue(style);
  const styleValueNode = styleValue.node as t.Expression;
  let assignee = styleValueNode;

  style.remove();

  if (spreadsAfterStyle) {
    assignee = t.logicalExpression('||', spreadsAfterStyle, assignee);
  } else if (styleValue.isObjectExpression()) {
    // @ts-ignore
    styleValue.pushContainer('properties', props);
    return styleValueNode;
  }

  return assign(t.objectExpression(props), assignee);
}

function buildClassNameAttribute(
  attrs: NodePath<t.JSXAttribute | t.JSXSpreadAttribute>[],
  rootId: t.Identifier,
  variants: t.ArrayExpression,
) {
  const idx = findPropIndex(attrs, 'className');
  const className =
    idx === -1 ? null : (attrs[idx] as NodePath<t.JSXAttribute>);

  const values: any[] = [
    t.memberExpression(rootId, t.identifier('cls1')),
    ...variants.elements,
  ];

  if (className) {
    const classNameValue = unwrapValue(className);

    className.remove();
    // take the explicit className attribute and coerce to a string if necessary
    values.unshift(
      classNameValue.isStringLiteral()
        ? classNameValue.node
        : falsyToString(classNameValue.node as t.Expression),
    );
  } else {
    values.unshift(
      falsyToString(
        pluckPropertyFromSpreads(attrs, idx, 'className', '??'),
        '??',
      ),
    );
  }

  return classNames(values)!;
}

export function inlineJsx(
  path: NodePath<t.JSXAttribute>,
  node: t.ArrayExpression,
  _state: PluginState,
) {
  const parent = path.parentPath as NodePath<t.JSXOpeningElement>;
  const attrs = parent.get('attributes');

  const [rootId, vars, variants] = node.elements as [
    t.Identifier,
    t.ArrayExpression,
    t.ArrayExpression,
  ];

  const style = buildStyleAttribute(attrs, vars);
  const className = buildClassNameAttribute(attrs, rootId, variants);

  // @ts-ignore
  parent.pushContainer(
    'attributes',
    [
      style &&
        t.jsxAttribute(
          t.jsxIdentifier('style'),
          t.jsxExpressionContainer(style),
        ),
      t.jsxAttribute(
        t.jsxIdentifier('className'),
        t.jsxExpressionContainer(className),
      ),
    ].filter(truthy),
  );
}
