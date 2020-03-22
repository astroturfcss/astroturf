import styled from "astroturf";

const SIZE = 75;

// prettier-ignore
const FancyBox = /*#__PURE__*/styled('div', null, {
  displayName: "FancyBox",
  styles: require("./multiple-components-FancyBox.css"),
  attrs: null,
  vars: []
});

const FancyHeader = /*#__PURE__*/ styled("h2", null, {
  displayName: "FancyHeader",
  styles: require("./multiple-components-FancyHeader.css"),
  attrs: null,
  vars: [],
});
