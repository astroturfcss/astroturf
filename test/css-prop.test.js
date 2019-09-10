import { mount } from 'enzyme';

import { jsx } from '../src/index';
import { testAllRunners } from './helpers';

describe('css prop', () => {
  testAllRunners('should compile string', async runner => {
    const [, styles] = await runner(
      `
      import { css } from 'astroturf';

      function Button() {
        return (
          <button
            css="color:blue"
          />
        );
      }
    `,
      { enableCssProp: true },
    );

    expect(styles[0].identifier).toEqual('CssProp1_button');
  });

  testAllRunners('should compile template literal', async runner => {
    const [, [style]] = await runner(
      `
      import { css } from 'astroturf';

      function Button() {
        return (
          <button
            css={\`
              color: blue;
            \`}
          />
        );
      }
    `,
      { enableCssProp: true },
    );

    expect(style.identifier).toEqual('CssProp1_button');
  });

  testAllRunners('should compile css tag', async runner => {
    const [, [style]] = await runner(
      `
      import { css } from 'astroturf';

      function Button() {
        return (
          <button
            css={css\`
              color: blue;
            \`}
          />
        );
      }
    `,
      { enableCssProp: true },
    );

    expect(style.identifier).toEqual('CssProp1_button');
  });

  testAllRunners.only('should interpolate static cars', async runner => {
    const [, [style]] = await runner(
      `
      import { css } from 'astroturf';

      const duration = 1000

      function Button() {
        return (
          <button
            css={css\`
              transition: all $\{duration + 500}ms;
            \`}
          />
        );
      }
    `,
      { enableCssProp: true },
    );

    expect(style.value).toMatch('1500ms');
  });

  testAllRunners('should warn when not enabled', async runner => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const [, styles] = await runner(
      `
      import { css } from 'astroturf';

      function Button() {
        return (
          <button
            css={css\`
              color: blue;
            \`}
          />
        );
      }
    `,
      { enableCssProp: false },
    );

    expect(styles).toHaveLength(1);
    expect(spy).toHaveBeenCalledWith(
      expect.stringMatching(
        'It looks like you are trying to use the css prop',
      ),
    );
    spy.mockRestore();
  });

  testAllRunners(
    'should only compile with appropriate css import',
    async runner => {
      const [, styles] = await runner(
        `
        function Button() {
          return (
            <button
              css={css\`
                color: blue;
              \`}
            />
          );
        }
      `,
        { allowGlobal: false, enableCssProp: true },
      );

      expect(styles).toHaveLength(0);
    },
  );

  it('should render the component correctly', () => {
    expect(
      mount(
        jsx('div', {
          green: true,
          big: undefined,
          dangerous: null,
          size: 'sm',
          theme: 'primary',
          foo: 1,
          css: {
            cls1: 'cls1',
            green: 'green',
            big: 'big',
            dangerous: 'dangerous',
            themePrimary: 'primary',
            'size-sm': 'small',
            'foo-1': 'foo',
          },
        }),
      ).find('div.green.primary.small.foo'),
    ).toHaveLength(1);
  });
});
