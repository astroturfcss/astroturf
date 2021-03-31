import styled from 'astroturf/react'; // eslint-disable-line import/no-extraneous-dependencies

import Button from './Button';

/**
 * This component demonstrates that the `border-radius` css property takes
 * precedence over the underlying `<Button/>` css property.
 */
export default styled(Button)`
  border-radius: 12px;
`;
