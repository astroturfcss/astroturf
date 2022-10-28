/* eslint-disable global-require */
// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

require('@babel/register')({
  extensions: ['.ts', '.tsx'],
});

const path = require('path');

const { getLocalIdent } = require('../lib/getLocalIdent');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'astroturf',
  tagline: 'Better styling through compiling',
  url: 'https://4catalyzer.github.io/astroturf/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: '4catalyzer', // Usually your GitHub org/user name.
  projectName: 'astroturf', // Usually your repo name.
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    [
      require.resolve('./plugins/theme'),
      {
        customCss: require.resolve('./src/css/custom.css'),
      },
    ],
    '@docusaurus/plugin-content-pages',
    [
      '@docusaurus/plugin-content-docs',
      {
        routeBasePath: '/',
        sidebarPath: require.resolve('./sidebars.js'),
      },
    ],
    function myPlugin() {
      return {
        name: 'docusaurus-tailwindcss',
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.

          postcssOptions.plugins.push(require('tailwindcss/nesting'));
          postcssOptions.plugins.push(require('tailwindcss'));
          postcssOptions.plugins.push(require('autoprefixer'));
          return postcssOptions;
        },
      };
    },
    () => {
      return {
        name: 'docusaurus-plugin-astroturf',
        configureWebpack(_, isServer, utils) {
          return {
            module: {
              rules: [
                {
                  test: /\.module\.astroturf$/,
                  use: utils.getStyleLoaders(isServer, {
                    modules: {
                      getLocalIdent,
                      exportOnlyLocals: isServer,
                    },
                    importLoaders: 1,
                    sourceMap: true,
                  }),
                },
                {
                  test: /\.(j|t)sx?$/,
                  exclude: /node_modules/,
                  use: {
                    loader: require.resolve('../lib/loader'),
                    options: {
                      extension: '.module.astroturf',
                      useAltLoader: true,
                      nesting: true,
                      experiments: {
                        modularCssExternals: true,
                      },
                      // ...options,
                    },
                  },
                },
              ],
            },
            resolveLoader: {
              alias: {
                'astroturf/inline-loader': path.resolve(
                  __dirname,
                  '../lib/inline-loader',
                ),
              },
            },
            resolve: {
              alias: {
                astroturf: path.resolve(__dirname, '../src/runtime'),
              },
            },
          };
        },
      };
    },
  ],

  // presets: [
  //   [
  //     'classic',
  //     /** @type {import('@docusaurus/preset-classic').Options} */
  //     ({
  //       docs: {
  //         routeBasePath: '/',
  //         sidebarPath: require.resolve('./sidebars.js'),
  //       },
  //       blog: false,

  //       theme: {
  //         customCss: require.resolve('./src/css/custom.css'),
  //       },
  //     }),
  //   ],
  // ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'astroturf',
        logo: {
          alt: 'astroturf',
          src: 'img/logo.svg',
        },
        items: [],
      },
      footer: {},
      prism: {
        theme: require('./theme'),
        // darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
