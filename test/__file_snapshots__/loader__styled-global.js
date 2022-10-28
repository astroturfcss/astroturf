const _FancyBox = require("styled-global-FancyBox.module.css!=!astroturf/inline-loader?style=1!/fixtures/styled-global.js?styleId=FancyBox");
const _FancierBox = require("styled-global-FancierBox.module.css!=!astroturf/inline-loader?style=1!/fixtures/styled-global.js?styleId=FancierBox");
// prettier-ignore
const FancyBox = /*#__PURE__*/s('div', null, {
  displayName: "FancyBox",
  styles: _FancyBox
});
const FancierBox = /*#__PURE__*/ s(FancyBox, null, {
  displayName: "FancierBox",
  styles: _FancierBox,
});