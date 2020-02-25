import styled from 'astroturf/react';

import Bar from './cycle';

const Foo = styled('button')`
  & > ${Bar} {
    test: other;
  }
`;

export default Foo;
