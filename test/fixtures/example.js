
const SIZE = 75;

let styles = css`
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

let styles2 = css`
  .foo {
    color: red;
    width: ${SIZE}px;
  }
`;

export default function Component() {
  let name = styles.foo;

  return <div className={name} width={SIZE}/>
}
