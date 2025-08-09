/**
 * ESLint configuration with TSDoc enforcement.
 * Note: This is a generic TypeScript setup suitable for non-Angular projects as well.
 */
// @ts-check

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    project: false,
  },
  plugins: ['@typescript-eslint', 'tsdoc', 'prettier', 'html'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'tsdoc/syntax': 'error',
    'prettier/prettier': 'error',
  },
  overrides: [
    {
      files: ['*.js'],
      parser: null,
      plugins: ['prettier'],
      extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    },
    {
      files: ['*.html'],
      rules: {},
    },
  ],
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'coverage/',
    'build/',
    'out/',
    '.git/',
  ],
};


