import React from 'react';
import styled, { css } from 'astroturf/react';

import { MDXProvider } from '@mdx-js/react';
import CodeBlock from './CodeBlock';

const InlineCode = styled('code')`
  @apply text-primary bg-secondary-darker bg-opacity-75 rounded px-1;
`;

interface Props {
  children?: React.ReactNode;
}

const Brand = styled('span')`
  font-family: theme('fontFamily.brand');
`;

function Layout(props: Props) {
  return (
    <MDXProvider
      components={{
        // Or define component inline
        pre: CodeBlock,
        inlineCode: InlineCode,
        Brand: Brand,
      }}
    >
      <nav className="h-12 py-3 px-8 sticky top-0">
        <div className="relative inline-block mr-12">
          <div className="absolute top-0 right-0 left-0 bottom-0 transform bg-primary skew-x-12 skew-y-3" />
          <span className="inline-block font-brand text-white text-2xl relative px-2">
            astroturf
          </span>
        </div>
      </nav>
      <main className="max-w-md mx-auto">{props.children}</main>
    </MDXProvider>
  );
}

export default Layout;
