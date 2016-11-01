
const SIZE = 75;

const styles = css`
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

export default function Component() {
  const name = styles.foo;

  return <div className={name} width={SIZE}/>;
}
