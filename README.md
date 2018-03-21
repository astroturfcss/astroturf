# css-literal-loader

A webpack loader and babel plugin for extracting and processing css defined in other files.

"Inline css" that just works with CSS, PostCSS, Less, Sass, or any other css preprocessor, and plays nicely with existing style tooling like `extract-text-webpack-plugin`.

```js
import React from 'react';

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

## Setup

Add the css-literal-loader to JavaScript loader configuration, and whatever you want to handle `.css` files:

```js
{
 module: {
   loaders: {
     {
       test: /\.css$/,
       loader: 'style!css?modules',
     },
     {
       test: /\.js$/,
       loader: 'babel!css-literal',
     },
   }
 }
}
```

### Options

css-literal-loader accepts a few query options.

* **tagName**: (default: `'css'`) The tag identifier used to locate inline css literals and extract them.
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
