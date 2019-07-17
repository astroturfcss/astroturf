import styled from 'astroturf';

const SIZE = 75;

// prettier-ignore
const FancyBox = styled('div', null, {
  displayName: "FancyBox",
  styles: require("./styled-FancyBox.css"),
  attrs: null
});

const FancierBox = styled(FancyBox, null, {
  displayName: "FancierBox",
  styles: require("./styled-FancierBox.css"),
  attrs: null
});
