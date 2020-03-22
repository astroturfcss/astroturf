import s from "astroturf";

// prettier-ignore
const FancyBox = /*#__PURE__*/s('div', null, {
  displayName: "FancyBox",
  styles: require("./styled-tag-FancyBox.css"),
  attrs: null,
  vars: []
});

const FancierBox = /*#__PURE__*/ s(FancyBox, null, {
  displayName: "FancierBox",
  styles: require("./styled-tag-FancierBox.css"),
  attrs: null,
  vars: [],
});
