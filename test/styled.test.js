import React from 'react';
import { mount } from 'enzyme';

import styled from '../src/index';

describe('styled', () => {
  it('should render the component with styles', () => {
    const Component = styled(
      'div',
      null,
      'FancyBox',
      { green: 'green', themePrimary: 'primary', 'size-sm': 'small' },
      'fancy-box',
      'fancyBox',
    );

    expect(
      mount(<Component green size="sm" theme="primary" />).find(
        'div.green.primary.small',
      ),
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
      Inner,
      null,
      'Outer',
      { green: 'green' },
      'outer',
      'outer',
    );

    console.log(
      mount(<Component as="p" green red />)
        .find('p.red.green')
        .html(),
    );
    expect(
      mount(<Component as="p" green red />).find('p.red.green:not([as])'),
    ).toHaveLength(1);
  });
});
