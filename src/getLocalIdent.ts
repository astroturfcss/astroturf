import path from 'path';

import slug from 'unique-slug';

export function getLocalIdent(
  loaderContext,
  _localIdentName,
  localName,
  options,
) {
  const query = new URLSearchParams(loaderContext.resourceQuery || '');
  return query.get('styleId')
    ? `${slug(
        path.relative(options.context, loaderContext.resourcePath),
      )}${query.get('styleId')}_${localName}`
    : null;
}
