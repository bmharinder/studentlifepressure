# PRESSURE POINTS — The Truth About Student Life

A cinematic, interactive frontend website for a college frontend competition.
Created by Team Potato — BCADS 13 (Design/UI: Divist · Frontend Code: Dev · Deployment: Hari)

## Run locally
No install needed. Open `index.html` in a browser, or serve the folder:
```
npx serve .        # or: python -m http.server 8000
```
GSAP + ScrollTrigger load from cdnjs and fonts from Google Fonts, so connect to the internet for the full animations. If they fail to load, all content and interactions still work.

## Put it on GitHub + GitHub Pages
1. Create a new repo, upload `index.html`, `styles.css`, `main.js`, `README.md` (keep them in the repo root).
2. Repo → Settings → Pages → Source: "Deploy from a branch" → `main` / `(root)` → Save.
3. Your site goes live at `https://<username>.github.io/<repo>/`.

## Notes
- Vanilla HTML/CSS/JS, no build step, no backend.
- Intro plays once per browser session; SKIP INTRO and Esc both skip it.
- Respects `prefers-reduced-motion`; the pressure values are illustrative, the stories are illustrative, and the message form sends nothing anywhere.
