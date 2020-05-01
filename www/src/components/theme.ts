import { stylesheet } from 'astroturf/react';

const colors = stylesheet`
  @value bgColor: theme(colors.secondary-lighter);
  @value primary: theme(colors.primary);
  @value yellow: theme(colors.yellow);
  @value puke: theme(colors.puke);
  @value teal: theme(colors.teal);
  @value redOrange: theme(colors.redOrange);
  @value black: theme(colors.black);

`;

// Original: https://github.com/damienstanton/ultramin
// Converted automatically using ./tools/themeFromVsCode
const theme = {
  plain: {
    color: colors.black,
    backgroundColor: colors.bgColor,
  },
  styles: [
    // { types: ['styled-template-string'], color: colors.black },
    {
      types: ['builtin', 'changed', 'keyword'],
      style: {
        color: colors.teal,
      },
    },

    {
      types: ['styled-template-string'],
      style: {
        color: colors.black,
        textShadow: 'none',
      },
    },

    {
      types: ['comment'],
      style: {
        color: 'rgb(197, 200, 198)',
      },
    },
    {
      types: ['string', 'number', 'builtin', 'variable', 'property'],
      style: {
        color: colors.primary,
        // textShadow: '1px 1px 0px #5c5a5a',
      },
    },
    {
      types: ['class'],
      style: {
        color: colors.puke,
        // textShadow: '1px 1px 0px #5c5a5a',
      },
    },
    {
      types: ['class-name', 'function', 'tag', 'attr-name'],
      style: {
        color: colors.primary,
        // textShadow: '1px 1px 0px #5c5a5a',
      },
    },
  ],
};

export default theme;
