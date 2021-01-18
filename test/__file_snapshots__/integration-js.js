(self["webpackChunkastroturf"] = self["webpackChunkastroturf"] || []).push([["main"],{

/***/ "./test/integration/Button.js":
/*!************************************!*\
  !*** ./test/integration/Button.js ***!
  \************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! export styles [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "styles": () => /* binding */ styles,
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var astroturf_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! astroturf/react */ "./src/runtime/react.js");
/* harmony import */ var _Button_styles_module_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Button-styles.module.css */ "./test/integration/Button-styles.module.css");
/* harmony import */ var _Button_module_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Button.module.css */ "./test/integration/Button.module.css");



const styles = _Button_styles_module_css__WEBPACK_IMPORTED_MODULE_1__.default;
const Button = /*#__PURE__*/(0,astroturf_react__WEBPACK_IMPORTED_MODULE_0__.default)('button', null, {
  displayName: "Button",
  styles: _Button_module_css__WEBPACK_IMPORTED_MODULE_2__.default
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Button);

/***/ }),

/***/ "./test/integration/main.js":
/*!**********************************!*\
  !*** ./test/integration/main.js ***!
  \**********************************/
/*! namespace exports */
/*! export MyComponent [provided] [no usage info] [missing usage info prevents renaming] */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MyComponent": () => /* binding */ MyComponent,
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var astroturf_jsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! astroturf/jsx */ "./src/runtime/jsx.js");
/* harmony import */ var astroturf_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! astroturf/react */ "./src/runtime/react.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var widget__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! widget */ "./test/integration/shared/widget/index.js");
/* harmony import */ var withConfig__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! withConfig */ "./test/integration/shared/withConfig/index.js");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Button */ "./test/integration/Button.js");
/* harmony import */ var _main_styles_module_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./main-styles.module.css */ "./test/integration/main-styles.module.css");
/* harmony import */ var _main_FancyBox_module_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./main-FancyBox.module.css */ "./test/integration/main-FancyBox.module.css");
/* harmony import */ var _main_FancierBox_module_css__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./main-FancierBox.module.css */ "./test/integration/main-FancierBox.module.css");
/* harmony import */ var _main_CssProp1_div_module_css__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./main-CssProp1_div.module.css */ "./test/integration/main-CssProp1_div.module.css");
/* harmony import */ var _main_CssProp2_span_module_css__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./main-CssProp2_span.module.css */ "./test/integration/main-CssProp2_span.module.css");
/** @jsxRuntime classic*/

/** @jsx _j */

/** @jsxFrag _j.F */












const width = 75;
const styles = _main_styles_module_css__WEBPACK_IMPORTED_MODULE_6__.default;
const FancyBox = /*#__PURE__*/(0,astroturf_react__WEBPACK_IMPORTED_MODULE_1__.default)('div', null, {
  displayName: "FancyBox",
  styles: _main_FancyBox_module_css__WEBPACK_IMPORTED_MODULE_7__.default
});
const FancierBox = /*#__PURE__*/(0,astroturf_react__WEBPACK_IMPORTED_MODULE_1__.default)('div', null, {
  displayName: "FancierBox",
  styles: _main_FancierBox_module_css__WEBPACK_IMPORTED_MODULE_8__.default
});
function MyComponent() {
  return (0,astroturf_jsx__WEBPACK_IMPORTED_MODULE_0__.default)(astroturf_jsx__WEBPACK_IMPORTED_MODULE_0__.default.F, null, (0,astroturf_jsx__WEBPACK_IMPORTED_MODULE_0__.default)("div", {
    css: [_main_CssProp1_div_module_css__WEBPACK_IMPORTED_MODULE_9__.default, null, [foo && _main_CssProp1_div_module_css__WEBPACK_IMPORTED_MODULE_9__.default.cssProp1DivVariant0]]
  }, (0,astroturf_jsx__WEBPACK_IMPORTED_MODULE_0__.default)("div", null, "hey "), (0,astroturf_jsx__WEBPACK_IMPORTED_MODULE_0__.default)("span", {
    css: [_main_CssProp2_span_module_css__WEBPACK_IMPORTED_MODULE_10__.default]
  }, "yo")));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FancierBox);

