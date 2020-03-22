(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/runtime/styled.js":
/*!*******************************!*\
  !*** ./src/runtime/styled.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const React = __webpack_require__(/*! react */ "./node_modules/react/index.js"); // eslint-disable-line import/no-extraneous-dependencies

// eslint-disable-next-line no-control-regex
const reWords = /[A-Z\xc0-\xd6\xd8-\xde]?[a-z\xdf-\xf6\xf8-\xff]+(?:['’](?:d|ll|m|re|s|t|ve))?(?=[\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000]|[A-Z\xc0-\xd6\xd8-\xde]|$)|(?:[A-Z\xc0-\xd6\xd8-\xde]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])+(?:['’](?:D|LL|M|RE|S|T|VE))?(?=[\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000]|[A-Z\xc0-\xd6\xd8-\xde](?:[a-z\xdf-\xf6\xf8-\xff]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])|$)|[A-Z\xc0-\xd6\xd8-\xde]?(?:[a-z\xdf-\xf6\xf8-\xff]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])+(?:['’](?:d|ll|m|re|s|t|ve))?|[A-Z\xc0-\xd6\xd8-\xde]+(?:['’](?:D|LL|M|RE|S|T|VE))?|\d*(?:1ST|2ND|3RD|(?![123])\dTH)(?=\b|[a-z_])|\d*(?:1st|2nd|3rd|(?![123])\dth)(?=\b|[A-Z_])|\d+|(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]|\ud83c[\udffb-\udfff])?)*/g;

const camelCase = (str) =>
  (str.match(reWords) || []).reduce(
    (acc, next) => acc + (!acc ? next : next[0].toUpperCase() + next.slice(1)),
    '',
  );

function varsToStyles(props, vars) {
  if (!vars || !vars.length) return props.style;
  const style = { ...props.style };
  vars.forEach(([id, value, unit = '']) => {
    const result = typeof value === 'function' ? value(props) : value;
    style[`--${id}`] = `${result}${unit}`;
  });
  return style;
}

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
    if (Array.isArray(type))
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
  const { displayName, attrs, vars, styles } = settings;

  options = options || { allowAs: typeof type === 'string' };

  // always passthrough if the type is a styled component
  const allowAs = type.isAstroturf ? false : options.allowAs;

  const hasModifiers = Object.keys(styles).some(
    (className) => className !== (styles.cls2 || styles.cls1),
  );

  function Styled(rawProps, ref) {
    const props = attrs ? attrs(rawProps) : rawProps;
    const childProps = { ...props, ref };

    if (allowAs) delete childProps.as;
    childProps.style = varsToStyles(childProps, vars);
    childProps.className = propsToStyles(childProps, styles, hasModifiers);

    return React.createElement(
      allowAs && props.as ? props.as : type,
      childProps,
    );
  }

  const decorated = React.forwardRef
    ? React.forwardRef(Styled)
    : (props) => Styled(props, null);

  decorated.displayName = displayName;

  decorated.withComponent = (nextType) => styled(nextType, options, settings);

  decorated.isAstroturf = true;

  return decorated;
}

function jsx(type, props, ...children) {
  if (props && props.css) {
    const { css, ...childProps } = props;
    childProps.style = varsToStyles(childProps, css[1]);
    childProps.className = propsToStyles(childProps, css[0] || css, true);
    props = childProps;
  }
  return React.createElement(type, props, ...children);
}

module.exports = styled;
module.exports.styled = styled;
module.exports.jsx = jsx;
module.exports.F = React.Fragment;

if (__DEV__) {
  module.exports.css = () => {
    throw new Error(
      'css template literal evaluated at runtime. ' +
        'Make sure astroturf is properly configured to compile this file',
    );
  };
}


/***/ }),

/***/ "./test/integration/Button-styles.css":
/*!********************************************!*\
  !*** ./test/integration/Button-styles.css ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
module.exports = {"cool":"Button-styles__cool"};

/***/ }),

/***/ "./test/integration/Button.css":
/*!*************************************!*\
  !*** ./test/integration/Button.css ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
module.exports = {"cls1":"Button__cls1","cls2":"Button__cls2 Button__cls1 button-with-caret"};

/***/ }),

/***/ "./test/integration/Button.js":
/*!************************************!*\
  !*** ./test/integration/Button.js ***!
  \************************************/
/*! exports provided: styles, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/* harmony import */ var astroturf__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! astroturf */ "./src/runtime/styled.js");
/* harmony import */ var astroturf__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(astroturf__WEBPACK_IMPORTED_MODULE_0__);

const styles = __webpack_require__(/*! ./Button-styles.css */ "./test/integration/Button-styles.css");
const Button = /*#__PURE__*/astroturf__WEBPACK_IMPORTED_MODULE_0___default()('button', null, {
  displayName: "Button",
  styles: __webpack_require__(/*! ./Button.css */ "./test/integration/Button.css"),
  attrs: null,
  vars: []
});
/* harmony default export */ __webpack_exports__["default"] = (Button);

