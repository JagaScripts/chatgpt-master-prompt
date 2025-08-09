# Cursor Recipes — Commenting & Docs

Use these snippets in Cursor to enforce and backfill comments across the codebase.

## 1) Global policy & backfill
> Add TSDoc comments everywhere and enforce via lint

- Install and set up eslint-plugin-tsdoc.
- Create file headers and TSDoc for all exported entities and public methods.
- Add inline comments for non-trivial logic (focus management, token estimator, regex).
- Fail lint if TSDoc is malformed.

## 2) Backfill for an entire folder
"""
Backfill and/or fix TSDoc across **src/app/core/services/**:
- Add a file header to each file.
- For each exported class and public method, add TSDoc with @summary, @description, @param, @returns, @throws (if applicable), and @example.
- Ensure comments reflect intent and constraints (not just restating code).
- Run lint and fix any tsdoc errors.
Commit with: docs(services): backfill TSDoc for services
"""

## 3) When creating a new component
"""
Create component **SectionsListComponent** with:
- File header TSDoc
- Class TSDoc @summary and @remarks
- TSDoc for @Input/@Output and public methods
- Minimal HTML comments only when necessary
- Unit test skeleton with docstrings for test cases
Commit with: feat(sections): add SectionsListComponent with TSDoc
"""

## 4) Lint rule toggle for strict docs (optional)
"""
Update ESLint config to include eslint-plugin-tsdoc and make tsdoc violations error-level. Ensure npm run lint fails on missing/invalid TSDoc.
Commit with: chore(lint): enforce eslint-plugin-tsdoc as error
"""
