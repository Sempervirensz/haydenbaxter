# WorldPulse — Mobile Experience Lab (Batch 4)

Three mobile directions for the **first Work card**, built in isolation for
review. Written 2026-07-23.

---

## STATUS: LAB ONLY — nothing promoted, nothing committed

Desktop (≥1024px) is settled and untouched. This batch only answers the phone
question. Production still renders the original `WorkSection` +
`WorldPulseDetail` below 1024px, exactly as before.

**Route:** `/worldpulse-hero-lab/mobile` — linked from `/admin/labs` under
"Work — cinematic". Covered by the existing `/worldpulse-hero-lab` entry in
`NON_PUBLIC_PREFIXES`, so no `site.ts` change was needed; the page also emits
`robots: { index: false }`.

---

## The measurement that drove every decision

The hero (`/WorldPulseCostal3.0.png`) is **3168×1344 — 2.36:1**. Cropped into a
portrait phone card it keeps only **19.6% of its width**, and inside that slice
the phone sits left and her face sits right, together filling the frame top to
bottom. **There is no empty corner to put text in.**

Two things follow, and both are geometry, not taste:

1. **The horizontal anchor is 38%.** Production currently uses `34%`
   (`cinematic-work-stack.css`, the ≤600px block), which cuts her face. `44%`
   cuts the phone's screen. 38% is the only anchor holding the whole phone *and*
   her whole face, with a sliver of coastline left over.
2. **A bottom-anchored headline is impossible full-bleed.** Solving for "clear
   the phone's WorldPulse screen" requires scaling the image ~1.75×, which crops
   the subject away entirely. That is why Concepts B and C put *all* resting text
   in the top band and leave only a CTA at the base, over her hand.

A third number sizes Concept B's sheet: hairline-to-jaw is **~52% of the photo's
height**, and a `cover` crop can only ever scale *up*. So the strip left above
the sheet must be at least that, which fixes the sheet at `48cqh`.

---

## The three concepts

| | **A · Dossier** | **B · Passport Sheet** ★ | **C · Two-Up** |
|---|---|---|---|
| Character | Restrained | Cinematic | Image-led |
| Photo | Own window, flex-sized | Full-bleed stage | Full-bleed, never covered |
| Story arrives | Inline disclosure | Bottom sheet on tap | Second snap-scroll pane |
| Motion | None | Sheet + re-frame + parallax | Native scroll-snap only |

**A · Dossier.** A shorter photo window means a *wider* slice of a 2.36:1 image
survives, so the whole subject fits comfortably. Rail, window, then mono label /
serif headline / lede / disclosure / white CTA stacked on dark. Nothing overlaps
anything, ever.

**B · Passport Sheet.** Full-bleed. Resting state carries only the rail, the
headline in the top band, and one CTA at the base that covers her hand — never
the WorldPulse screen she is holding up. Tapping raises a frosted sheet **and
re-frames the photograph upward at the same time**, so the subject stays composed
above the sheet instead of being half-buried by it.

**C · Two-Up.** Two snap-scrolling panes — pristine poster, then a full-screen
story page — with a persistent bar holding the pager and the CTA. Neither the
photo nor the copy compromises for the other.

### Tradeoffs worth knowing before you look

- **B loses the coastline.** Full-bleed keeps 19.6% of the width: you get the
  phone and her face and nothing else. **A is the only concept that keeps the
  whole scene.** If the coastal setting is load-bearing for the WorldPulse story,
  that is the strongest argument for A.
- **B and C look near-identical at rest.** Not laziness — the full-bleed portrait
  crop has one good answer and both land on it. They diverge entirely *after* the
  tap. If that similarity bothers you, C is the one to cut.
- **C's horizontal paging nested inside the Work section's vertical scroll track
  is a real gesture conflict** — the hardest of the three to integrate safely.
- **A on a 568px screen** needs a ~59px scroll once the story is expanded.

---

## Recommendation: B · Passport Sheet

A and B score about level — A wins performance and accessibility, B wins
storytelling and consistency, and they tie on usability once you notice B's extra
tap is the same cost desktop already pays for its hover reveal.

The tiebreak is the brief itself: the complaint about mobile today is that it
lacks the desktop's cinematic quality, hierarchy, and intention. A fixes
hierarchy and intention but gives up the full-bleed frame that defines the Work
stack; B fixes all three. B's costs — one `backdrop-filter` surface, a focus
trap, ~40 lines of parallax — are engineering costs that can be bounded or
deleted, not costs the visitor pays.

**A is the named fallback** if the `backdrop-filter` cost or the focus-management
surface is judged too high. It is a genuine improvement on what mobile ships
today and needs no new interaction machinery at all.

---

## Files

### Created
- `src/data/worldpulseMobileLab.ts` — concept metadata, device presets, and
  `getWorldPulseContent()` which reads real copy straight out of `WORK_SCREENS`.
- `src/components/worldpulse-hero-lab/WorldPulseMobileLab.tsx` — lab shell:
  concept tabs, device presets + sliders, Compare / Scroll-stage / Motion
  toggles, notes panel.
- `src/components/worldpulse-hero-lab/worldpulse-mobile-lab.css` — all lab and
  concept styling, scoped under `.wpm` / `.wpc`.
- `src/components/worldpulse-hero-lab/useSubtleParallax.ts` — the optional
  parallax (see below).
