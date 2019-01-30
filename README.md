# astroturf

**astroturf** lets you write CSS in your JavaScript files without adding any runtime layer, and with your existing CSS processing pipeline.

- **Zero runtime CSS-in-JS.** Get many of the same benefits as CSS-in-JS, but without the loss of flexibility in requiring framework-specific CSS processing, and while keeping your CSS fully static with no runtime style parsing.
- Use your existing tools – **Sass, PostCSS, Less** – but still write your style definitions in your JavaScript files
- **Whole component in the single file**. Write CSS in a template literal, then use it as if it were in a separate file


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Usage](#usage)
- [Extensions](#extensions)
- [Component API](#component-api)
  - [WHY?!](#why)
  - [Composition, variables, etc?](#composition-variables-etc)
  - [Sharing values between styles and JavaScript](#sharing-values-between-styles-and-javascript)
  - [Keyframes and global](#keyframes-and-global)
  - [With props](#with-props)
  - [`as` prop](#as-prop)
- [Setup](#setup)
  - [Options](#options)
  - [Use without webpack](#use-without-webpack)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage

```js
import React from 'react';
import { css } from 'astroturf';

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

When processed, the `css` block will be extracted into a `.css` file, taking advantage of any and all of the other loaders configured to handle css.

It even handles statically analyzable interpolations!

```js
import { css } from 'astroturf';

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

## Extensions

- [gatsby-plugin-astroturf](https://github.com/silvenon/gatsby-plugin-astroturf)

## Component API

For those that want something a bit more like styled-components or emotion, there is a component API!

```js
import styled, { css } from 'astroturf';

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
    <button
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

Styles are still extracted to a separate file, any props matching other defined classes are passed to the `classNames()` library. At runtime `styled()` returns a React component with the static CSS classes applied. You can check out the ["runtime"](https://github.com/4Catalyzer/astroturf/blob/master/src/runtime/styled.js#L16) it just creates a component.

There are a whole bucket of caveats of course, to keep the above statically extractable, and limit runtime code.

- We assume you are using css-modules in your css pipeline to return classes from the style files, we don't do any of that ourselves.
- Prop value handling requires the nesting transform
- All "top level" styles have any @import statements hoisted up (via a regex)

### WHY?!

The goal of this API is not to mimic or reimplement the features of other css-in-js libraries, but to provide
a more ergonomic way to write normal css/less/sass next to your javascript.

What does that mean? css-in-js libraries are often a _replacement_ for css preprocessors, in that they provide ways of doing variables, composition, mixins, imports etc. Usually they accomplish this by leaning
on JS language features where appropriate, and adding their own domain-specific language bits when needed.

astroturf **doesn't try to do any of that** because it's not trying to replace preprocessors but rather, make component-centric javascript work better with **existing** styling tooling. This means at a minimum it needs to scope styles to the component (handled by css-modules) and map those styles to your component's API (props), which is what the above API strives for.

This approach **gains** us:

- No additional work to extract styles for further optimization (autoprefixer, minifying, moving them to a CDN, etc)
- The smallest runtime, it's essentially zero
- Blazing Fast™ because there is zero runtime evaluation of styles
- Leverage the well-trod and huge css preprocesser ecosystems

It also means we **sacrifice**:

- A fine-grained style mapping to props. Props map to classes, its all very BEM-y but automated
- Dynamism in sharing values between js and css
- A unified JS-only headspace, you still need to think in terms of JS and CSS

### Composition, variables, etc?

How you accomplish that is mostly up to your preprocessor. Leverage Sass variables, or Less mixins, or postcss nesting polyfills, or whatever. The css you're writing is treated exactly like a normal style file so all the tooling you're used to works as expected. For composition, specifically around classes, you can also use css-modules `composes` to compose styles, since astroturf extracts styles to consistent names;

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

You don't have to define everything in a `.js` file. Where it makes sense just use normal css (or any other file type).

```scss
// mixins.scss
@mixin heavy() {
  font-weight: 900;
}
```

and then:

```js
// Button.js
const Title = styled('h3')`
  @import './mixins.scss';

  @include heavy();
  font-size: 12%;
`;
```

### Sharing values between styles and JavaScript

We've found that in practice, you rarely have to share values between the two, but there are times when it's
very convenient. Astroturf ofters two ways to do this, the first is string interpolations.

```js
const DURATION = 500;

const ColorTransition = styled('nav')`
  color: red;
  transition: color ${DURATION}ms;

  &.blue {
    color: blue;
  }
`;

class App extends React.Component {
  state = { blue: false }
  toggle = () => {
    this.setState(s => ({ blue: !s.blue }), () => {
      setTimeout(() => console.log('done!'), DURATION)
    })
  }
  render() {
    const { blue } = this.state
    <div>
      <ColorTransition blue={blue} />
      <button onClick={this.toggle}>Toggle Color</button>
    </div>;
  }
}
```

This works great for local variables, since the compiler can determine their
value at compile time and share them. For cases when you want to share things a bit more globally, such as in a theme, we recommend leaning on your css preprocesser again.

css-modules provides a syntax for exporting values from styles, generally this is used for class names, but you can leverage it for whatever values you want. Combined with something like Sass's variables it ends up being a powerful tool.

```js
const breakpointValues = css`
  @import '../styles/theme';

  :export {
    @each $breakpoint, $px in $grid-breakpoints {
      #{$breakpoint}: $px;
    }
  }
`

class Responsive extends React.Component {
  state = { blue: false }
  componentDidMount() {
    this.setState({
      isMobile: window.clientWidth < parseInt(breakpoints.md, 10)
    })
  }

  render() {
    const { isMobile } = this.state
    <div>
      {isMobile ? 'A small screen!' : 'A big screen!'}
    </div>;
  }
}
```

### Keyframes and global

Everything in `css` will be used as normal CSS Modules styles.
So, if you need to insert some CSS without isolation (like reset with [postcss-normalize](https://github.com/csstools/postcss-normalize)):

```js
css`
  @import-normalize;

  :global(.btn) {
    background: blue;
  }
`;
```

With [postcss-nested](https://github.com/postcss/postcss-nested) you can
add keyframes to specific component (and keyframes name will not be global):

```js
const Loader = styled('div')`
  animation-name: rotation;
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;

  @keyframes rotation {
    to {
      transform: rotate(360deg);
    }
  }
`;
```

### With props

It can also be useful to create components with props already applied, like the example below. We recommend using recompose's `withProps` higher-order component to do this.

**[`withProps` documentation](https://github.com/acdlite/recompose/blob/master/docs/API.md#withprops)**

```jsx
import styled from 'astroturf';
import withProps from 'recompose/withProps';

const PasswordInput = withProps({ type: 'password' })(styled('input')`
  background-color: #ccc;
`);
```

### `as` prop

`astroturf` supports the `as` prop to control the underlying element type at runtime.

```js
const Button = styled('button')`
  color: red;
`

<Button as="a" href="#link"/>
```

**This feature is only enabled by default for host components**, e.g. native DOM elements. We do this to prevent annoying conflicts with other UI libraries like react-bootstrap or semantic-ui which also use the the `as` prop. If you want to enable it for any styled component you can do so via the `allowAs` option.

```js
const StyledFooter = styled(Footer, { allowAs: true })`
  color: red;
`
```

## Setup

If you want the simplest, most bare-bones setup you can use the included `css-loader` which will setup css-modules and postcss-nested. This is the minimum setup necessary to get it working. Any options passed to the loader are passed to the official webpack `css-loader`

```js
{
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'astroturf/css-loader'],
      },
      {
        test: /\.jsx?$/,
        use: ['babel-loader', 'astroturf/loader'],
      },
      // astroturf works out of the box with typescript (.ts or .tsx files).
      {
        test: /\.tsx?$/,
        use: ['ts-loader', 'astroturf/loader'],
      },
    }
  ]
}
```

You can add on here as you would normally for additional preprocesser setup. Here's how you might set up Sass:

```js
{
  module: {
    rules: [
      {
        test: /\module\.scss$/,
        use: ['style-loader', 'astroturf/css-loader', 'sass-loader'],
      },
      {
        test: /\.jsx?$/,
        use: [
          'babel-loader',
          {
            loader: 'astroturf/loader',
            options: { extension: '.module.scss' },
          },
        ],
      },
    ];
  }
}
```

You can also skip the included `css-loader` entirely if your preprocessor handles nesting out of the box (like most do).

```js
[
  {
    test: /\.scss$/,
    use: ['style-loader', 'css-loader?modules=true', 'sass-loader'],
  },
  ...
]
```

### Options

astroturf accepts a few query options.

- **tagName**: (default: `'css'`) The tag identifier used to locate inline css literals and extract them.
- **styledTag**: (default: `'styled'`) The tag identifier used to locate components.
- **extension**: (default: `'.css'`) the extension used for extracted "virtual" files. Change to whatever file type you want webpack to process extracted literals as.

**Note:** astroturf expects uncompiled JavaScript code, If you are using babel or Typescript to transform tagged template literals, ensure the loader runs _before_ babel or typescript loaders.

### Use without webpack

If you aren't using webpack and still want to define styles inline, there is a babel plugin for that.

Config shown below with the default options.

```js
// babelrc.js
module.exports = {
  plugins: [
    [
      'astroturf/plugin',
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

metadata['astroturf'].styles; // [{ path, value }]
```
