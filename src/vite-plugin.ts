import { BabelFileResult, transformSync } from '@babel/core';

type ParserPlugin = 'jsx' | 'typescript';

export default () => ({
  name: 'vite:astroturf',
  enforce: 'pre',
  transform: (src: string, id: string): { code: string } => {
    if (id.includes('node_modules')) {
      return {
        code: src,
      };
    }
    const parserPlugins: ParserPlugin[] = [];
    if (/\.(t|j)sx?$/.test(id)) {
      parserPlugins.push('jsx');
    }
    if (/\.tsx?$/.test(id)) {
      parserPlugins.push('typescript');
    }
    const result: BabelFileResult | null = transformSync(src, {
      babelrc: false,
      configFile: false,
      filename: id,
      parserOpts: {
        plugins: parserPlugins,
      },
      plugins: ['astroturf/plugin'],
      sourceMaps: true,
      sourceFileName: id,
    });
    return {
      code: result?.code || src,
    };
  },
});
