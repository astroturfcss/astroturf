import styled  from 'astroturf/react';

const RedPasswordInput = styled('input').attrs({ type: 'password' })`
  background-color: red;
`;

const RedPasswordInput2 = styled('input').attrs(p => ({
  type: 'password',
}))`
  background-color: red;
`;
