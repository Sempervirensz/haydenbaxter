---
name: audit-repair
description: Work through the adversarial audit findings one at a time — confirm, fix, build, and verify each across Chromium/Firefox/WebKit at six widths, recording evidence in docs/audit-status.md. Use when the user runs /audit-repair, asks to resume audit repairs, or asks to fix the next audit finding.
---

# Audit Repair Loop

Repair the findings in `docs/adversarial-audit.md`, one at a time, verifying each
across three browser engines before moving on. Progress lives in
`docs/audit-status.md`, so the loop survives across sessions.

## Ground rules

**Source of truth is the Next.js site under `src/**`.** It is a Next 15 / React 19
static export (`output: "export"`). `legacy/design-inspo/` is a reference tree that
does not deploy — never fix anything there, and never cite it as evidence. Treat
`SITE_OVERVIEW.md`, `AI_EDITING_GUIDE.md`, and the root `*_HANDOFF.md` / `*_LAB.md`
documents as historical; they describe a vanilla-JS site that no longer ships.

**Never deploy.** Build and test locally. Deployment is the user's call, made
separately. Do not run `vercel`, and do not push.

**Respect what is already recorded.** A finding marked `Verified` in
`docs/audit-status.md` is done — do not redo it. Re-open it only if the regression
suite actually fails on it, and say so explicitly when you do.

**Do not stop between findings.** Finish one, update the ledger, start the next.
Do not ask the user to approve ordinary implementation choices — which selector,
which breakpoint, how to word a comment. Those are yours.

**Minimal diff.** The repo's own rule (`.claude/CLAUDE.md`): touch the smallest set
of files, preserve the visual language. Dark-only, DYMO label UI, grounded motion.
A repair that also refactors is a repair that cannot be reviewed.

## The loop

Repeat until every finding is `Verified`, `Blocked`, or `Invalid`.

### 1. Read state
Read `docs/audit-status.md`, then the matching section of `docs/adversarial-audit.md`.

### 2. Select
Take the highest-severity row that is not `Verified`, `Blocked`, or `Invalid`
(P0 → P1 → P2 → P3 → P4; within a severity, lowest ID first).

### 3. Confirm it still exists
**Do not trust the audit.** Reproduce the finding against current code before
changing anything. Findings go stale, and two in this audit were harness artifacts
rather than defects.

If it no longer reproduces, mark it `Invalid` with the evidence that disproves it,
and move to the next finding. That is a valid outcome, not a failure.

### 4. Record baseline
Capture the measurement that shows the defect — the number, the console output, the
computed style, the failing coordinate. This is what "before" means in the ledger.
A repair with no baseline cannot be shown to have worked.

### 5. Fix
Smallest safe change that resolves the finding. Prefer an existing pattern in the
codebase over a new one — e.g. `useCinematicParallax.ts:33` is the house pattern for
reduced-motion, `pageExtensions` in `next.config.ts` is the house pattern for keeping
a route out of production.

### 6. Build
```bash
npm run build
```
Must succeed. A failed build is not a finished repair. If another process holds
`.next`, use `NEXT_DIST_DIR=.next-audit npm run build` rather than killing it.

### 7. Test the matrix
```bash
npm run test:audit
```
Chromium + Firefox + WebKit at mobile (390), landscape (844×390), tablet (768),
laptop (1440), desktop (1920), and wide (2560). Add a test to
`tests/audit/audit-regression.spec.ts` that fails on the old behaviour and passes on
the new one — that test is what lets a later session trust this row.

### 8. Check the cross-cutting invariants
The suite already asserts these; confirm the finding's own change did not break them:
console errors, failed requests, horizontal overflow, text clipping, keyboard access,
reduced motion.

### 9. Debug until green
A failing test is not done. Before assuming a site defect, rule out the harness —
this suite has produced four false failures already, all documented in
`tests/audit/audit-regression.spec.ts` and `scripts/serve-export.mjs`:

| Symptom | Cause |
|---|---|
| WebKit: every asset fails with a TLS error | `upgrade-insecure-requests` in the replayed CSP; WebKit applies it to `127.0.0.1`, Chromium exempts localhost |
| Firefox: cookie rejections reported as console **errors** | Third-party Calendly/Stripe cookies |
| Chromium: `Failed to load resource: net::ERR_FAILED` | `route.abort()` on third-party; fulfil with 204 instead |
| Firefox: `NS_BINDING_ABORTED` on images | Browser-cancelled request from a `src` swap — not a failure |
| WebKit: Tab never moves focus | Safari excludes buttons/links from Tab order by default. Assert focusability, not Tab order |

If a failure is genuinely engine-specific site behaviour, fix the site — that is the
point of running three engines.

### 10. Update the ledger
Set the row to `Verified` and record: what changed, the before/after measurement, the
commit if you made one, and which engines/widths passed. `Verified` requires a green
matrix — a passing build alone is `Fixed`, not `Verified`. Append a `Run log` row.

### 11. Continue
Go to step 2. Do not summarise and wait.

## When to mark Blocked

Mark **only that finding** `Blocked`, write why, and continue to the next. Never
self-unblock, and never substitute your own judgement for the user's on these:

- **A missing asset** you cannot create — e.g. ETB-P2-03 needs a resume PDF.
- **Credentials or external access** — accounts, dashboards, DNS, another Vercel project.
- **Destructive deletion** — removing committed files or assets, e.g. ETB-P1-04b wants
  `public/atomic-os-demo/` (a whole second Next build) gone.
- **A genuine business decision** — what contact details to publish (ETB-P3-02),
  whether to suppress a third-party GDPR banner, what a claim should say.

Copy edits are *not* blocked: fix wording that is factually wrong about the site
(ETB-P2-04), but keep the author's voice and do not invent claims about experience,
clients, or outcomes.

## Reporting

At the end of a run, report only:
- findings moved to `Verified`, with the before → after measurement
- findings marked `Blocked` or `Invalid`, with the reason
- the matrix result (passed / failed / skipped counts)
- what is next

Do not paste the full audit or the whole ledger back.

## Files

| Path | Role |
|---|---|
| `docs/adversarial-audit.md` | The findings. Read-only except for `STATUS` blocks. |
| `docs/audit-status.md` | The ledger. **The resume point.** Update every iteration. |
| `tests/audit/audit-regression.spec.ts` | The matrix suite. Add a test per repair. |
| `playwright.audit.config.ts` | 3 engines × 6 widths = 18 projects. |
| `scripts/serve-export.mjs` | Serves `out/` the way Vercel does. |

## Honesty

Report what you actually verified. If you tested one width, say one width — do not
write "verified across all sizes". If a fix is unverified in an engine, say which.
The audit itself had to be corrected twice for claiming more than had been checked;
this ledger is worth less than nothing if its evidence cannot be trusted.
