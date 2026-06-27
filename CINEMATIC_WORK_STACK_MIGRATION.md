# Cinematic Work Stack — Migration Guide

How to take the lab-built **Cinematic Work Stack** and ship it as the production
Work experience. Written 2026-06-24.

---

## ✅ STATUS: DONE IN CODE (2026-06-24) — not yet committed or deployed

Final approach shipped to the codebase = **Option 1 (cinematic cards inside the CD
scroll), gated responsively** so mobile keeps the original.

**Homepage** (`src/app/page.tsx`) renders **`WorkSectionResponsive`**, which picks by
viewport width:
- **≥ 1024px** (large tablets, laptops, desktops) → `WorkSectionCinematic`: the
  signature CD-scroll clock landing (verbatim) flows into the four projects rendered
  as full-bleed cinematic cards.
- **< 1024px** (phones, standard tablets) → the **original `WorkSection`**, untouched.

### Files
- **Created**:
  - `src/components/work/WorkSectionResponsive.tsx` — the width switch (matchMedia, 1024px).
  - `src/components/work/WorkSectionCinematic.tsx` — CD landing + cinematic cards.
  - `src/components/work/WorkLanding.tsx` — the CD landing markup (reused verbatim).
  - `src/components/work/CinematicCardBody.tsx` — shared per-card content (+ `CINEMATIC_CARDS`).
  - `src/hooks/useCinematicParallax.ts` — shared sink/dim + drift rAF engine.
  - `src/components/work/CinematicWorkStack.tsx` (+ `cinematic-work-stack.css`) — the
    standalone/lab stack (takes `lab` prop), now consuming the shared pieces.
  - Lab routes: `/site-parallax-lab/work-cinema` and `/site-parallax-lab/work-merged`.
- **Untouched (critical, all verified clean vs HEAD)**: `src/components/WorkSection.tsx`
  (rollback), `src/hooks/useWorkScroll.ts`, `src/data/work.ts` (`screenBreaks`/zones),
  `CardDeck`, Hero, About, Connect, Brands, Journal.

### Notes
- Consulting cityscape (`.cht-bg`) now parallaxes (scoped `.work--cinematic` gives its
  chapter a full 300vh track so the drift has room). WorldPulse has the hover-revealed
  frosted-glass dossier.
- Verified: `tsc` + `next build` clean; homepage at 1440px → cinematic (4 cstack cards),
  at 375px → original (4 `.work__screen--detail` cards). CD disc present in both.

### Still to do (NOT done)
- **Not committed** to git, **not deployed** (your normal Vercel push ships it).
- Confirm on a **real phone** (touch path differs from the desktop preview).

### Rollback
Revert the one import line in `src/app/page.tsx` back to
`dynamic(() => import("@/components/WorkSection"))`. Nothing else in production changed.

The sections below are the original plan, kept for reference.

---

## 1. What it is

A borderless, full-bleed depth-handoff presentation of the four Work chapters
(01 WorldPulse · 02 Emerging Tech Builds · 03 Supply Chain · 04 Consulting). Each
chapter pins, then sinks + dims as the next slides over it ("Deep Sink", 100%).

It is **not** a rewrite of the content. It reuses the exact production data and
detail components, so it is a new *presentation layer* over what already ships.

Card behaviors:
- **01 WorldPulse** — full-bleed coastal photo + serif tagline. A hover (desktop)
  / focus (keyboard) / tap (touch) reveals a **frosted-glass panel** holding the
  full dossier. No click-through.
- **02 Emerging Tech Builds** — the real deployed `ETBDetail` (candy-bar gallery,
  in-page dossier).
- **03 Supply Chain** — the real deployed `SupplyChainDetail` (interactive globe +
  journey timeline).
- **04 Consulting** — the real `ConsultingHeroStage` (cityscape + reveal → offers
  → book-a-call / email).

> NOTE: the hover frosted-glass treatment is currently **card 01 only**. Cards
> 02–04 render their real components directly. Extending the hover-glass to the
> others is an open item (§7).

---

## 2. Exactly what was built (lab files)

All new, all under the parallax lab — **nothing in production was modified**:

| File | Purpose |
|---|---|
| `src/components/site-parallax-lab/CinematicWorkStack.tsx` | The stack component (engine + cards) |
| `src/components/site-parallax-lab/cinematic-work-stack.css` | All styling, scoped under `.cstack` |
| `src/app/site-parallax-lab/work-cinema/page.tsx` | Lab route `/site-parallax-lab/work-cinema` |
| `src/components/site-parallax-lab/ResponsiveViewer.tsx` | Dev-only device-frame previewer |
| `src/components/site-parallax-lab/responsive-viewer.css` | Viewer styling |
| `src/app/site-parallax-lab/work-cinema/viewer/page.tsx` | Lab route `/site-parallax-lab/work-cinema/viewer` |

### Reused from production (no changes needed)
- Data: `WORK_SCREENS` from `src/data/work.ts`
- Components: `WorldPulseDetail`* / `ETBDetail` / `SupplyChainDetail` / `ConsultingHeroStage` from `src/components/work/`
- Globe: `src/components/ui/realistic-globe` (via `SupplyChainDetail`)
- Global CSS: `src/styles/work-details.css` (already `@import`-ed by `globals.css`), `.etb-gallery__shell`
- Hero asset: `public/WorldPulseCostal3.0.png`

