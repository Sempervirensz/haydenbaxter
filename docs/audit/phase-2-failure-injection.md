# Report 2 — Failure Injection (Brief Phase 11) + Step 0 Result

**Date:** 2026-08-26 · **Against:** commit `15f4e7b`, local production export

> Phase 11 was ~10% covered in round 1 — only reduced-motion. All thirteen scenarios are now
> exercised. **The headline is how well the site holds up**, plus one self-inflicted breakage that
> Step 0 caught.

## Scope

**Exercised:** Google Fonts blocked · all images fail · all JS chunks fail · JS disabled entirely ·
Calendly blocked · video fails · slow network (300 ms/request) · DPR 3 · browser zoom 200% ·
rapid tab-switching ×5 · viewport resize mid-scroll across the 1024 breakpoint · reload deep in
the page · reduced motion (round 1). Plus Step 0: the original 8-spec feature suite.

**Not exercised:** real device thermal throttling; real network jitter; service-worker/offline
(none registered).

---

## Findings

### [ETB-P11-01] My lab-route fix broke the original feature suite — 27 tests, on deployed code

- **Severity:** **P2** · **Confidence:** **High (confirmed)** · **Area:** Test integrity
- **Location:** `tests/entry-cta.spec.ts:17` — `const LAB = "/entry-cta-lab";`

**Problem**
Commit `92fbecf` renamed 31 lab routes to `page.dev.tsx` so they stop shipping. `entry-cta.spec.ts`
navigates to `/entry-cta-lab`, and the original suite's `webServer` runs `next build` — a
*production* build, where that route no longer exists. Every test in the spec fails on a 404.

**Evidence**
```
tests/entry-cta.spec.ts:57
  await expect(page.locator(".ecta__choice")).toBeVisible();   ← never appears
Failures by spec:  entry-cta.spec.ts  (only)
Tests in that spec: 27
Other specs:        no failures
```
`.ecta__choice` is rendered by `src/components/entry-cta-lab/EntryCtaGate.tsx:183`, reachable only
via `/entry-cta-lab`.

**Why it matters**
This is exactly the risk Step 0 existed to find, and it was live: a deployed fix silently
invalidated 27 tests. The lab itself is fine — it still serves under `next dev`. The **suite's
assumption** that labs exist in a production build is what broke, and that assumption is now
permanently wrong by design.

**Recommended remediation**
Run lab specs against a dev server, mirroring the architecture: labs are dev-only, so lab tests
should be dev-only. Not deletion — 27 tests of real coverage on a lab that still exists.
**Complexity:** Small

---

### [ETB-P11-02] With JavaScript unavailable, the homepage is a dead end for all Work content

- **Severity:** **P3** · **Confidence:** **High (confirmed)** · **Area:** Resilience
- **Location:** `src/components/design-lab/design-lab.css:464-466`; `SoftLockGate.tsx`

**Problem**
The gate opens by JS setting state. With JS disabled or failed, `.dlab-gate__content` keeps
`is-locked` → `display: none`, and the "Skip ahead" link targets `#work`, which is *inside* that
hidden container.

**Evidence**
```
JS disabled:  gate class = "dlab-gate__content is-locked"   (display:none)
              document scrollHeight = 909px  (entry screen only)
              skip link href = "#work"  → target is display:none
Reachable links on the no-JS homepage:
  /blog · /privacy · Calendly · LinkedIn · WorldPulse · mailto · WhatsApp
  NOT reachable: /emerging-tech-builds  (no link from the homepage at all)
```

**Important calibration.** Other routes render fully without JS — `/emerging-tech-builds` returns
43,970 characters of body text. The content exists and is server-rendered; it is only *unreachable
from the homepage*. And every contact path survives: email, LinkedIn, WhatsApp, Book a Call. **The
conversion path works without JS; the evidence path does not.**

**Why it matters**
Not because people browse with JS off (~0.2%), but because "all JS chunks fail" produces the same
state — a CDN hiccup, an aggressive blocker, a flaky mobile connection. The brief lists
"JavaScript loads slowly" as a scenario for exactly this reason.

**Recommended remediation**
Cheapest meaningful fix: add `/emerging-tech-builds` as a real `<a href>` somewhere in the no-JS
homepage output (the footer already renders without JS). A `<noscript>` block is the belt-and-braces
option. Rebuilding the gate to be CSS-only is not proportionate.
**Complexity:** Small

---

### [ETB-P11-03] Reloading deep in the page throws the visitor back to the locked gate

