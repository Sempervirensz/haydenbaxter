# HaydenBaxter Portfolio — Claude Code Operating Manual

## North star
Design-forward portfolio. Dark-only. DYMO label UI. Grounded motion.
The Work/CD scroll interaction is a signature element (reference implementation lives in `legacy/design-inspo`).

## Two-world repo
1) **Primary (Next.js):** ship features here (`src/**`)
2) **Reference (legacy/design-inspo):** consult this when porting UX/visual systems

## File ownership (primary)
- Pages/routes: `src/app/**`
- Components: `src/components/**`
- Copy/content: `src/data/**` (create if missing; keep large copy out of components)
- Styling: `src/app/globals.css` (+ component styles)

## File ownership (reference)
- Copy/content: `legacy/design-inspo/app/data/site-content.js`
- Markup/templates: `legacy/design-inspo/app/renderers/page.js`
- Interactions: `legacy/design-inspo/app/features/*.js`
- Styling: `legacy/design-inspo/style.css`

## Default workflow for any task
1) Identify exact files to touch (keep list small)
2) Minimal diff, preserve vibe
3) Verify: no console errors; reduced-motion safe; layout stable
4) Summarize changes + how to test

## Commands
- Next dev: `npm run dev`
- Vanilla preview (if needed): `python3 -m http.server 8000`

## Where to look for truth
- Reference architecture: `legacy/design-inspo/SITE_OVERVIEW.md`
- Reference edit locations: `legacy/design-inspo/AI_EDITING_GUIDE.md`
