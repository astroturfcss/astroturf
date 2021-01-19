import { stripIndents } from 'common-tags';
import { mount } from 'enzyme';
import React from 'react';

import styled from '../src/runtime/react';
import { format, loaderPrefix, run, runLoader } from './helpers';

describe('styled', () => {
  it('should compile (babel)', async () => {
    const [code] = await run(
      `
      import styled from 'astroturf/react';
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
        import styled from 'astroturf/react';
        import _ButtonBase from "./MyStyleFile-ButtonBase.module.css";
        const ButtonBase = /*#__PURE__*/ styled('button', null, {
          displayName: \"ButtonBase\",
          styles: _ButtonBase
        });
      `,
    );
  });

  it('should compile (webpack)', async () => {
    const [code] = await runLoader(
      `
      import styled from 'astroturf/react';

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
        import styled from 'astroturf/react';
        import _ButtonBase from "${loaderPrefix}./MyStyleFile-ButtonBase.module.css";
        const ButtonBase = /*#__PURE__*/ styled('button', null, {
          displayName: \"ButtonBase\",
          styles: _ButtonBase
        });
      `,
    );
  });

  it('should hoist imports outside of wrapping class', async () => {
    const [, styles] = await run(
      `
      import styled from 'astroturf/react';

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
      /*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk15U3R5bGVGaWxlLUJ1dHRvbkJhc2UubW9kdWxlLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwrQkFBK0I7O0FBRS9CLFFBQVEsSUFBSSxFQUFFO0FBQ2Q7QUFDQSxjQUFjOztBQUVkLG9CQUFvQjtBQUNwQixtQkFBbUI7QUFDbkIsdUJBQXVCO0FBQ3ZCLDZCQUE2QjtBQUM3QiIsImZpbGUiOiJNeVN0eWxlRmlsZS1CdXR0b25CYXNlLm1vZHVsZS5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0ICd+Li9zdHlsZXMvbWl4aW5zLnNjc3MnO1xuXG4uY2xzMSB7IC8qISovIH1cbi5jbHMyIHtcbmNvbXBvc2VzOiBjbHMxO1xuXG5kaXNwbGF5OiBpbmxpbmUtZmxleDtcbmFsaWduLWl0ZW1zOiBjZW50ZXI7XG5qdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbmJvcmRlcjogMXB4IHNvbGlkIHRyYW5zcGFyZW50O1xufSJdfQ== */
    `);
  });

  it('should infer display names', async () => {
    const [, styles] = await run(
      `
      import styled from 'astroturf/react';

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
        import styled from 'astroturf/react';

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

    const Component = styled(Inner, null, {
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
