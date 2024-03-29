import styled from "astroturf/react";
import _RedPasswordInput from "./with-props-RedPasswordInput.module.css";
import _RedPasswordInput2 from "./with-props-RedPasswordInput2.module.css";
const RedPasswordInput = /*#__PURE__*/ styled("input", null, {
  displayName: "RedPasswordInput",
  styles: _RedPasswordInput,
  attrs: (props) => ({
    ...props,
    type: "password",
  }),
});
const RedPasswordInput2 = /*#__PURE__*/ styled("input", null, {
  displayName: "RedPasswordInput2",
  styles: _RedPasswordInput2,
  attrs: (p) => ({
    type: "password",
  }),
});