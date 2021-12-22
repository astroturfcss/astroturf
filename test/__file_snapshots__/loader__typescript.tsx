/** @jsxRuntime classic*/
/** @jsx _j */
/** @jsxFrag _j.F */
import _j from "astroturf/jsx";
import styled from "astroturf/react";
import React from "react";
import _styles from "typescript-styles.module.css!=!astroturf/inline-loader?style=1!/fixtures/typescript.tsx?styles";
import _Button from "typescript-Button.module.css!=!astroturf/inline-loader?style=1!/fixtures/typescript.tsx?Button";
import _CssProp1_Button from "typescript-CssProp1_Button.module.css!=!astroturf/inline-loader?style=1!/fixtures/typescript.tsx?CssProp1_Button";
import _CssProp2_Button from "typescript-CssProp2_Button.module.css!=!astroturf/inline-loader?style=1!/fixtures/typescript.tsx?CssProp2_Button";
const SIZE = 75;
const styles = _styles;
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
  styles: _Button,
});
class Component extends React.Component<PropsType> {
  render() {
    return (
      <>
        <h2>{this.props.children}</h2>
        <Button variant="primary" css={[_CssProp1_Button]}>
          click
        </Button>
        <Button variant="secondary" css={[_CssProp2_Button]}>
          cancel
        </Button>
      </>
    );
  }
}