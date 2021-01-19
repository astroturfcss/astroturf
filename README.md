# astroturf

**astroturf** lets you write CSS in your JavaScript files without adding any runtime layer, and with your existing CSS processing pipeline.

- **Zero runtime CSS-in-JS.** Get many of the same benefits as CSS-in-JS, but without the loss of flexibility in requiring framework-specific CSS processing, and while keeping your CSS fully static with no runtime style parsing.
- Use your existing tools – **Sass, PostCSS, Less** – but still write your style definitions in your JavaScript files
- **Whole component in the single file**. Write CSS in a template literal, then use it as if it were in a separate file

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Usage](#usage)
- [Component API](#component-api)
- [`css` prop](#css-prop)
- [Component API Goals and Non-Goals](#component-api-goals-and-non-goals)
- [Composition, variables, etc?](#composition-variables-etc)
- [Referring to other Components](#referring-to-other-components)
- [Sharing values between styles and JavaScript](#sharing-values-between-styles-and-javascript)
- [Keyframes and global](#keyframes-and-global)
- [Attaching Additional Props](#attaching-additional-props)
- [`as` prop](#as-prop)
- [Setup](#setup)
  - [Options](#options)
  - [Use with Parcel](#use-with-parcel)
  - [Use with Rollup](#use-with-rollup)
  - [Use with Gatsby](#use-with-gatsby)
  - [Use with Preact](#use-with-preact)
  - [Use with Next.js](#use-with-nextjs)
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

## Component API

For those that want something a bit more like styled-components or Emotion, there is a component API!

```js
import styled, { css } from 'astroturf/react';

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

## `css` prop

In addition to the `styled` helper, styles can be defined directly on components via the `css` prop.
You first need to enable this feature via the `enableCssProp` option in your loader config

```jsx
function Button({ variant, bgColor, children }) {
  return (
    <button
      css={css`
        color: black;
        border: 1px solid black;
        background-color: ${bgColor};

        ${variant === 'primary' &&
        css`
          color: blue;
          border: 1px solid blue;
        `}

        ${variant === 'secondary' &&
        css`
          color: green;
        `}
      `}
    >
      {children}
    </button>
  );
}
```

Styles are still extracted to a separate file, any props matching other defined classes are passed to the `classNames()` library. At runtime `styled()` returns a React component with the static CSS classes applied. You can check out the ["runtime"](https://github.com/4Catalyzer/astroturf/blob/master/src/runtime/styled.js) it just creates a component.

There are a whole bucket of caveats of course, to keep the above statically extractable, and limit runtime code.

- We assume you are using css-modules in your css pipeline to return classes from the style files, we don't do any of that ourselves.
- Prop value handling requires the nesting transform
- All "top level" styles have any @import statements hoisted up (via a regex)

## Component API Goals and Non-Goals

The goal of this API is not to mimic or reimplement the features of other css-in-js libraries, but to provide
a more ergonomic way to write normal css/less/sass next to your javascript.

What does that mean? css-in-js libraries are a _replacement_ for css preprocessors, in that they provide ways of doing variables, composition, mixins, imports etc. Usually they accomplish this by leaning
on JS language features where appropriate, and adding their own domain-specific language bits when needed.

astroturf **doesn't try to do any of that** because it's not trying to replace preprocessors, but rather, make component-centric javascript work better with **existing** styling tooling. This means at a minimum it needs to scope styles to the component (handled by css-modules) and map those styles to your component's API (props), which is what the above API strives for.

This approach **gains** us:

- No additional work to extract styles for further optimization (autoprefixer, minifying, moving them to a CDN, etc)
- The smallest runtime, it's essentially zero
- Blazing Fast™ because there is zero runtime evaluation of styles
- Leverage the well-trod and huge css preprocesser ecosystems

It also means we **sacrifice**:

- A fine-grained style mapping to props. Props map to classes, its all very BEM-y but automated
- Dynamism in sharing values between js and css
- A unified JS-only headspace, you still need to think in terms of JS and CSS

## Composition, variables, etc?

How you accomplish that is mostly up to your preprocessor. Leverage Sass variables, or Less mixins, or postcss nesting polyfills, or whatever. The css you're writing is treated exactly like a normal style file so all the tooling you're used to works as expected. For composition, specifically around classes, you can also use css-modules `composes` to compose styles and interpolation;

```js
// Button.js

const heavy = css`
  font-weight: 900;
`;

const Title = styled('h3')`
  composes: ${heavy};

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

## Referring to other Components

One limitation to fully encapsulated styles is that it's hard to contextually style components
without them referencing each other. In astroturf you can use a component in a
selector as if it were referencing a class selector.

> Note: Referencing stylesheets or styled components from other files has a few caveats:
> [cross-file-dependencies](/docs/cross-file-dependencies.md)

```js
const Link = styled.a`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  background: papayawhip;
  color: palevioletred;
`;

const Icon = styled.svg`
  flex: none;
  transition: fill 0.25s;
  width: 48px;
  height: 48px;

  ${Link}:hover & {
    fill: rebeccapurple;
  }
`;
```

## Sharing values between styles and JavaScript

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
  state = { isMobile: false }

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

## Keyframes and global

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

## Attaching Additional Props

A common task with styled components is to map their props or set default values.
astroturf cribs from Styled Components, by including an `attrs()` api.

```jsx
import styled from 'astroturf/react';

// Provide a default `type` props
const PasswordInput = styled('input').attrs({
  type: 'password',
})`
  background-color: #ccc;
`;

// Map the incoming props to a new set of props
const TextOrPasswordInput = styled('input').attrs(
  ({ isPassword, ...props }) => ({
    ...props,
    type: isPassword ? 'password' : 'text',
  }),
)`
  background-color: #ccc;
`;
```

Because `attrs()` is resolved during render you can use hooks in them! We even
do some magic in the non-function signature so that it works.

```js
const Link = styled('a').attrs(props => ({
  href: useRouter().createHref(props.to)
}))`
  color: blue;
`);

// astroturf will automatically compile to a function
// when using a plain object so that the hooks
// are only evaluated during render
const Link = styled(MyLink).attrs({
  router: useRouter()
})`
  color: blue;
`);
```

## `as` prop

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
`;
```

## Setup

This is all the setup necessary:

```js
{
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
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
    ];
  }
}
```

You can add on here as you would normally for additional preprocesser setup. Here's how you might set up Sass:

```js
{
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
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
    ],
  }
}
```

Since astroturf outputs CSS modules, it's best to use a `.module.*` extension. This
automatically tells webpack's `css-loader` to process the stlyes correctly and expose the
class names as exports for JS files. You can use whatever extension you like though, but
may need to manually configure CSS modules elsewhere.

### Options

astroturf accepts a few query options.

- **stylesheetTagName**: (default: `'stylesheet'`) The tag identifier used to locate inline stylesheets declarations.
- **cssTagName**: (default: `'css'`) The tag identifier used to locate inline css literals and extract them.
- **styledTagName**: (default: `'styled'`) The tag identifier used to locate components.
- **extension**: (default: `.'module.css'`) the extension used for extracted "virtual" files. Change to whatever file type you want webpack to process extracted literals as. It's generally
  best to use a `.module.*` extension because `css-loader` automatically processes files ending with a `.module` extension as CSS modules.
- **enableCssProp**: (default: true) compiles `css` props to styled components.
- **enableDynamicInterpolations**: (default: 'cssProp') enables or disables custom value interpolation, You can disable this feature if you need to target environments that
  do not support CSS custom properties.

**Note:** astroturf expects uncompiled JavaScript code, If you are using babel or Typescript to transform tagged template literals, ensure the loader runs _before_ babel or typescript loaders.

### Use with Parcel

Add these lines to `package.json` to work with [Parcel](https://parceljs.org/) builder:

```json
  "postcss": {
    "modules": true,
    "plugins": [
      "postcss-nested"
    ]
  },
  "babel": {
    "plugins": [
      "astroturf/plugin"
    ]
  },
```

### Use with Rollup

Add [babel](https://github.com/rollup/plugins/tree/master/packages/babel) and [postcss](https://github.com/egoist/rollup-plugin-postcss) plugins to [Rollup](https://rollupjs.org/) config file:

```js
plugins: [
  babel({
    plugins: ['astroturf/plugin'],
  }),
  postcss({
    extract: 'app.css',
    modules: true,
    plugins: [postcssNested],
  }),
];
```

See [example repl](https://repl.it/@vladshcherbin/rollup-astroturf#rollup.config.js)

### Use with Gatsby

See [gatsby-plugin-astroturf](https://github.com/silvenon/gatsby-plugin-astroturf)

### Use with Preact

Add these lines to `package.json` to work with [Preact](https://preactjs.com/):

```json
  "browser": {
    "react": "preact"
  },
```

### Use with Next.js

See [example](https://github.com/zeit/next.js/tree/canary/examples/with-astroturf)

### Use without webpack

If you aren't using webpack and still want to define styles inline, there is a babel preset for quickly configuring astroturf.

Config shown below with the default options.

```js
// babelrc.js
module.exports = {
  presets: [
    [
      'astroturf/preset',
      {
        cssTagName: 'css',
        extension: '.module.css',
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
