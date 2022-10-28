import { css } from 'astroturf/react';
import Highlight, { Prism, defaultProps } from 'prism-react-renderer';

import theme from './theme';

// @ts-ignore
Prism.languages.insertBefore('jsx', 'template-string', {
  'styled-template-string': {
    pattern:
      /(styled(\.\w+|\([^\)]*\))(\.\w+(\([^\)]*\))*)*|css|stylesheet|)`(?:\$\{[^}]+\}|\\\\|\\?[^\\])*?`/,
    lookbehind: true,
    greedy: true,
    inside: {
      interpolation: {
        pattern: /\$\{[^}]+\}/,
        inside: {
          'interpolation-punctuation': {
            pattern: /^\$\{|\}$/,
            alias: 'punctuation',
          },
          rest: Prism.languages.jsx,
        },
      },
      foo: {
        pattern: /[^$;]+/,
        inside: Prism.languages.css,
      },
    },
  },
});

function CodeBlock({ children, ...args }: any) {
  console.log(args);
  return (
    <Highlight {...defaultProps} code={children} language="jsx" theme={theme}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={className}
          style={style}
          css={css`
            composes: p-4 bg-secondary-lighter shadow overflow-x-auto mb-6 -mx-6 from global;

            @media (min-width: theme(screens.md)) {
              border-radius: theme(borderRadius.lg);
            }
          `}
        >
          <code>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  );
}

export default CodeBlock;
