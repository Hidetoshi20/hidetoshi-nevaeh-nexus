# Repository Guidelines

## Project Structure & Module Organization
- `docs/` — all site content (Markdown). Keep topic areas under existing folders, e.g., `docs/hidetoshi/`, `docs/nevaeh/`, `docs/Recipe Book/`.
- `mkdocs.yml` — site configuration (theme, plugins, language).
- `overrides/` — theme overrides. `overrides/main.html` currently sets `noindex, nofollow` to keep the site private.
- `internal/` — private notes. Not published unless linked or added to nav.
- `site/` — build output (created by MkDocs, deployed by Cloudflare Pages).

## Build, Test, and Development Commands
```bash
# Setup (recommended virtualenv)
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Local dev server (auto-reload)
mkdocs serve

# Strict build (treat warnings as errors)
mkdocs build --strict
```
Cloudflare Pages uses `pip install -r requirements.txt && mkdocs build` and publishes `site/` (see `wrangler.toml`).

## Coding Style & Naming Conventions
- Markdown: one `#` H1 title per page; use clear headings. English headings in Title Case; Chinese/emoji are welcome (consistent with existing files).
- Filenames: keep descriptive names; spaces and emoji are allowed (e.g., `docs/hidetoshi/gym-plan/🏋️ Lower 1 - Squat Focus.md`).
- Links: use relative links within `docs/`. Prefer fenced code blocks with language hints (e.g., ```bash).
- Optional page metadata example:
  ```yaml
  ---
  title: 下肢力量训练
  tags: [训练, 下肢]
  ---
  ```

## Testing Guidelines
- Run `mkdocs build --strict` before pushing; fix any warnings, broken links, or missing assets.
- Manually click through key pages via `mkdocs serve` to verify navigation (Awesome Pages orders items ascending).

## Commit & Pull Request Guidelines
- Use Conventional Commits with scopes seen in history, e.g.: `docs(home-plan): ...`, `feat(deployment): ...`, `refactor(authentication): ...`.
- PRs: include a concise description, linked issues, and screenshots/gifs for visible/theme changes. Ensure a strict build passes and that Cloudflare Pages preview is green.

## Security & Configuration Tips
- Do not commit secrets. Use Cloudflare Pages project variables for tokens and IDs.
- To make the site public, remove the `noindex, nofollow` meta in `overrides/main.html` and the robots setting in `mkdocs.yml` `extra.meta`.
