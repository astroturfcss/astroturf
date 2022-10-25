import JSON5 from 'json5';
import { lilconfig } from 'lilconfig';

const explorer = lilconfig('astroturf', {
  searchPlaces: ['package.json', `.astroturfrc`, `.astroturfrc.json`],
  loaders: {
    json: (_file: string, content: string) => JSON5.parse(content),
    noExt: (_file: string, content: string) => JSON5.parse(content),
  },
});

export default explorer;
