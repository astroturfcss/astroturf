import styled from "astroturf/react";
import _FancyBox from "astroturf/css-loader?inline!./styled-FancyBox.css";
import _FancierBox from "astroturf/css-loader?inline!./styled-FancierBox.css";
const SIZE = 75;
// prettier-ignore
const FancyBox = /*#__PURE__*/styled('div', null, {
  displayName: "FancyBox",
  styles: _FancyBox
});
const FancierBox = /*#__PURE__*/ styled(FancyBox, null, {
  displayName: "FancierBox",
  styles: _FancierBox,
});