import styled, { css } from 'astroturf/react';

const base = css`
  padding: 4rem;
`;

const other = css`
  & ${base} {
    margin: 4rem;
  }
`;

const FancyBox = styled('div')`
  composes: global from global;
  composes: ${other} ${other} ${base};

  color: red;
  width: 75px;

  &${base} {
    padding: 5rem;
  }

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
`;

const Button = styled(Button)`
  composes: button-with-caret from global;
`;
