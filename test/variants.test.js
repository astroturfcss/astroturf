import { mount } from 'enzyme';
import React from 'react';

import { jsx } from '../src/runtime/jsx';
import { testAllRunners } from './helpers';

describe('variants', () => {
  testAllRunners(
    'should allow css prop dynamic interpolations ',
    async (runner) => {
      const [code, styles] = await runner(
        `
      import { css } from 'astroturf';

      function Button({ color, primary }) {
        return (
          <button
            css={\`
              color: red;

              \${primary && css\`
                  color: blue;
              \`}
            \`}
          />
        );
      }
      `,
        { enableCssProp: true, enableDynamicInterpolations: 'cssProp' },
      );

      expect(styles).toHaveLength(1);

      expect(code).toContain(
        `
      css={[
        _CssProp1_button,
        null,
        [primary && _CssProp1_button["cssProp1ButtonVariant0"]],
      ]}`,
      );
    },
  );

  testAllRunners(
    'should allow multiple classes per variant',
    async (runner) => {
      const [code, styles] = await runner(
        `
      import { css } from 'astroturf';

      function Button({ color, primary }) {
        return (
          <button
            css={\`
              color: \${color};

              \${primary ? css\`
                  color: blue;
              \`: css\`
                  color: red;
              \`}
            \`}
          />
        );
      }
      `,
        { enableCssProp: true, enableDynamicInterpolations: 'cssProp' },
      );

      expect(styles).toHaveLength(1);
      const i = styles[0].interpolations[0];

      expect(code).toContain(
        `
      css={[
        _CssProp1_button,
        [["${i.id}", color]],
        [
          primary
            ? _CssProp1_button["cssProp1ButtonVariant1"]
            : _CssProp1_button["cssProp1ButtonVariant2"],
        ],
      ]}`,
      );
    },
  );

  testAllRunners('should handle nested iterpolations', async (runner) => {
    const [code, styles] = await runner(
      `
      import { css } from 'astroturf';

      const child = css\`
        color: red;
      \`

      function Button({ color, primary, height }) {
        return (
          <button
            css={\`
              color: \${color};

              \${primary && css\`
                height: \${height}

                & > \${child} {
                  color: blue;
                }
              \`}
            \`}
          />
        );
      }
      `,
      { enableCssProp: true, enableDynamicInterpolations: 'cssProp' },
    );

    expect(styles).toHaveLength(2);
    const i = styles[1].interpolations[0];
    const i2 = styles[1].interpolations[1];

    expect(code).toContain(
      `
      css={[
        _CssProp1_button,
        [
          ["${i.id}", color],
          ["${i2.id}", height],
        ],
        [primary && _CssProp1_button["cssProp1ButtonVariant1"]],
      ]}`,
    );
  });

  it('should apply styles', () => {
    function Wrapper({ primary }) {
      return jsx('div', {
        css: [{ cls1: 'cls1' }, null, [primary && 'variant1']],
      });
    }

    const wrapper = mount(<Wrapper primary />);

    expect(wrapper.find('div.cls1.variant1')).toHaveLength(1);

    wrapper.setProps({ primary: false });

    expect(wrapper.find('.variant1')).toHaveLength(0);
  });
});
