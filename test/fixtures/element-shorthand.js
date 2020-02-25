import styled from 'astroturf/react';

const SIZE = 75;

const FancyBox = styled.div`
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
