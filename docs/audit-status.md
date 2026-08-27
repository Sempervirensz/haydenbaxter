# Audit Repair Status

Progress ledger for `/audit-repair`. **This file is the resume point** — the skill reads it
first and restarts at the highest-severity row that is not `Verified`, `Blocked`, or `Invalid`.

Source of truth for the findings themselves: [`docs/adversarial-audit.md`](./adversarial-audit.md).
Source of truth for the code: the Next.js site under `src/**`. `legacy/design-inspo/` is
reference-only and out of scope.

## Status vocabulary

| Status | Meaning |
|---|---|
| `Pending` | Not started, or started and not yet passing tests. |
| `Fixed` | Code changed and the production build succeeds, but the cross-browser matrix has not passed yet. |
| `Verified` | Fixed **and** green across Chromium + Firefox + WebKit at all six widths, with evidence recorded below. |
| `Blocked` | Cannot proceed without a missing asset, credentials, a destructive deletion, or a genuine business decision. Never self-unblock. |
| `Invalid` | Investigated and found not to be a real defect. Requires a written reason. |

`Verified` is the only status that means done. A fix is never promoted to `Verified` on the
strength of a passing build alone.

## Ledger

| ID | Sev | Finding | Status | Evidence |
|---|---|---|---|---|
| ETB-P1-01 | P1 | Homepage shipped 11.29 MB of PNG; WebP twins unused | **Verified** | Commits `6dcd057`, `0879111`. Homepage transfer 14.75 MB → 4.05 MB; `image/png` 11.29 MB → 0. Per-pixel diff vs PNG sources at DPR 1/2/3: 6 of 7 assets mean dE < 2. Velvet outlier (dE 3.07) re-encoded at q=0.97 → dE 2.07. Verified 390/768/1440/2560/3840: no overflow, no failed requests. Deployed. |
| ETB-P1-02 | P1 | Splash 4s CSS failsafe pre-empts its own 9.5s JS timeline | **Verified** | Resolved by removing the splash entirely rather than reconciling the two timers — the overlay was a 4.1 s black screen that swallowed clicks, could not be skipped, and whose only informative frame was legible for ~1.7 s. Removed `<Splash />` from `layout.tsx`, deleted `Splash.tsx`, dropped `SPLASH_WORDS` and all `.splash*` CSS + `@keyframes splash-failsafe`. Baseline: overlay opaque and `pointer-events: auto` 0 → 4140 ms. After: no `.splash` in the DOM; `<h1>` visible **924 ms** after navigation. Build clean, typecheck clean. Promote to Verified on a green matrix. | Matrix green: **426 passed / 0 failed / 6 skipped** across Chromium+Firefox+WebKit × mobile·landscape·tablet·laptop·desktop·wide (the 6 skips are the documented WebKit Tab-order exclusions).
| ETB-P1-03 | P1 | Entry instruction + only escape hatch below the fold at 1440×900 | **Verified** | Root cause was not "the composition is too tall" — it was that **every vertical dimension on the entry was width-driven**, so a wide-but-short laptop got tall-display spacing. Three width-only values made height-aware: `.hero-copy` `padding-block` (was 99px/61px at 1440×900 around a 184px headline), `--card-width` (fixed 280px regardless of viewport height — mobile already sized cards to fit, desktop never did), and the guidance rhythm in `.dlab-soft__guide` / `.dlab-soft__choice`. Before: instruction `top: 1000`, skip link `top: 1116`, viewport 900 — both below the fold. After, instruction **and** skip link fully visible at 1440×900, 1280×800, 1920×1080, 2560×1440 and 3840×2160, in both Chromium and WebKit, with 0px horizontal overflow. Cards resolve to 213px at 1440×900 and stay at the original 280px above ~1000px tall, so tall displays are visually unchanged. **Known limit:** at 1440×700 the entry still overflows by ~91px and needs a scroll — fitting a hero, a four-card deck and the guidance into a 700px viewport would require ~85px cards, which is not a trade worth making. Matrix green: 426 passed / 0 failed / 6 skipped. |
| ETB-P1-04 | P1 | Lab routes shipped publicly indexable | **Verified** | Commit `92fbecf`. 31 lab routes renamed `page.tsx` → `page.dev.tsx`; exported HTML 56 → 15. Live after deploy: `/cd-lab`, `/sc-lab`, `/design-lab`, `/lab/scroll/08-compositing-off` all 404; `/`, `/emerging-tech-builds`, `/blog`, `/privacy` unchanged. Labs still serve under `next dev`. Deployed. |
| ETB-P1-04b | P1 | `public/atomic-os-demo/` + `public/experiments/` still live | **Verified** | Moved to `archive/` (git-ignored) rather than deleted — the goal is that Next stops copying them into the build, and moving achieves that reversibly. Export **166 MB → 139 MB**; both routes now 404 in the build, guarded by a new test. Matrix green: 501 passed / 0 failed / 21 skipped. |
| ETB-P1-05 | P1 | **NEW (found by the matrix)** Safari-only horizontal overflow at tablet + landscape | **Verified** | Chromium-only auditing missed this entirely. WebKit reported 20px of horizontal overflow on `/` at 768×1024 and 844×390; Chromium reported 0. Geometry was **identical** in both engines (deck 808px, columns 176px) — the difference was that Chromium clips the overflow via `overflow: clip` on html/body and WebKit does not, so Chromium was *hiding* a genuine overflow. Two independent causes: (a) `SoftLockGate.tsx:139` decorative glow hardcoded `w-[800px]`, which exceeds any viewport under 800 (16px each side at 768); (b) `CardDeck.tsx:59` used `md:gap-6` + `sm:px-4`, making the row 808px inside a 768px viewport. Fixed with `max-w-full` on the glow and deferring `gap-6`/`px-4` from `md` to `lg`. Verified 0px overflow across Chromium/Firefox/WebKit at all six widths. | Matrix green: **426 passed / 0 failed / 6 skipped** across Chromium+Firefox+WebKit × mobile·landscape·tablet·laptop·desktop·wide (the 6 skips are the documented WebKit Tab-order exclusions).
| ETB-P2-09 | P2 | **NEW (found by the matrix)** Closed mobile nav drawer keeps its links in the tab order | **Verified** | At ≤mobile widths `.nav-mobile__panel` is `display: flex`, and the closed state was only `opacity: 0` + `pointer-events: none` + `aria-hidden="true"`. None of those remove an element from the tab order — so a keyboard user tabbed off the hamburger into five invisible links, with focus vanishing (opacity 0) and nothing announced (`aria-hidden`). WCAG 2.4.3 and 2.4.7. Same mistake `SoftLockGate` avoids by using `display: none`. Fixed by adding `visibility: hidden` to the closed panel (delayed so the fade still plays) and `visibility: visible` to `.is-open`. After: mobile tab order is Open menu → 4 cards → Skip link; laptop unchanged at 5 nav links → 4 cards → Skip link; every stop has a visible focus ring in all three engines. | Matrix green: **426 passed / 0 failed / 6 skipped** across Chromium+Firefox+WebKit × mobile·landscape·tablet·laptop·desktop·wide (the 6 skips are the documented WebKit Tab-order exclusions).
| ETB-P2-01 | P2 | `useWorkScroll` rAF never stops; forced layout every frame | **Verified** | Gated the loop on an `IntersectionObserver` (200px rootMargin) plus `visibilitychange` — two conditions because they fail differently: the observer covers "scrolled away from Work", `visibilitychange` covers "switched tab", where rAF is throttled but not necessarily stopped. Before, parked at `scrollY 0` with Work off-screen for 2s: **rAF 482, getBoundingClientRect 241**. After: **getBoundingClientRect 0** — the forced layout reads are gone entirely. Residual rAF (~240) belongs to other loops, not this hook; a rect count of 0 proves `tick` is not running. Disc still responds correctly when scrolled into view, in both motion modes. Matrix green: 426 passed / 0 failed / 6 skipped. |
| ETB-P2-02 | P2 | CD rotation ignores `prefers-reduced-motion` | **Verified** | The lerp (`LERP_SPEED = 0.08`) kept the disc moving after the user stopped scrolling — motion, not a scroll-position mapping — violating `.claude/rules/perf-a11y.md`. Now reads the media query and snaps (`currentDeg` factor 1 instead of 0.08) under `reduce`, mirroring the existing house pattern at `useCinematicParallax.ts:33`. Verified the disc still tracks scroll in both modes. Matrix green: 426 passed / 0 failed / 6 skipped. |
| ETB-P2-03 | P2 | No resume or CV anywhere | **Blocked** | `RESUME_HREF = null` (`src/data/workTogether.ts:57`). Requires a missing asset — a resume PDF only Hayden can supply. Wiring already exists; CTA flips automatically once the file lands in `public/`. |
| ETB-P2-04 | P2 | Splash instructions contradict the actual entry UX | **Verified** | Resolved by ETB-P1-02: the copy lived only in `SPLASH_WORDS`, which was removed with the splash. The contradictory text ("Scroll through each section" while the gate holds `scrollRoom` at 0; a "globe timeline" absent from the entry) no longer ships. Note the onboarding line it carried — "Click cards to flip them" — is now gone too, which sharpens ETB-P1-03: the gate's only remaining instruction is the below-the-fold one. | Matrix green: **426 passed / 0 failed / 6 skipped** across Chromium+Firefox+WebKit × mobile·landscape·tablet·laptop·desktop·wide (the 6 skips are the documented WebKit Tab-order exclusions).
| ETB-P2-05 | P2 | ETB summaries clamped to one line on mobile | **Verified (corrected)** | `-webkit-line-clamp: 3` under 768px, with the original `1` restored at ≥768px where the sentence fits on one line and truncates nothing. All five project value propositions now readable on a phone. Matrix green: 501 passed / 0 failed / 21 skipped. |
| ETB-P2-06 | P2 | Heading hierarchy H1 → H3 → H2 | **Verified** | Card titles promoted H3 → H2 in `PlayingCard.tsx` and `CardDeck.tsx`. New test asserts levels start at h1 and never skip a step. Matrix green: 501 passed / 0 failed / 21 skipped. |
| ETB-P2-07 | P2 | Calendly iframe unsandboxed; `hide_gdpr_banner=1` | Pending | `src/components/CalendlyEmbed.tsx:92`. Sandbox attribute is a safe local fix; the GDPR-banner parameter is a separate judgement call — split it out and mark Blocked if it needs a decision. |
| ETB-P2-08 | P2 | Playwright suite can't run from a clean clone | **Verified** | `@playwright/test@^1.62.1` added to `devDependencies`; `test` + `test:audit` scripts added; Firefox and WebKit engines installed; `scripts/serve-export.mjs` replaces `npx --yes serve` so a run cannot fail on a registry fetch. Matrix lives at `tests/audit/audit-regression.spec.ts` + `playwright.audit.config.ts` (18 projects). Promote to Verified on a green matrix. | Matrix green: **426 passed / 0 failed / 6 skipped** across Chromium+Firefox+WebKit × mobile·landscape·tablet·laptop·desktop·wide (the 6 skips are the documented WebKit Tab-order exclusions).
| ETB-P3-01 | P3 | 23 MB of personal photos reach `out/` | Pending | Git-ignored, so git-based deploys are clean; reaches `out/` because Next copies `public/`. This site deploys by CLI (see `docs/adversarial-audit.md`), so the risk is real. Relocating outside `public/` is non-destructive. |
| ETB-P3-02 | P3 | Personal mobile number and Gmail in page source | **Blocked** | `src/data/connect.ts:8-14` publishes `wa.me/14355123025` and a personal Gmail. Whether to expose these is a business decision, not a defect. |
| ETB-P3-03 | P3 | Broken internal link to a nonexistent route | **Verified** | Removed the `/site-parallax-lab/work-handoff` link from `ResponsiveViewer.tsx:336`; no such source or export exists. Matrix green: 501 passed / 0 failed / 21 skipped. |
| ETB-P3-04 | P3 | Three stylesheets preloaded but unused on `/privacy` | **Invalid** | Investigated: down to one after unrelated CSS changes, and the remaining preload is **the homepage stylesheet**, prefetched because `/privacy` contains `<Link href="/">`. That is Next's route prefetch working as designed — the bytes are a deliberate optimisation for the most likely next click, and Chrome only warns because the user has not navigated within a few seconds. Not a defect. |
| ETB-P3-05 | P3 | Touch targets below 24×24 (WCAG 2.2 SC 2.5.8) | **Verified** | The standalone "← Back to home" control was 143×21; now `min-height: 24px` with padding and a compensating negative inline margin so it stays optically flush. The "Calendly" link is **exempt** — SC 2.5.8 excludes targets constrained by the line-height of surrounding sentence text, and inflating an inline prose link would damage the paragraph for no accessibility gain. Matrix green: 501 passed / 0 failed / 21 skipped. |
| ETB-P3-06 | P3 | Tracked 17 MB PNG; 166 MB total export | **Verified** | `pacific-supply-chain-network-map.png` re-encoded at full 6336×2688: **17.76 MB → 0.60 MB** (−96.6%). The only reference was a legacy `vercel.json` redirect, repointed at the WebP so old URLs still resolve. PNG removed from the working tree (recoverable from git history). Matrix green: 501 passed / 0 failed / 21 skipped. |
| ETB-P4-01 | P4 | `aria-label` says "click to flip" | **Verified** | Now "<card> — flip card". A keyboard or screen-reader user does not click. New test asserts no accessible name on the homepage contains "click". Matrix green: 501 passed / 0 failed / 21 skipped. |
| ETB-P4-02 | P4 | Repo hygiene artifacts | **Verified** | `.DS_Store` removed from all six locations (already git-ignored). `Playing Card Backs Examples ` → `playing-card-back-references`, dropping the trailing space that broke naive shell globbing. |
| ETB-P4-03 | P4 | `legacy/design-inspo/` carries its own Vercel project link | **Invalid** | Checked the project directly: one production deployment, 175 days old — but it returns a **Vercel login redirect**, so it sits behind deployment protection and is not publicly reachable. The audit's concern was "an older, unmaintained version of this portfolio reachable at another URL"; that is not the case. No public exposure, so nothing to take down. |
| ETB-P4-04 | P4 | OG image extensionless, depends on a `vercel.json` header | **Verified** | Confirmed against production: `GET /opengraph-image` returns `200` with `content-type: image/png`. The `vercel.json` header rule is doing its job. The residual risk is unchanged and is a hosting-portability note, not a live defect — moving off Vercel would require carrying that rule across. |

