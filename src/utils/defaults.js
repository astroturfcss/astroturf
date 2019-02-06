import defaults from 'lodash/defaults';

export const defaultOptions = {
  allowInterpolation: true,
  cssTag: 'css',
  styledTag: 'styled',
  extension: '.css',
  allowGlobal: false,
};

export const getDefaults = ({ tagName, ...provided } = {}) =>
  defaults(provided, { cssTag: tagName }, defaultOptions);
