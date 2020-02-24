import styled from "astroturf";
import _FancyBox from "./styled-FancyBox.css";
import _FancierBox from "./styled-FancierBox.css";
const SIZE = 75; // prettier-ignore
const FancyBox =
  /*#__PURE__*/
  styled("div", null, {
    displayName: "FancyBox",
    styles: _FancyBox
  });
const FancierBox =
  /*#__PURE__*/
  styled(FancyBox, null, {
    displayName: "FancierBox",
    styles: _FancierBox
  });