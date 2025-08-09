// Flat ESLint config (ESLint v9+) using ESM
import parser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import htmlPlugin from 'eslint-plugin-html';
import tsdocPlugin from 'eslint-plugin-tsdoc';

export default [
  // Ignore patterns (replaces .eslintignore)
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'build/**',
      'out/**',
      '.git/**',
      '.husky/**',
      'tmp/**',
      '.cache/**',
      '.vite/**',
      '**/*.min.js',
      'setup_eslint_tsdoc.sh',
      'package-lock.json',
      'package.json',
    ],
  },

  // TS/JS rules
  {
    files: ['**/*.{ts,js,cjs}'],
    languageOptions: {
      parser,
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
      tsdoc: tsdocPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      'tsdoc/syntax': 'error',
    },
  },

  // HTML
  {
    files: ['**/*.html'],
    plugins: {
      html: htmlPlugin,
    },
    rules: {},
  },
];


