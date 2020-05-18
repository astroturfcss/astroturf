import styled, { stylesheet } from 'astroturf/react';

export const styles = stylesheet`
  .cool {
    border: 1px solid red;
  }
`;

const Button = styled('button')`
  composes: button-with-caret from global;
`;

export default Button;
