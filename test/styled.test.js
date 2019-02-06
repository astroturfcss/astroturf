import React from 'react';
import { mount } from 'enzyme';

import styled from '../src/index';

const toSettings = (displayName, styles, kebabName, camelName) => ({
  displayName,
  styles,
  kebabName,
  camelName,
  vars: [],
});

describe('styled', () => {
  it('should render the component with styles', () => {
    const Component = styled(
      'div',
      null,

      toSettings(
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
      ),
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

  it('should add dynamic values to style', () => {
    const Component = styled('div', null, {
      displayName: 'FancyBox',
      kebabName: 'fancy-box',
      camelName: 'fancyBox',
      vars: [
        ['varname1', p => (p.green ? 'green' : 'red')],
        ['varname2', p => (p.size === 'sm' ? 15 : 30), 'rem'],
      ],
      styles: {
        big: 'big',
        themePrimary: 'primary',
        'size-sm': 'small',
        'foo-1': 'foo',
      },
    });

    const comp = mount(<Component size="sm" green foo={1} />).find(
      'div.small.foo',
    );

    expect(comp).toHaveLength(1);
    expect(comp.props().style).toEqual({
      '--varname1': 'green',
      '--varname2': '15rem',
    });
  });

  it('should allow withComponent', () => {
    const Div = styled(
      'div',
      null,
      toSettings('FancyBox', { green: 'green' }, 'fancy-box', 'fancyBox'),
    );

    const P = Div.withComponent('p');

    expect(mount(<Div green />).find('div.green')).toHaveLength(1);
    expect(mount(<P green />).find('p.green')).toHaveLength(1);
  });

  it('should allow `as` automatically on host components', () => {
    const Component = styled(
      'div',
      null,
      toSettings('FancyBox', { green: 'green' }, 'fancy-box', 'fancyBox'),
    );

    expect(mount(<Component as="p" green />).find('p.green')).toHaveLength(1);
  });

  it('should not allow `as` automatically for custom components', () => {
    const Component = styled(
      () => <div />,
      null,
      toSettings('FancyBox', { green: 'green' }, 'fancy-box', 'fancyBox'),
    );

    expect(mount(<Component as="p" green />).find('div')).toHaveLength(1);
  });

  it('should allow configurable `as` true', () => {
    const Component = styled(
      () => <div />,
      { allowAs: true },
      toSettings('FancyBox', { green: 'green' }, 'fancy-box', 'fancyBox'),
    );

    expect(mount(<Component as="p" green />).find('p.green')).toHaveLength(1);
  });

  it('should allow configurable `as` false', () => {
    const Component = styled(
      'div',
      { allowAs: false },
      toSettings('FancyBox', { green: 'green' }, 'fancy-box', 'fancyBox'),
    );

    expect(mount(<Component as="p" green />).find('div.green')).toHaveLength(
      1,
    );
  });

  it('should passthrough as', () => {
    const Inner = styled(
      'div',
      null,
      toSettings('FancyBox', { red: 'red' }, 'fancy-box', 'fancyBox'),
    );
    const Component = styled(
      Inner,
      null,
      toSettings('Outer', { green: 'green' }, 'outer', 'outer'),
    );

    expect(
      mount(<Component as="p" green red />).find('p.red.green:not([as])'),
    ).toHaveLength(1);
  });
});
