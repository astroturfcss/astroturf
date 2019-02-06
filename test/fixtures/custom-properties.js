import styled from 'astroturf';

const FancyDiv = styled('div')`
  color: ${props => (props.primary ? 'palevioletred' : 'red')};
  width: 75px;
`;

const FancyP = styled('p')`
  color: red;
  width: ${props => (props.primary ? 75 : 50)}px;
`;
