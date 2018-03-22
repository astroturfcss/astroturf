import classNames from 'classnames';
import React from 'react';

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
  class Styled extends React.Component {
    static displayName = displayName;
    static withComponent(nextType) {
      return styled(nextType, displayName, styles, getStyles);
    }
    render() {
      const props = omit ? omit(this.props) : this.props;
      delete props.innerRef;
      return React.createElement(type, {
        ref: this.props.innerRef,
        className: classNames(
          props.className,
          styleMap.map(s => (typeof s === 'string' ? s : s(this.props))),
        ),
      });
    }
  }
  return React.forwardRef
    ? React.forwardRef((props, ref) => <Styled innerRef={ref} {...props} />)
    : Styled;
};
