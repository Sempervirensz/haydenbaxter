# HaydenBaxter.com Adversarial Audit

**Date:** 2026-08-26
**Commit audited:** `5641cc7` ("Replace surface-level framing with direct operating language")
**Build audited:** `out/` static export, built 2026-08-26 11:38 (40 min after HEAD)
**Method:** static analysis + Chromium (Playwright 1.62.1) driving the real production static export behind a local server that replays `vercel.json` redirects, CSP, and security headers.

---

## Ground Truth Correction (read this first)

**The audit brief describes a site that is not what deploys.**

The brief specifies vanilla JS ES modules, `index.html`, `app/main.js`, `app/data/site-content.js`, `app/renderers/page.js`, `app/features/{splash,work-scroll,emerging-tech-builds,supply-consulting}.js`, `style.css`, and a 4500vh Work section.

That is `legacy/design-inspo/` — a **reference-only** tree. Production is a **Next.js 15 / React 19 static export** (`output: "export"`) from `src/**`, deployed to Vercel project `haydenbaxter`. Concretely:

| Brief said | Reality |
|---|---|
| Vanilla JS ES modules | Next.js 15.1 + React 19, TypeScript |
| Pure CSS, minimal deps | Tailwind 4 + 12 stylesheets; three.js, @react-three/fiber, drei, gsap, d3, opentype.js |
| `app/features/work-scroll.js` | `src/hooks/useWorkScroll.ts` |
| ~4500vh Work section | **1704vh** measured (Work `offsetHeight` 15,332px @ 1440×900); full page 21,403px ≈ 2378vh |
| "Embedded particle globe experiment" | `public/experiments/particle-globe-lab/` — a **separately built Vite app committed into `public/`**, not linked from any production page |

`legacy/design-inspo/` also carries **its own `.vercel/project.json`** (project `design-inspo`, same org) — a second independently deployable site living inside this repo.

Everything below audits **the Next.js site that actually ships**. I flag where this changes a conclusion.

---

## Executive Summary

**Is it ready to send to recruiters today?** Not quite. Two things stand between this site and a recruiter's good impression, and both are cheap to fix: a **14.75 MB homepage** and a **4-second unskippable black overlay** whose own instructions get cut off mid-display. Neither is a deep architectural problem. There is no resume anywhere on the site, which for a hiring artifact is a real gap.

**Is it ready to send to consulting prospects today?** Closer to yes than the recruiter case — `/emerging-tech-builds` and the three project detail pages are fast (0.86–1.86 MB), clean, and load with zero JS errors. But on a phone every project's one-line value proposition is clamped to roughly 40 characters, so the page that carries the evidence reads as five truncated fragments.

**Single biggest technical risk:** The homepage transfers **14.75 MB**, of which **11.29 MB is PNG** — while smaller, correct WebP twins of those exact files already sit in `public/` unused. `hayden-baxter-work-portfolio-cd.png` is 4.28 MB; its WebP is 107 KB. That is a **97.5% saving already sitting on disk**, unreferenced.

**Single biggest UX risk:** The entry is a soft-lock gate requiring four card flips. At **1440×900 — the single most common laptop viewport — both the instruction that explains the gate and the only escape link are below the fold on first load.** The user sees four face-down cards and no instruction. The splash that would have explained it is hard-cut by a CSS failsafe after ~1.7 seconds of display.

**Single biggest credibility risk:** **49 of 56 exported HTML routes (87.5%) are labs, sandboxes, and experiments**, and 20 of them ship with `index, follow` or no robots meta at all. A skeptical engineering manager who opens `/cd-lab`, `/lab/scroll/08-compositing-off`, or `/atomic-os-demo` sees unfinished work presented at the same URL authority as the portfolio.

**Top five to fix before launch:**
1. Point the six production references at the existing WebP files (`ETB-P1-01`) — removes ~8.5 MB from the homepage; one-line change each.
2. Reconcile the splash's 4s CSS failsafe with its 9.5s JS timeline, and make it skippable (`ETB-P1-02`).
3. Raise the entry instruction + skip link above the fold at 1440×900 (`ETB-P1-03`).
4. Add `noindex` to the 20 uncovered lab routes; extend `NON_PUBLIC_PREFIXES` (`ETB-P1-04`).
5. Publish a resume, or remove the "Request the resume" dead-end (`ETB-P2-03`).

**There are no P0 findings.** No secrets, no XSS sink, no vulnerable-dependency alarm, no broken core path. I looked specifically and did not find them; I am not going to manufacture one.

---

## Scorecard

| Category | Score | Assessment |
|---|---|---|
| Functional Reliability | 82 | Zero JS errors and zero failed requests across every route × 13 viewports. Nothing broke under abuse. Docked for the splash timing conflict and one broken lab link. |
| Mobile Experience | 61 | No horizontal overflow anywhere (genuinely hard to achieve). But 14.75 MB over mobile data, and every ETB project summary clamped to ~40 chars. |
| Performance | 38 | The one genuinely weak area. 14.75 MB homepage with 8.5 MB of it avoidable *today*. Continuous rAF + forced layout while off-screen. |
| Accessibility | 68 | Real strengths: cards are `<button>`s with labels, modal focus trap is textbook, 37/37 images have alt, 78 reduced-motion blocks. Docked for CD ignoring reduced-motion, H1→H3→H2 order, sub-24px targets. |
| Security & Privacy | 74 | Strong CSP, HSTS, nosniff, frame-ancestors none, no secrets, no `target="_blank"` without `noopener`. Docked for unsandboxed Calendly iframe, `hide_gdpr_banner=1`, published personal mobile number. |
| SEO & Sharing | 71 | Metadata is genuinely excellent — canonical, full OG/Twitter, valid 1200×630 PNG, JSON-LD `@graph`. Dragged down hard by 20 indexable lab routes. |
| UX | 63 | The gate is deliberate and has an escape hatch. It's just placed below the fold on laptops and its explanation is cut off. |
| Visual Polish | 88 | The strongest dimension. Consistent dark system, DYMO language held, deliberate typography. |
| Maintainability | 58 | Excellent comments explaining *why*. But 4204-line and 3712-line stylesheets, 49 lab routes in-tree, test runner undeclared, a second Vercel project nested inside. |
| Recruiter Effectiveness | 52 | No resume. Identity is a headline; role sought is not stated. 4s overlay + a puzzle gate consume much of a 45-second visit. |
| Consulting Effectiveness | 66 | Offer and evidence pages are solid and fast. Truncated mobile summaries and no stated pricing/engagement model cost trust. |
| **Overall Launch Readiness** | **64** | **Ship after P1 fixes.** Fundamentals are sound; the blockers are shallow and mostly config-level. |

---

## P0 Findings

**None.** See "Things That Look Suspicious But Are Actually Fine" for the candidates I chased and cleared.

---

## P1 Findings

### [ETB-P1-01] Homepage ships 11.29 MB of PNG while smaller WebP twins sit unused on disk
- **Severity:** P1 · **Confidence:** High · **Area:** Performance
- **Location:** `src/components/work/WorkLanding.tsx:31-32`, `src/components/WorkSection.tsx:52-53`, `src/components/work/WorkSectionMobile.tsx:68-69`, `src/app/globals.css:933`, `src/components/work/CtaDiscReveal.tsx:79`, `src/components/work/ConsultingHeroStage.tsx:21`

