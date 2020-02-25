// eslint-disable-next-line import/no-extraneous-dependencies
import { Fragment, createElement } from 'react';

export const resolveVariants = variants => variants.filter(Boolean).join(' ');

export function varsToStyles(props, vars) {
  if (!vars || !vars.length) return props.style;
  const style = { ...props.style };
  vars.forEach(([id, value, unit = '']) => {
    const result = typeof value === 'function' ? value(props) : value;
    style[`--${id}`] = `${result}${unit}`;
  });
  return style;
}

export const F = Fragment;

export function jsx(type, props, ...children) {
  if (props && props.css) {
    const { css, className, ...childProps } = props;
    const componentClassName = css[0].cls2 || css[0].cls1;
    childProps.style = varsToStyles(childProps, css[1]);
    childProps.className = `${
      className ? `${className} ${componentClassName}` : componentClassName
    } ${resolveVariants(css[2])}`;
    props = childProps;
  }

  return createElement(type, props, ...children);
}