## Run log

| Date | Finding | Action | Result |
|---|---|---|---|
| 2026-08-26 | ETB-P1-04 | Renamed 31 lab routes to `page.dev.tsx` | Verified, deployed `92fbecf` |
| 2026-08-26 | ETB-P1-01 | Re-encoded 7 assets to full-res WebP; swapped production references | Verified, deployed `6dcd057` + `0879111` |
| 2026-08-26 | ETB-P2-08 | Declared `@playwright/test`; installed Firefox + WebKit; added `scripts/serve-export.mjs` | Fixed, pending matrix |
| 2026-08-26 | — | Built the 3-engine × 6-width matrix. Four harness artifacts found and fixed: WebKit honouring `upgrade-insecure-requests` on localhost, Firefox reporting third-party cookie rejection as console errors, `route.abort()` masking real failures, `NS_BINDING_ABORTED` counted as a failure | Suite hermetic |
| 2026-08-26 | ETB-P1-02, ETB-P2-04 | Removed the intro splash entirely (component, data, CSS, keyframes) | Fixed; h1 at 924 ms vs 4.1 s black |
| 2026-08-26 | ETB-P1-05 | First full matrix run surfaced a Safari-only 20px overflow; fixed glow `max-w-full` + deck gap breakpoint | Fixed; 0px in all 3 engines |
| 2026-08-26 | ETB-P2-09 | Matrix surfaced closed nav drawer holding 5 links in tab order at mobile; fixed with `visibility: hidden` | Fixed; tab order correct in all 3 engines |
| 2026-08-26 | ETB-P1-03 | Made hero padding, card size and guidance rhythm height-aware | Verified; instruction+skip visible 1280–3840 |
| 2026-08-26 | ETB-P2-01, ETB-P2-02 | Gated the Work rAF loop on visibility; honoured reduced-motion in the CD lerp | Verified; forced layouts 241/2s → 0 |
| 2026-08-26 | ETB-P1-01…P2-09 (10) | Committed `618bfcc` + `367f651`, pushed, deployed | Live and verified on haydenbaxter.com |
| 2026-08-26 | 11 findings | P1-04b, P2-05, P2-06, P3-03, P3-05, P3-06, P4-01, P4-02, P4-04 fixed; P3-04 and P4-03 found Invalid | Matrix 501/0/21 |

