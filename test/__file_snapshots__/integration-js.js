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

const camelCase = str => (str.match(reWords) || []).reduce((acc, next) => acc + (!acc ? next : next[0].toUpperCase() + next.slice(1)), '');

function propsToStyles(props, styles, hasModifiers) {
  const componentClassName = styles.cls2 || styles.cls1;
  let className = props.className ? `${props.className} ${componentClassName}` : componentClassName;

  if (hasModifiers) {
    Object.keys(props).forEach(propName => {
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
    if (Array.isArray(type)) throw new Error('This styled() template tag was mistakenly evaluated at runtime. ' + 'Make sure astroturf is properly configured to compile this file');
    if (typeof settings === 'string') throw new Error('It looks like you have incompatible astroturf versions in your app. ' + 'This runtime expects styles compiled with a newer version of astroturf, ' + 'ensure that your versions are properly deduped and upgraded. ');
  }

  const {
    displayName,
    attrs,
    styles
  } = settings;
  options = options || {
    allowAs: typeof type === 'string'
  }; // always passthrough if the type is a styled component

  const allowAs = type.isAstroturf ? false : options.allowAs;
  const hasModifiers = Object.keys(styles).some(className => className !== (styles.cls2 || styles.cls1));

  function Styled(rawProps, ref) {
    const props = attrs ? attrs(rawProps) : rawProps;
    const childProps = { ...props,
      ref
    };
    if (allowAs) delete childProps.as;
    childProps.className = propsToStyles(childProps, styles, hasModifiers);
    return React.createElement(allowAs && props.as ? props.as : type, childProps);
  }

  const decorated = React.forwardRef ? React.forwardRef(Styled) : props => Styled(props, null);
  decorated.displayName = displayName;

  decorated.withComponent = nextType => styled(nextType, options, settings);

  decorated.isAstroturf = true;
  return decorated;
}

function jsx(type, props, ...children) {
  if (props.css) {
    const {
      css,
      ...childProps
    } = props;
    childProps.className = propsToStyles(childProps, css, true);
    props = childProps;
  }

  return React.createElement(type, props, ...children);
}

module.exports = styled;
module.exports.styled = styled;
module.exports.jsx = jsx;

if (__DEV__) {
  module.exports.css = () => {
    throw new Error('css template literal evaluated at runtime. ' + 'Make sure astroturf is properly configured to compile this file');
  };
}

/***/ }),

/***/ "./test/integration/index-Button.css":
/*!*******************************************!*\
  !*** ./test/integration/index-Button.css ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
module.exports = {"cls1":"index-Button__cls1","cls2":"index-Button__cls2 index-Button__cls1 button-with-caret"};

/***/ }),

/***/ "./test/integration/index-CssProp1_div.css":
/*!*************************************************!*\
  !*** ./test/integration/index-CssProp1_div.css ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
module.exports = {"cls1":"index-CssProp1_div__cls1","foo":"index-CssProp1_div__foo"};

/***/ }),

/***/ "./test/integration/index-CssProp2_span.css":
/*!**************************************************!*\
  !*** ./test/integration/index-CssProp2_span.css ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
module.exports = {"cls1":"index-CssProp2_span__cls1"};

/***/ }),

/***/ "./test/integration/index-FancierBox.css":
/*!***********************************************!*\
  !*** ./test/integration/index-FancierBox.css ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
module.exports = {"a0":"index-FancyBox__cls1","a1":"index-styles__parent","cls1":"index-FancierBox__cls1"};

/***/ }),

/***/ "./test/integration/index-FancyBox.css":
/*!*********************************************!*\
  !*** ./test/integration/index-FancyBox.css ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
module.exports = {"cls1":"index-FancyBox__cls1","primary":"index-FancyBox__primary","cls2":"index-FancyBox__cls2 index-FancyBox__cls1 foo"};

/***/ }),

/***/ "./test/integration/index-styles.css":
/*!*******************************************!*\
  !*** ./test/integration/index-styles.css ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
module.exports = {"parent":"index-styles__parent"};

/***/ }),

/***/ "./test/integration/index.js":
/*!***********************************!*\
  !*** ./test/integration/index.js ***!
  \***********************************/
/*! exports provided: Button, MyComponent, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Button", function() { return Button; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyComponent", function() { return MyComponent; });
/* harmony import */ var astroturf__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! astroturf */ "./src/runtime/styled.js");
/* harmony import */ var astroturf__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(astroturf__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/** @jsx _AstroTurfJsx **/

/** @jsxFrag React.Fragment **/
const {
  jsx: _AstroTurfJsx
} = __webpack_require__(/*! astroturf */ "./src/runtime/styled.js");

const _default = __webpack_require__(/*! ./index-CssProp1_div.css */ "./test/integration/index-CssProp1_div.css");

const _default2 = __webpack_require__(/*! ./index-CssProp2_span.css */ "./test/integration/index-CssProp2_span.css"); // eslint-disable-next-line import/no-unresolved
// eslint-disable-next-line import/no-unresolved




const width = 75;

const styles = __webpack_require__(/*! ./index-styles.css */ "./test/integration/index-styles.css");

const FancyBox = astroturf__WEBPACK_IMPORTED_MODULE_0___default()('div', null, {
  displayName: "FancyBox",
  styles: __webpack_require__(/*! ./index-FancyBox.css */ "./test/integration/index-FancyBox.css"),
  attrs: null
});
const FancierBox = astroturf__WEBPACK_IMPORTED_MODULE_0___default()('div', null, {
  displayName: "FancierBox",
  styles: __webpack_require__(/*! ./index-FancierBox.css */ "./test/integration/index-FancierBox.css"),
  attrs: null
});
const Button = astroturf__WEBPACK_IMPORTED_MODULE_0___default()('button', null, {
  displayName: "Button",
  styles: __webpack_require__(/*! ./index-Button.css */ "./test/integration/index-Button.css"),
  attrs: null
});
function MyComponent() {
  return _AstroTurfJsx(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, null, _AstroTurfJsx("div", {
    foo: true,
    css: _default
  }, _AstroTurfJsx("div", null, "hey "), _AstroTurfJsx("span", {
    css: _default2
  }, "yo")));
}
/* harmony default export */ __webpack_exports__["default"] = (FancierBox);

/***/ })

},[["./test/integration/index.js","runtime~main","vendors~main~vendor"]]]);