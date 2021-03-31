import styled from 'astroturf/react';

import Foo from './cycle-2';

const Bar = styled('button')`
  & > ${Foo} {
    test: foo;
  }
`;

export default Bar;
