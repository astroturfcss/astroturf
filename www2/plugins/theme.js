const path = require('path');

module.exports = function docusaurusTheme(ctx, options) {
  const { customCss } = options || {};

  return {
    name: 'docusaurus-theme',

    getThemePath() {
      return path.join(__dirname, 'theme');
    },

    getTypeScriptThemePath() {
      return path.resolve(__dirname, './theme');
    },

    getClientModules() {
      const modules = []; // [require.resolve('./theme/styles.scss')];

      if (customCss) {
        if (Array.isArray(customCss)) {
          modules.push(...customCss);
        } else {
          modules.push(customCss);
        }
      }

      return modules;
    },
  };
};
