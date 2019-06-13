import styled from 'astroturf';

const FancyBox = styled('div')`
  color: red;
  width: 75px;

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