/***/ }),

/***/ "./test/integration/shared/widget/index.js":
/*!*************************************************!*\
  !*** ./test/integration/shared/widget/index.js ***!
  \*************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var astroturf_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! astroturf/react */ "./src/runtime/react.js");
/* harmony import */ var _Widget_module_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Widget.module.css */ "./test/integration/shared/widget/Widget.module.css");


const Widget = /*#__PURE__*/(0,astroturf_react__WEBPACK_IMPORTED_MODULE_0__.default)('div', null, {
  displayName: "Widget",
  styles: _Widget_module_css__WEBPACK_IMPORTED_MODULE_1__.default
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Widget);

/***/ }),

/***/ "./test/integration/shared/withConfig/index.js":
/*!*****************************************************!*\
  !*** ./test/integration/shared/withConfig/index.js ***!
  \*****************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var astroturf_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! astroturf/react */ "./src/runtime/react.js");
/* harmony import */ var _index_Doodad_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index-Doodad.module.scss */ "./test/integration/shared/withConfig/index-Doodad.module.scss");


const Doodad = /*#__PURE__*/(0,astroturf_react__WEBPACK_IMPORTED_MODULE_0__.default)('div', null, {
  displayName: "Doodad",
  styles: _index_Doodad_module_scss__WEBPACK_IMPORTED_MODULE_1__.default
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Doodad);

/***/ }),

/***/ "./test/integration/Button-styles.module.css":
/*!***************************************************!*\
  !*** ./test/integration/Button-styles.module.css ***!
  \***************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"cool":"Button-styles-module__cool"});

/***/ }),

/***/ "./test/integration/Button.module.css":
/*!********************************************!*\
  !*** ./test/integration/Button.module.css ***!
  \********************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"cls1":"Button-module__cls1","cls2":"Button-module__cls2 Button-module__cls1 button-with-caret"});

/***/ }),

/***/ "./test/integration/main-CssProp1_div.module.css":
/*!*******************************************************!*\
  !*** ./test/integration/main-CssProp1_div.module.css ***!
  \*******************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"cls1":"main-CssProp1_div-module__cls1","cls2":"main-CssProp1_div-module__cls2 main-CssProp1_div-module__cls1","cssProp1DivVariant0":"main-CssProp1_div-module__cssProp1DivVariant0"});

/***/ }),

/***/ "./test/integration/main-CssProp2_span.module.css":
/*!********************************************************!*\
  !*** ./test/integration/main-CssProp2_span.module.css ***!
  \********************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"cls1":"main-CssProp2_span-module__cls1","cls2":"main-CssProp2_span-module__cls2 main-CssProp2_span-module__cls1"});

/***/ }),

/***/ "./test/integration/main-FancierBox.module.css":
/*!*****************************************************!*\
  !*** ./test/integration/main-FancierBox.module.css ***!
  \*****************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"a0":"main-FancyBox-module__cls1","a1":"main-styles-module__parent","a2":"Button-module__cls1","a3":"Button-module__cls1","cls1":"main-FancierBox-module__cls1","cls2":"main-FancierBox-module__cls2 main-FancierBox-module__cls1"});

/***/ }),

/***/ "./test/integration/main-FancyBox.module.css":
/*!***************************************************!*\
  !*** ./test/integration/main-FancyBox.module.css ***!
  \***************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"cls1":"main-FancyBox-module__cls1","cls2":"main-FancyBox-module__cls2 main-FancyBox-module__cls1 foo","primary":"main-FancyBox-module__primary"});

/***/ }),

/***/ "./test/integration/main-styles.module.css":
/*!*************************************************!*\
  !*** ./test/integration/main-styles.module.css ***!
  \*************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"a0":"Button-styles-module__cool","a1":"Widget-module__cls1","parent":"main-styles-module__parent","test":"main-styles-module__test"});

/***/ }),

/***/ "./test/integration/shared/widget/Widget.module.css":
/*!**********************************************************!*\
  !*** ./test/integration/shared/widget/Widget.module.css ***!
  \**********************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"cls1":"Widget-module__cls1","cls2":"Widget-module__cls2 Widget-module__cls1"});

/***/ }),

