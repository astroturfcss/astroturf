const _FancyBox = require("astroturf/css-loader?inline!./styled-global-FancyBox.css");
const _FancierBox = require("astroturf/css-loader?inline!./styled-global-FancierBox.css");
// prettier-ignore
const FancyBox = /*#__PURE__*/s('div', null, {
  displayName: "FancyBox",
  styles: _FancyBox
});
const FancierBox = /*#__PURE__*/ s(FancyBox, null, {
  displayName: "FancierBox",
  styles: _FancierBox
});