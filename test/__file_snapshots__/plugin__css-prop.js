/** @jsxFrag _j.F **/
/** @jsx _j.jsx **/
import * as _j from "astroturf/jsx";
import React from "react";
import _CssProp1_button from "./css-prop-CssProp1_button.css";
import _CssProp2_button from "./css-prop-CssProp2_button.css";
import _CssProp3_button from "./css-prop-CssProp3_button.css";
import _CssProp4_button from "./css-prop-CssProp4_button.css";
import _CssProp5_span from "./css-prop-CssProp5_span.css";
function Button() {
  return <button css={[_CssProp1_button]} />;
}
function Button2() {
  return <button css={[_CssProp2_button]} />;
}
const color = "orange";
function Button3() {
  return (
    <>
      <button css={[_CssProp3_button]} />
    </>
  );
}
function Button4({ theme }) {
  return _j.jsx(
    "button",
    {
      css: [_CssProp4_button, [["a1qka8js", theme]]],
    },
    "Hi there",
    _j.jsx("span", {
      css: [_CssProp5_span],
    })
  );
}