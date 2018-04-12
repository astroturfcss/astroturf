import { styled } from 'css-literal-loader/styled';
import withProps from 'recompose/withProps';

const RedPasswordInput = withProps({
  type: 'password',
})(styled('input')`
  background-color: red;
`);
