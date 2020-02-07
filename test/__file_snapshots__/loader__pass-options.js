import styled from "astroturf";
import _FancyBox from "./pass-options-FancyBox.css";
import _FancierBox from "./pass-options-FancierBox.css";
const SIZE = 75;
// prettier-ignore
const FancyBox = /*#__PURE__*/styled('div', {
  someOption: true
}, {
  displayName: "FancyBox",
  styles: _FancyBox,
  attrs: null,
  vars: []
});
const options = {};
const FancierBox = /*#__PURE__*/ styled(FancyBox, options, {
  displayName: "FancierBox",
  styles: _FancierBox,
  attrs: null,
  vars: []
});