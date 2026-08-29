# Hovedo's Way HLC — project guide

Static marketing site for Hovedo's Way Health & Life Coaching.
Plain HTML/CSS/JS. No framework, no build step, no dependencies.

## Repository layout

```
public/          <- EVERYTHING here is deployed and publicly reachable
  index.html       Home
  services.html    The three offerings + credentials
  inquiry.html     Contact form, FAQ, insurance, privacy
  splash.html      Coming-soon page (own splash.css / splash.js)
  style.css        Shared design system
  script.js        Nav toggle, footer year, inquiry form handler
  assets/          Web-ready files only (logo.svg, logo-light.svg,
                   mark.png favicon, certificates/)

Repo root        <- NOT deployed. Notes, config, this file.
Images/          <- gitignored. Source artwork. Never commit.
```

Anything placed in `public/` is served on the live domain. Keep working
notes, source files and scratch work at the repo root or outside it.

## Branches

| Branch  | Deploys to                          | Contains                 |
| ------- | ----------------------------------- | ------------------------ |
| `main`  | https://hlc.hovedosway.com          | production               |
| `draft` | https://draft.hovedosway-hlc.pages.dev | work in progress      |

**Work on `draft`.** Merge to `main` only when launching. Pushing to `main`
publishes immediately.

Cloudflare Pages auto-deploys on push, in roughly 20–60 seconds. Verify by
fetching the URL with a cache-buster rather than trusting the push.

## Design system (`public/style.css`)

| Token           | Value     | Use                            |
| --------------- | --------- | ------------------------------ |
| `--brand`       | `#f4701b` | logo arrow, rules, borders     |
| `--brand-deep`  | `#b95515` | links, eyebrows                |
| `--brand-hover` | `#e26410` | button hover                   |
| `--brand-solid` | `#be5715` | reserved: carries white text   |
| `--brand-tint`  | `#fef1e8` | panel fills                    |
| `--navy`        | `#1b3050` | secondary accent               |

Fonts: Fraunces (headings) + Inter (body), via Google Fonts.
Logo: `height: clamp(48px, 5.2vw, 60px)`.

**Buttons use dark ink on the bright orange** — 5.61:1 contrast. Do not
switch them to white text; white on `--brand` is 2.92:1 and fails WCAG AA.
`--brand-solid` exists for the case where white text is genuinely needed.

## Linking convention

Internal links use the **`.html` extension** — `services.html`, not `/services`.

Cloudflare Pages strips the extension in production (308 to `/services`), so
these links work live *and* under the local `http.server`, which serves files
literally and 404s on extensionless paths.

Do not write internal links as `/services`. They will work in production and
appear broken locally, which is the confusing way round.

`public/404.html` is the deliberate exception: it uses **absolute** paths
(`/style.css`, `/assets/logo.svg`). It gets served at arbitrary URLs, so
relative paths would resolve against a non-existent directory. This means the
404 page cannot be previewed properly on the local server — check it against
the deployed URL instead.

## Copy conventions

1. Service names are title case: **Health Coaching**, **Life Coaching**,
   **Diabetes Focus**, **General Life Coaching**. The condition itself stays
   lowercase — "I live with diabetes".
2. Use **"HIPAA-aligned"** throughout. Never "HIPAA-compliant".
3. Name the certifying body **only** in the Services credentials block.
   Describe methodology generically elsewhere ("years of research and
   coursework").
4. Do not add claims that are not in the approved copy — particularly about
   experience, outcomes, or credentials.
5. Never commit anything from `Images/` or any training material.

## The three offerings

1. **The Art of Being Liked, by YOURSELF and others** — flagship, 12 weeks,
   three phases. Keeps visual priority everywhere it appears.
2. **General Life Coaching** — relationships, money, career.
3. **Health Coaching** — nutrition, movement, daily habits. **Diabetes Focus
   is nested inside this**, not a separate offering. Do not split it back
   out; visitors must not think a diagnosis is required.

## Inquiry form

Web3Forms, wired and tested. Submissions go to the `admin@hovedosway.com`
alias; the address shown on the page is `vinson@hovedosway.com`.

The form posts from the form service's own domain with `replyto` set to the
enquirer. Do not reconfigure it to send as `@hovedosway.com` — the domain's
SPF and DMARC records are strict and such mail is rejected.

## Infrastructure notes

- DNS is managed at GoDaddy; `hlc` is a CNAME to the Pages project.
- Cloudflare Pages custom domains work for **subdomains** on third-party
  DNS, but not for an apex domain.
- Mail is Microsoft 365. To reach more than one recipient, convert the
  `admin@` alias to a distribution group — no site change needed.

## Workflow

Two machines share this repo.

```bash
git pull                       # always, before editing
# ...edit...
cd public && python -m http.server 8000    # local preview
git push origin draft
```

Push before walking away, even mid-task. An unpushed commit is invisible to
the other machine.
