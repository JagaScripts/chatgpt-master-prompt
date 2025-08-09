# Project: Prompt Builder (Java 21 + Angular 18 + Bootstrap)

## Goal
Build an **offline-first**, keyboard-driven **Prompt Builder** for **OpenAI-style prompts only**. Users fill structured sections (context, role, goal, output format, etc.), toggle concise/verbose modes, and generate a high-quality prompt that can be copied/exported. No backend in MVP—persist locally (LocalStorage/IndexedDB). Include a **token length estimator** (approximate). Provide **ES/EN** UI and basic prompt linting. Strong accessibility and full keyboard navigation.

## Tech Decisions (HARD REQUIREMENTS)
- **Frontend**: Angular **18** (standalone components, strict mode). Styling via **Bootstrap (latest stable 5.x)**; use utility classes first.
- **State**: lightweight Signals-based store/service (no NgRx in MVP).
- **Persistence**: LocalStorage for settings + IndexedDB (`idb`) for templates.
- **i18n**: `@ngx-translate/core` with English and Spanish.
- **A11y**: WAI-ARIA roles, visible focus rings, skip links, focus management, high-contrast theme.
- **Offline/PWA**: Angular PWA (`@angular/pwa`) with cached app shell + assets.
- **Export/Copy**: Clipboard API copy; export to Markdown and JSON; optional TXT.
- **Token estimator**: Client-side approximation (≈ 4 chars/token; show chars, words, est. tokens).
- **Linting**: Simple rules—missing goal, missing output format, conflicting constraints, language mismatch, etc.
- **No backend now**. Provide a `/server` Spring Boot 3 scaffold (commented/disabled) for future.
- **License**: MIT by default.

## Keyboard-First UX (MUST)
- Global shortcuts (configurable; expose a help overlay `?`):
  - `Ctrl+Shift+C`: Copy prompt
  - `Ctrl+Shift+P`: Toggle “copy with code fences”
  - `Ctrl+Alt+Up/Down`: Reorder focused section
  - `Ctrl+Shift+S`: Save template (name required)
  - `Alt+1`: Focus sections list
  - `Alt+2`: Focus live preview
  - `Alt+3`: Open lint panel
  - `?`: Shortcuts/help overlay
- Skip links: “Skip to form”, “Skip to preview”
- After actions (copy/save/reorder), **return focus** to the initiating control and announce via `aria-live="polite"`.

## Section Model (OpenAI-style prompts)
Each prompt is composed of **orderable, toggleable** sections:

- `context` (Background, constraints, prior decisions, environment)
- `role` (Persona, expertise, tone, optional **guardrails**)
- `goal` (Objective, success criteria) **required**
- `audience` (Target reader/user)
- `input` (Variables, sample input)
- `outputFormat` (Structure—headings, bullets, JSON schema, code fences) **required**
- `constraints` (Style, length, forbidden items)
- `process` (High-level steps/checklist; never force chain-of-thought leakage)
- `validation` (Acceptance checks, edge cases)
- `styleTone` (Voice, register)
- `toolsApis` (If applicable—names, contracts)
- `tokenBudget` (Concise/Verbose switch + target lengths)
- `language` (Output language; EN/ES)
- `determinism` (Qualitative hints—deterministic vs. creative)
- `dosDonts` (“Do” & “Don’t” lists)
- `followUp` (How to ask clarifying questions, when to stop)
- `metadata` (Tags, project, version)

### Interfaces (TypeScript)
Create `src/app/core/models`:

```ts
export type PromptSectionKey =
  | 'context' | 'role' | 'goal' | 'audience' | 'input' | 'outputFormat'
  | 'constraints' | 'process' | 'validation' | 'styleTone' | 'toolsApis'
  | 'tokenBudget' | 'language' | 'determinism' | 'dosDonts' | 'followUp' | 'metadata';

export interface PromptSection {
  key: PromptSectionKey;
  title: string;
  enabled: boolean;
  value: string;
  required?: boolean;
  order: number;
}

export interface PromptTemplate {
  id: string;
  name: string;
  sections: PromptSection[];
  updatedAt: string; // ISO
  tags: string[];
  locale: 'en' | 'es';
  mode: 'concise' | 'verbose';
  fences: boolean; // copy with code fences
}
```

## Prompt Synthesis
- Build ordered markdown (`## Section Title\ncontent`).
- If `fences === true`, wrap final with triple backticks.
- Keep whitespace tight, no trailing blank lines.

