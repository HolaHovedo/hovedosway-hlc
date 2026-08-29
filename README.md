# Hovedo's Way HLC

Static site for Hovedo's Way Health & Life Coaching.

- Production: https://hlc.hovedosway.com (`main`)
- Preview: https://draft.hovedosway-hlc.pages.dev (`draft`)

## Stack

Plain HTML/CSS/JS. No framework, no build step, no dependencies.

## Layout

Everything served lives in `public/`. The repo root is not deployed.

## Local preview

    cd public
    python -m http.server 8000

## Deploy

Cloudflare Pages builds on push. Build command is empty; build output
directory is `public`.

Work on `draft`; merge to `main` to publish.

See [CLAUDE.md](CLAUDE.md) for conventions and project detail.