/***/ }),

/***/ "./test/integration/main-CssProp1_div.css":
/*!************************************************!*\
  !*** ./test/integration/main-CssProp1_div.css ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
module.exports = {"cls1":"main-CssProp1_div__cls1","cls2":"main-CssProp1_div__cls2 main-CssProp1_div__cls1","foo":"main-CssProp1_div__foo"};

/***/ }),

/***/ "./test/integration/main-CssProp2_span.css":
/*!*************************************************!*\
  !*** ./test/integration/main-CssProp2_span.css ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
module.exports = {"cls1":"main-CssProp2_span__cls1","cls2":"main-CssProp2_span__cls2 main-CssProp2_span__cls1"};

/***/ }),

/***/ "./test/integration/main-FancierBox.css":
/*!**********************************************!*\
  !*** ./test/integration/main-FancierBox.css ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
module.exports = {"a0":"main-FancyBox__cls1","a1":"main-styles__parent","a2":"Button__cls1","a3":"Button__cls1","cls1":"main-FancierBox__cls1","cls2":"main-FancierBox__cls2 main-FancierBox__cls1"};

/***/ }),

/***/ "./test/integration/main-FancyBox.css":
/*!********************************************!*\
  !*** ./test/integration/main-FancyBox.css ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
module.exports = {"cls1":"main-FancyBox__cls1","cls2":"main-FancyBox__cls2 main-FancyBox__cls1 foo","primary":"main-FancyBox__primary"};

/***/ }),

/***/ "./test/integration/main-styles.css":
/*!******************************************!*\
  !*** ./test/integration/main-styles.css ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
module.exports = {"a0":"Button-styles__cool","a1":"Widget__cls1","parent":"main-styles__parent","test":"main-styles__test"};

/***/ }),

/***/ "./test/integration/main.js":
/*!**********************************!*\
  !*** ./test/integration/main.js ***!
  \**********************************/
/*! exports provided: MyComponent, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyComponent", function() { return MyComponent; });
/* harmony import */ var astroturf__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! astroturf */ "./src/runtime/styled.js");
/* harmony import */ var astroturf__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(astroturf__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var widget__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! widget */ "./test/integration/shared/widget/index.js");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Button */ "./test/integration/Button.js");
/** @jsx _j **/

/** @jsxFrag _f **/
const {
  jsx: _j,
  F: _f
} = __webpack_require__(/*! astroturf */ "./src/runtime/styled.js");






const width = 75;

const styles = __webpack_require__(/*! ./main-styles.css */ "./test/integration/main-styles.css");

const FancyBox = /*#__PURE__*/astroturf__WEBPACK_IMPORTED_MODULE_0___default()('div', null, {
  displayName: "FancyBox",
  styles: __webpack_require__(/*! ./main-FancyBox.css */ "./test/integration/main-FancyBox.css"),
  attrs: null,
  vars: []
});
const FancierBox = /*#__PURE__*/astroturf__WEBPACK_IMPORTED_MODULE_0___default()('div', null, {
  displayName: "FancierBox",
  styles: __webpack_require__(/*! ./main-FancierBox.css */ "./test/integration/main-FancierBox.css"),
  attrs: null,
  vars: []
});
function MyComponent() {
  return _j(_f, null, _j("div", {
    foo: true,
    css: [__webpack_require__(/*! ./main-CssProp1_div.css */ "./test/integration/main-CssProp1_div.css"), []]
  }, _j("div", null, "hey "), _j("span", {
    css: [__webpack_require__(/*! ./main-CssProp2_span.css */ "./test/integration/main-CssProp2_span.css"), []]
  }, "yo")));
}
/* harmony default export */ __webpack_exports__["default"] = (FancierBox);

/***/ }),

/***/ "./test/integration/shared/widget/Widget.css":
/*!***************************************************!*\
  !*** ./test/integration/shared/widget/Widget.css ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
module.exports = {"cls1":"Widget__cls1","cls2":"Widget__cls2 Widget__cls1"};

/***/ }),

/***/ "./test/integration/shared/widget/index.js":
/*!*************************************************!*\
  !*** ./test/integration/shared/widget/index.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var astroturf__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! astroturf */ "./src/runtime/styled.js");
/* harmony import */ var astroturf__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(astroturf__WEBPACK_IMPORTED_MODULE_0__);

const Widget = /*#__PURE__*/astroturf__WEBPACK_IMPORTED_MODULE_0___default()('div', null, {
  displayName: "Widget",
  styles: __webpack_require__(/*! ./Widget.css */ "./test/integration/shared/widget/Widget.css"),
  attrs: null,
  vars: []
});
/* harmony default export */ __webpack_exports__["default"] = (Widget);

/***/ })

},[["./test/integration/main.js","runtime~main","vendors~main~vendor"]]]);