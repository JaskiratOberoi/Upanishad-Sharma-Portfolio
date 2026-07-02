# Upanishad Sharma — Portfolio

Editorial-style portfolio site for technology & gaming journalist Upanishad Sharma.

Plain HTML/CSS/JS — no build step, no dependencies.

## Preview locally

```bash
python3 -m http.server 4173
# open http://localhost:4173
```

## Deploy

Drop the folder onto any static host:

- **Netlify / Vercel** — drag-and-drop the folder, done.
- **GitHub Pages** — push to a repo, enable Pages on the root.
- **Cloudflare Pages** — connect the repo, no build command needed.

## Editing content

Everything lives in `index.html`:

- **Articles** — the "Selected Work" cards; each is an `<article class="work-card">` with a link, tag, title, and blurb.
- **Stats** — the hero counters use `data-count` / `data-suffix` attributes.
- **Experience / About / Contact** — plain markup in their respective sections.

Colors and typography are CSS custom properties at the top of `styles.css` (`--paper`, `--ink`, `--accent`, font stacks).

## Résumé PDF

`assets/Upanishad-Sharma-Resume.pdf` is a one-page résumé in the site's visual style,
linked from the masthead button, hero, recruiter bar, and contact section.

To regenerate after editing content in `tools/generate_resume_pdf.py`:

```bash
python3 -m venv .venv && .venv/bin/pip install fpdf2
.venv/bin/python tools/generate_resume_pdf.py
```

Fonts are vendored in `tools/fonts/`.
