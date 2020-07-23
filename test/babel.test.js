const { runBabel } = require('./helpers');

describe('babel integration', () => {
  function run(src, options) {
    return runBabel(
      src,
      { ...options, jsxPragma: '__AstroturfJsx' },
      {
        presets: [
          '@babel/env',
          [
            '@babel/react',
            { pragma: '__AstroturfJsx', pragmaFrag: '__AstroturfJsx.F' },
          ],
        ],
      },
    );
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

    expect(code).toContain('/** @jsx __AstroturfJsx **/');
    expect(code).toContain('/** @jsxFrag __AstroturfJsx.F **/');

    expect(code).toContain(
      'var _jsx = _interopRequireDefault(require("astroturf/jsx"))',
    );
    expect(code).toContain(
      'var _MyStyleFileCls = _interopRequireDefault(require("./MyStyleFile-cls.css"))',
    );
  });
});
