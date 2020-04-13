import styled from "astroturf/react";
import _base from "astroturf/css-loader?inline!./styled-interpolations-base.css";
import _other from "astroturf/css-loader?inline!./styled-interpolations-other.css";
import _FancyBox from "astroturf/css-loader?inline!./styled-interpolations-FancyBox.css";
import _FancierBox from "astroturf/css-loader?inline!./styled-interpolations-FancierBox.css";
import _Button from "astroturf/css-loader?inline!./styled-interpolations-Button.css";
const base = _base.cls1;
const other = _other.cls1;
const FancyBox = /*#__PURE__*/ styled("div", null, {
  displayName: "FancyBox",
  styles: _FancyBox,
});
const FancierBox = /*#__PURE__*/ styled("div", null, {
  displayName: "FancierBox",
  styles: _FancierBox,
});
const Button = /*#__PURE__*/ styled(Button, null, {
  displayName: "Button",
  styles: _Button,
});