**Problem**
Production hardcodes `.png` for assets whose pre-compressed `.webp` twins already exist in `public/`. `next.config.ts` even documents the intent — *"real savings come from pre-compressed WebP"* — but the references were never switched.

**Evidence**
Measured transfer, Chromium, 1440×900, `/`:
```
transferred: 14.75 MB    load: 928ms    FCP: 244ms
bytes by type: image/png=11.29MB  text/javascript=1.65MB  image/jpeg=0.51MB
>300KB: 4.28MB images/portfolio/hayden-baxter-work-portfolio-cd.png
        2.59MB consulting/hero-2.png
        2.42MB playershellpngtransparent.png
        2.01MB playerforeground.png
```
On-disk comparison (`ls -la public/`):

| Asset | PNG | WebP | Saving |
|---|---|---|---|
| `images/portfolio/hayden-baxter-work-portfolio-cd` | 4,279,418 | 107,068 | **97.5%** |
| `playershellpngtransparent` | 2,417,837 | 50,450 | **97.9%** |
| `playerforeground` | 2,009,630 | 65,826 | **96.7%** |
| `WorldPulseCostal3.0` | 6,762,600 | 85,236 | 98.7% |
| `usethisbackground` | 8,809,274 | 235,616 | 97.3% |
| `consulting/hero-2.png` | 2,586,842 | *(none)* | needs generating |

