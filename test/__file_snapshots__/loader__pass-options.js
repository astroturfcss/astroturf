import styled from 'astroturf';

const SIZE = 75;

// prettier-ignore
const FancyBox = styled('div', {
  someOption: true
}, {
  displayName: "FancyBox",
  styles: require("./pass-options-FancyBox.css"),
  attrs: null
});

const options = {};

const FancierBox = styled(FancyBox, options, {
  displayName: "FancierBox",
  styles: require("./pass-options-FancierBox.css"),
  attrs: null
});
