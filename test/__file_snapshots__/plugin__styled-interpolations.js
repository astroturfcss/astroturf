import styled from "astroturf";
<<<<<<< HEAD
import _base from "./styled-interpolations-base.css";
import _other from "./styled-interpolations-other.css";
import _FancyBox from "./styled-interpolations-FancyBox.css";
import _FancierBox from "./styled-interpolations-FancierBox.css";
import _Button from "./styled-interpolations-Button.css";
const base = _base;
const other = _other;
=======

const base = require("./styled-interpolations-base.css").cls2;

const other = require("./styled-interpolations-other.css").cls2;

>>>>>>> WIP
const FancyBox =
  /*#__PURE__*/
  styled("div", null, {
    displayName: "FancyBox",
    styles: _FancyBox,
    attrs: null,
    vars: []
  });
const FancierBox =
  /*#__PURE__*/
  styled("div", null, {
    displayName: "FancierBox",
    styles: _FancierBox,
    attrs: null,
    vars: []
  });
const Button =
  /*#__PURE__*/
  styled(Button, null, {
    displayName: "Button",
    styles: _Button,
    attrs: null,
    vars: []
  });