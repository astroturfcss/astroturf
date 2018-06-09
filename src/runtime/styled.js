import classNames from 'classnames';
import camelCase from 'lodash/camelCase';
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

export function styled(type, displayName, styles, kebabName, camelName) {
  const componentClassName = has.call(styles, kebabName)
    ? styles[kebabName]
    : styles[camelName];
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

        if (typeof propValue === 'boolean') {
          if (propValue === true) {
            modifierClassNames.push(styles[propName]);
          }

          delete childProps[propName];
        } else if (typeof propValue === 'string') {
          const propKey = `${propName}-${propValue}`;
          if (has.call(styles, propKey)) {
            modifierClassNames.push(styles[propKey]);

            delete childProps[propName];
          } else {
            const camelPropKey = camelCase(propKey);
            if (has.call(styles, camelPropKey)) {
              modifierClassNames.push(styles[camelPropKey]);

              delete childProps[propName];
            }
          }
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
    styled(nextType, displayName, styles, kebabName, camelName);

  return decorated;
}

export default styled;
