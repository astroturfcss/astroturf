// eslint-disable-next-line import/no-unresolved
import styled, { css } from 'astroturf';

const width = 75;

const styles = css`
  .parent {
    color: red;
  }
`;

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

  ${styles.parent} > & {
    margin: 2em;
  }
`;

export default FancierBox;
