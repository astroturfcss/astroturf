import { mount } from 'enzyme';
import React from 'react';

import { withProps } from '../src/helpers';
import styled from '../src/index';

describe('styled', () => {
  it('should render the component with styles', () => {
    const Component = styled('div', null, {
      displayName: 'FancyBox',
      styles: {
        green: 'green',
        big: 'big',
        dangerous: 'dangerous',
        themePrimary: 'primary',
        'size-sm': 'small',
        'foo-1': 'foo',
      },
      kebabName: 'fancy-box',
      camelName: 'fancyBox',
    });

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
    const Div = styled('div', null, {
      displayName: 'FancyBox',
      styles: { green: 'green' },
      kebabName: 'fancy-box',
      camelName: 'fancyBox',
    });

    const P = Div.withComponent('p');

    expect(mount(<Div green />).find('div.green')).toHaveLength(1);
    expect(mount(<P green />).find('p.green')).toHaveLength(1);
  });

  it('should allow `as` automatically on host components', () => {
    const Component = styled('div', null, {
      displayName: 'FancyBox',
      styles: { green: 'green' },
      kebabName: 'fancy-box',
      camelName: 'fancyBox',
    });

    expect(mount(<Component as="p" green />).find('p.green')).toHaveLength(1);
  });

  it('should not allow `as` automatically for custom components', () => {
    const Component = styled(() => <div />, null, {
      displayName: 'FancyBox',
      styles: { green: 'green' },
      kebabName: 'fancy-box',
      camelName: 'fancyBox',
    });

    expect(mount(<Component as="p" green />).find('div')).toHaveLength(1);
  });

  it('should allow configurable `as` true', () => {
    const Component = styled(
      () => <div />,
      { allowAs: true },
      {
        displayName: 'FancyBox',
        styles: { green: 'green' },
        kebabName: 'fancy-box',
        camelName: 'fancyBox',
      },
    );

    expect(mount(<Component as="p" green />).find('p.green')).toHaveLength(1);
  });

  it('should allow configurable `as` false', () => {
    const Component = styled(
      'div',
      { allowAs: false },
      {
        displayName: 'FancyBox',
        styles: { green: 'green' },
        kebabName: 'fancy-box',
        camelName: 'fancyBox',
      },
    );

    expect(mount(<Component as="p" green />).find('div.green')).toHaveLength(
      1,
    );
  });

  it('should passthrough as', () => {
    const Inner = styled('div', null, {
      displayName: 'FancyBox',
      styles: { red: 'red' },
      kebabName: 'fancy-box',
      camelName: 'fancyBox',
    });

    const Component = styled(withProps({})(Inner), null, {
      displayName: 'Outer',
      styles: { green: 'green' },
      kebabName: 'outer',
      camelName: 'outer',
    });

    expect(
      mount(<Component as="p" green red />).find('p.red.green:not([as])'),
    ).toHaveLength(1);
  });

  describe('attrs()', () => {
    it('should provide from object', () => {
      const Component = styled('div', null, {
        displayName: 'FancyBox',
        attrs: p => ({ ...p, green: true }),
        styles: { green: 'green' },
        kebabName: 'fancy-box',
        camelName: 'fancyBox',
      });

      expect(mount(<Component />).find('div.green')).toHaveLength(1);

      // can't be overridden
      expect(
        mount(<Component green={false} />).find('div.green'),
      ).toHaveLength(1);
    });

    it('should provide from function which maps props', () => {
      const Component = styled('div', null, {
        displayName: 'FancyBox',
        attrs: p => ({ green: p.foo }),
        styles: { green: 'green' },
        kebabName: 'fancy-box',
        camelName: 'fancyBox',
      });

      expect(mount(<Component />).find('div.green')).toHaveLength(0);

      expect(mount(<Component foo />).find('div[foo=true]')).toHaveLength(0);

      expect(mount(<Component foo />).find('div.green')).toHaveLength(1);
    });
  });
});