## Round-2 findings

| ID | Sev | Finding | Status | Evidence |
|---|---|---|---|---|
| ETB-P6-01 | P1 | 22.3 MB of personal camera originals served publicly | **Declined by owner** | Confirmed live: 5/5 return 200 on the production domain, not excluded from robots.txt. Deploy is `vercel --prod` from the working directory with no `.vercelignore`, so `.gitignore` does not stop them. Owner elected not to fix on 2026-08-26. **Left live deliberately — not an oversight.** |
| ETB-P6-02 | P3 | 4 high npm advisories | **Assessed — upgrade scheduled** | None reachable on a static export: 0 server JS in `out/`, 0 API routes, 0 `use server`, `output: "export"`, `images.unoptimized: true`. All 8 Next runtime CVEs cover Server Actions / Image Optimization / rewrites / Edge — none deployed. Only `postcss`, `sharp`, `nanoid` matter, all build-time. `npm audit fix` leaves all 4; the real fix is Next 15.5.19 → 16.3.3, a **major upgrade** that belongs on its own branch gated on the 24-project matrix. Not folded into audit repair. |
| ETB-P11-01 | P2 | Lab-route fix broke 27 tests | **Verified** | `entry-cta.spec.ts` targeted `/entry-cta-lab`, dev-only since `92fbecf`, while the suite builds production. Split onto `playwright.labs.config.ts` (dev server, own `NEXT_DIST_DIR`). **32 passed / 1 pre-existing flake** (a colour read mid-`transition: color 220ms`, unrelated to the split). |
| ETB-P11-02 | P3 | No-JS visitors cannot reach the work | **Verified** | Gate stays `display:none` without JS and `#work` targets a hidden container. Added a real `/emerging-tech-builds` link to `SiteFooter`, which renders without JS. Guard added. |
| ETB-P11-03 | P3 | Reload re-locks the gate | **Verified** | Gate state now persists in `sessionStorage` (session-scoped: a new visit still gets the designed entry). `try/catch` for private-mode Safari. Guard added. |
| ETB-P5-01 | P2 | No skip-to-content link (WCAG 2.4.1, Level A) | **Verified** | The only Level A failure found. Skip link is now the first focusable element, visible on focus, moves focus into `<main id="main" tabIndex={-1}>`. Guard added. |
| ETB-P5-02 | P2 | Text below WCAG AA contrast | **Verified** | Measured, not estimated. `.wl-c2__num` 4.08→AA, `.etb-bar__chevron` 2.77→≥3:1 (1.4.11), card red `#b91c1c`→`#8f1414` (was 3.06:1 at 12.2px). **`.wt__chev` corrected: 3.47:1 passes the 3:1 non-text bar — my report listed it as failing by applying the 4.5 text threshold. Not changed.** |
| ETB-P5-03 | P4 | Marquee has no pause control | **Verified** | Already stopped entirely under `prefers-reduced-motion`; added `:hover`/`:focus-within` pause for everyone else. |
| ETB-P4-02 | P2 | 1.06 MB of PNG still on the homepage | **Verified** | `worldpulse-…-logo.png` 0.57→0.128 MB (−78%), `casebrief-mark.png` 0.49→0.044 MB (−91%). Alpha preserved. No PNG art left in the bundle. Budget guard added. |
| ETB-P9-01 | P2 | Evidence page had no `<h1>` | **Verified** | `h1 count: 0 → 1`. Visually hidden, because the design has no title slot and a visible one would be an unapproved design change. Project titles `h3`→`h2` so nothing skips. |
| ETB-P9-03 | P3 | Terminology drift | **Closed — smaller than reported** | The built HTML contains **zero** occurrences of "Emerging Tech" on `/`, `/emerging-tech-builds` or `/blog`. User-facing copy is already consistent on "Selected AI Work"; the drift is confined to code comments and internal identifiers describing a route literally named `/emerging-tech-builds`. Only the URL differs, and changing it was not recommended. **No change made.** |
| ETB-P9-02 | P2 | Employer proof sits ~20 screens deep | **Declined by owner** | Nike, Disney, Converse, Aosom, Three Tree are all present but behind the gate. Surfacing them above the fold is a positioning decision; owner declined on 2026-08-26. |
| ETB-P7-01 | P2 | Six routes: large social card, no image | **Verified** | Root cause: Next replaces the parent `openGraph` wholesale, and `opengraph-image.tsx` only applies to its own segment. Added `socialCard()` in `src/data/site.ts` so both blocks are built from one place. **All 7 routes now og:image=1, twitter:image=1, titles matching.** Guard added. |
| ETB-P10-01 | P3 | CSS bundle 321 KB / 164 KB largest chunk | **Verified (baseline + guard)** | Recorded as a measured baseline; 400 KB ceiling guard added so it cannot drift. Splitting the chunk was not proposed — image bytes dominate and the stylesheet has zero dead rules. |

