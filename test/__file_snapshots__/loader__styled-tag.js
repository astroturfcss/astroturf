import s from "astroturf";
import _FancyBox from "astroturf/css-loader?inline!./styled-tag-FancyBox.css";
import _FancierBox from "astroturf/css-loader?inline!./styled-tag-FancierBox.css";
// prettier-ignore
const FancyBox = /*#__PURE__*/s('div', null, {
  displayName: "FancyBox",
  styles: _FancyBox
});
const FancierBox = /*#__PURE__*/ s(FancyBox, null, {
  displayName: "FancierBox",
  styles: _FancierBox
});