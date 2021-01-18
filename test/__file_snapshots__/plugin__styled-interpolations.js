import styled from "astroturf/react";
import _base from "./styled-interpolations-base.module.css";
import _other from "./styled-interpolations-other.module.css";
import _FancyBox from "./styled-interpolations-FancyBox.module.css";
import _FancierBox from "./styled-interpolations-FancierBox.module.css";
import _Button from "./styled-interpolations-Button.module.css";
const base = _base.cls2;
const other = _other.cls2;
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