- `src/components/worldpulse-hero-lab/concepts/ConceptDossier.tsx`
- `src/components/worldpulse-hero-lab/concepts/ConceptSheet.tsx`
- `src/components/worldpulse-hero-lab/concepts/ConceptTwoUp.tsx`
- `src/app/worldpulse-hero-lab/mobile/page.tsx`

### Modified
- `src/data/labsRegistry.ts` — **one line**, the hub entry.

### Untouched (verified against HEAD)
`src/components/work/**` (incl. `CinematicCardBody`, `WorkSectionCinematic`,
`WorkSectionResponsive`, `WorldPulseDetail`, `cinematic-work-stack.css`),
`src/components/WorkSection.tsx`, `src/app/page.tsx`, `src/app/globals.css`,
`src/styles/work-details.css`, `src/data/work.ts`, `src/data/site.ts`.

`git status` shows one modified file and six new paths. Nothing else.

---

## Two structural decisions

**Extended the hero lab rather than making a sibling route.** `/worldpulse-hero-lab/mobile`
inherits the `NON_PUBLIC_PREFIXES` entry and reads as the same investigation. No
working code was duplicated.

**Container queries, not an iframe.** `ResponsiveViewer` frames the cinematic
stack in an iframe so real viewport media queries fire. Here the concepts are
sized with `container-type: size` on the phone frame and `cqw`/`cqh` units
instead, which means a plain fixed-size div reproduces phone dimensions exactly,
three phones fit side by side in Compare mode, and — the reason that matters —
**every concept is already container-driven if it is later dropped into the
cinematic card.**

---

## Parallax

Concept B only. `useSubtleParallax.ts`: one rAF loop writing one custom property,
IntersectionObserver-gated, `prefers-reduced-motion` short-circuited before the
loop starts, ±10px peak.

Travel comes from a **12px vertical bleed on a wrapper, not a `scale()`** —
scaling would cost horizontal crop and there is none to spare. Nothing else
writes to that wrapper's transform, so the drift and the open-state re-frame
never fight. Deleting the hook call makes the whole layer inert.

Measured: `+6.13px` with the card above centre, `−3.81px` below.

**Verdict:** it adds a real sense of the card being a window rather than a
picture, but it is genuinely optional. Ship B without it if there is any doubt.

---

## How to test

```bash
npm run dev
```

Then open `/worldpulse-hero-lab/mobile`, roughly in this order:

1. **Compare all three** — fastest read on how different they actually are.
2. **B → "Explore WorldPulse"** — the sheet rise + photo re-frame is the whole idea.
3. **A → "Read the full story"** — the photo window shrinks as copy expands. Deliberate.
4. **C → "Story"** in the pager, or drag the poster sideways.
5. **SE (1st) · 320×568** — the size that breaks things. Re-open every expanded state there.
6. **Scroll stage · on** with B — drops the card into a chapter track; scroll the
   phone and the parallax becomes visible.
7. **Simulate reduced motion** — collapses transitions and stops the parallax
   without touching OS settings. (The real media query is honoured independently.)

### Verified 2026-07-23
- `npx tsc --noEmit`, `npm run check:assets`, `npm run build` — all clean.
  (Dev server stopped and `.next` removed first, per trap #3 in `AGENTS.md`.)
- Route builds at 5.59 kB, emits `noindex`, covered by
  `Disallow: /worldpulse-hero-lab`, absent from the sitemap.
- All three concepts at 320×568, 360×740, 375×667, 393×852, 430×932 — including
  every expanded state simultaneously: **zero overflow**.
- Full keyboard cycle on B with real key events: Enter opens → focus enters sheet
  → Escape closes → focus returns to trigger, frame does not scroll.
- Reduced motion collapses transitions to 1ms, switches `scroll-behavior` to
  `auto`, stops the parallax.
- No console errors, no server errors.

> `npm run lint` is not usable in this repo — it has no ESLint config and prompts
> to create one. Pre-existing; `npm run check` is the documented gate.

### Bugs found and fixed while testing
1. `.focus()` on the sheet scrolled the `overflow: hidden` frame and destroyed
   the composition — needed `focus({ preventScroll: true })`. An
   `overflow: hidden` ancestor is still *programmatically* scrollable.
2. Concept A clipped its CTA when the story was expanded on an SE.
3. B's top scrim was taller than the strip of photo left above an open sheet on
   short phones, blacking out the portrait.
4. A rAF-latched scroll throttle in C could stick permanently if the tab hid.

Three further "failures" turned out to be `document.hidden` artifacts of the
headless preview pane pausing rAF, IntersectionObserver delivery, and smooth
scrolling — verified against real input, not defects.

---

## To promote B later

1. Move the concept into `CinematicCardBody` case 1, behind the existing
   `<1024px` branch. The CSS is container-query-driven, so it needs
   `container-type: size` on `.cstack__card` and nothing else.
2. Replace `useSubtleParallax` with the existing `useCinematicParallax` drift, or
   drop it — the stack already parallaxes.
3. Scope the `.wpc-*` styles into `cinematic-work-stack.css`.
4. Swap the 6.7MB PNG for the tracked **`WorldPulseCostal3.0.webp` (85KB)** —
   already in the repo, currently unreferenced.
5. Drop the always-on `will-change` hints.
6. **The larger call this batch deliberately did not make:** decide whether the
   mobile Work section should switch from the original `WorkSection` to a
   cinematic mobile variant at all.

Separately worth fixing whenever the production card is next touched: the
**`background-position: 34%`** phone framing in `cinematic-work-stack.css` cuts
her face. `38%` is correct.
