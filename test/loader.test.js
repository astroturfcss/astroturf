const { runLoader, loaderPrefix } = require('./helpers');

describe('webpack loader', () => {
  it('should add imports', async () => {
    const [code] = await runLoader(
      `
      import { css, stylesheet } from 'astroturf';

      const cls = css\`\`
      const styles = stylesheet\`\`

      function Button() {
        return (
          <button
            css={css\`
              color: blue;
            \`}
          />
        );
      }

      export default Button;
    `,
      { enableCssProp: true },
    );

    expect(code).toContain('/** @jsx _j **/');
    expect(code).toContain('/** @jsxFrag _j.F **/');

    expect(code).toContain(
      `import _CssProp1_button from "${loaderPrefix}./MyStyleFile-CssProp1_button.css"`,
    );
    expect(code).toContain('[_CssProp1_button');

    expect(code).toContain(
      `import _styles from "${loaderPrefix}./MyStyleFile-styles.css"`,
    );
    expect(code).toContain('const styles = _styles;');
    expect(code).toContain('const cls = _cls.cls1;');
  });

  it('finds different css tag names', async () => {
    const [, styles] = await runLoader(
      `
      import { css as less } from 'astroturf';

      const styles = less\`
        .bar {
          font-weight: bold;
          font-style: italic;
        }
      \`;
    `,
      {
        cssTagName: 'less',
        extension: '.less',
      },
    );

    expect(styles).toHaveLength(1);
    expect(styles[0].absoluteFilePath.endsWith('.less')).toBe(true);
  });

  it('finds different styled tag names', async () => {
    const [, styles] = await runLoader(
      `
      const styles = s('div')\`
        font-weight: bold;
        font-style: italic;
      \`;
    `,
      {
        styledTagName: 's',
        allowGlobal: true,
      },
    );

    expect(styles).toHaveLength(1);
  });
});
