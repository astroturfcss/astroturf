import { css } from 'astroturf';
import React from 'react';

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

interface PropsType {
  children: JSX.Element;
  name: string;
}

function fooGood<T extends { x: number }>(obj: T): T {
  console.log(Math.abs(obj.x));
  return obj;
}

class Component extends React.Component<PropsType, {}> {
  render() {
    return <h2>{this.props.children}</h2>;
  }
}

// OK