**Reproduce:** load `/`, DevTools Network, filter Img, sort by size.
**Observed:** 14.75 MB total. **Expected:** ≈6.2 MB with the WebP files already present.
**Why it matters:** On a 1.6 MB/s 4G connection this is ~9 s of downloading versus ~4 s. This is a design-forward portfolio judged partly on craft; a 14.75 MB homepage is the loudest possible counter-signal, and the fix is already sitting in the repo.
**Remediation:** Swap the six references to `.webp`; generate a WebP for `hero-2.png`. Consider `<picture>` with PNG fallback only if you still support browsers without WebP (you almost certainly don't).
**Complexity:** Small

> **STATUS — FIXED and deployed 2026-08-26.** Commit `6dcd057`, deployment `haydenbaxter-lfa9ak78h`, live on `www.haydenbaxter.com`.
>
> **Correction to this finding as originally written:** it called the swap a find-and-replace against equivalent files. It was not. Every pre-existing `.webp` twin was **downscaled** — CD disc 2048→1200, WorldPulse 3168→1600, playershell 1800→900, usethisbackground 3072→2048, mobile-statue 1440→900. Swapping to them as-is would have traded weight for resolution.
>
> Resolved by measuring what each asset actually renders at (CD reaches 1165 CSS px at 3840; `playerforeground` 1216×1486) and **re-encoding from the PNG sources at full resolution**, q=0.85, alpha preserved. Full-res WebP costs 1.96 MB against 26.87 MB of PNG, so the downscale bought nothing worth having. `hero-2` and `mobile-statue` had no usable WebP and were encoded fresh (no encoder installed — done via a Chromium canvas).
>
> | | before | after |
> |---|---|---|
> | Homepage transfer | 14.75 MB | **4.05 MB** (−72.5%) |
> | `image/png` | 11.29 MB | 0 |
> | `image/webp` | — | 0.85 MB |
>
> **Quality verification (redone properly, commit `0879111`).** The first pass only eyeballed "after" screenshots at one viewport with no baseline — too weak a basis for a visual-craft site. Replaced with a per-pixel diff of each asset against its PNG source, rasterised at the size it is actually displayed at, across DPR 1/2/3 (mean absolute RGB difference per channel, 0–255):
>
> | asset | mean dE | %px > 8 | verdict |
> |---|---|---|---|
> | `hayden-baxter-work-portfolio-cd` | 0.87 | 0.15 | imperceptible |
> | `playerforeground` | 0.50 | 0.03 | imperceptible |
> | `playershellpngtransparent` | 0.65 | 0.01 | imperceptible |
> | `mobile-statue` | 1.17 | 0.18 | imperceptible |
> | `hero-2` | 1.13 | 0.35 | imperceptible |
> | `WorldPulseCostal3.0` | 1.80 | 0.93 | imperceptible |
> | `usethisbackground` @ q0.85 | **3.07** | **4.10** | outlier → fixed |
>
> The velvet background was the one real regression. Amplifying a dark region 3.2× showed q=0.85 smoothing its fine grain into waxy patches — photographic assets mask that (WorldPulse and hero-2 are clean even blown out 2.6×), flat fabric grain does not. Re-encoded at **q=0.97** → mean dE 2.07, 0.71% of pixels, grain intact. It costs 2.06 MB vs 0.96 MB but **not on initial load**: it is a CSS background inside the soft-lock gate, so it is only fetched once the visitor opens the Work section. Homepage transfer stays 4.05 MB.
>
> **Cross-size verification** at 390 (DPR 3) / 768 (2) / 1440 (2) / 2560 (1) / 3840 (1), through the gate and into the Work section: zero horizontal overflow, zero failed requests at every size, and the `.cd-player-shell` ↔ `.cd-player-fg` responsive swap resolves correctly at each width. Every re-encoded asset has resolution headroom at its largest real render — the CD peaks at 1119 CSS px (source 2048), `playerforeground` at 1216×1486 (source 1800×2200), the shell at 350×428 @ DPR 3 = 1050×1284 (source 1800×2200).
>
> No 4xx, no JS errors, no horizontal overflow across 5 routes × 13 viewports. Live spot-check confirms no heavy PNG served.
>
> **Also fixed incidentally:** `.cd-player-shell` is `display:none` on desktop (`globals.css:905`) and `.cd-player-fg` is `display:none` on mobile (`globals.css:1331`), but a `display:none` `<img>` still downloads — **every visitor fetched both and used one.** That pair went 4.43 MB → 116 KB, cheap enough to leave the redundancy in place rather than restructure the DOM.
>
> **Remaining PNG on the homepage (~1.06 MB), not addressed:** `images/worldpulse/worldpulse-digital-product-passport-logo.png` (0.57 MB) and `assets/casebrief-mark.png` (0.49 MB). Same treatment would apply.
>
> PNGs were kept on disk — `vercel.json` redirects still target them and the labs still reference them.

---

### [ETB-P1-02] Splash CSS failsafe fires at 4s and silently pre-empts its own 9.5s JS timeline
- **Severity:** P1 · **Confidence:** High · **Area:** UX / Functional
- **Location:** `src/app/globals.css:1362` + `1413-1419`; `src/components/Splash.tsx:7-10`, `:60-82`; `src/data/siteContent.ts:3-10`

**Problem**
Two independent timing systems govern the splash and they disagree. The JS sequence is designed to run ~9.5 s. The CSS carries `animation: splash-failsafe 0s linear 4s forwards`, whose keyframe sets `opacity:0; visibility:hidden; pointer-events:none`. At exactly 4 s the failsafe wins — instantly, with `0s` duration, so there is no fade at all.

The casualty is the sixth and only informational "word":
> "Step Inside / Scroll through each section. / Click cards to flip them. / Use the globe timeline to move through the journey. / Start Exploring ↓"

**Evidence** — measured state transitions (100 ms polling, Chromium 1440×900):
```
t=  609ms  opacity=1.00 vis=visible pointer=auto  word="Hello"
t= 1024ms  ...                                    word="你好"
t= 1337ms  ...                                    word="Olá"
t= 1749ms  ...                                    word="नमस्ते"
t= 2468ms  opacity=1.00 vis=visible pointer=auto  word="Step Inside"
t= 4140ms  opacity=0.00 vis=hidden  pointer=none  word="Step Inside"
```
The five-line instruction block is on screen from **2366 ms to 4140 ms — about 1.7 seconds.**

Consequences, all confirmed:
1. `FINAL_HOLD = 5200`, `PAUSE_AFTER = 1500`, and `FADE_DURATION = 700` (`Splash.tsx:7-10`) are **dead constants** — they can never take effect.
2. The designed `transition: opacity 600ms ease` (`globals.css:1361`) never runs; the user gets a hard cut.
3. `.splash` is `position:fixed; inset:0; z-index:9999; background:#000` with computed `pointer-events: auto` until 4140 ms — it covers and intercepts input for the first ~4.1 s.
4. There is **no click, key, or skip handler** in `Splash.tsx` — a returning visitor sits through it on every full page load.

**Why it matters:** Every visitor spends their first 4 seconds on a black screen, and the text explaining the card-flip gate (`ETB-P1-03`) is unreadable in the time given. The splash is actively teaching nobody while costing everybody.
**Remediation:** Pick one owner for the timing. Either shorten the JS sequence under 4 s, or raise the failsafe above the JS total and keep it as a true JS-error failsafe. Add click/keydown-to-dismiss and a `sessionStorage` flag so it plays once.
**Complexity:** Small

---

### [ETB-P1-03] At 1440×900 the entry gate's instruction and only escape hatch are both below the fold
- **Severity:** P1 · **Confidence:** High · **Area:** UX
- **Location:** `src/components/design-lab/SoftLockGate.tsx`; `src/app/page.tsx:32-43`

**Problem**
The homepage opens on a soft-lock gate: four face-down cards that must be flipped to unlock the site. At 1440×900 the copy explaining this and the bypass link both render below the viewport.

**Evidence** — measured on load, before any scroll, 1440×900:
```
scrollRoom: 295px
belowFold: [
  { tag: "p", txt: "Flip the four cards to continue in Story Mode.", top: 1000 },
  { tag: "a", txt: "Skip ahead and see where I can add value→",     top: 1116 }
]
```
Viewport height is 900. Both sit below it. The user's first screen is a headline and four card backs, with no stated affordance.

At 390×844 the same elements are **fully visible** (`belowFoldCount: 0`) — mobile is better designed than desktop here.

**Reproduce:** Load `/` at exactly 1440×900, wait out the splash, do not scroll.
**Why it matters:** 1440×900 is the most common laptop viewport. A recruiter who doesn't scroll sees a puzzle with no instructions, and the splash text that would have explained it was cut off after 1.7 s (`ETB-P1-02`). The escape hatch exists and is well-written — it's just not where the user is looking.
**Remediation:** Tighten the vertical rhythm so the instruction + skip link clear an 900px fold, or pin the skip link to the viewport bottom while the gate is locked.
**Complexity:** Small

---

### [ETB-P1-04] 20 lab/experiment routes ship publicly indexable; 87.5% of deployed pages are non-production
- **Severity:** P1 · **Confidence:** High · **Area:** SEO / Credibility
- **Location:** `src/data/site.ts:30-63` (`NON_PUBLIC_PREFIXES`); `public/atomic-os-demo/`; `public/experiments/particle-globe-lab/`

**Problem**
The export contains **56 HTML routes; 49 are labs, demos, or experiments.** `NON_PUBLIC_PREFIXES` covers most, but 20 slip through with `index, follow` or no robots meta at all.

**Evidence** — robots meta extracted from every exported page:

`index, follow` (actively inviting indexation):
```
./cd-lab.html          ./cd-lab-desktop.html   ./sc-lab.html
./worldpulse-hero-lab.html
./lab/card-lighting.html  ./lab/card-motion.html  ./lab/card-sizing.html
./lab/scroll.html  ./lab/scroll-systems.html
./lab/scroll/00-baseline.html … ./lab/scroll/10-stack.html   (11 more)
```
**No robots meta at all, and absent from `robots.txt`:**
```
./atomic-os-demo/index.html
./atomic-os-demo/messages/index.html
./experiments/particle-globe-lab/dist/index.html
```
`/cd-lab` and `/cd-lab-desktop` *are* in `robots.txt` — but `Disallow` without `noindex` still permits Google to index the URL from an external link, and the page explicitly says `index, follow`.

`public/atomic-os-demo/` is a **complete second Next.js build (2.9 MB) committed into `public/`**, tracked in git, deployed, with its own `_next/` and `404`. It is linked from no production page (`grep -rn "atomic-os-demo" src/` → no hits).

**Why it matters:** An EM evaluating engineering judgment who lands on `/lab/scroll/08-compositing-off` sees a debugging artifact at portfolio authority. It also splits crawl budget across 49 unfinished pages.
**Remediation:** Add `robots: { index: false, follow: false }` to every lab route's metadata (don't rely on `robots.txt`). Extend `NON_PUBLIC_PREFIXES` with `/atomicos-mark-lab`, `/casebrief-mark-lab`, `/cortex-mark-lab`, `/atomic-os-demo`, `/experiments`. Longer term, move labs behind a non-exported route group or a separate preview deployment.
**Complexity:** Small (noindex) / Medium (route restructure)

> **STATUS — partially remediated 2026-08-26 (this session).** Confirmed live on production first (`/cd-lab`, `/sc-lab`, `/lab/scroll/08-compositing-off` all returned 200 with `index, follow`; `/atomic-os-demo` and `/experiments/particle-globe-lab/dist` returned 200 with no robots meta).
>
> Fix applied: **31 lab route files renamed `page.tsx` → `page.dev.tsx`**, reusing the existing `pageExtensions` mechanism in `next.config.ts:26` rather than adding a denylist entry. Verified by production build: **exported HTML went 56 → 15 files**, and all 41 Next.js lab routes are gone from the build. All labs still serve in `next dev` (verified 200 on `/cd-lab`, `/sc-lab`, `/design-lab`, `/lab/scroll/08-compositing-off`, `/offer-lab/consulting`). Production routes unaffected.
>
> **Still open — requires a separate decision.** These are static sub-apps committed under `public/`, which Next copies verbatim, so the rename cannot reach them:
> - `public/atomic-os-demo/` — 4 HTML files, 2.9 MB, no robots meta
> - `public/experiments/particle-globe-lab/dist/` — 1 HTML file, 1.1 MB, no robots meta
>
> **DEPLOYED to production 2026-08-26** — commit `92fbecf`, Vercel deployment `haydenbaxter-qpqnntkls`, aliased to `www.haydenbaxter.com`.
>
> Verified live after deploy:
> - `/cd-lab`, `/sc-lab`, `/design-lab`, `/lab/scroll/08-compositing-off` → **404 "Page not found"**
> - `/`, `/emerging-tech-builds` (5 project bars), `/emerging-tech-builds/cortex`, `/blog`, `/privacy` → **all 200, unchanged**
> - `/atomic-os-demo`, `/experiments/particle-globe-lab/dist` → **still live**, as expected; these are the `public/` sub-apps the rename cannot reach.
>
> Note on the deploy pipeline: this project deploys by **Vercel CLI (`vercel --prod`), not git integration** — production deployments carry no commit metadata and are user-attributed. A `git push` alone does not deploy. Worth knowing before assuming a merged change is live.

