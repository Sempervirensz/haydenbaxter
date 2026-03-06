# AI Editing Guide

This project was restructured so edits are localized and faster for AI tools.

## Where to edit

- `app/data/site-content.js`: page copy, labels, cards, portfolio content, scroll labels/breakpoints
- `app/renderers/page.js`: HTML structure/templates for each section
- `app/features/splash.js`: splash intro behavior
- `app/features/work-scroll.js`: scroll-driven work section state + CD rotation logic
- `app/features/emerging-tech-builds.js`: Screen 2 filters, sorting, hover preview, modal, image fallbacks
- `app/features/supply-consulting.js`: Screen 3/4 interactive cards, hover states, and modals
- `index.html`: thin shell only (fonts, stylesheet, mount points)
- `style.css`: all visual styles

## Common changes

- Update portfolio text or stats: edit `app/data/site-content.js`
- Add/remove work screens: edit `app/data/site-content.js` and adjust `workScroll.screenBreaks` if timing should change
- Change markup classes/layout: edit `app/renderers/page.js` (keep class names in sync with `style.css`)
- Change interactions: edit files in `app/features/`
- Update Emerging Tech Builds projects/filters/scores: edit `app/data/site-content.js` (`work.detailScreens[1].etb`)
- Update Supply Chain section data: edit `app/data/site-content.js` (`work.detailScreens[2].supplyChain`)
- Update Consulting section data/offers: edit `app/data/site-content.js` (`work.detailScreens[3].consulting`)

## Performance / context hygiene

- Avoid inline base64 images in HTML (use image files instead)
- Keep large text/content in `app/data/site-content.js` so UI logic stays small
- Keep interaction code separate from rendering code to reduce cross-file edits
