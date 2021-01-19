import styled from "astroturf/react";
import _FancyBox from "./pass-options-FancyBox.module.css";
import _FancierBox from "./pass-options-FancierBox.module.css";
const SIZE = 75; // prettier-ignore
const FancyBox = /*#__PURE__*/ styled(
  "div",
  {
    someOption: true,
  },
  {
    displayName: "FancyBox",
    styles: _FancyBox,
  }
);
const options = {};
const FancierBox = /*#__PURE__*/ styled(FancyBox, options, {
  displayName: "FancierBox",
  styles: _FancierBox,
});