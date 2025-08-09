#!/usr/bin/env bash
set -euo pipefail

echo "Installing ESLint, Prettier, and TSDoc tooling..."

npm pkg set scripts.lint="ng lint" \
  scripts.lint\:eslint="eslint \"src/**/*.ts\" --max-warnings=0" \
  scripts.lint\:html="eslint \"src/**/*.html\" --max-warnings=0" \
  scripts.format="npx prettier --write \"src/**/*.{ts,html,scss,md,json}\"" \
  scripts.test\:quick="echo '(placeholder)'"

npm i -D \
  eslint \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  eslint-plugin-tsdoc \
  eslint-plugin-prettier \
  eslint-config-prettier \
  prettier \
  eslint-plugin-html

echo "Tooling installed."


