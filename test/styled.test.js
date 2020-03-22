import { stripIndents } from 'common-tags';
import { mount } from 'enzyme';
import React from 'react';

import { withProps } from '../src/helpers';
import styled from '../src/index';
import { format, run, runLoader } from './helpers';

describe('styled', () => {
  it('should compile', async () => {
    const [code] = await run(
      `
      import { styled } from 'astroturf';
      const ButtonBase = styled('button')\`
        @import '~./styles/mixins.scss';

        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid transparent;
      \`;
    `,
    );

    expect(code).toEqual(
      format`
        import { styled } from 'astroturf';
        const ButtonBase = /*#__PURE__*/ styled('button', null, {
          displayName: \"ButtonBase\",
          styles: require(\"./MyStyleFile-ButtonBase.css\"),
          attrs: null,
          vars: []
        });
      `,
    );
  });

  it('should compile', async () => {
    const [code] = await runLoader(
      `
      import { styled } from 'astroturf';

      const ButtonBase = styled('button')\`
        @import '~./styles/mixins.scss';

        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid transparent;
      \`;
    `,
    );

    expect(code).toEqual(
      format`
        import { styled } from 'astroturf';

        const ButtonBase = /*#__PURE__*/ styled('button', null, {
          displayName: \"ButtonBase\",
          styles: require(\"./MyStyleFile-ButtonBase.css\"),
          attrs: null,
          vars: []
        });
      `,
    );
  });

  it('should hoist imports outside of wrapping class', async () => {
    const [, styles] = await run(
      `
      import { styled } from 'astroturf';

      const ButtonBase = styled('button')\`
        @import '~./styles/mixins.scss';

        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid transparent;
      \`;
    `,
    );

    expect(styles[0].value).toEqual(stripIndents`
      @import '~./styles/mixins.scss';
      .cls1 { /*!*/ }
      .cls2 {
      composes: cls1;

      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid transparent;
      }
    `);
  });

  it('should infer display names', async () => {
    const [, styles] = await run(
      `
      import styled from 'astroturf';

      const Foo = () => {};
      const bar = 'qux';
      Foo[bar]['baz'] = styled('div')\`
        color: red;
      \`;

      export default styled(FancyBox)\`
        color: ultra-red;
      \`;
    `,
    );

    expect(styles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ identifier: 'FooBarBaz' }),
        expect.objectContaining({ identifier: 'MyStyleFile' }),
      ]),
    );
  });

  it('should throw for unassigned components', async () => {
    await expect(
      run(
        `
        styled('p')\`
          color: blue;
        \`;
    `,
      ),
    ).rejects.toThrow(
      /The output of this styled component is never used\. Either assign it to a variable or export it/,
    );
  });

  it('should render the component with styles', () => {
    const Component = styled('div', null, {
      displayName: 'FancyBox',
      styles: {
        cls1: 'cls1',
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
      styles: { cls1: 'cls1', green: 'green' },
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
      styles: { cls1: 'cls1', green: 'green' },
      kebabName: 'fancy-box',
      camelName: 'fancyBox',
    });

    expect(mount(<Component as="p" green />).find('p.green')).toHaveLength(1);
  });

  it('should not allow `as` automatically for custom components', () => {
    const Component = styled(() => <div />, null, {
      displayName: 'FancyBox',
      styles: { cls1: 'cls1', green: 'green' },
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
        styles: { cls1: 'cls1', green: 'green' },
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
        styles: { cls1: 'cls1', green: 'green' },
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
      styles: { cls1: 'cls1', red: 'red' },
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
        attrs: (p) => ({ ...p, green: true }),
        styles: { cls1: 'cls1', green: 'green' },
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
        attrs: (p) => ({ green: p.foo }),
        styles: { cls1: 'cls1', green: 'green' },
        kebabName: 'fancy-box',
        camelName: 'fancyBox',
      });

      expect(mount(<Component />).find('div.green')).toHaveLength(0);

      expect(mount(<Component foo />).find('div[foo=true]')).toHaveLength(0);

      expect(mount(<Component foo />).find('div.green')).toHaveLength(1);
    });
  });
});
