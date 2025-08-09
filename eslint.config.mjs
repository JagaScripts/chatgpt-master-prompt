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
      // Top-level and nested build/output directories
      'dist/**',
      '**/dist/**',
      'coverage/**',
      '**/coverage/**',
      'build/**',
      '**/build/**',
      'out/**',
      '**/out/**',
      // All node_modules, including nested package workspaces
      'node_modules/**',
      '**/node_modules/**',
      // Angular/CLI caches and temp folders
      '.angular/**',
      '**/.angular/**',
      '.cache/**',
      '**/.cache/**',
      '.git/**',
      '.husky/**',
      'tmp/**',
      '**/tmp/**',
      '.vite/**',
      '**/.vite/**',
      '**/*.min.js',
      'setup_eslint_tsdoc.sh',
      'package-lock.json',
      'package.json',
      // Temporary ignore during Angular scaffold
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


