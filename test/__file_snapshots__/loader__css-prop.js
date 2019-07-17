/** @jsx _AstroTurfJsx **/
/** @jsxFrag React.Fragment **/

const { jsx: _AstroTurfJsx } = require('astroturf');
const _default = require('./css-prop-CssProp1_button.css');
const _default2 = require('./css-prop-CssProp2_button.css');
const _default3 = require('./css-prop-CssProp3_button.css');

function Button() {
  return <button css={_default} />;
}

function Button2() {
  return <button css={_default2} />;
}

const color = 'orange';
function Button3() {
  return (
    <>
      <button css={_default3} />
    </>
  );
}
