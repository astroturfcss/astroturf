module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
  },

  plugins: ['ts-expect'],
  rules: {
    'ts-expect/expect': 'error',
  },
};
