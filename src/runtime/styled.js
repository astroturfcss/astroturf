import classNames from 'classnames';
import React from 'react'; // eslint-disable-line import/no-extraneous-dependencies

const has = Object.prototype.hasOwnProperty;
// eslint-disable-next-line no-control-regex
const reWords = /[A-Z\xc0-\xd6\xd8-\xde]?[a-z\xdf-\xf6\xf8-\xff]+(?:['’](?:d|ll|m|re|s|t|ve))?(?=[\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000]|[A-Z\xc0-\xd6\xd8-\xde]|$)|(?:[A-Z\xc0-\xd6\xd8-\xde]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])+(?:['’](?:D|LL|M|RE|S|T|VE))?(?=[\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000]|[A-Z\xc0-\xd6\xd8-\xde](?:[a-z\xdf-\xf6\xf8-\xff]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])|$)|[A-Z\xc0-\xd6\xd8-\xde]?(?:[a-z\xdf-\xf6\xf8-\xff]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])+(?:['’](?:d|ll|m|re|s|t|ve))?|[A-Z\xc0-\xd6\xd8-\xde]+(?:['’](?:D|LL|M|RE|S|T|VE))?|\d*(?:1ST|2ND|3RD|(?![123])\dTH)(?=\b|[a-z_])|\d*(?:1st|2nd|3rd|(?![123])\dth)(?=\b|[A-Z_])|\d+|(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]|\ud83c[\udffb-\udfff])?)*/g;

const camelCase = str =>
  (str.match(reWords) || []).reduce(
    (acc, next) => acc + (!acc ? next : next[0].toUpperCase() + next.slice(1)),
    '',
  );

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
