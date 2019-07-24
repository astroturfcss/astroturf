import styled, { css } from 'astroturf';

export const styles = css`
  .cool {
    content: '';
  }
`;

const Button = styled('button')`
  composes: button-with-caret from global;
`;

export default Button;
