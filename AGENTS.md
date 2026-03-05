# AGENTS.md — HaydenBaxter + Design-Inspo Agent Contract

## North star
Design-forward portfolio. Dark-only. DYMO label UI. The Work/CD scroll interaction is a signature element.
Minimize diffs. Preserve architecture. Avoid style drift.

## Two-world repo (intended)
1) **Next.js site (haydenbaxter)** = primary product and deployment target
2) **legacy/design-inspo** = reference implementation / source of truth for CD + DYMO behaviors and patterns

## File ownership rules (do not mix concerns)
### Next.js (primary)
- Routing/pages: `src/app/**`
- Components: `src/components/**`
- Copy/content: `src/data/**` (create if missing) — avoid hardcoded long strings in components
- Styling: `src/app/globals.css` + component styles (keep tokens centralized)

### legacy/design-inspo (reference)
- Copy/content: `legacy/design-inspo/app/data/site-content.js`
- Markup/templates: `legacy/design-inspo/app/renderers/page.js`
- Interactions: `legacy/design-inspo/app/features/*.js`
- Styling: `legacy/design-inspo/style.css`

## Non-negotiables
- Dark mode only (no light theme work)
- Respect `prefers-reduced-motion`
- Smallest possible change set (touch minimum files)
- When porting from reference → primary, preserve the original UX first; refactor second

## Workflow (always)
1) Restate goal + constraints in 3 bullets
2) List files to touch (keep list small)
3) Implement minimal diff
4) Provide verification checklist (how to test + what to visually confirm)

## Commands
- Next dev: `npm run dev`
- Vanilla preview (if needed): `python3 -m http.server 8000`
