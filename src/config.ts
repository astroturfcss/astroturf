import { cosmiconfig } from 'cosmiconfig';
import JSON5 from 'json5';

const explorer = cosmiconfig('astroturf', {
  searchPlaces: ['package.json', `.astroturfrc`, `.astroturfrc.json`],
  loaders: {
    json: (_file: string, content: string) => JSON5.parse(content),
    noExt: (_file: string, content: string) => JSON5.parse(content),
  },
});

export default explorer;
