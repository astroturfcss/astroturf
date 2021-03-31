const _FancierBox = require("./styled-global-FancierBox.module.css");
const _FancyBox = require("./styled-global-FancyBox.module.css");
// prettier-ignore
const FancyBox = /*#__PURE__*/s('div', null, {
  displayName: "FancyBox",
  styles: _FancyBox
});
const FancierBox = /*#__PURE__*/ s(FancyBox, null, {
  displayName: "FancierBox",
  styles: _FancierBox,
});