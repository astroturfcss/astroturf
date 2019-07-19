import styled from 'astroturf'

const base = require('./styled-interpolations-base.css');

const other = require('./styled-interpolations-other.css');

const FancyBox = styled('div', null, {
  displayName: "FancyBox",
  styles: require("./styled-interpolations-FancyBox.css"),
  attrs: null
});

const FancierBox = styled('div', null, {
  displayName: "FancierBox",
  styles: require("./styled-interpolations-FancierBox.css"),
  attrs: null
});

const Button = styled(Button, null, {
  displayName: "Button",
  styles: require("./styled-interpolations-Button.css"),
  attrs: null
});
