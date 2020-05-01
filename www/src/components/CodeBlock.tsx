import React from 'react';
import { Prism } from '@docpocalypse/prism-react-renderer';
import { CodeBlock as BaseCodBlock } from '@docpocalypse/code-live';
import theme from './theme';
import { css } from 'astroturf/react';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';

// @ts-ignore
Prism.languages.insertBefore('jsx', 'template-string', {
  'styled-template-string': {
    pattern: /(styled(\.\w+|\([^\)]*\))(\.\w+(\([^\)]*\))*)*|css|stylesheet|)`(?:\$\{[^}]+\}|\\\\|\\?[^\\])*?`/,
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
        // alias: 'language-css',
      },
    },
  },
});

const getLanguage = (className = '') => {
  const [, mode]: RegExpMatchArray = className.match(/language-(\w+)/) || [];
  return mode;
};

const toText = (node: React.ReactNode): string => {
  const nodes = React.Children.toArray(node);

  return nodes
    .filter((c) => c !== true && c !== false && c !== null)
    .reduce<string>((str, next) => {
      if (!React.isValidElement(next)) return str + String(next);

      return str + toText(next.props.children);
    }, '');
};

function CodeBlock(props: any) {
  const {
    children,
    originalType: _1,
    metastring: _2,
    mdxType: _3,
    parentName: _4,
    ...codeProps
  } = props.children?.props ?? {};

  // const flatCode = toText(children);
  const language = codeProps.language || getLanguage(codeProps.className);

  return (
    <BaseCodBlock
      {...codeProps}
      theme={theme}
      language={language}
      code={
        props.noFormat
          ? children
          : prettier.format(children, {
              parser: 'babel',
              printWidth: 40,
              plugins: [parserBabel],
            })
      }
      css={css`
        composes: p-4, bg-secondary-lighter, rounded-lg, shadow, overflow-x-auto, mb-6, -mx-6 from global;
      `}
    />
  );
}

export default CodeBlock;
