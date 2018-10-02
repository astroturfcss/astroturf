import styled from 'astroturf';

const Foo = () => {};
const bar = 'Bar';
Foo[bar]['baz'] = styled('div')`
  color: red;
`;

export default styled(FancyBox)`
  color: ultra-red;
`;
