/** @jsx _j **/
/** @jsxFrag _f **/

const { jsx: _j, F: _f } = require("astroturf");
const _default = require("./css-prop-CssProp1_button.css");
const _default2 = require("./css-prop-CssProp2_button.css");
const _default3 = require("./css-prop-CssProp3_button.css");
const _default4 = require("./css-prop-CssProp4_button.css");
const _default5 = require("./css-prop-CssProp5_span.css");

import React from "react";

function Button() {
  return <button css={[_default, []]} />;
}

function Button2() {
  return <button css={[_default2]} />;
}

const color = "orange";
function Button3() {
  return (
    <>
      <button css={[_default3, []]} />
    </>
  );
}

function Button4({ theme }) {
  return _j(
    "button",
    {
      css: [_default4, [["a1qka8js", theme]]]
    },
    "Hi there",
    _j("span", {
      css: [_default5]
    })
  );
}
