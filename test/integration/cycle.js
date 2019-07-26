import styled from 'astroturf';

import Foo from './cycle-2';

const Bar = styled('button')`
  & > ${Foo} {
    test: foo;
  }
`;

export default Bar;
