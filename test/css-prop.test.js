import { mount } from 'enzyme';
import { jsx } from '../src/index';
import { run, runLoader } from './helpers';

describe('css prop', () => {
  it('should compile string', async () => {
    const [, styles] = await run(
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

  it('should compile template literal', async () => {
    const [, [style]] = await run(
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

  it('should compile css tag', async () => {
    const [, [style]] = await run(
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

  it('should warn when not enabled', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const [, styles] = await run(
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

  it('should only compile with appropriate css import', async () => {
    const [, styles] = await run(
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
  });

  describe('loader', () => {
    it('should compile string', async () => {
      const [, [style]] = await runLoader(
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

      expect(style.identifier).toEqual('CssProp1_button');
    });

    it('should compile template literal', async () => {
      const [, [style]] = await runLoader(
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

    it('should compile css tag', async () => {
      const [, [style]] = await runLoader(
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

    it('should only compile with appropriate css import', async () => {
      const [, styles] = await runLoader(
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
    });
  });

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
