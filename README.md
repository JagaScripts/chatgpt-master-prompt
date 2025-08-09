# chatgpt-master-prompt

Prompt Builder (Angular 18 + Bootstrap) — offline-first, keyboard-driven app to compose OpenAI-style prompts with live preview, i18n (EN/ES), basic linting, and token estimates.

## Quick Start

### Prerequisites

- Node.js >= 20
- npm

### Install toolchain (repo root)

```bash
npm install
```

### Run the web app

```bash
cd prompt-builder
npm install
npx playwright install # only needed once if you plan to run e2e
npm start
# App at http://localhost:4200
```

### Lint & Format (repo root)

```bash
npm run format
npm run lint
```

### e2e Smoke (optional)

```bash
cd prompt-builder
npm run e2e
```

## Keyboard Shortcuts

- Ctrl+Shift+C: Copy prompt
- Ctrl+Shift+P: Toggle copy with code fences
- Ctrl+Alt+Up/Down: Reorder last-edited section
- ?: Toggle help overlay

## Git Workflow

- GitHub Flow, feature branches, squash merge to main
- Conventional Commits enforced by commit-msg hook
- Always pull before push on main:
  - `git pull --rebase origin main` then `git push origin main`

## Notable Features

- Live markdown preview (sanitized)
- i18n EN/ES via ngx-translate
- Sections editor with reorder buttons and shortcuts
- Minimal lint panel (required fields)
- Token stats (chars/words/tokens)
- LocalStorage autosave, template Save/Load

## License

Apache-2.0 license
