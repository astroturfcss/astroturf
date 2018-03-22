import { styled } from 'css-literal-loader/styled';

const SIZE = 75;

// prettier-ignore
const Div = styled('div')`
  composes:
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

export default function Component() {
  const name = styles.foo;

  return <div className={name} width={SIZE} />;
}
