import { CodeBlock as BaseCodBlock } from '@docpocalypse/code-live';
import { Prism } from '@docpocalypse/prism-react-renderer';
import { css } from 'astroturf/react';
import parserBabel from 'prettier/parser-babel';
import prettier from 'prettier/standalone';
import React, { useLayoutEffect, useRef, useState } from 'react';

import theme from '../../theme';

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
        // alias: 'language-css',
      },
    },
  },
});

const getLanguage = (className = '') => {
  const [, mode]: RegExpMatchArray = className.match(/language-(\w+)/) || [];
  return mode;
};

let charWidth: number | undefined;

function CodeBlock(props: any) {
  const ref = useRef<HTMLDivElement>(null);
  const {
    children,
    originalType: _1,
    metastring: _2,
    mdxType: _3,
    parentName: _4,
    noFormat,
    printWidth: defaultPrintWidth,
    ...codeProps
  } = props.children?.props ?? {};

  const [printWidth, setPrintWidth] = useState<number>(defaultPrintWidth);

  // const flatCode = toText(children);
  const language = codeProps.language || getLanguage(codeProps.className);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    const pre = ref.current!.firstElementChild!;
    const style = getComputedStyle(pre);

    if (charWidth == null) {
      const measure = document.createElement('div');

      measure.innerText = '0';
      measure.style.font = style.font;
      measure.style.opacity = '0';
      measure.style.position = 'absolute';
      document.body.appendChild(measure);
      charWidth = measure.getBoundingClientRect().width;
      document.body.removeChild(measure);
    }
    // console.log(div, charWidth);
    let width =
      pre.getBoundingClientRect().width -
      (parseFloat(style.paddingLeft) + parseFloat(style.paddingRight));

    width = Math.floor(width / charWidth);
    if (width !== printWidth) setPrintWidth(width);
  });

  const isJs = ['js', 'ts', 'tsx', 'jsx'].includes(language);

  return (
    <div ref={ref}>
      <BaseCodBlock
        {...codeProps}
        theme={theme}
        language={language}
        code={
          noFormat || printWidth == null || !isJs
            ? children
            : prettier.format(children, {
                parser: 'babel',
                printWidth,
                plugins: [parserBabel],
              })
        }
        css={css`
          composes: p-4 bg-secondary-lighter shadow overflow-x-auto mb-6 -mx-6 from global;

          @media (min-width: theme(screens.md)) {
            border-radius: theme(borderRadius.lg);
          }
        `}
      />
    </div>
  );
}

export default CodeBlock;
