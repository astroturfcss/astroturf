import { styled } from 'astroturf';
import withProps from 'recompose/withProps';

const RedPasswordInput = withProps({
  type: 'password',
})(styled('input')`
  background-color: red;
`);
