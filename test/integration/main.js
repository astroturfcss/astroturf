import styled, { css, stylesheet } from 'astroturf';
import React from 'react';
import Widget from 'widget';

import Button, { styles as btnStyles } from './Button';
import * as Buttons from './Button';

const width = 75;

const styles = stylesheet`
  .parent {
    color: red;
  }

  .test > ${btnStyles.cool}, .test > ${Widget} {
    holla: yo;
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

  /* these are the same selector */
  & > ${Button} {
    margin-left: 4px;
  }
  & > ${Buttons.Button} {
    margin-left: 8px;
  }
`;

export function MyComponent() {
  return (
    <>
      <div
        foo
        css={css`
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
