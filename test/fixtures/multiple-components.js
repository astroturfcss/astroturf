import { styled, css } from 'css-literal-loader/styled';

const SIZE = 75;

// prettier-ignore
const FancyBox = styled('div')`
  color: red;
  width: ${SIZE}px;

  @media (min-width: 420px) {
		width: 96px;
		height: 96px;
	}

  ${props => props.primary && css`
    background: white;
    color: palevioletred;
  `}
`;

const FancyHeader = styled('h2')`
  color: red;
  width: ${SIZE}px;

  ${props =>
    props.primary &&
    css`
      background: white;
      color: palevioletred;
    `};
`;
