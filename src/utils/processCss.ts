import postcss from 'postcss';
import postcssNested from 'postcss-nested';
import postcssScss from 'postcss-scss';

export default function process(css: string, from: string) {
  return postcss([postcssNested()]).process(css, {
    from,
    syntax: postcssScss,
    map: {
      inline: true,
    },
  });
}
