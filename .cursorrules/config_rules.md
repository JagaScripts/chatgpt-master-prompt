# Prompt Builder — Implementation Rules

## 1. Product Scope (MVP)
- **OpenAI-style prompts only.**
- Offline-first PWA. No backend. Persist to LocalStorage/IndexedDB.
- Two UI languages: **English** (default) and **Spanish**.
- Strong keyboard UX + accessibility. High-contrast theme included.
- Export: **Markdown**, **JSON**, (optional **TXT**). Copy with/without code fences.
- Token estimator: **approx chars / 4**.

## 2. Architecture
- **Angular 18** (standalone components, strict TS).
- **Bootstrap 5** utilities; minimal custom SCSS.
- **Packages**: `@ngx-translate/core`, `@ngx-translate/http-loader`, `idb`, `marked`, `dompurify`, `eslint-plugin-tsdoc`.
- **State**: signals-based store/service (no NgRx in MVP).
- **PWA**: `@angular/pwa`—cache app shell; show update available; offline ready.
- Folder hints:
  - `src/app/core/models` — interfaces
  - `src/app/core/services` — clipboard, templates, settings, i18n, estimator
  - `src/app/features/sections` — editors & list
  - `src/app/features/preview` — live preview
  - `src/app/features/lint` — lint panel
  - `src/assets/i18n/en.json`, `es.json`

## 3. Data Models
- `PromptSection` and `PromptTemplate` as in `config.json` schema.
- Validation:
  - `goal` **required**, ≥ 10 chars
  - `outputFormat` **required**
  - Conflicting constraints → error
  - `roleMissingWithStyleTone` → warning
  - Language mismatch (UI vs desired output) → warning

## 4. Prompt Assembly
- Order by `order`; include only `enabled && value.trim()`.
- Render `## ${title}\n${value}` per section; join with a single blank line.
- If “copy with fences” → wrap with triple backticks.
- **Never** include internal notes or linter output in the final prompt.

## 5. Keyboard & A11y
- Shortcuts:
  - `Ctrl+Shift+C`: Copy prompt
  - `Ctrl+Shift+P`: Toggle code fences
  - `Ctrl+Alt+↑/↓`: Reorder section
  - `Ctrl+Shift+S`: Save template
  - `Alt+1`: Focus sections
  - `Alt+2`: Focus preview
  - `Alt+3`: Open lint panel
  - `?`: Help overlay
- Provide skip links and visible focus outlines.
- Use ARIA roles and `aria-live` for confirmation messages.
- All dialogs/overlays are focus-trapped; ESC closes.

## 6. i18n
- All strings in `assets/i18n/*.json`.
- UI defaults to **English**, toggle persists.
- Ensure placeholders and dynamic counts are localized.

## 7. Styling
- Bootstrap utilities first. Keep custom SCSS small:
  - Focus ring (2px, high-contrast)
  - High-contrast theme variables and body class
- Respect `prefers-color-scheme`; allow manual override.

## 8. Persistence
- Settings in LocalStorage.
- Templates in IndexedDB (`idb`) store `prompt_templates`.
- Autosave current working template (idle debounce ~2s).

## 9. Exports & Imports
- Export current prompt as `.md`, `.json`, optional `.txt`.
- Import `.json` → validate against `PromptTemplate` schema; migrate if version differs.

## 10. Token Estimator
- Show `characters`, `words`, `estimatedTokens = ceil(chars/4)`.
- Display disclaimer: approximate only.

## 11. QA & Tests
- Minimal Playwright e2e:
  - Reorder via keyboard
  - Copy to clipboard
  - i18n toggle persists
  - PWA: app loads offline after first visit
- Manual a11y checks with keyboard and a screen reader smoke test.

## 12. Commit & Branching (Standards)
- **Model**: **GitHub Flow** (feature branches, short-lived).
- **Commit style**: **Conventional Commits** `type(scope): summary`
  - Allowed `type`: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- **Versioning**: SemVer (when we start tagging releases).

