import styled from "astroturf/react";
import _base from "styled-interpolations-base.module.css!=!astroturf/inline-loader?style=1!/fixtures/styled-interpolations.js?styleId=base";
import _other from "styled-interpolations-other.module.css!=!astroturf/inline-loader?style=1!/fixtures/styled-interpolations.js?styleId=other";
import _FancyBox from "styled-interpolations-FancyBox.module.css!=!astroturf/inline-loader?style=1!/fixtures/styled-interpolations.js?styleId=FancyBox";
import _FancierBox from "styled-interpolations-FancierBox.module.css!=!astroturf/inline-loader?style=1!/fixtures/styled-interpolations.js?styleId=FancierBox";
import _Button from "styled-interpolations-Button.module.css!=!astroturf/inline-loader?style=1!/fixtures/styled-interpolations.js?styleId=Button";
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