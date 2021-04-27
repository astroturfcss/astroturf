module.exports = {
  purge: {
    content: ['./src/**/*.{js,tsx,mdx}'],
    options: {
      defaultExtractor: (content) => {
        // Capture as liberally as possible, including things like `h-(screen-1.5)`
        const broadMatches = content.match(/[^<>"'`\s]*[^,<>"'`\s:]/g) || [];
        const broadMatchesWithoutTrailingSlash = broadMatches.map((match) =>
          match.replace(/\\\\$/, ''),
        );

        // Capture classes within other delimiters like .block(class="w-1/2") in Pug
        const innerMatches =
          content.match(/[^<>"'`\s.(){}[\]#=%]*[^<>"'`\s.(){}[\]#=%:]/g) || [];

        return broadMatches
          .concat(broadMatchesWithoutTrailingSlash)
          .concat(innerMatches);
      },
    },
  },
  theme: {
    fontFamily: {
      brand: 'Fontdiner Swanky',
      sans: 'Lato',
    },

    colors: {
      white: '#F6EEE1',
      black: '#384201',
      primary: '#A44338',
      secondary: 'hsl(155, 48%, 63%)',
      'secondary-lighter': 'hsl(137, 41%, 90%)',
      'secondary-darker': 'hsl(155, 48%, 53%)',

      yellow: '#fed011',
      redOrange: '#e64f2a',
      teal: '#0d6d6e',
      puke: '#5e5d2d',
    },
    extend: {
      boxShadow: {
        default: '2px 2px 2px #5c5a5a',
      },
    },
  },
};
