// eslint-disable-next-line import/no-unresolved
import styled, { css } from 'astroturf';
import React from 'react';

const width = 75;

const styles = css`
  .parent {
    color: red;
  }
`;

const FancyBox = styled('div')`
  composes: foo from global;

  color: red;
  width: ${width}px;

  &.primary {
    background: white;
    color: palevioletred;
  }
`;

const FancierBox = styled('div')`
  color: ultra-red;

  > ${FancyBox} {
    padding: 4em;
  }

  ${styles.parent} > & {
    margin: 2em;
  }
`;

export const Button = styled('button')`
  composes: button-with-caret from global;
`;

export function MyComponent() {
  return (
    <>
      <div
        foo
        css={`
          color: red;

          &.foo {
            color: blue;
          }
        `}
      >
        <div>hey </div>
        <span
          css={`
            color: blue;
          `}
        >
          yo
        </span>
      </div>
    </>
  );
}

export default FancierBox;
