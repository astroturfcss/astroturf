module.exports = {
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
    'gatsby-plugin-mdx',
    'gatsby-plugin-typescript',
    'gatsby-plugin-postcss',
  ],
};
