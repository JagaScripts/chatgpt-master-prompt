# Automation & Non-Interactive Execution (zsh)

This project is optimized for non-interactive execution in zsh to avoid editor "Skip" prompts.

## Shell: zsh
- Primary shell: zsh
- Disable history expansion to avoid `!` issues:
  - Temporary (current session): `setopt NO_BANG_HIST`
  - Persistent: add `setopt NO_BANG_HIST` to your `~/.zshrc`
- Prefer single quotes for Node one-liners or use a heredoc with a quoted delimiter:
  ```bash
  node <<'NODE'
  // JS here; safe from zsh history expansion
  NODE
  ```

## Environment for non-interactive runs
Export these to reduce prompts and paging:
```bash
export PAGER=cat
export GIT_PAGER=cat
export LESS=FRX
export NG_CLI_ANALYTICS=false
export NPM_CONFIG_FUND=false
```

## Command patterns
- Append `| cat` to long outputs to avoid pagers.
- Use background jobs for long pipelines:
  ```bash
  nohup bash -lc 'your commands here' >/tmp/your_job.log 2>&1 & disown
  ```
- Prefer non-interactive flags: `--yes`, `--defaults`, `--interactive=false`, `--skip-confirmation`.

## Git & Hooks
- Keep hooks non-interactive (format, lint, quick test); fail-fast, do not prompt.
- Use squash merges to keep `main` green.


