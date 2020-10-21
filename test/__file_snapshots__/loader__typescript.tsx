/* @jsxRuntime classic */
/* @jsx _j */
/* @jsxFrag _f */

const { jsx: _j, F: _f } = require("astroturf");
import styled from "astroturf";
import React from "react";

const SIZE = 75;

const styles = require("./typescript-styles.css");

interface PropsType {
  children: JSX.Element;
  name: string;
}

function someMath<T extends { x: number }>(obj: T): T {
  console.log(Math.abs(obj.x));
  return obj as T;
}

const Button = /*#__PURE__*/ styled("button", null, {
  displayName: "Button",
  styles: require("./typescript-Button.css"),
  attrs: null,
  vars: [],
});

class Component extends React.Component<PropsType> {
  render() {
    return (
      <>
        <h2>{this.props.children}</h2>
        <Button
          variant="primary"
          css={[require("./typescript-CssProp1_Button.css"), []]}
        >
          click
        </Button>
        <Button
          variant="secondary"
          css={[require("./typescript-CssProp2_Button.css"), []]}
        >
          cancel
        </Button>
      </>
    );
  }
}
