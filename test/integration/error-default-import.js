import { css } from 'astroturf';

import MyButton from './Button';

export const styles = css`
  .parent {
    color: red;
  }

  .test > ${MyButton}, .test {
    holla: yo;
  }
`;
