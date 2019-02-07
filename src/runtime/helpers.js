/* eslint-disable react/no-multi-comp */
const React = require('react'); // eslint-disable-line import/no-extraneous-dependencies

const getName = (name, C) => `${name}(${C.displayName || C.name || C})`;

function mapProps(mapper) {
  return Component =>
    Object.assign(
      React.forwardRef((p, ref) => <Component ref={ref} {...mapper(p)} />),
      {
        isAstroturf: true,
        displayName: getName('mapProps', Component),
      },
    );
}

function withProps(objOrMapper) {
  return Component =>
    Object.assign(
      React.forwardRef((p, ref) => (
        <Component
          ref={ref}
          {...p}
          {...(typeof objOrMapper === 'function'
            ? objOrMapper(p)
            : objOrMapper)}
        />
      )),
      {
        isAstroturf: true,
        displayName: getName('withProps', Component),
      },
    );
}

module.exports = { mapProps, withProps };
