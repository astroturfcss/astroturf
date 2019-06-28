const cssLoader = require('css-loader');
const postcssLoader = require('postcss-loader');
const postcssNested = require('postcss-nested');

function postcss(loader, css, map, meta, cb) {
  const ctx = { ...loader };
  ctx.async = () => cb;
  ctx.loaderIndex++;
  ctx.query = {
    plugins: [postcssNested()],
  };

  postcssLoader.call(ctx, css, map, meta);
}

module.exports = function loader(css, map, meta) {
  const done = this.async();

  postcss(this, css, map, meta, (err, ...args) => {
    if (err) {
      done(err);
      return;
    }

    const ctx = { ...this };
    ctx.query = {
      ...this.query,
      modules: true,
      importLoaders: 0,
    };

    cssLoader.call(ctx, ...args);
  });
};
