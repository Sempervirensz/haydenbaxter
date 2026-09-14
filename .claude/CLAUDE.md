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

## Worktrees — one writer per checkout (READ THIS FIRST)

The primary checkout `/Users/haydenbaxter/Desktop/haydenbaxter` has ONE HEAD and ONE
working tree, and several agent sessions are usually open against this repo at once.

**Never run `git checkout <branch>` or `git switch <branch>` in the primary checkout.**
Switching the branch there changes the files under every other session working in it: their
edits appear to vanish, and their commits land on whatever branch you selected. On
2026-09-14 four sessions did exactly this inside 30 minutes, which erased five commits via a
`reset --hard` and made the shipped navbar look like it had reverted.

Instead:
- Take your own worktree (`EnterWorktree`, or `git worktree add .claude/worktrees/<name> -b <branch>`).
- Treat the primary checkout as read/build only.
- Give each dev server its own port AND its own `NEXT_DIST_DIR` (see `.claude/launch.json`);
  two `next dev` on one dist dir flap routes between 200 and 404.
- The stash stack is SHARED across every worktree. Never use bare `git stash` / `git stash pop`
  — you can swallow another session's work. Prefer a WIP commit; if you must stash, use
  `git stash push -u -m "<unique-tag>"` and `git stash apply <sha>`.
- Before any destructive git command, check who else is here:
  `for p in $(pgrep -f "MacOS/claude"); do lsof -a -p $p -d cwd -Fn | grep ^n; done`

## Commands
- Next dev: `npm run dev`
- Vanilla preview (if needed): `python3 -m http.server 8000`

## Where to look for truth
- Reference architecture: `legacy/design-inspo/SITE_OVERVIEW.md`
- Reference edit locations: `legacy/design-inspo/AI_EDITING_GUIDE.md`
