import { MDXProvider } from '@mdx-js/react';
import styled, { css } from 'astroturf/react';
import React, { useState } from 'react';

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

const NavItem = styled('a')`
  composes: my-2, inline-block, font-brand, text-xl, text-white, text-shadow-sm, relative from global;

  &::before {
    @apply bg-primary absolute;

    content: '';
    z-index: -1;
    opacity: 0;
    transform: skew(-6deg, -3deg);

    pointer-events: none;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  &:hover::before {
    opacity: 1;
  }
`;

function Layout(props: Props) {
  const [expanded, setExpanded] = useState(true);

  return (
    <MDXProvider
      components={{
        // Or define component inline
        pre: CodeBlock,
        inlineCode: InlineCode,
        Brand,
      }}
    >
      <div
        css={css`
          @apply py-3 px-6 sticky top-0;

          @media (max-width: theme(screens.md)) {
            @apply bg-secondary border-b border-secondary-darker flex  justify-between;
          }
        `}
      >
        <div className="relative inline-block mr-12">
          <div className="absolute top-0 right-0 left-0 bottom-0 transform bg-primary skew-x-12 skew-y-3" />
          <span className="inline-block font-brand text-white text-2xl relative px-2">
            astroturf
          </span>
        </div>

        <button
          type="button"
          className="focus:shadow-outline md:hidden"
          onClick={() => setExpanded((t) => !t)}
        >
          <div className="bg-white my-1" css="height: 2px; width: 1.5rem" />
          <div className="bg-white my-1" css="height: 2px; width: 1.5rem" />
          <div className="bg-white my-1" css="height: 2px; width: 1.5rem" />
        </button>
      </div>
      <nav
        css={css`
          @apply py-3 px-6;

          top: 61px;
          position: fixed;
          display: inline-flex;
          align-items: flex-start;
          flex-direction: column;

          @media (max-width: theme(screens.md)) {
            display: none;

            width: 100%;
            box-shadow: theme(boxShadow.default);
            background-color: theme(colors.secondary-darker);
            max-height: calc(100% - 61px);
            overflow-y: auto;
          }

          ${expanded &&
          css`
            @media (max-width: theme(screens.md)) {
              display: flex;
              align-items: center;
            }
          `}
        `}
      >
        <NavItem href="/getting-started">Getting Started</NavItem>
        <NavItem href="/configuration">Configuration</NavItem>
        <NavItem href="/migration">Migrating to v1</NavItem>
        <NavItem href="/tooling">Tooling</NavItem>
      </nav>
      <main
        css={css`
          margin: 0 auto;
          max-width: theme('screens.sm');
          padding: theme('padding.6');
        `}
      >
        {props.children}
      </main>
    </MDXProvider>
  );
}

export default Layout;
