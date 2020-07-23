const { runBabel } = require('./helpers');

describe('babel integration', () => {
  function run(src, options) {
    return runBabel(src, {
      presets: [
        '@babel/env',
        '@babel/react',
        [
          require('../src/preset.ts'),
          {
            ...options,
            writeFiles: false,
          },
        ],
      ],
    });
  }

  it('should not require additional compilation', async () => {
    const [code] = await run(
      `
      import { css, stylesheet } from 'astroturf';

      const cls = css\`\`
      const styles = stylesheet\`\`

      function Button() {
        return (
          <>
            <button
              css={css\`
                color: blue;
              \`}
            />
          </>
        );
      }

      export default Button;
    `,
      { enableCssProp: true },
    );

    expect(code).not.toContain('/** @jsx');
    expect(code).not.toContain('/** @jsxFrag');

    expect(code).toContain(
      'var _jsx = _interopRequireDefault(require("astroturf/jsx"))',
    );

    expect(code).toContain('(0, _jsx["default"])("button",');
    expect(code).toContain(
      'var _MyStyleFileCls = _interopRequireDefault(require("./MyStyleFile-cls.css"))',
    );

    expect(code).toContain('React.Fragment');
  });
});