/***/ "./test/integration/shared/withConfig/index-Doodad.module.scss":
/*!*********************************************************************!*\
  !*** ./test/integration/shared/withConfig/index-Doodad.module.scss ***!
  \*********************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"cls1":"index-Doodad-module__cls1","cls2":"index-Doodad-module__cls2 index-Doodad-module__cls1"});

/***/ }),

/***/ "./src/runtime/index.js":
/*!******************************!*\
  !*** ./src/runtime/index.js ***!
  \******************************/
/*! namespace exports */
/*! export css [provided] [no usage info] [missing usage info prevents renaming] */
/*! export stylesheet [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "stylesheet": () => /* binding */ stylesheet,
/* harmony export */   "css": () => /* binding */ css
/* harmony export */ });
const stylesheet = () => {
  throw new Error(
    'stylesheet template literal evaluated at runtime. ' +
      'Make sure astroturf is properly configured to compile this file',
  );
};

const css = () => {
  throw new Error(
    'css template literal evaluated at runtime. ' +
      'Make sure astroturf is properly configured to compile this file',
  );
};


/***/ }),

/***/ "./src/runtime/jsx.js":
/*!****************************!*\
  !*** ./src/runtime/jsx.js ***!
  \****************************/
/*! namespace exports */
/*! export F [provided] [no usage info] [missing usage info prevents renaming] -> ./node_modules/react/cjs/react.development.js .Fragment */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! export jsx [provided] [no usage info] [missing usage info prevents renaming] */
/*! export resolveVariants [provided] [no usage info] [missing usage info prevents renaming] */
/*! export varsToStyles [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.d, __webpack_require__.r, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "resolveVariants": () => /* binding */ resolveVariants,
/* harmony export */   "varsToStyles": () => /* binding */ varsToStyles,
/* harmony export */   "jsx": () => /* binding */ jsx,
/* harmony export */   "F": () => /* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.Fragment,
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
// eslint-disable-next-line import/no-extraneous-dependencies


const resolveVariants = (variants) =>
  !variants ? '' : variants.filter(Boolean).join(' ');

function varsToStyles(props, vars) {
  if (!vars || !vars.length) return props.style;
  const style = { ...props.style };
  vars.forEach(([id, value, unit = '']) => {
    const result = typeof value === 'function' ? value(props) : value;
    style[`--${id}`] = `${result}${unit}`;
  });
  return style;
}

function jsx(type, props, ...children) {
  if (props && props.css) {
    const { css, className, ...childProps } = props;
    const componentClassName = css[0].cls2 || css[0].cls1;
    childProps.style = varsToStyles(childProps, css[1]);
    childProps.className = `${
      className ? `${className} ${componentClassName}` : componentClassName
    } ${resolveVariants(css[2])}`;
    props = childProps;
  }

  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(type, props, ...children);
}
jsx.F = react__WEBPACK_IMPORTED_MODULE_0__.Fragment;

// the reason for the crazy exports here is that you need to do a BUNCH of work
// to keep typescript from eliding (removing) the jsx imports
// see: https://github.com/babel/babel/pull/11523


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (jsx);


/***/ }),

/***/ "./src/runtime/react.js":
/*!******************************!*\
  !*** ./src/runtime/react.js ***!
  \******************************/
/*! namespace exports */
/*! export css [provided] [no usage info] [missing usage info prevents renaming] -> ./src/runtime/index.js .css */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! export stylesheet [provided] [no usage info] [missing usage info prevents renaming] -> ./src/runtime/index.js .stylesheet */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.d, __webpack_require__.r, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__,
/* harmony export */   "css": () => /* reexport safe */ ___WEBPACK_IMPORTED_MODULE_2__.css,
/* harmony export */   "stylesheet": () => /* reexport safe */ ___WEBPACK_IMPORTED_MODULE_2__.stylesheet
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! . */ "./src/runtime/index.js");
/* harmony import */ var _jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./jsx */ "./src/runtime/jsx.js");
// eslint-disable-next-line import/no-extraneous-dependencies