## 13. Branching Rules
- One branch per component or tight unit of work.
- Branch names:
  - New component: `feat/component/<kebab-name>`
  - Fixes: `fix/component/<kebab-name>`
- Keep branches short-lived; merge when functional and checks pass.

## 14. Commit Frequency (Meaningful Changes)
- Commit **early** and **often**, but only on **meaningful changes** (not every save).
- A change is “meaningful” when it:
  - compiles/lints cleanly **or**
  - completes a small vertical slice (UI + logic) **or**
  - renames/moves files cohesively **or**
  - adds/removes a test or fixes a failing test.
- Message examples:
  - `feat(sections): add keyboard reorder handlers`
  - `fix(i18n): load es.json on startup`
  - `refactor(services): extract estimator service`

### 14.1 Scope Derivation
- Map file path → scope:
  - `src/app/features/sections/**` → `sections`
  - `src/app/features/preview/**` → `preview`
  - `src/app/core/services/**` → `services`
  - `src/app/core/models/**` → `models`
  - `src/assets/i18n/**` → `i18n`
  - otherwise → top-level folder name

## 15. Merge Rules (Direct Squash)
- When a component is complete and passes checks, **direct squash merge** into `main`.
- Squash title = concise summary; body = bullet points (optional).
- Keep `main` always green and releasable.

## 16. Hooks & Checks
- `pre-commit`: run formatter + lint + quick tests.
- `commit-msg`: enforce Conventional Commit regex.
- If checks fail → block commit (or prompt to fix).
- Supporting scripts (package.json):
  - `"format": "ng lint --fix || true && npx prettier --write \"src/**/*.{ts,html,scss,md,json}\""`
  - `"lint": "ng lint"`
  - `"test:quick": "echo \"(placeholder)\""`

## 17. Cursor Behavior (Git)
- Use **GitHub Flow** with one branch per component (`feat/component/<kebab-name>`).
- **Commit on meaningful changes** only (ensure format/lint pass).
- Use **Conventional Commits** with path-derived scope.
- When component is done, **direct squash merge** into `main`.

## 17.1 Shell Policy (zsh)
- Primary shell: **zsh**. All automation and commands should be compatible with zsh.
- Prefer non-interactive flags to avoid prompts (e.g., `--yes`, `--skip-install=false`).
- When embedding Node/JS one-liners that include `!` or complex quoting, use:
  - Single-quoted strings, or
  - Heredoc with quoted delimiter, for example:
    ```bash
    node <<'NODE'
    // JS here; safe from zsh history expansion
    NODE
    ```
- For long, multi-step flows, consider background scripts with logs to avoid editor UI prompts.

## 18. Code Documentation Rules (TSDoc/JSDoc)
- **Mandatory** TSDoc for:
  - All exported components, services, classes, interfaces, enums.
  - All public functions/methods (including lifecycle hooks).
  - Angular `@Input()`/`@Output()` members (describe meaning and units).
- **File headers** at top:
  ```ts
  /**
   * @fileoverview <purpose>
   * @module <alias or path>
   * @remarks Part of Prompt Builder MVP.
   */
  ```
- Standard block:
  ```ts
  /**
   * @summary <1-line>
   * @description <2–4 lines>
   * @param foo - meaning
   * @returns what
   * @throws when
   * @example
   * const x = doThing("bar");
   * @public
   */
  ```
- Private helpers: brief TSDoc or single-line comment if obvious.
- HTML templates: minimal `<!-- ... -->` notes for complex keyboard behavior only.
- Lint enforcement: **eslint-plugin-tsdoc**; lint must fail on invalid TSDoc.
- Cursor must backfill/maintain TSDoc on any code change. Use `TODO(tsdoc): ...` when info is unknown.

## 19. Non-Goals (MVP)
- No OpenAI API calls.
- No user accounts or server storage.
- No template sharing links.

## 20. Future Hooks (commented stubs)
- `/server` Spring Boot 3 scaffold (disabled) with README for future Postgres persistence.
- Share links & collaboration.
- Model-specific variants beyond OpenAI.
