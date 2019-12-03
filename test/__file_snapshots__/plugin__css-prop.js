/** @jsxFrag _f **/

/** @jsx _j **/
import { F as _f2 } from "astroturf";
import { jsx as _j2 } from "astroturf";
import React from "react";

function Button() {
  return <button css={[require("./css-prop-CssProp1_button.css"), []]} />;
}

function Button2() {
  return <button css={[require("./css-prop-CssProp2_button.css")]} />;
}

const color = "orange";

function Button3() {
  return (
    <>
      <button css={[require("./css-prop-CssProp3_button.css"), []]} />
    </>
  );
}

function Button4({ theme }) {
  return _j(
    "button",
    {
      css: [require("./css-prop-CssProp4_button.css"), [["a1qka8js", theme]]]
    },
    "Hi there",
    _j("span", {
      css: [require("./css-prop-CssProp5_span.css")]
    })
  );
}
