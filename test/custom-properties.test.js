import { mount } from 'enzyme';

import { jsx } from '../src/index';
import { run, testAllRunners } from './helpers';

describe('custom properties', () => {
  testAllRunners(
    'should allow Styled dynamic interpolations',
    async (runner) => {
      const [code, [style]] = await runner(
        `
        import styled from 'astroturf';

        const Button = styled.button\`
          color: \${p => p.color};
        \`
      `,
        { customCssProperties: true },
      );

      const i = style.interpolations[0];

      expect(code).toContain(`vars: [["${i.id}", (p) => p.color]]`);
    },
  );

  testAllRunners(
    'should allow css prop dynamic interpolations',
    async (runner) => {
      const [code, [style]] = await runner(
        `
      import { css } from 'astroturf';

      function Button({ color }) {
        return (
          <button
            css={\`
              color: \${color};
            \`}
          />
        );
      }
      `,
        { enableCssProp: true, customCssProperties: 'cssProp' },
      );

      const i = style.interpolations[0];

      expect(code).toContain(
        `css={[require("./MyStyleFile-CssProp1_button.css"), [["${i.id}", color]]]}`,
      );
    },
  );

  testAllRunners('should handle units correctly', async (runner) => {
    const [code, [style]] = await runner(
      `
      import { css } from 'astroturf';

      function Button({ duration }) {
        return (
          <button
            css={\`
              transition: \${duration}ms;
            \`}
          />
        );
      }
      `,
      { enableCssProp: true },
    );

    const i = style.interpolations[0];

    expect(code).toContain(
      `css={[
        require("./MyStyleFile-CssProp1_button.css"),
        [["${i.id}", duration, "ms"]],
      ]}`,
    );
  });

  it('should disallow when configured off', async () => {
    await expect(
      run(
        `
      import styled, { css } from 'astroturf';

      const ButtonA = styled.button\`
        color: \${p => p.color};
      \`

      function ButtonB({ color }) {
        return (
          <button
            css={\`
              color: \${color};
            \`}
          />
        );
      }
      `,
        { enableCssProp: true, customCssProperties: false },
      ),
    ).rejects.toThrow(/Could not resolve interpolation to a value/);
  });

  it('should disallow Styled usage when configured off', async () => {
    await expect(
      run(
        `
      import styled, { css } from 'astroturf';

      const ButtonA = styled.button\`
        color: \${p => p.color};
      \`
      `,
        { enableCssProp: true, customCssProperties: 'cssProp' },
      ),
    ).rejects.toThrow(/Could not resolve interpolation to a value/);
  });

  it('should apply styles', () => {
    const wrapper = mount(
      jsx('div', {
        green: true,
        css: [
          {
            cls1: 'cls1',
            green: 'green',
          },
          [['aszd', 'blue']],
        ],
      }),
    );
    expect(wrapper.find('div.green')).toHaveLength(1);
    expect(wrapper.prop('style')).toEqual({
      '--aszd': 'blue',
    });
  });
});
