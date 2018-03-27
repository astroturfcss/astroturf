import { css as less } from 'css-literal-loader/styled';

const SIZE = 75;

const styles = less`
  .foo {
    color: red;
    width: ${SIZE}px;
  }

  .bar {
    composes: foo;

    font-weight: bold;
    font-style: italic;
  }
`;
