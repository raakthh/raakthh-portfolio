# raakthh portfolio

Personal portfolio website for **raakthh** (Araa), built with HTML5, CSS3, and vanilla JavaScript. No frameworks, no build step, no external dependencies. Works on GitHub Pages.

> Building with data. Thinking beyond it.

## Project structure

```
index.html
css/style.css
js/data.js            all content (projects, experience, skills, contacts)
js/main.js            rendering and interactions
assets/favicon.svg
assets/images/profile/    put profile.jpg here
assets/images/projects/   put real project screenshots here
assets/documents/         put cv.pdf here
docs/PROJECT_BRIEF.md
docs/PROGRESS.md
```

## Run locally

Opening `index.html` directly works, but a local server is recommended (the CV check uses `fetch`, which needs HTTP):

```bash
cd raakthh
python3 -m http.server 8000
# open http://localhost:8000
```

## Update content

Edit `js/data.js` only. Everything on the page is rendered from it.

- **Profile photo:** save as `assets/images/profile/profile.jpg`. Until then an initial-letter placeholder is shown.
- **Project screenshots:** add real images to `assets/images/projects/` and set the project's `image` field, for example `"assets/images/projects/savera.png"`.
- **CV:** save your PDF as `assets/documents/cv.pdf`. The "Download CV" button stays hidden until the file exists, then appears automatically.
- **New project:** copy an object in `projects`, give it a unique `id`, and use categories from the `categories` list. Only add links that really exist.

## Deploy to GitHub Pages

1. Create a repository on GitHub (for example `raakthh.github.io` for a root site, or any name for a project site).
2. Push this folder's contents to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/raakthh/<repo-name>.git
   git push -u origin main
   ```
3. In the repository go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then **Save**.
5. After a minute the site is live at `https://raakthh.github.io/` (or `https://raakthh.github.io/<repo-name>/`).

All asset paths are relative, so both URL styles work.

## Accessibility and performance notes

- Semantic landmarks, skip link, visible focus states, keyboard-operable menu, filters, and modal (Esc closes, focus is trapped and restored).
- `prefers-reduced-motion` disables animations and smooth scrolling.
- Theme choice is saved in `localStorage` and defaults to the system preference.
- No API keys, tokens, or secrets are used or stored.
