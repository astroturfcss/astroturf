import { stripIndents } from 'common-tags';
import { run } from './helpers';

describe('css tag', () => {
  it('should remove css imports', async () => {
    const [code] = await run(`
      import { css } from 'astroturf';

      const styles = css\`
        .blue {
          color: blue;
        }
      \`;
    `);

    expect(code).toEqual(
      stripIndents`
        const styles =
          /*#__PURE__*/
          require("./MyStyleFile-styles.css");
      `,
    );
  });

  it('should remove just the css import', async () => {
    const [code] = await run(`
      import styled, { css } from 'astroturf';

      const styles = css\`
        .blue {
          color: blue;
        }
      \`;
    `);

    expect(code).toEqual(
      stripIndents`
        import styled from 'astroturf';

        const styles =
          /*#__PURE__*/
          require("./MyStyleFile-styles.css");
      `,
    );
  });

  it('allows different tag names', async () => {
    const [, styles] = await run(
      `
      import { css as less } from 'astroturf';

      const SIZE = 75;

      const styles = less\`
        .foo {
          color: red;
          width: $\{SIZE}px;
        }

        .bar {
          composes: foo;

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

  it('should throw when there are ambigious identifiers', async () => {
    await expect(
      run(
        `
        import { css as less } from 'astroturf';

        less\`
          .blue {
            color: blue;
          }
        \`;

        less\`
          .red {
            color: red;
          }
        \`;
      `,
        { tagName: 'less' },
      ),
    ).rejects.toThrow(
      /There are multiple anonymous less tags that would conflict/,
    );
  });

  it('respects the allowGlobal setting', async () => {
    const [, styles] = await run(
      `
      const styles = less\`
        .bar {
          composes: foo;

          font-weight: bold;
          font-style: italic;
        }
      \`;
    `,
      {
        tagName: 'less',
        allowGlobal: false,
      },
    );

    expect(styles).toHaveLength(0);
  });
});