---

## P2 Findings

### [ETB-P2-01] `useWorkScroll` runs an unconditional rAF loop with a forced layout read every frame, for the whole session
- **Severity:** P2 · **Confidence:** High · **Area:** Performance
- **Location:** `src/hooks/useWorkScroll.ts:92-96` (`getProgress`), `:150` (unconditional `requestAnimationFrame(tick)`)

**Problem**
`tick()` re-schedules itself every frame with no visibility, intersection, or idle gate. Each frame calls `el.getBoundingClientRect()` — a forced synchronous layout read — even when the Work section is thousands of pixels off-screen.

**Evidence** — instrumented `requestAnimationFrame` and `Element.prototype.getBoundingClientRect`, parked at `scrollY = 0` with Work fully off-screen, 2-second window:
```
prefers-reduced-motion: no-preference → rAF=482  getBoundingClientRect=241
prefers-reduced-motion: reduce        → rAF=480  getBoundingClientRect=240
```
≈241 forced layout reads/sec and ≈120 rAF callbacks/sec (two concurrent loops), sustained for the entire visit regardless of where the user is.

**Why it matters:** Continuous main-thread work and battery drain on exactly the mediocre laptop / mid-range phone this should be tuned for. The repo already has `/lab/scroll/03-globe-pause-offscreen` exploring this class of fix — it just was not applied to the production hook.
**Remediation:** Gate the loop with an `IntersectionObserver` on the Work section and a `visibilitychange` listener; cancel the rAF when off-screen or the tab is hidden.
**Complexity:** Small

---

### [ETB-P2-02] The CD rotation ignores `prefers-reduced-motion`, violating the repo's own rule
- **Severity:** P2 · **Confidence:** High · **Area:** Accessibility
- **Location:** `src/hooks/useWorkScroll.ts:73-79` (media query checks viewport only), `:124` (`LERP_SPEED` smoothing)

**Problem**
`.claude/rules/perf-a11y.md` states: *"Any animation must respect `prefers-reduced-motion`."* The hook queries `(max-width: 640px) and (pointer: coarse)` but never queries reduced-motion. Because rotation is smoothed by a lerp (`LERP_SPEED = 0.08`), the disc **keeps rotating after the user stops scrolling** — that is animation, not a scroll-position mapping.

**Evidence** — identical disc transform with `reducedMotion: "reduce"`:
```
no-preference : at scroll+2200 → matrix(-0.706902, -0.707311, 0.707311, -0.706902, 0, 0)
reduce        : at scroll+2200 → matrix(-0.706884, -0.707329, 0.707329, -0.706884, 0, 0)
```
Same ~135° rotation, same rAF count. No reduced-motion path exists.

**Context (fair):** the codebase honours reduced-motion in **78 other places**, and `useCinematicParallax.ts:33` does it correctly. This one hook is the gap, not the codebase's posture.
**Remediation:** Mirror `useCinematicParallax.ts:33` — read the media query, and under `reduce` set `currentDeg = targetDeg` directly (snap, no lerp).
**Complexity:** Small

---

### [ETB-P2-03] No resume or CV exists anywhere on the site or in the repo
- **Severity:** P2 · **Confidence:** High · **Area:** Recruiter Effectiveness
- **Location:** `src/data/workTogether.ts:57` — `export const RESUME_HREF: string | null = null;`

**Problem**
The primary hiring artifact is absent. The code is honest about it — `src/components/cta-lab/README.md:198` records *"No resume asset exists in `public/` — `git ls-files` has no PDF anywhere in the repo"* — and the Experience CTA degrades to "Request the resume."
**Why it matters:** For a recruiter this is the single most-wanted object. "Request the resume" converts a 10-second download into an email exchange, and many recruiters simply leave.
**Remediation:** Add the PDF to `public/` and set `RESUME_HREF`; the CTA flips to "View resume" automatically (already wired).
**Complexity:** Small

---

### [ETB-P2-04] Splash instructions describe a different site than the one behind them
- **Severity:** P2 · **Confidence:** High · **Area:** Content / UX
- **Location:** `src/data/siteContent.ts:9`

**Problem**
The overlay instructs: *"Scroll through each section. Click cards to flip them. Use the globe timeline to move through the journey."*

Measured against actual behaviour:
- **"Scroll through each section"** — scrolling is *locked* at entry. `scrollRoom` is **0** at 375/390/430/2560/3840 until four cards are flipped (verified: after flipping, `scrollHeight` jumps 900 → 21,403).
- **"Use the globe timeline"** — there is no globe timeline on the entry. The globe lives in `/sc-lab`.
- **"Click cards to flip them"** — correct, and the only accurate line. It's also the one users have ~1.7 s to read (`ETB-P1-02`).

**Why it matters:** The first instruction actively contradicts the gate, telling users to do the one thing the page prevents.
**Remediation:** Rewrite to describe the gate. **Report only — no content changed, per audit scope.**
**Complexity:** Small

---

### [ETB-P2-05] Every ETB project summary is clamped to one line (~40 chars) on mobile
- **Severity:** P2 · **Confidence:** High · **Area:** Mobile / Consulting Effectiveness
- **Location:** `src/styles/work-details.css:454-466` (`.etb-bar__summary`, `-webkit-line-clamp: 1`)

**Problem**
All five project one-liners on `/emerging-tech-builds` clamp to a single line on phones. Desktop fits on one line naturally (`scrollHeight 18 === clientHeight 18`); mobile needs 35–88 px and shows 18.

**Evidence** at 390×844 — content height vs displayed height:
```
CaseBrief      "Understand the full story of an injury…"        53 / 18
AtomicOS       "An operating system built for better habits…"   53 / 18
Cortex         "Find the signal. Grade the evidence…"           35 / 18
ProcureBridge  "Procurement intelligence that evaluates…"       53 / 18
OpenClaw       "Open-ended agentic workflows that turn…"        53 / 18
```
At 320×568, `CaseBrief` needs 70 px and `AtomicOS`/`ProcureBridge` need 88 px. Rendering confirmed correct (ellipsis shows) — this is intentional CSS, not a bug. The defect is the **product decision**, on the page carrying the consulting evidence.
**Remediation:** `-webkit-line-clamp: 3` under a mobile breakpoint, or shorten the summaries to fit one line at 390px.
**Complexity:** Small

---

### [ETB-P2-06] Heading hierarchy skips and reverses: H1 → H3 → H2
- **Severity:** P2 · **Confidence:** High · **Area:** Accessibility (WCAG 1.3.1)
- **Location:** `src/components/HeroSection.tsx` (card titles), homepage section components

