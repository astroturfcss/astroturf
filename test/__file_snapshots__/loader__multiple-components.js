import styled from "astroturf/react";
import _FancyBox from "multiple-components-FancyBox.module.css!=!astroturf/inline-loader?style=1!/fixtures/multiple-components.js?styleId=FancyBox";
import _FancyHeader from "multiple-components-FancyHeader.module.css!=!astroturf/inline-loader?style=1!/fixtures/multiple-components.js?styleId=FancyHeader";
const SIZE = 75;
// prettier-ignore
const FancyBox = /*#__PURE__*/styled('div', null, {
  displayName: "FancyBox",
  styles: _FancyBox
});
const FancyHeader = /*#__PURE__*/ styled("h2", null, {
  displayName: "FancyHeader",
  styles: _FancyHeader,
});