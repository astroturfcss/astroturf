import styled from 'astroturf/react';

const Doodad = styled('div')`
  $foo: red;

  height: 20px;
  width: 30px;
  background-color: $foo;
`;

export default Doodad;
