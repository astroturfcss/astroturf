import s from 'astroturf';

// prettier-ignore
const FancyBox = styled('div', null, {
  displayName: "FancyBox",
  styles: require("./styled-tag-FancyBox.css"),
  attrs: null
});

const FancierBox = styled(FancyBox, null, {
  displayName: "FancierBox",
  styles: require("./styled-tag-FancierBox.css"),
  attrs: null
});