**Evidence** — DOM order on `/`:
```
H1: I help orgs put AI to work, strengthen global supply chains…
H3: JACK OF ALL TRADES     ← jumps H1 → H3
H3: QUEEN OF VISION
H3: KING OF STRATEGY
H3: ACE OF EXECUTION
H2: Let's work together    ← reverses back to H2
H2: Personas / H2: Connect / H2: About / H2: Journal
```
**Why it matters:** Screen-reader users navigating by heading level get a structure implying the four cards are subsections of something that was never announced.
**Remediation:** Promote card titles to `H2`, or wrap them in a titled `H2` section.
**Complexity:** Small

---

### [ETB-P2-07] Calendly iframe is unsandboxed and suppresses its own GDPR banner
- **Severity:** P2 · **Confidence:** Medium · **Area:** Security / Privacy
- **Location:** `src/components/CalendlyEmbed.tsx:92`

**Evidence** — the only iframe on `/`:
```json
{ "src": "https://calendly.com/haydenjbaxter/30min?embed_domain=…&hide_gdpr_banner=1&…",
  "title": "Select a Date & Time - Calendly",
  "sandbox": null }
```
Three issues, ordered by real risk:
1. **`hide_gdpr_banner=1`** suppresses Calendly's own consent UI while a third-party embed loads on the homepage for every visitor, including EU ones. The site publishes a `/privacy` page, so the intent to be compliant exists — this parameter works against it.
2. **No `sandbox` attribute.** CSP does constrain `frame-src` to Calendly, and `X-Frame-Options: DENY` + `frame-ancestors 'none'` protect *your* pages. A `sandbox="allow-scripts allow-same-origin allow-forms allow-popups"` would bound the embed's capability.
3. Calendly receives a connection (IP, referrer, UA) from every homepage visitor before any interaction.

**Fair note:** the component itself is *excellently* engineered — see "Actually Fine". The finding is about embed configuration, not code quality.
**Remediation:** Add `sandbox`; gate the embed behind a click or explicit consent; reconsider `hide_gdpr_banner`.
**Complexity:** Small

---

### [ETB-P2-08] The Playwright suite cannot run from a clean clone — runner is undeclared
- **Severity:** P2 · **Confidence:** High · **Area:** Maintainability / Credibility
- **Location:** `package.json` (dependencies + devDependencies); `playwright.config.ts`; `tests/*.spec.ts` (8 files)

**Evidence**
```
node -e "require('@playwright/test/package.json').version"  → 1.62.1  (installed)
grep -n "playwright" package.json                          → NOT DECLARED
```
`playwright.config.ts` imports `@playwright/test`, and 8 spec files depend on it. There is also no `test` script. After `npm ci`, `npx playwright test` fails.
**Why it matters:** The test suite is one of the strongest engineering signals here — thoughtful viewport-as-project design and comments explaining why retries exist. An EM who clones and runs it gets a resolution error, which reads as tests that were never really run.
**Remediation:** `npm i -D @playwright/test` and add `"test": "playwright test"`.
**Complexity:** Small

---

## P3 Findings

### [ETB-P3-01] 23 MB of personal camera originals reach `out/` — deployed only on a local CLI deploy
- **Severity:** P3 · **Confidence:** Medium (impact is deploy-method dependent) · **Area:** Privacy
- **Location:** `public/Personal Photos/` → `out/Personal Photos/`; `.gitignore:23-26`

`.gitignore` excludes `public/Personal Photos/` and states *"Nothing references these."* Confirmed untracked (`git ls-files` → empty). **But `next build` copies all of `public/` into `out/`**, so the directory is present in the local export (23 MB: `IMG_8296.jpeg`, `PANO_20170527_125156(1).jpg`, etc.).

**Assessment:** A **git-based Vercel deploy is clean** — the files aren't in the repo. Risk is real only if the site is deployed from this folder via `vercel deploy` / `--prebuilt`, which the tracked `.vercel/project.json` suggests is at least possible. I could not determine the deploy method from the repo alone.
**Remediation:** Confirm deploys are git-triggered. If local deploys ever happen, move these outside `public/`.
**Complexity:** Small

---

### [ETB-P3-02] Personal mobile number and personal Gmail published in page source
- **Severity:** P3 · **Confidence:** High · **Area:** Privacy
- **Location:** `src/data/connect.ts:8-14`

`https://wa.me/14355123025` (personal mobile) and `mailto:haydenjbaxter@gmail.com` are in the static HTML, harvestable by scrapers. This may well be deliberate for a consulting storefront — flagging so it's a decision, not an accident. A forwarding address and a business number would preserve reachability without permanent exposure.
**Complexity:** Small

---

### [ETB-P3-03] Broken internal link to a route that does not exist
- **Severity:** P3 · **Confidence:** High · **Area:** Functional (lab-only)
- **Location:** `src/components/site-parallax-lab/ResponsiveViewer.tsx:336` → `/site-parallax-lab/work-handoff`

Neither `src/app/site-parallax-lab/work-handoff/` nor any exported `work-handoff.html` exists (present: `work-cinema`, `work-merged`, `work-mobile`, `work-mobile-variants`). The link 404s. Contained to a lab surface, hence P3.
**Complexity:** Small

---

### [ETB-P3-04] Three stylesheets preloaded but never used on `/privacy`
- **Severity:** P3 · **Confidence:** High · **Area:** Performance
- **Location:** Next.js CSS chunking; reproduced at all 13 viewports

```
[warning] The resource /_next/static/css/b78b3c930f72f7da.css was preloaded using
link preload but not used within a few seconds from the window's load event.
(also 451540247cffe2b2.css, baf4012bb02cff71.css)
```
The only console output found anywhere on the site. Wasted bytes plus a warning a reviewer will open DevTools and see.
**Complexity:** Medium (CSS chunking)

---

### [ETB-P3-05] Touch targets below the 24×24 WCAG 2.2 minimum
- **Severity:** P3 · **Confidence:** High · **Area:** Accessibility (WCAG 2.2 SC 2.5.8)
- **Location:** `/privacy`, `/emerging-tech-builds`

`/privacy` at 390×844: "← Back to home" 143×**21**, "Calendly" 65×**21**. Both fall short of 24×24. Nav links (73–138 × 38) and cards (309×415) are comfortably fine — this is localised.
**Complexity:** Small

---

### [ETB-P3-06] Single tracked 17 MB PNG; 166 MB total export
- **Severity:** P3 · **Confidence:** High · **Area:** Performance / Repo hygiene
- **Location:** `public/images/supply-chain/pacific-supply-chain-network-map.png` (17 MB, tracked)

Total export 166 MB (`images/` 60 MB, `about/` 24 MB, `Personal Photos/` 23 MB, `assets/` 11 MB). The 17 MB map is not requested by the routes I measured, so it isn't hurting users today — but it's tracked in git, slows every clone, and is one reference away from becoming a 17 MB page load.
**Complexity:** Small

---

## P4 Findings

### [ETB-P4-01] `aria-label` uses mouse-specific language
`"QUEEN OF VISION — click to flip"` — a screen-reader or keyboard user does not click. Prefer "flip card" or "reveal". Location: card button `aria-label`s.

