Cursor Prompt — Set up Git hooks + ESLint/TSDoc enforcement

## Context
We are in the Angular 18 project **prompt-builder**. We already decided:
- Git model: **GitHub Flow**, one branch per component.
- Commit cadence: **meaningful changes only**, Conventional Commits.
- Merge strategy: **direct squash** to `main`.
- TSDoc is **mandatory** for all public APIs, enforced by ESLint.

## Task
Configure Git hooks (pre-commit + commit-msg), add ESLint + TSDoc enforcement, and commit everything following our Git rules.

---

## Steps

### 1. Create a working branch
Branch name:
```
chore/tooling/git-hooks-eslint-tsdoc
```
Commit scope for this task = `chore(tooling)`.

### 2. Add / update lint & docs setup files
Ensure these files exist at project root (create/overwrite if missing):
- `.eslintrc.cjs` (Angular ESLint + `eslint-plugin-tsdoc` with `tsdoc/syntax: error`)
- `.eslintignore` (ignore dist, node_modules, etc.)
- `setup_eslint_tsdoc.sh` (installs deps, ensures ESLint builder, adds scripts)
- `ESLint_TSDoc_SETUP.md` (instructions)

If files already exist, preserve our policy (`tsdoc/syntax: error`). Merge rules if needed.

### 3. Install lint dependencies & configure
Make the script executable and run:
```bash
chmod +x setup_eslint_tsdoc.sh
./setup_eslint_tsdoc.sh
```
Ensure `package.json` has scripts:
```json
"lint": "ng lint",
"lint:eslint": "eslint \"src/**/*.ts\" --max-warnings=0",
"lint:html": "eslint \"src/**/*.html\" --max-warnings=0",
"format": "npx prettier --write \"src/**/*.{ts,html,scss,md,json}\"",
"test:quick": "echo \"(placeholder)\""
```

### 4. Create Git hooks (native, no Husky)

#### .git/hooks/commit-msg
```bash
#!/usr/bin/env bash
msg_file="$1"
regex='^((feat|fix|docs|style|refactor|test|chore))(\([a-z0-9-]+\))?: .{1,100}$'
if ! grep -Pq "$regex" "$msg_file"; then
  echo "✖ Conventional Commit required: type(scope): summary" >&2
  echo "  Examples: feat(sections): add reorder keys | fix(i18n): load es.json" >&2
  exit 1
fi
```

#### .git/hooks/pre-commit
```bash
#!/usr/bin/env bash
set -e
npm run format
npm run lint
npm run test:quick || echo "⚠ tests quick failed; proceed? Ctrl+C to cancel"
```

Mark as executable:
```bash
chmod +x .git/hooks/commit-msg
chmod +x .git/hooks/pre-commit
```

### 5. Run quick verification
```bash
npm run lint && npm run lint:eslint && npm run lint:html
```
If ESLint complains about missing TSDoc in existing files, **add minimal TSDoc headers** to satisfy `tsdoc/syntax` for touched files (e.g., `main.ts`, `app.config.ts`).

### 6. Commit (meaningful)
```bash
git add .
git commit -m "chore(tooling): add git hooks and enforce TSDoc via ESLint"
git push origin chore/tooling/git-hooks-eslint-tsdoc
```

### 7. Merge
- If PR workflow: open PR titled `chore(tooling): add git hooks and enforce TSDoc via ESLint`, squash merge when approved.
- If direct merge allowed: squash merge to `main` directly.

---

## Constraints & Style
- Keep changes tight, no unrelated refactors.
- Respect git rules: GitHub Flow, Conventional Commits.
- Never disable `tsdoc/syntax: error`. Use `TODO(tsdoc)` only as placeholder to be filled.

## Done Criteria
- Hooks present & executable.
- `npm run lint` passes or only fails with known `TODO(tsdoc)` placeholders.
- Branch merged to `main` (squash).

# Cursor Prompt — Set up Git hooks + ESLint/TSDoc enforcement

## Context
We are in the Angular 18 project **prompt-builder**. We already decided:
- Git model: **GitHub Flow**, one branch per component.
- Commit cadence: **meaningful changes only**, Conventional Commits.
- Merge strategy: **direct squash** to `main`.
- TSDoc is **mandatory** for all public APIs, enforced by ESLint.

## Task
Configure Git hooks (pre-commit + commit-msg), add ESLint + TSDoc enforcement, and commit everything following our Git rules.

---

## Steps

### 1. Create a working branch
Branch name:
```
chore/tooling/git-hooks-eslint-tsdoc
```
Commit scope for this task = `chore(tooling)`.

### 2. Add / update lint & docs setup files
Ensure these files exist at project root (create/overwrite if missing):
- `.eslintrc.cjs` (Angular ESLint + `eslint-plugin-tsdoc` with `tsdoc/syntax: error`)
- `.eslintignore` (ignore dist, node_modules, etc.)
- `setup_eslint_tsdoc.sh` (installs deps, ensures ESLint builder, adds scripts)
- `ESLint_TSDoc_SETUP.md` (instructions)

If files already exist, preserve our policy (`tsdoc/syntax: error`). Merge rules if needed.

### 3. Install lint dependencies & configure
Make the script executable and run:
```bash
chmod +x setup_eslint_tsdoc.sh
./setup_eslint_tsdoc.sh
```
Ensure `package.json` has scripts:
```json
"lint": "ng lint",
"lint:eslint": "eslint \"src/**/*.ts\" --max-warnings=0",
"lint:html": "eslint \"src/**/*.html\" --max-warnings=0",
"format": "npx prettier --write \"src/**/*.{ts,html,scss,md,json}\"",
"test:quick": "echo \"(placeholder)\""
```

### 4. Create Git hooks (native, no Husky)

#### .git/hooks/commit-msg
```bash
#!/usr/bin/env bash
msg_file="$1"
regex='^((feat|fix|docs|style|refactor|test|chore))(\([a-z0-9-]+\))?: .{1,100}$'
if ! grep -Pq "$regex" "$msg_file"; then
  echo "✖ Conventional Commit required: type(scope): summary" >&2
  echo "  Examples: feat(sections): add reorder keys | fix(i18n): load es.json" >&2
  exit 1
fi
```

#### .git/hooks/pre-commit
```bash
#!/usr/bin/env bash
set -e
npm run format
npm run lint
npm run test:quick || echo "⚠ tests quick failed; proceed? Ctrl+C to cancel"
```

Mark as executable:
```bash
chmod +x .git/hooks/commit-msg
chmod +x .git/hooks/pre-commit
```

### 5. Run quick verification
```bash
npm run lint && npm run lint:eslint && npm run lint:html
```
If ESLint complains about missing TSDoc in existing files, **add minimal TSDoc headers** to satisfy `tsdoc/syntax` for touched files (e.g., `main.ts`, `app.config.ts`).

### 6. Commit (meaningful)
```bash
git add .
git commit -m "chore(tooling): add git hooks and enforce TSDoc via ESLint"
git push origin chore/tooling/git-hooks-eslint-tsdoc
```

### 7. Merge
- If PR workflow: open PR titled `chore(tooling): add git hooks and enforce TSDoc via ESLint`, squash merge when approved.
- If direct merge allowed: squash merge to `main` directly.

---

## Constraints & Style
- Keep changes tight, no unrelated refactors.
- Respect git rules: GitHub Flow, Conventional Commits.
- Never disable `tsdoc/syntax: error`. Use `TODO(tsdoc)` only as placeholder to be filled.

## Done Criteria
- Hooks present & executable.
- `npm run lint` passes or only fails with known `TODO(tsdoc)` placeholders.
- Branch merged to `main` (squash).
