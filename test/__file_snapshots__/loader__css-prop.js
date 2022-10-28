/** @jsxRuntime classic*/
/** @jsx _j */
/** @jsxFrag _j.F */
import _j from "astroturf/jsx";
import React from "react";
import _CssProp1_button from "css-prop-CssProp1_button.module.css!=!astroturf/inline-loader?style=1!/fixtures/css-prop.js?styleId=CssProp1_button";
import _CssProp2_button from "css-prop-CssProp2_button.module.css!=!astroturf/inline-loader?style=1!/fixtures/css-prop.js?styleId=CssProp2_button";
import _CssProp3_button from "css-prop-CssProp3_button.module.css!=!astroturf/inline-loader?style=1!/fixtures/css-prop.js?styleId=CssProp3_button";
import _CssProp4_button from "css-prop-CssProp4_button.module.css!=!astroturf/inline-loader?style=1!/fixtures/css-prop.js?styleId=CssProp4_button";
import _CssProp5_span from "css-prop-CssProp5_span.module.css!=!astroturf/inline-loader?style=1!/fixtures/css-prop.js?styleId=CssProp5_span";
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
  return _j(
    "button",
    {
      css: [_CssProp4_button, [["a1qka8js", theme]]],
    },
    "Hi there",
    _j("span", {
      css: [_CssProp5_span],
    })
  );
}