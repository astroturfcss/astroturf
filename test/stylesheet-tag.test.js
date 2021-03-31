import { format, run, testAllRunners } from './helpers';

describe('css tag', () => {
  testAllRunners(
    'should inject imports in the right order',
    async (runner, { requirePath }) => {
      const [code] = await runner(`
      import { stylesheet } from 'astroturf';
      import Component from './Foo';

      const styles = stylesheet\`
        .blue {
          color: blue;
        }
      \`;
      const styles2 = stylesheet\`
        .blue {
          color: blue;
        }
      \`;
    `);

      expect(code).toEqual(
        format`
        import Component from './Foo';
        import _styles from "${requirePath('styles')}"
        import _styles2 from "${requirePath('styles2')}"
        const styles = _styles;
        const styles2 = _styles2;
      `,
      );
    },
  );

  it('should remove stylesheet imports', async () => {
    const [code] = await run(`
      import { stylesheet } from 'astroturf';

      const styles = stylesheet\`
        .blue {
          color: blue;
        }
      \`;
    `);

    expect(code).toEqual(
      format`
        import _styles from "./MyStyleFile-styles.module.css"
        const styles = _styles;
      `,
    );
  });

  testAllRunners(
    'should remove just the stylesheet import',
    async (runner, h) => {
      const [code] = await runner(`
      import styled, { stylesheet } from 'astroturf/react';

      const styles = stylesheet\`
        .blue {
          color: blue;
        }
      \`;
    `);

      expect(code).toEqual(
        format`
        import styled from 'astroturf/react';
        import _styles from "${h.requirePath('styles')}"
        const styles = _styles;
      `,
      );
    },
  );

  testAllRunners('allows different tag names', async (runner) => {
    const [, styles] = await runner(
      `
      import { stylesheet as less } from 'astroturf';

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
        cssTagName: 'less',
        extension: '.less',
      },
    );

    expect(styles).toHaveLength(1);
    expect(styles[0].absoluteFilePath.endsWith('.less')).toBe(true);
  });

  testAllRunners(
    'should throw when there are ambigious identifiers',
    async (runner) => {
      await expect(
        runner(
          `
        import { stylesheet as less } from 'astroturf';

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
          { cssTagName: 'less' },
        ),
      ).rejects.toThrow(
        /There are multiple anonymous less tags that would conflict/,
      );
    },
  );

  testAllRunners('respects the allowGlobal setting', async (runner) => {
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
        stylesheetTagName: 'less',
        allowGlobal: false,
      },
    );

    expect(styles).toHaveLength(0);
  });

  testAllRunners('handles non-simple interpolations', async () => {
    const [, styles] = await run(
      `
      import { stylesheet } from 'astroturf';

      const duration = 1000
      const durationMs = \`$\{duration + 500}ms\`;

      const styles = stylesheet\`
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
