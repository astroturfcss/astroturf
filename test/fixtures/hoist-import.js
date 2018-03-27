import { styled } from 'css-literal-loader/styled';

const ButtonBase = styled('button')`
  @import '~./styles/mixins.scss';

  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
`;
