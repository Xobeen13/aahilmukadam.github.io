# Aahil Mukadam Portfolio

A retro sci-fi manga-inspired portfolio site built with plain HTML, CSS, and JavaScript.

## Files
- `index.html` — page structure
- `styles.css` — all visual styling
- `portfolio-data.js` — projects, experience, skills, and contact links
- `script.js` — rendering, filtering, and content-manager logic

## Update your portfolio
You have two ways to update content:

### 1. Edit the data file directly
Open `portfolio-data.js` and add a new object to `projects` or `experience`.

### 2. Use the built-in editor
Open the website and click **Edit Portfolio**.
- Add a project or experience.
- Changes are previewed immediately and saved in your browser.
- Go to **Export Data** and download the updated `portfolio-data.js`.
- Replace the old file with the downloaded one before deploying again.

## Customize contact links
In `portfolio-data.js`, replace the placeholder email, LinkedIn, GitHub, and résumé URLs.

## Run locally
You can double-click `index.html`, but using a local server is better:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy for free
Good options:
- GitHub Pages
- Netlify
- Cloudflare Pages
- Vercel

Because this is a static site, no build step is required.

## Art direction
The visual system uses original retro manga/comic motifs: thick ink outlines, halftone textures, speed-line bursts, caption boxes, bold primary colors, and a custom robot illustration. It is inspired by mid-century Japanese sci-fi manga aesthetics without reproducing copyrighted Astro Boy artwork or panels.
