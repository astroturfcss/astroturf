import Link from '@docusaurus/Link';
// import { MDXProvider } from '@mdx-js/react';
import styled, { css } from 'astroturf/react';
import React, { useState } from 'react';

// import CodeBlock from '../components/CodeBlock';
import MDXContent from './MDXContext';

interface Props {
  children?: React.ReactNode;
}

const NavItem = styled(Link)`
  composes: my-2 inline-block font-brand text-xl text-white text-shadow-sm relative from global;

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

  &:hover {
    text-decoration: none;
  }
  &:hover::before {
    opacity: 1;
  }
`;

function Layout(props: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div
        className="py-3 px-6 sticky top-0 bg-secondary shadow-sm border-b border-secondary-darker flex justify-between"
        css={css`
          @apply py-3 px-6 sticky top-0;

          @media (max-width: theme(screens.md)) {
            @apply;
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
          className="focus:shadow-outline lg:hidden"
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

          @media (max-width: theme(screens.lg)) {
            display: none;

            width: 100%;
            box-shadow: theme(boxShadow.default);
            background-color: theme(colors.secondary-darker);
            max-height: calc(100% - 61px);
            overflow-y: auto;
          }

          ${expanded &&
          css`
            @media (max-width: theme(screens.lg)) {
              display: flex;
              align-items: center;
            }
          `}
        `}
      >
        <NavItem to="/introduction">Introduction</NavItem>
        <NavItem to="/setup">Setup</NavItem>
        <NavItem to="/advanced">Advanced features</NavItem>
        {/* <NavItem to="/migration">Migrating to v1</NavItem> */}
        <NavItem to="/tooling">Tooling</NavItem>
      </nav>
      <main
        css={css`
          margin: 0 auto;
          max-width: theme('screens.sm');
          padding: theme('padding.6');
        `}
      >
        <MDXContent>{props.children}</MDXContent>
      </main>
    </>
  );
}

export default Layout;
