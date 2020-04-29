/**
 * It's own function for test easier test mocking
 */
export default function getLoaderPrefixedRequest(modules = false) {
  const loaderPrefix = require.resolve('../css-loader');
  return `${loaderPrefix}?inline${modules ? '&modules' : ''}!`;
}
