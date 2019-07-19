import styled from 'astroturf';
const SIZE = 75; // prettier-ignore

const FancyBox =
/*#__PURE__*/
styled('div', null, {
  displayName: "FancyBox",
  styles: require("./styled-FancyBox.css"),
  attrs: null
});
const FancierBox =
/*#__PURE__*/
styled(FancyBox, null, {
  displayName: "FancierBox",
  styles: require("./styled-FancierBox.css"),
  attrs: null
});