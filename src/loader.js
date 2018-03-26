import { basename } from 'path';
import loaderUtils from 'loader-utils';

import traverse from './traverse';
import VirtualModulePlugin from './VirtualModulePlugin';

// can'ts use class syntax b/c babel doesn't transpile it correctly for Error
function CssLiteralLoaderError(error) {
  Error.call(this);
  this.name = 'CssLiteralLoaderError';

  this.message = error.message;
  if (error.codeFrame) this.message += `\n\n ${error.codeFrame} \n`;

  this.error = error;
  try {
    this.stack = error.stack.replace(/^(.*?):/, `${this.name}:`);
  } catch (err) {
    Error.captureStackTrace(this, CssLiteralLoaderError);
  }
}

CssLiteralLoaderError.prototype = Object.create(Error.prototype);
CssLiteralLoaderError.prototype.constructor = CssLiteralLoaderError;

function collectStyles(src, filename, opts) {
  // quick regex as an optimization to avoid parsing each file
  if (!src.match(new RegExp(`${opts.tagName}\`([\\s\\S]*?)\``, 'gmi'))) {
    return { styles: [] };
  }

  // maybe eventually return the ast directly if babel-loader supports it
  try {
    const { metadata } = traverse(src, filename, {
      ...opts,
      writeFiles: false,
    });
    return { styles: metadata['css-literal-loader'].styles || [] };
  } catch (err) {
    throw new CssLiteralLoaderError(err);
  }
}

function replaceStyleTemplates(src, styles) {
  let offset = 0;

  function splice(str, start, end, replace) {
    const result =
      str.slice(0, start + offset) + replace + str.slice(end + offset);

    offset += replace.length - (end - start);
    return result;
  }

  styles.forEach(({ start, end, path }) => {
    src = splice(src, start, end, `require('./${basename(path)}')`);
  });

  return src;
}

const LOADER_PLUGIN = Symbol('loader added VM plugin');

module.exports = function loader(content) {
  if (this.cacheable) this.cacheable();

  const options = loaderUtils.getOptions(this) || {};
  const { tagName, extension = '.css' } = options;

  const { styles } = collectStyles(content, this.resourcePath, {
    tagName,
    extension,
  });

  if (!styles.length) return content;

  let { emitVirtualFile } = this;

  // The plugin isn't loaded
  if (!emitVirtualFile) {
    const compilation = this._compilation; // eslint-disable-line no-underscore-dangle
    let plugin = compilation[LOADER_PLUGIN];

    if (!plugin) {
      plugin = VirtualModulePlugin.bootstrap(compilation);
      compilation[LOADER_PLUGIN] = plugin;
    }
    emitVirtualFile = plugin.addFile;
  }

  styles.forEach(style => {
    // style.path = `${basepath}__css_literal_loader_${idx++}${extension}`;
    emitVirtualFile(style.path, style.value);
  });

  return replaceStyleTemplates(content, styles);
};
