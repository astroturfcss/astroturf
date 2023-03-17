import { format, run, testAllRunners } from './helpers';

describe('css tag', () => {
  testAllRunners(
    'should inject imports in the right order',
    async (runner, { requirePath }) => {
      const [code] = await runner(`
      import { css } from 'astroturf';
      import Component from './Foo';

      const styles = css\`
        color: blue;
      \`;
      const styles2 = css\`
        color: blue;
      \`;
    `);

      expect(code).toEqual(
        format`
        import Component from './Foo';
        import _styles from "${requirePath('styles')}"
        import _styles2 from "${requirePath('styles2')}"
        const styles = _styles.cls2;
        const styles2 = _styles2.cls2;
      `,
      );
    },
  );

  testAllRunners('should allow disabling', async (runner) => {
    const [, styles] = await runner(
      `
        import { css } from 'astroturf';

        const styles = css\`
          .foo {
            color: red;
          }
        \`;
      `,
      {
        cssTagName: false,
        stylesheetTagName: 'css',
      },
    );

    expect(styles).toHaveLength(1);
    expect(styles[0].type).toEqual('stylesheet');
  });

  it('should remove css imports', async () => {
    const [code] = await run(`
      import { css } from 'astroturf';

      const styles = css\`
        color: blue;
      \`;
    `);

    expect(code).toEqual(
      format`
        import _styles from "./MyStyleFile-styles.module.css"
        const styles = _styles.cls2;
      `,
    );
  });

  testAllRunners('should remove just the css import', async (runner, h) => {
    const [code] = await runner(`
      import styled, { css } from 'astroturf/react';

      const styles = css\`
        color: blue;
      \`;
    `);

    expect(code).toEqual(
      format`
          import styled from 'astroturf/react';
          import _styles from "${h.requirePath('styles')}"
          const styles = _styles.cls2;
        `,
    );
  });

  testAllRunners('allows different tag names', async (runner) => {
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
        import { css as less } from 'astroturf';

        less\`a
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

  testAllRunners(
    'should use object properties as identifiers',
    async (runner) => {
      const [, styles] = await runner(
        `
      import { css } from 'astroturf';
      
      const styles = {
        blue: css\`
          color: blue
        \`,

        red: css\`
          color: red;
        \`,
      }
    `,
        { cssTagName: 'css' },
      );

      expect(styles[0].identifier).toEqual('blue');
      expect(styles[1].identifier).toEqual('red');
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
        cssTagName: 'less',
        allowGlobal: false,
      },
    );

    expect(styles).toHaveLength(0);
  });

  testAllRunners('handles non-simple interpolations', async () => {
    const [, styles] = await run(
      `
      import { css } from 'astroturf';

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
