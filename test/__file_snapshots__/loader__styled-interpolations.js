import styled from "astroturf/react";
import _base from "styled-interpolations-base.module.css!=!astroturf/inline-loader?style!/fixtures/styled-interpolations.js?base";
import _other from "styled-interpolations-other.module.css!=!astroturf/inline-loader?style!/fixtures/styled-interpolations.js?other";
import _FancyBox from "styled-interpolations-FancyBox.module.css!=!astroturf/inline-loader?style!/fixtures/styled-interpolations.js?FancyBox";
import _FancierBox from "styled-interpolations-FancierBox.module.css!=!astroturf/inline-loader?style!/fixtures/styled-interpolations.js?FancierBox";
import _Button from "styled-interpolations-Button.module.css!=!astroturf/inline-loader?style!/fixtures/styled-interpolations.js?Button";
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