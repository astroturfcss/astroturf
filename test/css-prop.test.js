import { mount } from 'enzyme';

import { jsx } from '../src/runtime/jsx';
import { format, testAllRunners } from './helpers';

describe('css prop', () => {
  testAllRunners('should compile string', async (runner) => {
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
    );

    expect(styles[0].identifier).toEqual('CssProp1_button');
  });

  testAllRunners('should compile template literal', async (runner) => {
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
    );

    expect(style.identifier).toEqual('CssProp1_button');
  });

  testAllRunners('should compile css tag', async (runner) => {
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
    );

    expect(style.identifier).toEqual('CssProp1_button');
  });

  testAllRunners('should interpolate static vars', async (runner) => {
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
    );

    expect(style.value).toMatch('1500ms');
  });

  testAllRunners(
    'should find when used with createElement',
    async (runner) => {
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
      );

      // expect(code).toMatchSnapshot();
      expect(code).not.toMatch('React.createElement');
      expect(code).not.toContain('/** @jsx');
      expect(code).not.toContain('/** @jsxFrag');

      expect(code).toMatch('import _j from "astroturf/jsx";');
      expect(code).toMatch('_j(');
      expect(styles).toHaveLength(2);
      expect(styles[0].identifier).toEqual('CssProp1_div');
    },
  );

  testAllRunners(
    'should find when used with automatic runtime',
    async (runner) => {
      const [code, styles] = await runner(
        `  
      import { css } from 'astroturf';
      import { jsx as _jsx } from "react/jsx-runtime";
      import { jsxs as _jsxs } from "react/jsx-runtime";
        
      function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
      
      const Widget = React.forwardRef((props, ref) => {
        return  /*#__PURE__*/_jsxs('div',  _extends({}, props, {
          tabIndex: -1,
          css: css\`
              color: red
            \`,
          children: [/*#__PURE__*/_jsx('span', { css: 'width: 3rem' }), children] 
        }))
      })
    `,
      );

      expect(code).not.toMatch('_jsxs(');
      expect(code).not.toMatch('_jsx(');
      expect(code).not.toContain('/** @jsx');
      expect(code).not.toContain('/** @jsxFrag');

      expect(code).toMatch('import _j from "astroturf/jsx";');
      expect(code).toMatch('_j.jsx2(');
      expect(code).toMatch('_jsx');
      expect(code).toMatch('_jsxs');
      expect(styles).toHaveLength(2);
      expect(styles[0].identifier).toEqual('CssProp1_div');
    },
  );

  testAllRunners(
    'should inject imports in the right order',
    async (runner, { requirePath }) => {
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
      );

      expect(code).toContain(
        format`
          import Component from './Foo';
          import _CssProp1_button from "${requirePath('CssProp1_button')}";
          import _CssProp2_span from "${requirePath('CssProp2_span')}";
        `,
      );
    },
  );

  testAllRunners('should warn when not enabled', async (runner) => {
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
    async (runner) => {
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

  testAllRunners('falls back to stylesheet prop', async (runner) => {
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
      {
        cssTagName: false,
        stylesheetTagName: 'css',
      },
    );

    expect(styles).toHaveLength(1);
    expect(styles[0].type).toEqual('class');
  });

  it('should render the component correctly', () => {
    expect(
      mount(
        jsx('div', {
          css: [
            {
              cls1: 'cls1',
            },
            [],
            [],
          ],
        }),
      ).find('div.cls1'),
    ).toHaveLength(1);
  });
});
