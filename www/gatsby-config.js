module.exports = {
  pathPrefix: '/astroturf',
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'MDXPages',
        path: 'src/pages/',
      },
    },
    {
      resolve: `gatsby-plugin-webfonts`,
      options: {
        fonts: {
          google: [
            {
              family: 'Fontdiner+Swanky',
              subsets: ['latin'],
              display: 'swap',
            },
            {
              family: 'Lato',
              subsets: ['latin'],
              display: 'swap',
            },
          ],
        },
      },
    },
    {
      resolve: 'gatsby-plugin-css',
      options: {
        useDefaultPostcss: false,
        useCssModuleLoader: true,
      },
    },
    'gatsby-plugin-mdx',
    'gatsby-plugin-typescript',
  ],
};
