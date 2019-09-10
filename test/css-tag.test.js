import { format, run, testAllRunners } from './helpers';

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
      format`
        const styles = require("./MyStyleFile-styles.css");
      `,
    );
  });

  testAllRunners('should remove just the css import', async runner => {
    const [code] = await runner(`
      import styled, { css } from 'astroturf';

      const styles = css\`
        .blue {
          color: blue;
        }
      \`;
    `);

    expect(code).toEqual(
      format`
        import styled from 'astroturf';

        const styles = require("./MyStyleFile-styles.css");
      `,
    );
  });

  testAllRunners('allows different tag names', async runner => {
    const [, styles] = await runner(
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

  testAllRunners(
    'should throw when there are ambigious identifiers',
    async runner => {
      await expect(
        runner(
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
    },
  );

  testAllRunners('respects the allowGlobal setting', async runner => {
    const [, styles] = await runner(
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

  testAllRunners('handles non-simple interpolations', async () => {
    const [, styles] = await run(
      `
      const duration = 1000
      const durationMs = \`$\{duration + 500}ms\`;

      const styles = css\`
        .bar {
          transition: all $\{durationMs};
        }
      \`;
    `,
    );

    expect(styles).toHaveLength(1);
    expect(styles[0].value).toMatch('1500ms');
  });
});