### [ETB-P4-02] Repo hygiene artifacts
`.DS_Store` present at repo root, `src/`, `out/`, `docs/`, `legacy/`; directory `Playing Card Backs Examples ` has a **trailing space** in its name (breaks naive shell scripts). `.gitignore` covers `.DS_Store` but existing copies persist on disk.

### [ETB-P4-03] `legacy/design-inspo/` carries its own Vercel project link
`legacy/design-inspo/.vercel/project.json` → project `design-inspo`, same org. A second deployable site nested in the repo — if it is live, it is an older, unmaintained version of this portfolio reachable at another URL. Worth confirming and taking down if so.

### [ETB-P4-04] OG image is extensionless and depends on a `vercel.json` header rule
`out/opengraph-image` is a valid PNG (1200×630, 51 KB) with no file extension; correct `Content-Type` comes solely from the `vercel.json` rule. Correct on Vercel, silently broken on any other static host.

---

## Browser and Device Matrix

**Tested — Chromium 1234 (Playwright 1.62.1), headless, macOS 25.2:**

| Viewport | Routes | Result |
|---|---|---|
| 320×568 | 9 | No horizontal overflow; ETB summaries clamped |
| 375×812, 390×844, 430×932 | 9 each | Entry `scrollRoom` 0 (by design); no overflow |
| 844×390 (landscape mobile) | 9 | Clean |
| 768×1024, 1024×768 | 9 each | Clean |
| 1280×800, 1440×700, 1440×900 | 9 each | **Skip link below fold at 1440×900** |
| 1920×1080, 2560×1440, 3840×2160 | 9 each | Clean; `scrollRoom` 0 at 2560/3840 |

Routes: `/`, `/emerging-tech-builds`, `/emerging-tech-builds/{cortex,atomic-os,casebrief}`, `/blog`, `/blog/[slug]`, `/privacy` — 13 viewports each. Also: reduced-motion (both states), rAF/layout instrumentation, keyboard-only tab traversal (22 stops), splash timing at 100 ms resolution, per-page network accounting.

**NOT tested — do not assume these pass:**
- **Safari / WebKit and Firefox / Gecko.** Only Chromium engines are installed locally. This is a meaningful gap: the repo contains `/lab/scroll/05-safari-root-no-gutter` and `06-safari-root-no-clip`, and `useWorkScroll.ts:130` documents a Safari perf cliff — so Safari-specific issues are known to exist here. iOS Safari is likely the #1 mobile browser for this audience.
- Real physical devices; real touch; iOS/Android system behaviours (URL-bar resize, momentum scroll, `100vh` quirks).
- Actual screen readers (VoiceOver / NVDA / JAWS). Structural a11y was reasoned manually from the DOM.
- CPU throttling and network throttling. Perf figures are **local, uncontended, ~0 ms RTT** — real-world numbers will be worse, and the 14.75 MB figure is transfer size, not time.
- Lighthouse / Core Web Vitals field data. `LCP` read as 0 in my harness (headless + instant localhost); FCP was 244 ms on `/`.
- The consulting deep-dive and supply-chain scroll sections, and the particle globe, beyond static inspection.
- `legacy/design-inspo/` runtime behaviour (the vanilla site the brief described).

---

## Performance Findings

Measured per route, Chromium 1440×900, local server (content-length sums):

| Route | Transfer | DOM nodes | Depth | Stylesheets | CSS rules | FCP |
|---|---|---|---|---|---|---|
| `/` | **14.75 MB** | 536 | 16 | 12 | 1781 | 244 ms |
| `/blog` | 2.72 MB | 87 | 7 | 2 | 1024 | 88 ms |
| `/emerging-tech-builds/cortex` | 1.86 MB | 317 | 14 | 3 | 1037 | 104 ms |
| `/emerging-tech-builds` | 0.86 MB | 111 | 8 | 2 | 1024 | 88 ms |
| `/privacy` | 0.82 MB | 122 | 4 | 4 | 1043 | 68 ms |

**The homepage is the entire performance problem.** Every other route is lean. DOM sizes are genuinely small (87–536 nodes) — no DOM bloat. Compositing surfaces on `/`: 24 `will-change` elements, 6 `backdrop-filter`, 4 `position: fixed`, 1 canvas, 1 video, 37 images (29 lazy — good).

`/blog` carries a **1.88 MB PNG** for a single post thumbnail — worth compressing (P3-adjacent, folded into the WebP work).

**Sustained cost:** ≈241 forced layout reads/sec + ≈120 rAF/sec for the whole session (`ETB-P2-01`).

---

## Accessibility Findings

**Genuinely good — verified, not assumed:**
- Cards are real `<button>` elements with descriptive `aria-label`s, not click-handler divs.
- **37/37 images have `alt`**; 20 correctly use `alt=""` for decorative.
- `DetailModal` is textbook: `role="dialog"`, `aria-modal="true"`, Escape handler, first/last focus trap, focus restoration to the trigger, and body-overflow save/restore rather than blind reset (`DetailModal.tsx:34-130`).
- `<html lang="en">`; no `target="_blank"` missing `rel="noopener"`; no unnamed buttons.
- Gated content uses `display: none` (`design-lab.css:464`) so it is genuinely out of the tab order.
- Visible focus indicators on every one of the 22 tab stops (1–2 px outlines).
- Reduced-motion honoured in 78 places, including the splash.

**Findings:** `ETB-P2-02` (CD ignores reduced-motion), `ETB-P2-06` (H1→H3→H2), `ETB-P3-05` (sub-24px targets), `ETB-P4-01` ("click to flip").

**Tab order on `/` (measured, 22 presses):** 5 nav links → 4 cards → skip link → wrap. Focus stays correctly inside the gate; nothing below is reachable while locked. No keyboard trap.

---

## Security Findings

**Strong, and worth saying plainly:**
- **CSP is real and tight** (`vercel.json`): `default-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`, `base-uri 'self'`, scoped `frame-src`/`connect-src`, `upgrade-insecure-requests`. `'unsafe-inline'` on `script-src` is present — a normal Next.js concession, worth noting but not a finding on a static site with no user input.
- HSTS `max-age=63072000; includeSubDomains; preload`; `X-Content-Type-Options: nosniff`; `X-Frame-Options: DENY`; `Referrer-Policy: strict-origin-when-cross-origin`; `Permissions-Policy` denying camera/mic/geolocation/payment/USB/browsing-topics.
- **No secrets found.** Scanned tracked files for API keys, tokens, private-key headers, AWS/GitHub/OpenAI key patterns — clean. `.env.example` is a template; `.env*` is git-ignored.
- No `dangerouslySetInnerHTML` XSS sink reachable from user input; the site takes no user input at all.
- No mixed content; all external references HTTPS.
- Zero failed requests and zero page errors across the full sweep.

**Findings:** `ETB-P2-07` (iframe sandbox / GDPR banner), `ETB-P3-01` (personal photos, conditional), `ETB-P3-02` (personal number/email).

