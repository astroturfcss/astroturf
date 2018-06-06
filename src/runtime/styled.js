import classNames from 'classnames';
import React from 'react'; // eslint-disable-line

import reactPropsRegex from './props';

function omitNonHostProps(props) {
  const result = {};
  Object.keys(props).forEach(key => {
    if (reactPropsRegex.test(key)) result[key] = props[key];
  });
  return result;
}

export const styled = (type, displayName, styles, getStyles) => {
  const styleMap = getStyles(styles);
  const omit = typeof type === 'string' ? omitNonHostProps : null;

  function Styled(_props) {
    const props = omit ? omit(_props) : { ..._props };
    delete props.innerRef;
    props.ref = _props.innerRef;
    props.className = classNames(
      props.className,
      styleMap.map(s => (typeof s === 'string' ? s : s(_props))),
    );
    return React.createElement(type, props);
  }

  Styled.displayName = displayName;

  const decorated = React.forwardRef
    ? React.forwardRef((props, ref) => <Styled innerRef={ref} {...props} />)
    : Styled;

  decorated.withComponent = nextType =>
    styled(nextType, displayName, styles, getStyles);

  return decorated;
};

export default styled;

export const css = () => {
  throw new Error('`css` template literal evaluated at runtime!');
};
