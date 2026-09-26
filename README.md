# Tech Feast — Beyond the ordinary

A responsive, dependency-free parallax webpage made for Tech Feast. Built with semantic HTML, CSS, and vanilla JavaScript.

## Run

Open `index.html` directly in a browser. No installation, build step, API keys, external fonts, or network connection is required.

For a local server, run `python -m http.server 8000` in this folder, then visit `http://localhost:8000`.

## Experience

- Layered orbital hero, overlapping signal graphics, staggered playground cards, and concentric depth rings move at different scroll speeds.
- Native scrolling with requestAnimationFrame updates, cached section measurements, passive listeners, and transforms.
- Scroll-linked marquee and reading-progress line.
- Click “Make some waves” for a short particle burst and changing message.
- Motion toggle, automatic reduced-motion support, keyboard focus styles, skip link, semantic sections, and mobile layouts.
- All content remains accessible with JavaScript disabled. Decorative elements are hidden from assistive technology.

## Publish with GitHub Pages

In the repository, open **Settings → Pages**. Select **Deploy from a branch**, then **main** and **/(root)**, and save. GitHub will display the hosted URL when deployment completes.

## Files

- `index.html`: content and accessible page structure
- `styles.css`: responsive styling and visual layers
- `script.js`: parallax, progress, motion controls, and particle interaction

This is a creative Tech Feast showcase; no event dates, ticket availability, or registration claims are implied.
