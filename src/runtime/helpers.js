import React from 'react'; // eslint-disable-line import/no-extraneous-dependencies

const returnsArg = p => p;

const decorate = (C, displayName, mapper = returnsArg) => {
  const render = (p, ref) => <C ref={ref} {...mapper(p)} />;
  const decorated = React.forwardRef(render);
  decorated.isAstroturf = C.isAstroturf;
  decorated.setName = name => {
    render.displayName = `${name}(${C.displayName || C.name || C})`;
  };
  decorated.setName(displayName);
  return decorated;
};

export function mapProps(mapper) {
  return Component => decorate(Component, `mapProps`, mapper);
}

export function withProps(objOrMapper) {
  const hoc = mapProps(props => ({
    ...props,
    ...(typeof objOrMapper === 'function' ? objOrMapper(props) : objOrMapper),
  }));

  return Component => {
    const decorated = hoc(Component);
    decorated.setName(`withProps`);
    return decorated;
  };
}

// eslint-disable-next-line no-shadow
export function defaultProps(defaultProps) {
  return Component =>
    Object.assign(decorate(Component, `defaultProps`), { defaultProps });
}
