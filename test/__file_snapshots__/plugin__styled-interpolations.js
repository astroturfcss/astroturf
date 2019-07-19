import styled from 'astroturf';

const base =
/*#__PURE__*/
require("./styled-interpolations-base.css");

const other =
/*#__PURE__*/
require("./styled-interpolations-other.css");

const FancyBox =
/*#__PURE__*/
styled('div', null, {
  displayName: "FancyBox",
  styles: require("./styled-interpolations-FancyBox.css"),
  attrs: null
});
const FancierBox =
/*#__PURE__*/
styled('div', null, {
  displayName: "FancierBox",
  styles: require("./styled-interpolations-FancierBox.css"),
  attrs: null
});
const Button =
/*#__PURE__*/
styled(Button, null, {
  displayName: "Button",
  styles: require("./styled-interpolations-Button.css"),
  attrs: null
});