## Linting (first pass)
- `goal` present, length ≥ 10 chars.
- `outputFormat` present (non-empty).
- Conflicts: “very brief” + “write 1500 words”; multiple languages requested; both “no code” and “return code”.
- Warn if `role` missing while `styleTone` exists.
- Language mismatch between `language` and app UI = **warning**.

## Token Estimation
- Show: characters, words, **estimated tokens** = `Math.ceil(chars / 4)`; explain it’s approximate.

## Pages & Components
- `AppComponent`: layout, skip links, top bar (template switcher, i18n toggles EN/ES, theme switch, help).
- `SectionsListComponent`: list of sections with enable/disable, reorder, textarea editor (monospace), character/word/token counters per section.
- `PreviewPaneComponent`: live markdown preview (sanitized). “Copy” and “Copy with fences”.
- `LintPanelComponent`: shows issues; keyboard-focusable; jump to section.
- `TemplatesService`: CRUD in IndexedDB; autosave; import/export JSON; sample starter templates.
- `ClipboardService`: copy logic with fallback.
- `I18nService`: wraps ngx-translate; locale persisted.
- `SettingsService`: theme, shortcuts, preferences persisted.
- `EstimatorService`: token/length estimates.

## i18n
- Use `@ngx-translate/core`. Keys under `assets/i18n/en.json` and `es.json`.
- All visible strings translated.
- Default language = **English**; toggleable to **Spanish**.

## PWA
- `ng add @angular/pwa`: cache app shell; show install banner; offline-ready.
- Display install state and update-available snackbar.

## Bootstrap
- Import Bootstrap CSS via `angular.json`. Prefer utility classes; minimal custom SCSS (focus ring, high-contrast variables).

## Data Persistence
- Use `idb` for templates (`prompt_templates` store). Use LocalStorage for light settings.

## Export/Import
- Export current prompt as:
  - Markdown (`.md`)
  - JSON (`PromptTemplate` schema)
  - TXT (optional)
- Import JSON (validate schema; migrate if needed).

## Accessibility
- Proper labels, `aria-describedby`, `aria-live` for status, role=toolbar for action rows.
- Visible focus outline (2px) always.
- Focus trap in modals/overlays; ESC to close.

## Testing (light)
- Add a few e2e Playwright tests for:
  - Keyboard reorder
  - Copy to clipboard
  - i18n toggle persistence
  - PWA installs/offline loads (basic)

## Deliverables
- Angular app fully running with the features above.
- `README.md` with quick start commands.
- Sample templates (2):
  1) “Coding Assistant (System+User)”
  2) “Email Rewrite & Tone Control”
- Optional `/server` Spring Boot skeleton (disabled) with `README` noting future persistence.

## Commands (WSL Ubuntu 24.04)
1. Initialize:
   - `corepack enable`
   - `npm i -g @angular/cli`
   - `ng new prompt-builder --routing --style=scss --ssr=false`
   - `cd prompt-builder`
   - `npm i bootstrap @ngx-translate/core @ngx-translate/http-loader idb marked dompurify`
   - `ng add @angular/pwa`

2. Wire Bootstrap CSS in `angular.json` “styles”.

3. Implement components/services per spec.

4. Add keyboard shortcuts and help overlay.

5. Add lint panel and token estimator.

6. Build & run:
   - `npm run start`

## Non-Goals (MVP)
- No API calls to OpenAI.
- No authentication.
- No multi-user sync.
- No server-side storage.

## Quality Bar
- Clean, small components; comments where non-obvious.
- Type-safe models; strict TS.
- Pass basic e2e tests and manual a11y checks.

## Git Behavior (Cursor)
- **Model**: **GitHub Flow** with **one branch per component**.
  - New components: `feat/component/<kebab-name>`
  - Fixes: `fix/component/<kebab-name>`
- **Commit cadence**: **meaningful changes only** (not every save). Ensure formatter/linter pass before committing.
- **Commit messages**: **Conventional Commits** `type(scope): summary`. Derive `scope` from path:
  - `src/app/features/sections/**` → `sections`
  - `src/app/features/preview/**` → `preview`
  - `src/app/core/services/**` → `services`
  - `src/app/core/models/**` → `models`
  - `src/assets/i18n/**` → `i18n`
  - otherwise → top-level folder name
- **Merges**: When a component is complete and checks pass, **direct squash merge** into `main`. Keep `main` green at all times.
- **Hooks**: use pre-commit (format, lint, quick tests) and commit-msg regex to enforce Conventional Commits.

**Now scaffold and implement the app as specified. Ask only if a requirement is ambiguous.**
