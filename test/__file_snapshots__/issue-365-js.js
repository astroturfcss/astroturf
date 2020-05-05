(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js?!./node_modules/css-loader/dist/cjs.js?!./src/css-loader.ts!./test/integration/issue-365-BlockStyled.css":
/*!****************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--4-0!./node_modules/css-loader/dist/cjs.js??ref--4-1!./src/css-loader.ts!./test/integration/issue-365-BlockStyled.css ***!
  \****************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin
/* harmony default export */ __webpack_exports__["default"] = ({"cls1":"issue-365-BlockStyled__cls1","cls2":"issue-365-BlockStyled__cls2 issue-365-BlockStyled__cls1","active":"issue-365-BlockStyled__active issue-365-mixins__cls1"});

/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js?!./node_modules/css-loader/dist/cjs.js?!./src/css-loader.ts!./test/integration/issue-365-mixins.css":
/*!***********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--4-0!./node_modules/css-loader/dist/cjs.js??ref--4-1!./src/css-loader.ts!./test/integration/issue-365-mixins.css ***!
  \***********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin
/* harmony default export */ __webpack_exports__["default"] = ({"cls1":"issue-365-mixins__cls1","cls2":"issue-365-mixins__cls2 issue-365-mixins__cls1"});

/***/ }),

/***/ "./src/runtime/index.js":
/*!******************************!*\
  !*** ./src/runtime/index.js ***!
  \******************************/
/*! exports provided: stylesheet, css */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stylesheet", function() { return stylesheet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "css", function() { return css; });
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
/*! exports provided: resolveVariants, varsToStyles, jsx, F, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resolveVariants", function() { return resolveVariants; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "varsToStyles", function() { return varsToStyles; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "jsx", function() { return jsx; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "F", function() { return react__WEBPACK_IMPORTED_MODULE_0__["Fragment"]; });

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

  return Object(react__WEBPACK_IMPORTED_MODULE_0__["createElement"])(type, props, ...children);
}
jsx.F = react__WEBPACK_IMPORTED_MODULE_0__["Fragment"];

// the reason for the crazy exports here is that you need to do a BUNCH of work
// to keep typescript from eliding (removing) the jsx imports
// see: https://github.com/babel/babel/pull/11523


/* harmony default export */ __webpack_exports__["default"] = (jsx);


/***/ }),

/***/ "./src/runtime/react.js":
/*!******************************!*\
  !*** ./src/runtime/react.js ***!
  \******************************/
/*! exports provided: default, css, stylesheet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! . */ "./src/runtime/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "css", function() { return ___WEBPACK_IMPORTED_MODULE_1__["css"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "stylesheet", function() { return ___WEBPACK_IMPORTED_MODULE_1__["stylesheet"]; });

/* harmony import */ var _jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./jsx */ "./src/runtime/jsx.js");
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

  const decorated = Object(react__WEBPACK_IMPORTED_MODULE_0__["forwardRef"])((rawProps, ref) => {
    const props = attrs ? attrs(rawProps) : rawProps;
    const childProps = { ...props, ref };

    if (allowAs) delete childProps.as;
    childProps.style = Object(_jsx__WEBPACK_IMPORTED_MODULE_2__["varsToStyles"])(childProps, vars);
    childProps.className = propsToStyles(childProps, styles, hasModifiers);

    if (variants) childProps.className += ` ${Object(_jsx__WEBPACK_IMPORTED_MODULE_2__["resolveVariants"])(variants)}`;

    return Object(react__WEBPACK_IMPORTED_MODULE_0__["createElement"])(allowAs && props.as ? props.as : type, childProps);
  });

  decorated.displayName = displayName;

  decorated.withComponent = (nextType) => styled(nextType, options, settings);

  decorated.isAstroturf = true;

  return decorated;
}

/* harmony default export */ __webpack_exports__["default"] = (styled);




/***/ }),

/***/ "./test/integration/issue-365.js":
/*!***************************************!*\
  !*** ./test/integration/issue-365.js ***!
  \***************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var astroturf_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! astroturf/react */ "./src/runtime/react.js");
/* harmony import */ var astroturf_css_loader_inline_issue_365_mixins_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! astroturf/css-loader?inline!./issue-365-mixins.css */ "./node_modules/mini-css-extract-plugin/dist/loader.js?!./node_modules/css-loader/dist/cjs.js?!./src/css-loader.ts!./test/integration/issue-365-mixins.css");
/* harmony import */ var astroturf_css_loader_inline_issue_365_BlockStyled_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! astroturf/css-loader?inline!./issue-365-BlockStyled.css */ "./node_modules/mini-css-extract-plugin/dist/loader.js?!./node_modules/css-loader/dist/cjs.js?!./src/css-loader.ts!./test/integration/issue-365-BlockStyled.css");



const mixins = astroturf_css_loader_inline_issue_365_mixins_css__WEBPACK_IMPORTED_MODULE_1__["default"].cls1;
const Block = /*#__PURE__*/React.createElement(BlockStyled, {
  active: false
});
const BlockStyled = /*#__PURE__*/Object(astroturf_react__WEBPACK_IMPORTED_MODULE_0__["default"])("div", null, {
  displayName: "BlockStyled",
  styles: astroturf_css_loader_inline_issue_365_BlockStyled_css__WEBPACK_IMPORTED_MODULE_2__["default"]
});

/***/ })

},[["./test/integration/issue-365.js","runtime~main","vendors~main~vendor"]]]);