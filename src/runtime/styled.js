import classNames from 'classnames';
import camelCase from 'lodash/camelCase';
import React from 'react'; // eslint-disable-line import/no-extraneous-dependencies

const has = Object.prototype.hasOwnProperty;

export function styled(
  type,
  options,
  displayName,
  styles,
  kebabName,
  camelName,
) {
  options = options || { allowAs: typeof type === 'string' };
  const componentClassName = has.call(styles, kebabName)
    ? styles[kebabName]
    : styles[camelName];

  // always passthrough if the type is a styled component
  const allowAs = type.isAstroturf ? false : options.allowAs;

  const hasModifiers = Object.keys(styles).some(
    className => className !== camelName && className !== kebabName,
  );

  function Styled(props, ref) {
    const childProps = { ...props, ref };
    if (allowAs) delete childProps.as;

    const modifierClassNames = [];

    if (hasModifiers) {
      Object.keys(props).forEach(propName => {
        const propValue = props[propName];

        if (typeof propValue === 'boolean' || propValue == null) {
          if (has.call(styles, propName)) {
            if (propValue) {
              modifierClassNames.push(styles[propName]);
            }

            delete childProps[propName];
          } else {
            const camelPropName = camelCase(propName);

            if (has.call(styles, camelPropName)) {
              if (propValue) {
                modifierClassNames.push(styles[camelPropName]);
              }

              delete childProps[propName];
            }
          }
        } else if (
          typeof propValue === 'string' ||
          typeof propValue === 'number'
        ) {
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
    }

    childProps.className = classNames(
      childProps.className,
      componentClassName,
      ...modifierClassNames,
    );

    return React.createElement(
      allowAs && props.as ? props.as : type,
      childProps,
    );
  }

  const decorated = React.forwardRef
    ? React.forwardRef(Styled)
    : props => Styled(props, null);

  decorated.displayName = displayName;

  decorated.withComponent = nextType =>
    styled(nextType, options, displayName, styles, kebabName, camelName);

  decorated.isAstroturf = true;

  return decorated;
}

export default styled;

export const css = () => {
  throw new Error('`css` template literal evaluated at runtime!');
};
