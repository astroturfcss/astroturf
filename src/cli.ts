#!/usr/bin/env node

/* eslint-disable no-await-in-loop */
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

import Processor from '@modular-css/processor';
import Output from '@modular-css/processor/lib/output';
import fastGlob from 'fast-glob';
import { AtRule, PluginCreator, Result, Rule } from 'postcss';
import postcssScss from 'postcss-scss';
import resolve from 'resolve';
import yargs from 'yargs';

import config from './config';
import type {
  AstroturfMetadata,
  Change,
  ResolvedImport,
  Style,
} from './types';
import createFilename from './utils/createFilename';
import { collectStyles, replaceStyleTemplates } from './utils/loaders';

/**
 * use comma seperators for composes classes
 */
function composesPlugin(css: any) {
  css.walkDecls('composes', (decl: any) => {
    const [, classes, rest = ''] = decl.value.match(/(.+?)(from.*)?$/);

    // eslint-disable-next-line no-param-reassign
    decl.value = `${classes
      .split(/,?\s+/)
      .filter(Boolean)
      .join(', ')} ${rest}`;
  });
}

composesPlugin.postcssPlugin = 'compat-composes-delimiter';

const exportPlugin: PluginCreator<never> = () => {
  function collect(rule: Rule | AtRule, result: Result) {
    const exported = Object.create(null);

    rule.walkDecls((decl) => {
      exported[decl.prop] = decl.value;
    });

    rule.remove();

    result.messages.push({
      type: 'css-module-loader',
      plugin: 'modular-css-export-icss',
      exports: exported,
    });
  }

  return {
    postcssPlugin: 'astroturf/icss-export',
    AtRule: {
      export: (rule, { result }) => {
        collect(rule, result);
      },
    },
    Rule(rule, { result }) {
      if (rule.selector === ':export') {
        collect(rule, result);
      }
    },
  };
};

exportPlugin.postcss = true;

const stripInlineComments: PluginCreator<never> = () => {
  return {
    postcssPlugin: 'astroturf/strip-inline-comments',
    Comment(comment) {
      if (comment.raws.inline) comment.remove();
    },
  };
};
stripInlineComments.postcss = true;

export async function handler({ files, outFile, configFile }) {
  const styles = new Map<string, AstroturfMetadata>();
  const outFiles: Array<{ value: string; absoluteFilePath: string }> = [];
  const options = configFile ? await config.load(configFile) : null;

  const deps = new Map<string, string>();

  const dependencyResolver = (
    { request, identifier }: ResolvedImport,
    localStyle: Style,
  ) => {
    const source = resolve.sync(request, {
      basedir: path.dirname(localStyle.absoluteFilePath),
    });

    let styleFile = createFilename(
      request,
      { extension: '.css' } as any,
      identifier,
    );
    styleFile = path.resolve(
      path.dirname(localStyle.absoluteFilePath),
      styleFile,
    );
    deps.set(styleFile, source);
    return { source: styleFile };
  };

  async function runAstroturf(content: string, file: string) {
    const existing = styles.get(file);

    if (existing) return existing;

    const fileOptions = options || (await config.search(file));

    const result = collectStyles(content, file, dependencyResolver, {
      ...fileOptions?.config,
      writeFiles: false,
      extension: '.css',
      generateInterpolations: true,
      experiments: {
        modularCssExternals: true,
      },
    });
    styles.set(file, result);

    return result;
  }

  const processor = new Processor({
    before: [composesPlugin],
    processing: [exportPlugin],
    after: [stripInlineComments],
    resolvers: [(src, file) => path.resolve(path.dirname(src), file)],
    postcss: { syntax: postcssScss },
    loadFile: async (src) => {
      if (deps.has(src)) {
        const hostFile = deps.get(src)!;
        const result = await runAstroturf(
          await readFile(hostFile, 'utf-8'),
          hostFile,
        );

        const style = result?.styles.find((s) => s.absoluteFilePath === src);

        if (style?.value) {
          return style.value;
        }
      }

      return readFile(src, 'utf-8');
    },
  });

  for (const file of files) {
    const content = await readFile(file, 'utf-8');
    const astroturf = await runAstroturf(content, file);

    if (!astroturf || !astroturf.styles.length) {
      continue;
    }

    const changeset: Partial<Change>[] = [];
    const emptyCss: RegExp[] = [];

    await Promise.all(
      astroturf.styles.map((s) =>
        processor.string(s.absoluteFilePath, s.value),
      ),
    ).then((processed) => {
      processed.forEach((r, idx) => {
        const style = astroturf.styles[idx];
        const isEmpty = !r.details.result.css.trim();

        if (!outFile) {
          if (isEmpty) {
            emptyCss.push(
              new RegExp(
                `(import )(.+?from\\s+)["'](${style.requirePath.replace(
                  /[-[\]{}()*+!<=:?./\\^$|#\s,]/g,
                  '\\$&',
                )})["'];?`,
                'g',
              ),
            );
          } else {
            outFiles.push({
              absoluteFilePath: style.absoluteFilePath,
              value: r.details.result.css,
            });
          }
        }

        changeset.push(style);

        if (style.code) {
          changeset.push({
            start: 0,
            end: 0,
            code: `\nconst ${style.importIdentifier} = ${JSON.stringify(
              {
                ...Object.fromEntries(
                  Object.entries(r.details.values).map(([k, v]: any) => [
                    `@${k}`,
                    v.value,
                  ]),
                ),
                ...r.details.exported,
                ...Output.fileCompositions(r.details, processor, {
                  joined: true,
                }),
              },
              null,
              2,
            )};\n`,
          });
        }
      });
    });

    for (const change of astroturf.changeset) {
      if (astroturf.styles.includes(change as any)) {
        continue;
      }
      if (change.type === 'style-imports') {
        changeset.push({
          ...change,
          code: !outFile
            ? emptyCss
                .reduce((code, exp) => code?.replace(exp, ''), change.code!)
                .replace(/(import )(.+?from\s+)(.*)/g, '$1$3')
            : '',
        });
        continue;
      }
      changeset.push(change);
    }

    await writeFile(
      file,
      replaceStyleTemplates({}, file, content, changeset).code,
    );
  }

  if (outFile) {
    outFiles.push({
      absoluteFilePath: path.isAbsolute(outFile)
        ? outFile
        : path.resolve(process.cwd(), outFile),
      value: (await processor.output()).css,
    });
  }

  await Promise.all(
    outFiles.map((style) =>
      writeFile(style.absoluteFilePath, style.value, 'utf-8'),
    ),
  );
}
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
yargs
  .help()
  .alias('h', 'help')
  .command(
    '*',
    'Compile astroturf in files to CSS and class hashes',
    (_) =>
      _.option('css-out-file', {
        alias: 'c',
        type: 'string',
        description: 'The CSS output filename when concat-css is set.',
      }).option('config', {
        type: 'string',
        description: 'An astroturf rc file',
      }),

    async ({ _, 'css-out-file': cssOutFile, config: configFile }) => {
      const files = await fastGlob(_);

      await handler({ files, outFile: cssOutFile, configFile });
    },
  ).argv;
