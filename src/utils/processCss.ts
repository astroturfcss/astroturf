import postcss from 'postcss';
import postcssNested from 'postcss-nested';

export default function process(css: string, from: string) {
  return postcss([postcssNested()]).process(css, {
    from,
    map: {
      inline: true,
    },
  });
}
