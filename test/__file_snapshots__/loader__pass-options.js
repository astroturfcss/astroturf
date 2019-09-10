import styled from "astroturf";

const SIZE = 75;

// prettier-ignore
const FancyBox = /*#__PURE__*/styled('div', {
  someOption: true
}, {
  displayName: "FancyBox",
  styles: require("./pass-options-FancyBox.css"),
  attrs: null,
  vars: []
});

const options = {};

const FancierBox = /*#__PURE__*/ styled(FancyBox, options, {
  displayName: "FancierBox",
  styles: require("./pass-options-FancierBox.css"),
  attrs: null,
  vars: []
});
