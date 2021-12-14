// eslint-disable-next-line import/no-extraneous-dependencies
import { Fragment, createElement } from 'react';

export const resolveVariants = (variants) =>
  !variants ? '' : variants.filter(Boolean).join(' ');

export function varsToStyles(props, vars) {
  if (!vars || !vars.length) return props.style;
  const style = { ...props.style };
  vars.forEach(([id, value, unit = '']) => {
    const result = typeof value === 'function' ? value(props) : value;
    style[`--${id}`] = `${result}${unit}`;
  });
  return style;
}

function jsx2(fn, type, props, ...args) {
  if (props && props.css) {
    const { css, className, ...childProps } = props;
    const componentClassName = css[0].cls2 || css[0].cls1;
    childProps.style = varsToStyles(childProps, css[1]);
    childProps.className = `${
      className ? `${className} ${componentClassName}` : componentClassName
    } ${resolveVariants(css[2])}`;
    props = childProps;
  }
  return fn(type, props, ...args);
}
function jsx(type, props, ...children) {
  return jsx2(createElement, type, props, ...children);
}

jsx.F = Fragment;
jsx.jsx2 = jsx2;

// the reason for the crazy exports here is that you need to do a BUNCH of work
// to keep typescript from eliding (removing) the jsx imports
// see: https://github.com/babel/babel/pull/11523
export { jsx2, jsx, Fragment as F };

export default jsx;
