import React from 'react';
import { mount } from 'enzyme';

import styled from '../src/index';
import { withProps } from '../src/helpers';

describe('styled', () => {
  it('should render the component with styles', () => {
    const Component = styled(
      'div',
      null,
      'FancyBox',
      {
        green: 'green',
        big: 'big',
        dangerous: 'dangerous',
        themePrimary: 'primary',
        'size-sm': 'small',
        'foo-1': 'foo',
      },
      'fancy-box',
      'fancyBox',
    );

    expect(
      mount(
        <Component
          green
          big={undefined}
          dangerous={null}
          size="sm"
          theme="primary"
          foo={1}
        />,
      ).find('div.green.primary.small.foo'),
    ).toHaveLength(1);
  });

  it('should allow withComponent', () => {
    const Div = styled(
      'div',
      null,
      'FancyBox',
      { green: 'green' },
      'fancy-box',
      'fancyBox',
    );

    const P = Div.withComponent('p');

    expect(mount(<Div green />).find('div.green')).toHaveLength(1);
    expect(mount(<P green />).find('p.green')).toHaveLength(1);
  });

  it('should allow `as` automatically on host components', () => {
    const Component = styled(
      'div',
      null,
      'FancyBox',
      { green: 'green' },
      'fancy-box',
      'fancyBox',
    );

    expect(mount(<Component as="p" green />).find('p.green')).toHaveLength(1);
  });

  it('should not allow `as` automatically for custom components', () => {
    const Component = styled(
      () => <div />,
      null,
      'FancyBox',
      { green: 'green' },
      'fancy-box',
      'fancyBox',
    );

    expect(mount(<Component as="p" green />).find('div')).toHaveLength(1);
  });

  it('should allow configurable `as` true', () => {
    const Component = styled(
      () => <div />,
      { allowAs: true },
      'FancyBox',
      { green: 'green' },
      'fancy-box',
      'fancyBox',
    );

    expect(mount(<Component as="p" green />).find('p.green')).toHaveLength(1);
  });

  it('should allow configurable `as` false', () => {
    const Component = styled(
      'div',
      { allowAs: false },
      'FancyBox',
      { green: 'green' },
      'fancy-box',
      'fancyBox',
    );

    expect(mount(<Component as="p" green />).find('div.green')).toHaveLength(
      1,
    );
  });

  it('should passthrough as', () => {
    const Inner = styled(
      'div',
      null,
      'FancyBox',
      { red: 'red' },
      'fancy-box',
      'fancyBox',
    );
    const Component = styled(
      withProps({})(Inner),
      null,
      'Outer',
      { green: 'green' },
      'outer',
      'outer',
    );

    expect(
      mount(<Component as="p" green red />).find('p.red.green:not([as])'),
    ).toHaveLength(1);
  });
});
