import classNames from 'classnames';
import React from 'react'; // eslint-disable-line import/no-extraneous-dependencies

import reactPropsRegex from './props';

const has = Object.prototype.hasOwnProperty;

function omitNonHostProps(props) {
  const result = {};
  Object.keys(props).forEach(key => {
    if (reactPropsRegex.test(key)) result[key] = props[key];
  });
  return result;
}

function styled(type, displayName, styles, camelName, kebabName) {
  const componentClassName = has.call(styles, camelName)
    ? styles[camelName]
    : styles[kebabName];
  const omit = typeof type === 'string' ? omitNonHostProps : null;

  const hasModifiers = Object.keys(styles).some(
    className => className !== camelName && className !== kebabName,
  );

  function Styled(props) {
    const childProps = omit ? omit(props) : { ...props };

    delete childProps.innerRef;
    childProps.ref = props.innerRef;

    if (hasModifiers) {
      const modifierClassNames = [];

      Object.keys(props).forEach(propName => {
        const propValue = props[propName];

        if (
          (typeof propValue === 'boolean' || typeof propValue === 'string') &&
          has.call(styles, propName)
        ) {
          if (propValue === true) {
            modifierClassNames.push(styles[propName]);
          } else if (propValue !== false && has.call(styles, propValue)) {
            modifierClassNames.push(styles[propName], styles[propValue]);
          }

          delete childProps[propName];
        }
      });

      childProps.className = classNames(
        childProps.className,
        componentClassName,
        ...modifierClassNames,
      );
    } else {
      childProps.className = classNames(
        childProps.className,
        componentClassName,
      );
    }

    return React.createElement(type, childProps);
  }

  Styled.displayName = displayName;

  const decorated = React.forwardRef
    ? React.forwardRef((props, ref) => <Styled innerRef={ref} {...props} />)
    : Styled;

  decorated.withComponent = nextType =>
    styled(nextType, displayName, styles, camelName, kebabName);

  return decorated;
}

export default styled;
