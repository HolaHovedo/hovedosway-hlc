# Hovedo's Way HLC

Static site for Hovedo's Way HLC, served at https://hlc.hovedosway.com

## Stack
Plain HTML/CSS/JS. No build step.

## Local preview
Open `index.html` in a browser, or:

    python -m http.server 8000

## Deploy
Pushing to `main` triggers an automatic Cloudflare Pages deploy.
The footer carries a `build: vN` marker used to confirm a deploy landed.
