import styled, { stylesheet } from 'astroturf';

export const styles = stylesheet`
  .cool {
    content: '';
  }
`;

const Button = styled('button')`
  composes: button-with-caret from global;
`;

export default Button;
