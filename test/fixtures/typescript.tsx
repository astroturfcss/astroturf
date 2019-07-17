import styled, { css } from 'astroturf';
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

function someMath<T extends { x: number }>(obj: T): T {
  console.log(Math.abs(obj.x));
  return obj as T;
}

const Button = styled('button')<{ variant: 'primary' | 'secondary' }>`
  color: red;

  &.variant-primary {
    background: white;
  }

  &.variant-secondary {
    background: black;
  }
`;

class Component extends React.Component<PropsType> {
  render() {
    return (
      <>
        <h2>{this.props.children}</h2>
        <Button
          variant="primary"
          css={css`
            color: red !important;
          `}
        >
          click
        </Button>
        <Button
          variant="secondary"
          css={`
            color: red !important;
          `}
        >
          cancel
        </Button>
      </>
    );
  }
}
