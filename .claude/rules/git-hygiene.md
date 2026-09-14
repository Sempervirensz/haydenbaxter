# Git hygiene for agent-driven edits

- One writer at a time (Claude OR Codex OR Cursor).
- Commit in small, logical chunks.
- Before switching tools, write a short handoff note: goal, constraints, files touched, next steps, test steps.

## The shared-checkout rules (added 2026-09-14 after work was lost)

- The primary checkout has one HEAD shared by every session. **Do not `git checkout`/`git switch`
  a branch there** — take a worktree instead. See the worktree section in `.claude/CLAUDE.md`.
- The stash stack is shared across all worktrees. Never bare `git stash` / `git stash pop`;
  use `git stash push -u -m "<tag>"` and `git stash apply <sha>`, then drop by tag.
- `git reset --hard`, `git clean`, `git checkout -- .` and `git stash drop` are denied in
  `.claude/settings.json`. That is deliberate — they are what lost the work. If you genuinely
  need one, ask first and say what you are about to discard.
- Archive rather than delete: stale unmerged branches are tagged `archive/<branch>` and pushed
  to origin. Recover one with `git checkout -b <branch> archive/<branch>`.
- `git push` does NOT deploy. Production ships via `vercel --prod`, which builds REMOTELY from
  the working tree — so uncommitted files ship. Deploy only from a clean tree, and copy
  `.vercel/project.json` into a worktree first or Vercel creates a stray project.

