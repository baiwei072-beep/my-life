# Mike Blog

This is a static personal blog with a local browser-based writing tool.

## Open locally

Redeploy trigger
Double-click [index.html](./index.html) to open it in your browser.

## Run as a local frontend app

1. Create the virtual environment:
   `python3 -m venv .venv`
2. Install dependencies:
   `./.venv/bin/pip install -r requirements.txt`
3. Install the browser for automation:
   `./.venv/bin/playwright install chromium`
4. Start the local server:
   `./.venv/bin/python tools/run_dev.py`
5. Open:
   `http://127.0.0.1:4173/login.html`

## Automated browser smoke test

Run:

```bash
./.venv/bin/python tools/smoke_test.py
```

It checks:

- login page loads
- local login redirects into the personal space
- avatar recommendations stay hidden until the avatar is clicked
- recommended avatars render
- every published card has a delete button
- publishing and deleting a dynamic post works

## Publish a new post

1. Open [compose.html](./compose.html).
2. Fill in the title, category, date, summary, and body.
3. Click `Publish`.
4. The post will appear on the homepage in the same browser.

## Important limitation

- Published posts are stored in `localStorage`.
- They are available only in the browser where you published them.
- If you want posts to exist as real files or sync across devices, the next step is to move this site to a Markdown-based workflow with a build step.

## If you want to upgrade it later

- For a more serious writing workflow, migrate it to `Astro` or `Next.js + Markdown`.
- To use your own domain, deploy it with `GitHub Pages`, `Vercel`, or `Netlify`.
- To reuse content for WeChat, write here first and then paste it into the official editor.

## Current structure

```text
blog/
├── assets/
│   └── avatar.png
├── posts/
│   ├── fintech-projects.html
│   ├── template.html
│   └── writing-practice.html
├── index.html
├── styles.css
└── README.md
```
