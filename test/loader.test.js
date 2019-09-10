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

    expect(code.includes('/** @jsx _j **/')).toBe(true);
    expect(code.includes('/** @jsxFrag _f **/')).toBe(true);

    expect(
      code.includes(
        'const _default = require("./MyStyleFile-CssProp1_button.css");',
      ),
    ).toBe(true);

    expect(
      code.includes('const styles = require("./MyStyleFile-styles.css")'),
    ).toBe(true);
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