// eslint-disable-next-line no-control-regex
const reWords = /[A-Z\xc0-\xd6\xd8-\xde]?[a-z\xdf-\xf6\xf8-\xff]+(?:['’](?:d|ll|m|re|s|t|ve))?(?=[\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000]|[A-Z\xc0-\xd6\xd8-\xde]|$)|(?:[A-Z\xc0-\xd6\xd8-\xde]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])+(?:['’](?:D|LL|M|RE|S|T|VE))?(?=[\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000]|[A-Z\xc0-\xd6\xd8-\xde](?:[a-z\xdf-\xf6\xf8-\xff]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])|$)|[A-Z\xc0-\xd6\xd8-\xde]?(?:[a-z\xdf-\xf6\xf8-\xff]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])+(?:['’](?:d|ll|m|re|s|t|ve))?|[A-Z\xc0-\xd6\xd8-\xde]+(?:['’](?:D|LL|M|RE|S|T|VE))?|\d*(?:1ST|2ND|3RD|(?![123])\dTH)(?=\b|[a-z_])|\d*(?:1st|2nd|3rd|(?![123])\dth)(?=\b|[A-Z_])|\d+|(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]|\ud83c[\udffb-\udfff])?)*/g;

const camelCase = (str) =>
  (str.match(reWords) || []).reduce(
    (acc, next) => acc + (!acc ? next : next[0].toUpperCase() + next.slice(1)),
    '',
  );

function propsToStyles(props, styles, hasModifiers) {
  const componentClassName = styles.cls2 || styles.cls1;
  let className = props.className
    ? `${props.className} ${componentClassName}`
    : componentClassName;

  if (hasModifiers) {
    Object.keys(props).forEach((propName) => {
      const propValue = props[propName];
      const typeOf = typeof propValue;

      if (typeOf === 'boolean' || propValue == null) {
        if (styles[propName]) {
          if (propValue) {
            className += ` ${styles[propName]}`;
          }

          delete props[propName];
        } else {
          const camelPropName = camelCase(propName);

          if (styles[camelPropName]) {
            if (propValue) {
              className += ` ${styles[camelPropName]}`;
            }
            delete props[propName];
          }
        }
      } else if (typeOf === 'string' || typeOf === 'number') {
        const propKey = `${propName}-${propValue}`;

        if (styles[propKey]) {
          className += ` ${styles[propKey]}`;
          delete props[propName];
        } else {
          const camelPropKey = camelCase(propKey);

          if (styles[camelPropKey]) {
            className += ` ${styles[camelPropKey]}`;
            delete props[propName];
          }
        }
      }
    });
  }
  return className;
}

function styled(type, options, settings) {
  if (__DEV__) {
    if (settings == null)
      throw new Error(
        'This styled() template tag was mistakenly evaluated at runtime. ' +
          'Make sure astroturf is properly configured to compile this file',
      );
    if (typeof settings === 'string')
      throw new Error(
        'It looks like you have incompatible astroturf versions in your app. ' +
          'This runtime expects styles compiled with a newer version of astroturf, ' +
          'ensure that your versions are properly deduped and upgraded. ',
      );
  }
  const { displayName, attrs, vars, variants, styles } = settings;

  options = options || { allowAs: typeof type === 'string' };

  // always passthrough if the type is a styled component
  const allowAs = type.isAstroturf ? false : options.allowAs;

  const hasModifiers = Object.keys(styles).some(
    (className) => className !== (styles.cls2 || styles.cls1),
  );

  const decorated = (0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)((rawProps, ref) => {
    const props = attrs ? attrs(rawProps) : rawProps;
    const childProps = { ...props, ref };

    if (allowAs) delete childProps.as;
    childProps.style = (0,_jsx__WEBPACK_IMPORTED_MODULE_1__.varsToStyles)(childProps, vars);
    childProps.className = propsToStyles(childProps, styles, hasModifiers);

    if (variants) childProps.className += ` ${(0,_jsx__WEBPACK_IMPORTED_MODULE_1__.resolveVariants)(variants)}`;

    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(allowAs && props.as ? props.as : type, childProps);
  });

  decorated.displayName = displayName;

  decorated.withComponent = (nextType) => styled(nextType, options, settings);

  decorated.isAstroturf = true;

  return decorated;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (styled);




/***/ })

},
0,[["./test/integration/main.js","runtime~main","vendors-node_modules_react_index_js"]]]);