- **Severity:** **P3** · **Confidence:** **High (confirmed)** · **Area:** UX / state

**Problem**
Gate state is not persisted. Reload at any depth and the visitor is back at the entry gate with
four cards to flip again, scroll position lost.

**Evidence**
```
Flip 4 cards → scroll to y=9000 → reload
after: scrollY = 9,  gateOpen = false,  h1 visible = true
```

**Why it matters**
A visitor who reloads, or arrives via back/forward, or shares a deep link, redoes the puzzle. The
brief lists "reload halfway down the page" and "history/back-button problems" as attacks; this is
both. Mitigating factor: the skip link is one click.

**Recommended remediation**
Persist the opened state in `sessionStorage` and restore on mount. Small, self-contained, and
matches the existing pattern of client-only state in `SoftLockGate`.
**Complexity:** Small

---

## Suspicious but actually fine — the site survived nearly everything

Every scenario below left the headline, all four cards, the skip link, and **zero horizontal
overflow** intact:

| Scenario | Result |
|---|---|
| Google Fonts blocked | Falls back to `DM Serif Display` — a real stack, not `serif` |
| All images fail | Layout holds, no overflow |
| All JS chunks fail | Static HTML still presents the entry |
| Calendly blocked | No layout void — the component's documented fallback works |
| Video fails | No gap |
| Slow network (300 ms/req) | Renders correctly |
| DPR 3 | Clean |
| Browser zoom 200% | No overflow |
| **Rapid tab-switching ×5** | **Disc still responds after refocus** |
| **Resize mid-scroll across 1024** | 0 overflow, **0 page errors**, still scrollable |

Two of those deserve specific credit, because they test code I changed:

1. **Tab churn ×5 → the CD still responds.** `ETB-P2-01` gated the Work rAF loop on
   `visibilitychange`. This is the scenario that could have left the loop permanently stopped
   after a backgrounded tab. It recovers.
2. **Resize across the 1024 breakpoint mid-scroll** — where `WorkSectionResponsive` swaps between
   the cinematic and mobile components — produced **zero page errors**.

Also corrected during this phase: I initially recorded the skip link as having **no `href`**. It
does — `href="#work"`, at `SoftLockGate.tsx:160`. My extraction regex failed on a nested `<span>`.
The finding above is the accurate version.

---

## Prepared changes

### [ ] 1 — Run lab specs against a dev server `ETB-P11-01`

**Files:** new `playwright.labs.config.ts`; `playwright.config.ts` (add `entry-cta.spec.ts` to
`testIgnore`); `package.json` (`test:labs` script)

Mirror `playwright.audit.config.ts`, but with `webServer` running `next dev` on its own port and
its own `NEXT_DIST_DIR`, so lab routes exist. The existing config already documents why a suite
must own its server.

- **Risk:** Low. No production code changes. Restores 27 tests.
- **Verification:** `npm run test:labs` green; `npm test` no longer includes the lab spec.

### [ ] 2 — Give the no-JS homepage a route into the work `ETB-P11-02`

**File:** `src/components/SiteFooter.tsx` (renders without JS)

Add a real `<a href="/emerging-tech-builds">Selected AI Work</a>` alongside the existing
`/blog` and `/privacy` links.

- **Risk:** Very low — one link in an already-rendering component.
- **Verification:** JS-disabled context; assert `/emerging-tech-builds` appears among navigable
  hrefs on the homepage.

### [ ] 3 — Persist the gate so a reload does not re-lock it `ETB-P11-03`

**File:** `src/components/design-lab/SoftLockGate.tsx`

On open, write a flag to `sessionStorage`; on mount, restore. Session-scoped deliberately — a new
visit should still get the designed entry; the same visit should not be punished for reloading.
Wrap access in `try/catch` (private mode throws).

- **Risk:** Low. Needs care that restore happens before first paint to avoid a flash of the gate.
- **Verification:** Flip → scroll → reload → assert gate open. Add as a regression guard.

### [ ] 4 — Regression guards for all three

**File:** `tests/audit/audit-regression.spec.ts`

No-JS navigability; gate survives reload; and a guard that the disc still responds after
visibility churn (protecting the `ETB-P2-01` fix).

- **Risk:** None.
- **Verification:** Each fails before its fix, passes after.

---

## Not proposed

**Making the gate work without JavaScript.** It is a JS-driven interaction by design; rebuilding it
as CSS-only would compromise the signature entry to serve ~0.2% of visitors, when a single footer
link recovers the lost content.