**Dependency note:** `npm audit` was not run — this environment has no network egress. 11 production dependencies, all mainstream and current-major (Next 15.1, React 19, three 0.183). Recommend running `npm audit` where egress exists; I am not going to guess at CVEs.

---

## Recruiter Red Team

*45 seconds, laptop at 1440×900, link from LinkedIn.*

**Seconds 0–4:** Black screen. Greetings cycle in five languages. An instruction block appears at 2.4 s and vanishes at 4.1 s — too fast to read.
**Seconds 4–20:** Headline: *"I help orgs put AI to work, strengthen global supply chains, and innovate where sustainability meets next-gen tech."* Clear and strong. Below it: four face-down playing cards. **No instruction, no skip link — both below the fold.** The nav (Work / About / Connect / Journal / Book a Call) is the only obvious affordance.
**Seconds 20–45:** They either scroll and discover the gate, click a nav item, or leave.

| Question | Answerable in 45 s? |
|---|---|
| Who is Hayden? | Partly — name + value-prop headline; no photo or bio above the fold |
| What does he do? | **Yes** — the headline is genuinely good |
| What role does he want? | **No** — never stated (IC? Lead? Fractional? Consulting only?) |
| What has he built? | Only after passing the gate |
| What companies has he worked for? | **No** — no employer names on the entry |
| How to contact him? | **Yes** — "Book a Call" in nav |
| How to view his resume? | **No — none exists** (`ETB-P2-03`) |

**Impressive:** the headline; visual polish; the fact that a personal site has a CSP, JSON-LD, and a Playwright suite at all.
**Confusing:** an unexplained card puzzle as the front door.
**Makes them leave:** 4 s of black, then a gate with no visible instructions, and no resume at the end of it.

---

## Consulting Buyer Red Team

| Question | Answer |
|---|---|
| What can he do for me? | **Yes** — `/emerging-tech-builds` names five concrete systems (CaseBrief, AtomicOS, Cortex, ProcureBridge, OpenClaw) |
| Who are the services for? | **Partly** — implied via personas, never stated as ICP |
| What outcomes? | **Weak** — statuses are "Production / In Development"; no metrics, timelines, or client results |
| What evidence? | **Good** — real screenshots and demo stats on detail pages; `/emerging-tech-builds/cortex` is convincing |
| What should I do next? | **Yes** — "Book a Call" → Calendly, well implemented |

**Trust reducers, in order:**
1. On mobile, all five project summaries truncate mid-sentence (`ETB-P2-05`) — the evidence page reads as fragments.
2. No named clients, no testimonials, no engagement model or pricing band.
3. If they open a lab URL (`/cd-lab`, `/sc-lab`) they see unfinished internal work at the same authority as the portfolio.
4. A 14.75 MB homepage is a poor advertisement for someone selling technical judgment.

**Trust builders:** the Calendly fallback path (a blocked scheduler still yields a working booking link) is exactly the reliability thinking a buyer wants — most sites fail this silently.

---

## Architecture Findings

**Separation of concerns — largely intact, and better than the brief's model:**

| Layer | Intended | Reality |
|---|---|---|
| Content | `site-content.js` | **Good** — 31 typed modules in `src/data/`; copy is genuinely out of components |
| Markup | `renderers/page.js` | **Good** — React components in `src/components/` |
| Behaviour | `features/*.js` | **Good** — `src/hooks/` + colocated hooks |
| Styles | `style.css` | **Degraded** — see below |

**Where it degrades:**
- **Styling is not centralised.** `src/app/globals.css` is **3,712 lines** and `src/styles/work-details.css` is **4,204 lines**, alongside ~30 component stylesheets. The homepage loads **12 stylesheets / 1,781 CSS rules**. The `.claude/CLAUDE.md` contract says styling lives in `globals.css` (+ component styles); in practice `work-details.css` has become a second uncontrolled global.
- **Labs are first-class routes, not a separate world.** 49 of 56 exported routes are experimental. `NON_PUBLIC_PREFIXES` is a 36-entry hand-maintained denylist that has already drifted (five routes uncovered) — a denylist that must be updated by hand for every new lab will keep drifting.
- **A second Next.js app is committed inside `public/`** (`atomic-os-demo/`, 2.9 MB), plus a built Vite app (`experiments/particle-globe-lab/dist/`). Static output of other builds inside `public/` is invisible to the type system, the linter, and every check script.
- **A second Vercel project** is linked inside `legacy/design-inspo/`.

**Genuine strengths, and they are not small:**
- Comments explain **why**, not what — `next.config.ts` on the `.next` contention bug, `playwright.config.ts` on why retries exist locally, `CalendlyEmbed.tsx` on why the auto-scan class is deliberately avoided, `useWorkScroll.ts:130` on the Safari `var()` perf cliff. This is the writing of someone who debugged something real and left a note so the next person wouldn't repeat it. It is the strongest engineering signal in the repo.
- `useWorkScroll`'s `getCdState` is a **pure function of scroll progress** with no accumulated state — which is precisely why the scroll state machine survives the abuse the brief asked me to inflict.
- `WorkSectionResponsive` correctly subscribes to `matchMedia` change events rather than reading `.matches` once.
- Guard scripts exist (`check:assets`, `check:scale`) and a typecheck is wired into `npm run check`.

---

## Dead Code / Cleanup Candidates

| Item | Size / Scope | Note |
|---|---|---|
| `public/atomic-os-demo/` | 2.9 MB | Full Next.js build in `public/`; referenced by no `src/` file |
| `public/experiments/particle-globe-lab/` | 1.1 MB | Built Vite app; not linked from production |
| `public/Personal Photos/` | 23 MB | Git-ignored; `.gitignore` says "Nothing references these" |
| `Playing Card Backs Examples ` | 5 files | Repo-root scratch dir, trailing space in name |
| `Splash.tsx` dead constants | 3 constants | `FINAL_HOLD`, `PAUSE_AFTER`, `FADE_DURATION` unreachable (`ETB-P1-02`) |
| `.next-alt/` | 13 dirs | Alt build dir; git-ignored, correctly |
| `legacy/design-inspo/` | whole tree | Reference-only, but has a live Vercel project link |
| Root planning docs | 8 `.md` | `CINEMATIC_WORK_STACK_MIGRATION.md`, `WORK_MOBILE_VARIATIONS.md`, `LARGE_DISPLAY_HANDOFF.md`, etc. — historical handoffs at repo root |
| 17 MB supply-chain PNG | 17 MB | Tracked; not loaded by any measured route |
| `.DS_Store` | 6 locations | Ignored going forward, still on disk |

**Recommend keeping:** all 8 `tests/*.spec.ts`, `scripts/check-*.mjs`, and the `.claude/rules/` — these are assets, not clutter.

---

## Things That Look Suspicious But Are Actually Fine

This section exists because several of these looked like findings until I checked, and two would have been wrong to report.

1. **`/` has zero scroll room at 375/390/430/2560/3840** — looked like the known "entry doesn't scroll" defect. It is **intentional**: `belowFoldCount: 0` at every one of those widths, so *nothing is hidden*. The entry is an exact-fit gate. On mobile the instruction and skip link are both fully visible. Not a defect. (The 1440×900 case *is* a defect — `ETB-P1-03` — precisely because there `belowFoldCount: 2`.)

