import { mount } from 'enzyme';

import { jsx } from '../src/index';
import { run } from './helpers';

describe('custom properties', () => {
  it('should allow Styled dynamic interpolations', async () => {
    const [code, [style]] = await run(
      `
        import styled from 'astroturf';

        const Button = styled.button\`
          color: \${p => p.color};
        \`
      `,
      { customCssProperties: true },
    );

    const i = style.interpolations[0];

    expect(code).toContain(`vars: [["${i.id}", p => p.color]]`);
  });

  it('should allow css prop dynamic interpolations ', async () => {
    const [code, [style]] = await run(
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

    expect(code).toContain(`css={[_default, [["${i.id}", color]]]}`);
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
