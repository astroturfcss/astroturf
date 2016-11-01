css-literal-loader
====

A webpack loader for extracting and processing css defined in other files.

"Inline css" that just works with css modules, extract-text-webpack-plugin, postCSS, LESS, SASS, or any other css preprocessor or loader.

```js
import React from 'react';

const styles = css`
  .button {
    color: black;
    border: 1px solid black;
    background-color: white;
  }
`;

export default function Button(props) {
  return <button className={styles.button} {...props} />
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

Add the css-literal-loader to js/jsx file loaders, and whatever you want to handle `.css` files:

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

You can change the "tag" name used to locate style definitions (by default `"css"`), by adding the `query: { tagName: 'myCustomName'}` to the loader query.

**Note:** css-literal-loader expects uncompiled JavaScript code, If you are using babel to transform tagged template literals, you ensure the loader runs _before_ the babel loader.