2. **`-webkit-line-clamp: 1` with computed `display: flow-root`** — looked like the classic broken clamp (line-clamp requires `-webkit-box`). The **source is correct**: `work-details.css:462` sets `display: -webkit-box`. Modern Chrome simply *normalises* the computed value to `flow-root`. Rendering confirmed correct — the ellipsis appears. Reporting this as a CSS bug would have been wrong; the real finding (`ETB-P2-05`) is the product decision to clamp to one line.

3. **My own harness produced two false findings.** My first static server let Python emit a **directory listing** for `/emerging-tech-builds` and `/blog` (both exist as `foo.html` *and* a `foo/` asset dir). That produced bogus "small touch target" hits on `atomic-os.html`, `cortex.txt`, etc. Fixed the server to prefer the sibling `.html` (as Vercel does) and re-ran. **No site defect existed.**

4. **`useWorkScroll` reads `mq.matches` once with no change listener** — looked like a resize bug. In practice `WorkSectionResponsive` *does* subscribe to `matchMedia` change and remounts across the 1024px boundary, and the inner query requires `(pointer: coarse)`, which does not flip on a real device. Impact is negligible. Not reported as a finding.

5. **`SoftLockGate` comment claims `aria-hidden` keeps content "out of the a11y tree + tab order"** — that claim is technically false (`aria-hidden` does not remove focusability; `inert` does). But `.dlab-gate__content.is-locked` sets `display: none` (`design-lab.css:464-466`), which *does*. Verified empirically: tab traversal never reaches gated content. **Comment is imprecise; behaviour is correct.**

6. **Two `ERR_ABORTED` image requests on `/`** (`consulting/hero-2.png`, the CD PNG) — both returned HTTP 200. Benign request cancellation from a `src` swap/unmount, not a broken asset. Both load successfully on the subsequent request.

7. **`CalendlyEmbed` looked over-engineered at 140 lines for an iframe.** Reading it, every branch earns its place: shared script promise, explicit `initInlineWidget` instead of the auto-scan, polling `window.Calendly` rather than trusting a `load` event that may have already fired, timeouts, and a real fallback link. The comment explains that a blocked script previously left "a styled 700px void." This is **the best-engineered file I read.**

8. **The CD scroll state machine survived every attack.** `getCdState` (`useWorkScroll.ts:20-53`) is a pure function of a single progress scalar with no accumulated state and no direction dependence — so fast scroll, reverse scroll, and scrollbar jumps are all structurally incapable of desyncing it. Verified: disc transform changed correctly across jump-scrolls. **This is good design, not luck.**

9. **The splash ignores reduced-motion** — it does not. `Splash.tsx:43-54` checks the query and skips straight to hidden, with a comment explaining why it hides via class rather than `.remove()` (React reconciliation on client-side route changes).

10. **`out/` looked stale** — it is not: built 2026-08-26 11:38, 40 minutes *after* HEAD (`5641cc7`, 10:57).

---

## Top 10 Fixes by ROI

Ranked by *impact × probability × visibility ÷ effort*.

| # | Fix | ID | Effort | Why it ranks here |
|---|---|---|---|---|
| 1 | Point 6 references at existing WebP files | P1-01 | S | ~8.5 MB off the homepage (58%). Hits **100%** of visitors. Files already exist — this is a find-and-replace. Highest ratio in the audit by a wide margin. |
| 2 | Fix the splash 4s/9.5s conflict + add skip | P1-02 | S | Affects 100% of first loads, is the literal first impression, and the fix is reconciling two numbers. |
| 3 | `noindex` the 20 uncovered lab routes | P1-04 | S | Removes the "unfinished work at portfolio authority" credibility hit. Metadata-only. |
| 4 | Raise instruction + skip link above the 900px fold | P1-03 | S | Unblocks the most common laptop viewport; pure layout. |
| 5 | Add the resume PDF, set `RESUME_HREF` | P2-03 | S | Wiring already exists — CTA flips automatically. Converts recruiter dead-ends. |
| 6 | Gate the rAF loop on visibility/intersection | P2-01 | S | Removes ~241 forced layouts/sec for the whole session; biggest battery/CPU win available. |
| 7 | Honour reduced-motion in `useWorkScroll` | P2-02 | S | A11y correctness + fixes a violation of the repo's own rule. ~5 lines, mirroring an existing pattern. |
| 8 | `line-clamp: 3` on mobile ETB summaries | P2-05 | S | Restores the value proposition on the consulting evidence page. One media query. |
| 9 | Declare `@playwright/test`, add `test` script | P2-08 | S | Converts an invisible asset into a visible one for any EM who clones. Two lines. |
| 10 | Sandbox the Calendly iframe; revisit GDPR param | P2-07 | S | Real hardening + compliance posture; one attribute plus a decision. |

**Why these ten:** every one is Small effort. The genuinely expensive work — CSS consolidation, moving labs out of the export, image pipeline automation — is real but none of it blocks launch. Items 1–4 alone move Overall Launch Readiness from 64 to roughly 80.

---

## Launch Recommendation

# SHIP AFTER P1 FIXES

**Why not SHIP:** Four P1s each independently damage the primary audience. A 14.75 MB homepage on a phone, a 4-second black overlay that cuts off its own instructions, an entry gate whose explanation is below the fold on the most common laptop size, and 20 indexable lab routes — those are not polish items. The first thing a recruiter experiences is currently the weakest thing about the site.

**Why not DO NOT SHIP:** Nothing is actually broken. Zero JavaScript errors, zero failed network requests, and zero horizontal overflow across 9 routes × 13 viewports. Security posture is above average for a personal site. Metadata and structured data are better than most commercial sites. The scroll state machine is provably robust. The accessibility fundamentals — real buttons, complete alt text, a correct modal focus trap — are done properly. This is a well-built site with a bad first four seconds and an un-run image optimisation.

**The deciding fact:** all four P1s are **Small** effort, and the largest one is a find-and-replace against files that already exist on disk. This is perhaps a day of work, not a rebuild.

**Suggested sequence:**
1. Fixes 1–4 above → re-run the sweep → **ship.**
2. Then 5–10 within the following week.
3. **Before or immediately after shipping, test on real iOS Safari.** It is the largest untested surface, the repo contains Safari-specific workarounds and lab routes implying known issues, and it is likely the single most common way a recruiter will open this link.

---

## Appendix: Reproducing This Audit

Temporary artifacts live in the session scratchpad and are **not** committed. Nothing in the repository was modified by this audit except the addition of this file.

```bash
# Serve the real static export with vercel.json redirects + headers replayed
python3 <scratchpad>/serve_out.py 4321

# Responsive sweep: 9 routes x 13 viewports -> sweep.json
node <scratchpad>/sweep.mjs

# Keyboard/a11y structure, splash timing, rAF instrumentation, per-page weight
node <scratchpad>/a11y.mjs
node <scratchpad>/splash2.mjs
node <scratchpad>/motion.mjs
node <scratchpad>/perf.mjs
```

**Harness caveat worth repeating:** the static server must prefer `foo.html` over listing the `foo/` directory when both exist, or it fabricates findings. See "Actually Fine" #3.