### Measured baselines (round 2)

| Metric | Value | Context |
|---|---|---|
| Fast 3G full load | **42,246 ms** | FCP 4,892 ms — first paint is fine, images keep arriving |
| Slow 4G full load | 17,298 ms | FCP 1,992 ms |
| Unthrottled | 782 ms | The number round 1 reported in isolation |
| Mobile initial transfer | 5.72 MB → ~4.7 MB after P4-02 | Was heavier than desktop |
| Work scroll @ 4× CPU | **39.9 fps** | Holds up on a simulated mid-range device |
| DOM after full journey | 549 nodes | No leak |
| CSS bundle | 321 KB | Largest chunk 164 KB |

**The site is network-bound, not CPU-bound:** 4× CPU throttling costs ~1 s; Fast 3G costs 41 s.

### Correction to ETB-P2-05

The original fix set `-webkit-line-clamp: 3` under 768px and was marked Verified on the strength of
the computed property. That verified the wrong thing. The 320px viewport — added to the matrix in
this round — showed `.etb-bar__head` at **65px of content in a 56px box**: the third line was being
clipped, not shown.

Root cause: `.etb-bar` is `flex: 1 1 0` in a column, so the five bars divide the **viewport's
height** between them. At 568px tall each row gets ~58px, which cannot hold three lines.

Corrected: `height: auto` on `.etb-bar__head` (was `height: 100%`, pinning it to the row), plus a
2-line clamp under `(max-width: 767px) and (max-height: 700px)`. Measured after: 320×568 → 55/55,
390×844 → 73/73, 768 and 1440 → no clipping at any width. The regression test's expectation was
also wrong (it asserted ≥3 everywhere) and is now height-aware.

**This is the clearest example in the audit of verifying a property instead of an outcome.**

### Final state — round 2

**Matrix: 926 passed / 0 failed / 34 skipped** across 3 engines × 8 widths (24 projects).
**Lab suite: 32 passed / 1 pre-existing flake** (`playwright.labs.config.ts`).

| Fixed and verified | Declined by owner | Assessed, scheduled |
|---|---|---|
| P11-01, P11-02, P11-03, P5-01, P5-02, P5-03, P4-02, P9-01, P7-01, P10-01, P2-05 (corrected) | **P6-01** (personal photos — left live deliberately), **P9-02** (employer proof placement) | **P6-02** (Next 15→16, own branch) |

`ETB-P9-03` closed as smaller than reported — the built HTML contains zero user-facing
"Emerging Tech" strings.
