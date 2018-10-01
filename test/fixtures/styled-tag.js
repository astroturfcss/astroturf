import s from 'css-literal-loader/styled';

// prettier-ignore
const FancyBox = s('div')`
  color: red;
  width: 75px;
  &.primary {
    background: white;
    color: palevioletred;
  }
`;

const FancierBox = s(FancyBox)`
  color: ultra-red;
`;
