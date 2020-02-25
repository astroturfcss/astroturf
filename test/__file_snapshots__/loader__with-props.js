import { styled } from "astroturf";
import _RedPasswordInput from "astroturf/css-loader?inline!./with-props-RedPasswordInput.css";
import _RedPasswordInput2 from "astroturf/css-loader?inline!./with-props-RedPasswordInput2.css";
const RedPasswordInput = /*#__PURE__*/ styled("input", null, {
  displayName: "RedPasswordInput",
  styles: _RedPasswordInput,
  attrs: props => ({ ...props, type: "password" })
});
const RedPasswordInput2 = /*#__PURE__*/ styled("input", null, {
  displayName: "RedPasswordInput2",
  styles: _RedPasswordInput2,
  attrs: p => ({
    type: "password"
  })
});