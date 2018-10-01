import styled from 'astroturf';

const SIZE = 75;

// prettier-ignore
const FancyBox = styled('div')`
  color: red;
  width: ${SIZE}px;

  @media (min-width: 420px) {
    width: 96px;
    height: 96px;
  }

  &.primary {
    background: white;
    color: palevioletred;
  }
`;

const FancierBox = styled(FancyBox)`
  color: ultra-red;
`;
