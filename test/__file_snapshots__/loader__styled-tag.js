import s from "astroturf";
import _FancyBox from "./styled-tag-FancyBox.css";
import _FancierBox from "./styled-tag-FancierBox.css";
// prettier-ignore
const FancyBox = /*#__PURE__*/s('div', null, {
  displayName: "FancyBox",
  styles: _FancyBox,
  attrs: null,
  vars: []
});
const FancierBox = /*#__PURE__*/ s(FancyBox, null, {
  displayName: "FancierBox",
  styles: _FancierBox,
  attrs: null,
  vars: []
});