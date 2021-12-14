"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["main"],{

/***/ "./integration/issue-365.js":
/*!**********************************!*\
  !*** ./integration/issue-365.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var astroturf_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! astroturf/react */ "../src/runtime/react.js");
/* harmony import */ var issue_365_mixins_module_css_astroturf_inline_loader_style_Users_jquense_src_astroturf_test_integration_issue_365_js_mixins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! issue-365-mixins.module.css!=!astroturf/inline-loader?style!./integration/issue-365.js?mixins */ "issue-365-mixins.module.css!=!../src/inline-loader.ts?style!./integration/issue-365.js?mixins");
/* harmony import */ var issue_365_BlockStyled_module_css_astroturf_inline_loader_style_Users_jquense_src_astroturf_test_integration_issue_365_js_BlockStyled__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! issue-365-BlockStyled.module.css!=!astroturf/inline-loader?style!./integration/issue-365.js?BlockStyled */ "issue-365-BlockStyled.module.css!=!../src/inline-loader.ts?style!./integration/issue-365.js?BlockStyled");



const mixins = issue_365_mixins_module_css_astroturf_inline_loader_style_Users_jquense_src_astroturf_test_integration_issue_365_js_mixins__WEBPACK_IMPORTED_MODULE_1__.default.cls2;
const Block = /*#__PURE__*/React.createElement(BlockStyled, {
  active: false
});
const BlockStyled = /*#__PURE__*/(0,astroturf_react__WEBPACK_IMPORTED_MODULE_0__.default)("div", null, {
  displayName: "BlockStyled",
  styles: issue_365_BlockStyled_module_css_astroturf_inline_loader_style_Users_jquense_src_astroturf_test_integration_issue_365_js_BlockStyled__WEBPACK_IMPORTED_MODULE_2__.default
});

/***/ }),

/***/ "issue-365-BlockStyled.module.css!=!../src/inline-loader.ts?style!./integration/issue-365.js?BlockStyled":
/*!***************************************************************************************************************!*\
  !*** issue-365-BlockStyled.module.css!=!../src/inline-loader.ts?style!./integration/issue-365.js?BlockStyled ***!
  \***************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"cls1":"issue-365__cls1-2fz","cls2":"issue-365__cls2-1Im issue-365__cls1-2fz","active":"issue-365__active--Om issue-365__cls2-qZK issue-365__cls1-1l7"});

/***/ }),

/***/ "issue-365-mixins.module.css!=!../src/inline-loader.ts?style!./integration/issue-365.js?mixins":
/*!*****************************************************************************************************!*\
  !*** issue-365-mixins.module.css!=!../src/inline-loader.ts?style!./integration/issue-365.js?mixins ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"cls1":"issue-365__cls1-3C5","cls2":"issue-365__cls2-129 issue-365__cls1-3C5"});

/***/ }),

/***/ "../src/runtime/index.js":
/*!*******************************!*\
  !*** ../src/runtime/index.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "stylesheet": () => (/* binding */ stylesheet),
/* harmony export */   "css": () => (/* binding */ css)
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

/***/ "../src/runtime/jsx.js":
/*!*****************************!*\
  !*** ../src/runtime/jsx.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "resolveVariants": () => (/* binding */ resolveVariants),
/* harmony export */   "varsToStyles": () => (/* binding */ varsToStyles),
/* harmony export */   "jsx2": () => (/* binding */ jsx2),
/* harmony export */   "jsx": () => (/* binding */ jsx),
/* harmony export */   "F": () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.Fragment),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../node_modules/react/index.js");
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

function jsx2(fn, type, props, ...args) {
  if (props && props.css) {
    const { css, className, ...childProps } = props;
    const componentClassName = css[0].cls2 || css[0].cls1;
    childProps.style = varsToStyles(childProps, css[1]);
    childProps.className = `${
      className ? `${className} ${componentClassName}` : componentClassName
    } ${resolveVariants(css[2])}`;
    props = childProps;
  }
  return fn(type, props, ...args);
}
function jsx(type, props, ...children) {
  return jsx2(react__WEBPACK_IMPORTED_MODULE_0__.createElement, type, props, ...children);
}

jsx.F = react__WEBPACK_IMPORTED_MODULE_0__.Fragment;
jsx.jsx2 = jsx2;

// the reason for the crazy exports here is that you need to do a BUNCH of work
// to keep typescript from eliding (removing) the jsx imports
// see: https://github.com/babel/babel/pull/11523


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (jsx);


/***/ }),

/***/ "../src/runtime/react.js":
/*!*******************************!*\
  !*** ../src/runtime/react.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "css": () => (/* reexport safe */ ___WEBPACK_IMPORTED_MODULE_2__.css),
/* harmony export */   "stylesheet": () => (/* reexport safe */ ___WEBPACK_IMPORTED_MODULE_2__.stylesheet)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../node_modules/react/index.js");
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! . */ "../src/runtime/index.js");
/* harmony import */ var _jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./jsx */ "../src/runtime/jsx.js");
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
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendors-node_modules_react_index_js"], () => (__webpack_exec__("./integration/issue-365.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);