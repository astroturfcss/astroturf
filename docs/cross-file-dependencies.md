# Cross File Dependencies

astroturf allows targeting other styled components, or stylesheet modules.

**ButtonToolbar.js**

```js
import styled from 'astroturf';

import Button from './Button';

const ButtonToolbar = styled('div')`
  display: inline-flex;
  align-items: center;'

  & > ${Button} {
    margin-right: 3rem;
  }
`;
```

Under the hood this makes use of the css-modules `composes` feature to import
css classes from other files and compose them into the new class selector.

Rather than try and track exports of style sheets and styled components directly,
`astroturf` uses a simple naming convention to map imports to styles in other modules.
In particular, the imported _name_ of a styled component should be the exactly the
same as the name assigned to the component in it's host file.

Take the import of `Button` in the example above. The implementation of `Button.js` looks
something like this:

**Button.js**

```js
import styled from 'astroturf';

const Button = styled('button')`
  /* ... */
`;

export default Button;
```

Notice that the styled component here is assigned to the variable named `Button`.
astroturf uses this information to identify the extracted style by the name `Button`.
In order to reference this componennt in `ButtonToolbar` it's _important_ that it's
imported as the same name.

so this will work:

```js
import Button from './Button';
```

Whereas this:

```js
import MyButton from './Button';
```

will not work, because `Button.js` has no style identified by the name: `MyButton`.
The same logic also applies to named exports, and even allows aliasing, e.g.
`import { Button as BaseButton } from './Button'` would work.
