import { mount } from 'enzyme';

import { jsx } from '../src/index';
import { format, testAllRunners } from './helpers';

describe('css prop', () => {
  testAllRunners('should compile string', async runner => {
    const [, styles] = await runner(
      `
      import { css } from 'astroturf';

      function Button() {
        return (
          <button
            css="color:blue"
          />
        );
      }
    `,
      { enableCssProp: true },
    );

    expect(styles[0].identifier).toEqual('CssProp1_button');
  });

  testAllRunners('should compile template literal', async runner => {
    const [, [style]] = await runner(
      `
      import { css } from 'astroturf';

      function Button() {
        return (
          <button
            css={\`
              color: blue;
            \`}
          />
        );
      }
    `,
      { enableCssProp: true },
    );

    expect(style.identifier).toEqual('CssProp1_button');
  });

  testAllRunners('should compile css tag', async runner => {
    const [, [style]] = await runner(
      `
      import { css } from 'astroturf';

      function Button() {
        return (
          <button
            css={css\`
              color: blue;
            \`}
          />
        );
      }
    `,
      { enableCssProp: true },
    );

    expect(style.identifier).toEqual('CssProp1_button');
  });

  testAllRunners('should interpolate static vars', async runner => {
    const [, [style]] = await runner(
      `
      import { css } from 'astroturf';

      const duration = 1000

      function Button() {
        return (
          <button
            css={css\`
              transition: all $\{duration + 500}ms;
            \`}
          />
        );
      }
    `,
      { enableCssProp: true },
    );

    expect(style.value).toMatch('1500ms');
  });

  testAllRunners('should find when used with createElement', async runner => {
    const [code, styles] = await runner(
      `
      function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

      import { css } from 'astroturf';
      import React from 'react';

      const Widget = React.forwardRef((props, ref) => {
        return React.createElement('div', _extends({
          ref: ref
        }, props, {
          tabIndex: -1,
          css: css\`
            color: red;
          \`
        }), React.createElement('span', { css: 'width: 3rem' }));
      });
    `,
      { enableCssProp: true },
    );

    expect(code).not.toMatch('React.createElement');
    expect(styles).toHaveLength(2);
    expect(styles[0].identifier).toEqual('CssProp1_div');
  });

  testAllRunners.only(
    'should inject imports in the right order',
    async runner => {
      const [code] = await runner(
        `
          import { css } from 'astroturf';
          import Component from './Foo';

          function Button() {
            return (
              <button
                css={css\`
                  color: blue;
                \`}
              >
                <span css="height: 3rem;"/>
              </button>
            );
          }
        `,
        { enableCssProp: true },
      );

      expect(code).toContain(
        format`
          import Component from './Foo';
          import _CssProp1_button from "./MyStyleFile-CssProp1_button.css";
          import _CssProp2_span from "./MyStyleFile-CssProp2_span.css";
        `,
      );
    },
  );

  testAllRunners('should warn when not enabled', async runner => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const [, styles] = await runner(
      `
      import { css } from 'astroturf';

      function Button() {
        return (
          <button
            css={css\`
              color: blue;
            \`}
          />
        );
      }
    `,
      { enableCssProp: false },
    );

    expect(styles).toHaveLength(1);
    expect(spy).toHaveBeenCalledWith(
      expect.stringMatching(
        'It looks like you are trying to use the css prop',
      ),
    );
    spy.mockRestore();
  });

  testAllRunners(
    'should only compile with appropriate css import',
    async runner => {
      const [, styles] = await runner(
        `
        const Widget = (props) =>
          React.createElement('div', _extends({}, props, {
            tabIndex: -1,
            css: css\`
              color: red;
            \`
          }));

        function Button() {
          return (
            <button
              css={css\`
                color: blue;
              \`}
            />
          );
        }
      `,
        { allowGlobal: false, enableCssProp: true },
      );

      expect(styles).toHaveLength(0);
    },
  );

  it('should render the component correctly', () => {
    expect(
      mount(
        jsx('div', {
          green: true,
          big: undefined,
          dangerous: null,
          size: 'sm',
          theme: 'primary',
          foo: 1,
          css: {
            cls1: 'cls1',
            green: 'green',
            big: 'big',
            dangerous: 'dangerous',
            themePrimary: 'primary',
            'size-sm': 'small',
            'foo-1': 'foo',
          },
        }),
      ).find('div.green.primary.small.foo'),
    ).toHaveLength(1);
  });
});