\* WorldPulse content (the two caption paragraphs + WorldXPulse link) is read from
`WORK_SCREENS` and rendered inside the glass panel; `WorldPulseDetail` itself is
not used by the stack.

---

## 3. Lab-only parts to STRIP before production

These exist only to drive the lab/viewer and must be removed when migrating:

1. **The control dock** — the entire `<aside className="cstack__dock">…</aside>`
   block (Intensity slider, Motion toggle, "Responsive view" + "Handoff lab"
   links) and its CSS (`.cstack__dock*`, `.cstack__dial*`, `.cstack__toggle*`).
2. **The embed bridge** — the `embedded` state, the `window.self !== window.top`
   check, and the `postMessage` listener (`source === "cstack-ctl"`). Keep the
   `peek` state and its button toggle (that is the touch affordance).
3. **The lab intro header** — `<header className="cstack__intro">` ("PLX 04 ·
   Cinematic stack" / "Work, in full bleed" / lede / scroll hint). Replace with
   the production Work intro or drop it.
4. **The outro** — `<footer className="cstack__outro">`.
5. **The whole Responsive Viewer** (`ResponsiveViewer.tsx`, `responsive-viewer.css`,
   `/work-cinema/viewer` route) — dev tooling, never shipped.
6. **`Link` import** — only used by the dock's lab links; remove once the dock is gone.

After stripping, the component is just: the root `.cstack`, the four
`.cstack__chapter` cards, and the rAF engine.

### Bake the lab settings as constants
The dock made these adjustable; in production hard-code them:
- intensity = `1` (drop `intensityRef` / `intensity` state → use `1`)
- motion = on, but still gated by `prefers-reduced-motion` (the `cstack--off`
  path already handles this — keep it)

---

## 4. Migration steps

**Recommended: stage behind a route first, then swap the homepage.**

### Step A — promote the component to a production location
1. Move `CinematicWorkStack.tsx` → `src/components/work/CinematicWorkStack.tsx`.
2. Move `cinematic-work-stack.css` → alongside it (or into `src/styles/`); keep the
   `import "./cinematic-work-stack.css"`.
3. Apply all of §3 (strip lab-only parts, bake constants).
4. Add `id="work"` to the root element (the homepage nav anchors to `#work`).

### Step B — verify in isolation
Keep `/site-parallax-lab/work-cinema` pointing at the production component for a
final review pass at all breakpoints (use the viewer until you delete it).

### Step C — swap the homepage Work section
In `src/app/page.tsx`:
```diff
- const WorkSection = dynamic(() => import("@/components/WorkSection"));
+ const WorkSection = dynamic(() => import("@/components/work/CinematicWorkStack"));
```
(Keep the `<WorkSection />` usage, or rename the symbol to `CinematicWorkStack`.)

The old `useWorkScroll`-driven `src/components/WorkSection.tsx` stays in the repo
until you are confident, then can be removed in a follow-up.

### Step D — confirm deep links still work
The standalone detail pages (`/emerging-tech-builds`, `/emerging-tech-builds/*`,
etc.) are independent and unaffected. The stack renders ETB/SC inline, which
duplicates that content on the homepage — intended.

---

## 5. Production cleanup checklist
- [ ] Component moved to `src/components/work/`, CSS alongside
- [ ] Dock, embed bridge, intro, outro, lab `Link`s removed
- [ ] intensity/motion baked; `prefers-reduced-motion` still respected (`cstack--off`)
- [ ] `id="work"` on root; nav anchor verified
- [ ] `ResponsiveViewer.*` and `/work-cinema/viewer` deleted (or left as an internal tool, never linked from prod)
- [ ] `npx tsc --noEmit` clean
- [ ] `npm run build` clean (static export)

---

## 6. Responsive + a11y notes (already handled, keep them)
- WorldPulse glass panel anchors bottom-left and width is capped
  (`min(420px, calc(100vw - 2·pad - 24px))`) so it never bleeds off the card.
- Headline fades while the panel is open (`:has()`, opacity-only — the rAF loop
  owns the caption transform).
- Hero zoom is tiered (1.04 mobile / 1.07 tablet / 1.12 desktop) and
  background-position is tuned per breakpoint for card 01.
- The mobile dock collapsed to a bottom pill — irrelevant after the dock is removed.
- Reduced motion: `.cstack--off` disables the sink/scale transforms.

---

## 7. Open items (decide before or after migration)
- **Hover-glass on cards 02–04** — only card 01 has it; the others show their real
  components. Decide whether to wrap them in the same treatment.
- **Supply Chain on mobile** — its deployed layout is a tall scrolling timeline; in
  a pinned card only the globe + first stops show. Options: internal scroll, un-pin
  on mobile, or a condensed timeline.
- **Consulting desktop** — the cityscape sits low with sky dead-space up top;
  consider re-anchoring the image.
- **WorldPulse link label** wraps to two lines at 375px — shorten if undesired.

---

## 8. Rollback
Revert the one-line `dynamic(import(...))` change in `src/app/page.tsx` to point
back at `@/components/WorkSection`. Nothing else in production was touched, so this
fully restores the original scroll-driven Work section.
