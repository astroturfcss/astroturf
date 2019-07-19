import styled from 'astroturf'

const SIZE = 75;

// prettier-ignore
const FancyBox = styled('div', null, {
  displayName: "FancyBox",
  styles: require("./multiple-components-FancyBox.css"),
  attrs: null
});

const FancyHeader = styled('h2', null, {
  displayName: "FancyHeader",
  styles: require("./multiple-components-FancyHeader.css"),
  attrs: null
});
