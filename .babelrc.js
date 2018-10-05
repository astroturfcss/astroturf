module.exports = {
  presets: [['@4c/4catalyzer', { target: 'node' }]],
  overrides: [
    {
      test: 'src/runtime/**',
      presets: [['@4c/4catalyzer', { target: 'web' }]],
    },
  ],
};
