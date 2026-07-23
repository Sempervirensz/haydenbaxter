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
- Verify before you hand work back: `npm run check` (tsc + asset references)
- Production build: `npm run build` (static export to `out/`)
- Vanilla preview (if needed): `python3 -m http.server 8000`

## Traps that have already caused shipped bugs

Read these before touching assets or running a build. Each one is invisible on
this machine and only shows up in production.

### 1. Asset paths are case-sensitive in production, not in dev
Development is macOS (case-insensitive); Vercel builds on Linux
(case-sensitive). `url("/Consulting/hero.png")` resolves locally and 404s
after deploy. Worse, `git config core.ignorecase` is `true`, so git can track
`public/consulting/` while your working copy shows `public/Consulting/` — and
any audit that reads the filesystem gives the wrong answer.

**git's index is the authority**, not the filesystem: `git ls-files public/`
is exactly what a fresh clone gets. `npm run check:assets` enforces this.

### 2. Assets under `public/` must actually be committed
A referenced file sitting untracked in your working directory renders fine
locally and is simply absent for everyone else. Eight assets were in this
state at once. `npm run check:assets` catches it.

### 3. Never run `npm run build` while `npm run dev` is running
They share `.next/`, and the production build overwrites the manifests the
dev server is still using. The symptom is not an error — the page keeps
serving and every chunk returns 200, but React never hydrates, so every
`onClick` silently does nothing and it looks like an interaction bug in your
code. Stop the dev server, `rm -rf .next`, then build.

### 4. Booking links come from one place
`CALENDLY_URL` in `src/data/connect.ts` feeds the navbar CTA, the Connect
embed, and the consulting drawer. Change it there, never inline.

### 5. Much of `src/app/*-lab/` is uncommitted work in progress
Many lab and sandbox routes exist only in the working directory. If a lab
route seems to be missing from git, that is expected — do not "restore" it
from a build artifact. Production surfaces are `/`, `/blog`, `/privacy`,
`/emerging-tech-builds/**` (see `PUBLIC_ROUTES` in `src/data/site.ts`).
