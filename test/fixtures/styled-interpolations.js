import styled, { css } from 'astroturf';

const base = css`
  .item {
    padding: 4rem;
  }
`;

const other = css`
  .other ${base.item} {
    margin: 4rem;
  }
`;

const FancyBox = styled('div')`
  composes: global from global;
  composes: ${other.other} ${other.other} ${base.item};

  color: red;
  width: 75px;

  &${base.item} {
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
