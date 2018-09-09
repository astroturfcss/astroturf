# css-literal-loader

A webpack loader and babel plugin for extracting and processing css defined in other files.

"Inline css" that just works with CSS, PostCSS, Less, Sass, or any other css preprocessor, and plays nicely with existing style tooling like `extract-text-webpack-plugin`.

```js
import React from 'react';
import { css } from 'css-literal-loader/styled';

const styles = css`
  .button {
    color: black;
    border: 1px solid black;
    background-color: white;
  }
`;

export default function Button({ children }) {
  return <button className={styles.button}>{children}</button>;
}
```

When processed, the `css` block will be extracted and treated as a `.css` file, taking advantage of any and all of the other loaders configured to handle css.

It even handles statically analyzable interpolations!

```js
import { css } from 'css-literal-loader/styled';

const margin = 10;
const height = 50;
const bottom = height + margin;

const styles = css`
  .box {
    height: ${height}px;
    margin-bottom: ${margin}px;
  }

  .footer {
    position: absolute;
    top: ${bottom}px;
  }
`;
```

### Experimental component API

For those that want something a bit more like styled-components, there is an experimental component API!

```js
import { styled, css } from 'css-literal-loader/styled'; // import needed!

const Button = styled('button')`
  color: black;
  border: 1px solid black;
  background-color: white;

  &.primary {
    color: blue;
    border: 1px solid blue;
  }

  &.color-green {
    color: green;
  }
`;
```

You can render this with:

```js
render(
  <Button primary color="green">
    A styled button
  </Button>,
  mountNode,
);
```

The above transpiles to something like:

```js
const styles = css`
  .button {
    color: black;
    border: 1px solid black;
    background-color: white;

    &.primary {
      color: blue;
      border: 1px solid blue;
    }

    &.color-green {
      color: green;
    }
  }
`;

function Button({ primary, color, className, ...props }) {
  return (
    <div
      {...props}
      className={classNames(
        className,
        styles.button,
        primary && styles.primary,
        color === 'green' && styles.colorGreen,
      )}
    />
  );
}
```

Styles are still extracted to a separate file, any props matching other defined classes are passed to the `classNames()` library. At runtime `styled()` returns a React component with the static CSS classes applied. You can check out the ["runtime"](https://github.com/4Catalyzer/css-literal-loader/blob/master/src/runtime/styled.js#L16) it just creates a component.

There are a whole bucket of caveats of course, to keep the above statically extractable, and limit runtime code.

* We assume you are using css-modules in your css pipeline to return classes from the style files, we don't do any of that ourselves.
* Prop value handling requires the nesting transform
* All "top level" styles have any @import statements hoisted up (via a regex)

### WHY?!

The goal of this API is not to mimic or reimplement the features of other css-in-js libraries, but to provide
a more ergonomic way to write normal css/less/sass next to your javascript.

What does that mean? css-in-js libraries are often a _replacement_ for css preprocessors, in that they provide ways of doing variables, composition, mixins, imports etc. Usually they accomplish this by leaning
on JS language features where appropriate, and adding there own domain-specific language bits when needed.

css-literal-loader **doesn't try to do any of that** because it's not trying to replace preprocessors but rather, make component-centric javascript work better with **existing** styling tooling. This means at a minimum it needs to scope styles to the component (handled by css-modules) and map those styles to your component's API (props), which is what the above API strives for.

#### Composition, variables, etc?

How you accomplish that is mostly up to your preprocessor. Leverage Sass variables, or Less mixins, orpostcss nesting polyfills, or whatever. The css you'r writing is treated just like a normal style file so all the tooling your used to works here. For composition specifically around classes you can also use css-modules `composes` to compose styles, since
css-literal-loader extracts styles to consistent names;

```js
// Button.js

const helpers = css`
  .heavy {
    font-weight: 900;
  }
`;

const Title = styled('h3')`
  composes: heavy from './Button-helpers.css';

  font-size: 12%;
`;
```

You can also don't have to define everything in a `.js` file. Where it makes sense just use normal css (or which tfile type) is appropriate.

```scss
// mixins.scss
@mixin heavy() {
  font-weight: 900;
}
```

and then:

```
// Button.js
const Title = styled('h3')`
  @import './mixins.scss';

  @include heavy();
  font-size: 12%;
`;
```

### With props

It can also be useful to create components with props already applied, like the example below. We recommend using recompose's `withProps` higher-order component to do this.

**[`withProps` documentation](https://github.com/acdlite/recompose/blob/master/docs/API.md#withprops)**

```jsx
import { styled } from 'css-literal-loader/styled';
import withProps from 'recompose/withProps';

const PasswordInput = withProps({ type: 'password' })(styled('input')`
  background-color: #ccc;
`);
```

## Setup

Add the css-literal-loader to JavaScript loader configuration, and whatever you want to handle `.css` files:

```js
{
 module: {
   rules: {
     {
       test: /\.css$/,
       use: [
         'style-loader',
        { loader: 'css-loader', options: { modules: true } }
      ],
     },
     {
       test: /\.js$/,
       use: ['babel-loader','css-literal-loader'],
     },
     // css-literal-loader works out of the box with typescript (.ts or .tsx files).
     {
       test: /\.tsx?$/,
       use: ['ts-loader','css-literal-loader'],
     },
   }
 }
}
```

### Options

css-literal-loader accepts a few query options.

* **tagName**: (default: `'css'`) The tag identifier used to locate inline css literals and extract them.
* **styledTag**: (default: `undefined`) The tag identifier used to locate components. By default it will auto-detect variables based on `import`.
* **extension**: (default: `'.css'`) the extension used for extracted "virtual" files. Change to whatever file type you want webpack to process extracted literals as.

**Note:** css-literal-loader expects uncompiled JavaScript code, If you are using babel or Typescript to transform tagged template literals, ensure the loader runs _before_ babel or typescript loaders.

## Use without webpack

If you aren't using webpack and still want to define styles inline, there is a babel plugin for that.

Config shown below with the default options.

```js
// babelrc.js
module.exports = {
  plugins: [
    [
      'css-literal-loader/babel',
      {
        tagName: 'css',
        extension: '.css',
        writeFiles: true, // Writes css files to disk using the result of `getFileName`
        getFileName(hostFilePath, pluginsOptions) {
          const basepath = join(
            dirname(hostFilePath),
            basename(hostFilePath, extname(hostFilePath)),
          );
          return `${basepath}__extracted_style${opts.extension}`;
        },
      },
    ],
  ],
};
```

The extracted styles are also available on the `metadata` object returned from `babel.transform`.

```js
const { metadata } = babel.transformFile(myJsfile);

metadata['css-literal-loader'].styles; // [{ path, value }]
```
