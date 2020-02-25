/** @jsx _j **/
/** @jsxFrag _f **/
import { jsx as _j, F as _f } from "astroturf";
import styled from "astroturf";
import React from "react";
import _styles from "astroturf/css-loader?inline!./typescript-styles.css";
import _Button from "astroturf/css-loader?inline!./typescript-Button.css";
import _CssProp1_Button from "astroturf/css-loader?inline!./typescript-CssProp1_Button.css";
import _CssProp2_Button from "astroturf/css-loader?inline!./typescript-CssProp2_Button.css";
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
  styles: _Button
});
class Component extends React.Component<PropsType> {
  render() {
    return (
      <>
        <h2>{this.props.children}</h2>
        <Button variant="primary" css={[_CssProp1_Button, [], []]}>
          click
        </Button>
        <Button variant="secondary" css={[_CssProp2_Button, [], []]}>
          cancel
        </Button>
      </>
    );
  }
}