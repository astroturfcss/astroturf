const { runLoader } = require('./helpers');

describe('webpack loader', () => {
  it('should add imports', async () => {
    const [code] = await runLoader(
      `
      import { css } from 'astroturf';

      const styles = css\`\`

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
    expect(code).toContain('/** @jsxFrag _f **/');

    expect(code).toContain(
      'import _CssProp1_button from "./MyStyleFile-CssProp1_button.css"',
    );
    expect(code).toContain('[_CssProp1_button');

    expect(code).toContain('import _styles from "./MyStyleFile-styles.css"');
    expect(code).toContain('const styles = _styles;');
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
        tagName: 'less',
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
        styledTag: 's',
      },
    );

    expect(styles).toHaveLength(1);
  });
});
