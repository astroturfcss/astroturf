/** @jsxFrag _f **/

/** @jsx _j **/
import { F as _f2 } from "astroturf";
import { jsx as _j2 } from "astroturf";
import _default3 from "./css-prop-CssProp3_button.css";
import _default2 from "./css-prop-CssProp2_button.css";
import _default from "./css-prop-CssProp1_button.css";

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
