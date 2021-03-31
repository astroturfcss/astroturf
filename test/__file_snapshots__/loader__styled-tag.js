import s from "astroturf/react";
import _FancyBox from "styled-tag-FancyBox.module.css!=!astroturf/inline-loader?style!/fixtures/styled-tag.js?FancyBox";
import _FancierBox from "styled-tag-FancierBox.module.css!=!astroturf/inline-loader?style!/fixtures/styled-tag.js?FancierBox";
// prettier-ignore
const FancyBox = /*#__PURE__*/s('div', null, {
  displayName: "FancyBox",
  styles: _FancyBox
});
const FancierBox = /*#__PURE__*/ s(FancyBox, null, {
  displayName: "FancierBox",
  styles: _FancierBox,
});