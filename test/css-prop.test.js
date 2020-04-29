import { mount } from 'enzyme';

import { jsx } from '../src/runtime/jsx';
import { format, run, testAllRunners } from './helpers';

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

      expect(code).not.toMatch('React.createElement');
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
          import _CssProp1_button from "${requirePath(
            './MyStyleFile-CssProp1_button.css',
          )}";
          import _CssProp2_span from "${requirePath(
            './MyStyleFile-CssProp2_span.css',
          )}";
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

  describe.only('inline optimization', () => {
    async function runInline(jsxStr) {
      const [code] = await run(
        `
          import { css } from 'astroturf';

          function Button({ color }) {
            return (${jsxStr});
          }
        `,
        { experiments: { inlineCssPropOptimization: true } },
      );

      expect(code).not.toContain('css={');
      return code;
    }

    it('style no conflicts', async () => {
      const code = await runInline(`
        <button
          css={css\`
            color: \${color};
          \`}
        />
      `);

      expect(code).toIgnoreIndentAndContain(`
        style={{
          "--akeopjh": color,
        }}
        className={_CssProp1_button.cls1}
      `);
    });

    it('style: reuse the style object', async () => {
      const code = await runInline(`
        <button
          style={{ backgroundColor: "red" }}
          css={css\`
            color: \${color};
          \`}
        />
      `);

      expect(code).toIgnoreIndentAndContain(`
        style={{
          backgroundColor: "red",
          "--akeopjh": color,
        }}
        className={_CssProp1_button.cls1}
      `);
    });

    it('style: should Object.assign when unclear', async () => {
      const code = await runInline(`
        <button
          style={style}
          css={css\`
            color: \${color};
          \`}
        />
      `);

      expect(code).toIgnoreIndentAndContain(`
        style={Object.assign(
          {
            "--akeopjh": color,
          },
          style
        )}
        className={_CssProp1_button.cls1}
      `);
    });

    it('style: should handle spread', async () => {
      const code = await runInline(`
        <button
          {...spread}
          css={css\`
            color: \${color};
          \`}
        />
      `);

      expect(code).toIgnoreIndentAndContain(`
        style={Object.assign(
          {
            "--akeopjh": color,
          },
          spread.style
        )}
        className={\`\${spread.className ?? ""} \${_CssProp1_button.cls1}\`.trim()}
      `);
    });

    it('should handle multiple spreads', async () => {
      const code = await runInline(`
        <button
          {...spread}
          {...other}
          css={css\`
            color: \${color};
          \`}
        />
      `);

      expect(code).toIgnoreIndentAndContain(`
        style={Object.assign(
          {
            "--akeopjh": color,
          },
          other.style || spread.style
        )}
        className={\`\${other.className ?? spread.className ?? ""} \${
          _CssProp1_button.cls1
        }\`.trim()}
      `);
    });

    it('should ignore spreads when style comes after', async () => {
      const code = await runInline(`
        <button
          {...spread}
          {...other}
          style={style}
          css={css\`
            color: \${color};
          \`}
        />
      `);

      expect(code).toIgnoreIndentAndContain(`
        style={Object.assign(
          {
            "--akeopjh": color,
          },
          style
        )}
        className={\`\${other.className ?? spread.className ?? ""} \${
          _CssProp1_button.cls1
        }\`.trim()}
      `);
    });

    it('should handle spreads with style', async () => {
      const code = await runInline(`
        <button
          style={style}
          {...spread}
          {...other}
          css={css\`
            color: \${color};
          \`}
        />
      `);

      expect(code).toIgnoreIndentAndContain(`
        style={Object.assign(
          {
            "--akeopjh": color,
          },
          other.style || spread.style || style
        )}
        className={\`\${other.className ?? spread.className ?? ""} \${
          _CssProp1_button.cls1
        }\`.trim()}
      `);
    });

    it('should handle spreads with style object', async () => {
      const code = await runInline(`
        <button
          style={{ color: 'red' }}
          {...spread}
          {...other}
          css={css\`
            color: \${color};
          \`}
        />
      `);

      expect(code).toIgnoreIndentAndContain(`
        style={Object.assign(
          {
            "--akeopjh": color,
          },
          other.style ||
            spread.style || {
              color: "red",
            }
        )}
        className={\`\${other.className ?? spread.className ?? ""} \${
          _CssProp1_button.cls1
        }\`.trim()}
      `);
    });
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
