import { codeFrameColumns } from '@babel/code-frame';
import { SourceLocation } from '@babel/types';
import levenshtein from 'fast-levenshtein';
import sortBy from 'lodash/sortBy';
import MagicString from 'magic-string';
import pico from 'picocolors';
import type { CssSyntaxError } from 'postcss';

import config from '../config';
import traverse from '../traverse';
import type {
  AstroturfMetadata,
  DependencyResolver,
  ResolvedImport,
  ResolvedOptions,
  Style,
} from '../types';
import { getNameFromFile } from './createFilename';

class AstroturfLoaderError extends Error {
  error?: Error | string;

  constructor(errorOrMessage: string | Error, codeFrame?: any) {
    super();

    this.name = 'AstroturfLoaderError';

    if (typeof errorOrMessage !== 'string') {
      this.error = errorOrMessage;

      if (errorOrMessage.name === 'CssSyntaxError') {
        this.handleCssError(errorOrMessage as CssSyntaxError);
      } else {
        this.handleBabelError(errorOrMessage);
      }
    } else {
      this.message = errorOrMessage;
      Error.captureStackTrace(this, AstroturfLoaderError);
    }

    if (codeFrame) this.message += `\n\n${codeFrame}\n`;
  }

  handleBabelError(error: Error) {
    this.message = error.message;

    try {
      this.stack = error.stack!.replace(/^(.*?):/, `${this.name}:`);
    } catch (e) {
      Error.captureStackTrace(this, AstroturfLoaderError);
    }
  }

  handleCssError(error: CssSyntaxError) {
    const { line, column, reason, plugin, file } = error;

    this.message = `${this.name}\n\n`;

    if (typeof line !== 'undefined') {
      this.message += `(${line}:${column}) `;
    }

    this.message += plugin ? `${plugin}: ` : '';
    this.message += file ? `${file} ` : '<css input> ';
    this.message += `${reason}`;

    const code = error.showSourceCode();

    if (code) {
      this.message += `\n\n${code}\n`;
    }
    // @ts-ignore
    this.stack = false;
  }
}

export function buildDependencyError(
  content: string,
  { type, identifier, request }: ResolvedImport,
  styles: Style[],
  resource: string,
  loc: SourceLocation,
) {
  let idents = styles.map((s) => s.identifier);

  let closest: string | undefined;
  let minDistance = 2;
  idents.forEach((ident) => {
    const d = levenshtein.get(ident, identifier);
    if (d < minDistance) {
      minDistance = d;
      closest = ident;
    }
  });
  const isDefaultImport = type === 'ImportDefaultSpecifier';

  if (!closest && isDefaultImport) {
    closest = idents.find((ident) => ident === getNameFromFile(resource));
  }
  if (closest) idents = idents.filter((ident) => ident !== closest);

  const identMsg = idents.map((s) => pico.yellow(s)).join(', ');

  const alternative = isDefaultImport
    ? `Instead try: ${pico.yellow(`import ${closest} from '${request}';`)}`
    : `Did you mean to import as ${pico.yellow(closest)} instead?`;

  return new AstroturfLoaderError(
    // eslint-disable-next-line prefer-template
    `Could not find a style associated with the interpolated value. ` +
      `Styles should use the same name used by the intended component or class set in the imported file.\n\n` +
      codeFrameColumns(
        content,
        { start: loc.start },
        {
          highlightCode: true,
          message: !isDefaultImport
            ? `(Imported as ${pico.bold(identifier)})`
            : '',
        },
      ) +
      `\n\n${
        closest
          ? `${alternative}\n\nAlso available: ${identMsg}`
          : `Available: ${identMsg}`
      }`,
  );
}

export function collectStyles(
  src: string,
  filename: string,
  resolveDependency: DependencyResolver,
  opts: Partial<ResolvedOptions>,
): AstroturfMetadata {
  // maybe eventually return the ast directly if babel-loader supports it
  try {
    const { metadata } = traverse(src, filename, {
      ...opts,
      resolveDependency,
      writeFiles: false,
      generateInterpolations: true,
    })!;
    return (metadata as any).astroturf;
  } catch (err: any) {
    throw new AstroturfLoaderError(err);
  }
}

export function replaceStyleTemplates(
  filename: string,
  src: string,
  locations: { start?: number; end?: number; code?: string }[],
  sourceMap = true,
) {
  locations = sortBy(locations, (i) => i.start || 0);

  const magic = new MagicString(src);

  locations.forEach(({ start = 0, end = 0, code = '' }) => {
    if (code.endsWith(';')) code = code.slice(0, -1); // remove trailing semicolon

    if (start === end) {
      magic.appendLeft(start, code);
    } else {
      magic.overwrite(start, end, code);
    }
  });

  return {
    code: magic.toString(),
    map: sourceMap
      ? magic.generateMap({
          includeContent: true,
          source: filename,
          hires: true,
        })
      : null,
  };
}

export async function resolveOptions(
  loaderContext: any,
): Promise<Partial<ResolvedOptions>> {
  const loaderOpts = loaderContext.getOptions() || {};

  if (loaderOpts.config === false) {
    return loaderOpts;
  }
  const result = await (typeof loaderOpts.config === 'string'
    ? config.load(loaderOpts.config)
    : config.search(loaderContext.resourcePath));

  return result?.config || loaderOpts;
}
