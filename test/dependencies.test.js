import { run } from './helpers';

describe('custom properties', () => {
  it('should resolve', async () => {
    const [, styles] = await run(
      `
      import styled, { css } from 'astroturf';

      const base = css\`
        font-weight: bold
      \`

      const parent = css\`
        & > \${base} {
          font-weight: inherit
        }
      \`
    `,
    );

    expect(styles).toHaveLength(2);
    expect(styles[1].value).toContain(
      '@value cls1 as a0 from "MyStyleFile-base.css";',
    );
    expect(styles[1].value).toContain('& > .a0');
  });

  it('should use m-css external', async () => {
    const [, styles] = await run(
      `
      import styled, { css } from 'astroturf';

      const base = css\`
        font-weight: bold
      \`

      const parent = css\`
        & > \${base} {
          font-weight: inherit
        }
      \`
    `,
      {
        experiments: {
          modularCssExternals: true,
        },
      },
    );

    expect(styles).toHaveLength(2);
    expect(styles[1].value).toContain(
      '& > :external(cls1 from "MyStyleFile-base.css")',
    );
  });
});
