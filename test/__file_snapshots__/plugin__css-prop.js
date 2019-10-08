/** @jsxFrag _f **/

/** @jsx _j **/
import { F as _f2 } from "astroturf";
import { jsx as _j2 } from "astroturf";
import _default5 from "./css-prop-CssProp5_span.css";
import _default4 from "./css-prop-CssProp4_button.css";
import _default3 from "./css-prop-CssProp3_button.css";
import _default2 from "./css-prop-CssProp2_button.css";
import _default from "./css-prop-CssProp1_button.css";
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
