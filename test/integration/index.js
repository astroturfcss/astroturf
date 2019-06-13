// eslint-disable-next-line import/no-unresolved
import styled from 'astroturf';

const width = 75;

const FancyBox = styled('div')`
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
`;

export default FancierBox;
