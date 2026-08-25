# Cortex mark — art direction

**Lab:** `/cortex-mark-lab` · **Production page:** `/emerging-tech-builds/cortex` (unchanged)

## The question

The embroidered brain currently renders as a 72–96px seal above the kicker
(`.etb-page__mark` in `globals.css`). At that size the stitching, the thread
colours and the knit all disappear — it reads as a favicon. Each direction
below makes the mark lead the page, in a different way.

Every direction renders the **real** detail page — same record, same story,
stats, screenshots and accordions — with only the hero swapped. Press `1`–`8`
or use the rail.

| # | Direction | What it does |
| --- | --- | --- |
| 1 | Current | Today's hero, as the baseline to argue against. |
| **Round one** | | |
| 2 | A · Specimen plate | The mark as a full-measure editorial plate with a letterbox crop, a mono caption strip, and the nine thread colours spelled out as swatches. |
| 3 | B · Masthead lockup | Patch and title side by side at ~230px with a merrowed stitch edge. The palette moves into the page: spectrum hairline, tags in gold / green / blue. |
| 4 | C · Fabric field | Full-bleed textile band. The photo appears twice — blurred wide as the ground, sharp and oversized as the mark — with the mark's edges feathered into the field. |
| **Round two** | | |
| 5 | **D · Disc seal** | Cut to a circle and vignetted free of its cloth, with a mono type ring turning slowly around it. Mirrored against B: type left, emblem right. Speaks the CD language the site already owns. |
| 6 | **E · Macro band** | A full-bleed strip of the thread itself — loops, not a logo — with the complete mark kept small and sharp beside the title. The craft argument rather than the scale argument. |
| 7 | **F · Sleeve** | Album-sleeve composition: one big square mark centred, everything under it centred with it. The only centred measure on the site, which is what makes it read as a cover. |
| 8 | **G · Persistent badge** | The one direction whose argument is not size. A modest circular mark in the hero, then a corner badge that pins once the hero scrolls past and holds for the whole page. |

## Moving between labs

The rail's top row switches projects — `/cortex-mark-lab`,
`/atomicos-mark-lab`, `/casebrief-mark-lab`. They are real `<Link>`s, not
state, so a shared URL lands on the lab it names. `←` / `→` cycle between them
and wrap; `1`–`n` still pick a direction within the current lab. The route list
lives in `../mark-lab/labs.ts`.

## Scope

This is art direction for **one project**. AtomicOS and CaseBrief now have
their own labs in `../atomicos` and `../casebrief`, built on their own marks'
properties — none of the three import from each other, and their treatments
deliberately do not overlap. There is no shared "ETB mark system".

## Files

- `CortexMarkHero.tsx` — the seven hero treatments. Reuses the page's own
  `.etb-page__category / __title / __oneLiner / __tags` classes, so what
  differs between directions is the mark and the composition, and only that.
- `cortex-mark.css` — all of it scoped under `.cortex-skin`, which is the only
  thing that lets it reach a page.
- `CortexStickyBadge.tsx` — G's pinned corner badge. The only client component
  here; if G ships, the rest can stay server-rendered.
- `CortexMarkLab.tsx` — thin: state plus `../mark-lab/MarkLabShell`, which is
  the rail all three labs share. That shell is a switcher, not a design system
  — it has no opinion about any mark. The art direction is entirely in
  `CortexMarkHero.tsx` and `cortex-mark.css`.

## The one shared-code change

`ProjectDetailPage` gained an optional `hero?: ReactNode` prop. Omitted — which
is every page today — it draws its own hero exactly as before. Note that an
element which *renders* null still counts as a hero being passed, so the
baseline has to pass `undefined`.

## Shipping a direction

1. Import `cortex-mark.css` and `CortexMarkHero` from
   `src/app/emerging-tech-builds/cortex/page.tsx`.
2. Wrap `<ProjectDetailPage>` in `<div className="cortex-skin"
   data-cortex-variant="…">` and pass `hero={<CortexMarkHero … />}`.
3. Delete the losing branches from `CortexMarkHero.tsx` and their CSS.
4. Drop `/cortex-mark-lab` from `labsRegistry.ts` and `Splash.tsx`'s
   `NO_SPLASH_ROUTES`, or keep it as the record of the decision.

## Notes for the next pass

- **The asset is the ceiling.** `cortex-mark.webp` is a 1024² render. A
  full-bleed band already upscales it ~1.4×, so E's zoom is capped at 1.6 —
  past that the thread stops being thread. C and E would both get noticeably
  better from a 2048² or 3072² master. Worth re-rendering before picking either.
- The mask on C is an **edge feather**, not a vignette. The brain fills ~85% of
  its frame, so any circular fade wide enough to hide the seam also eats the
  outer lobes. A faint vertical edge is still visible where sharp knit meets
  blurred ground; it reads as depth of field at normal viewing.
- A's letterbox crop is the point on a wide measure but keeps only a band
  across the middle of the brain at phone width, so it goes to 5:4 under 620px.
- D's ring sits at 92% of the emblem half-box and the disc stops at 85%. If the
  legend text changes, the `textLength` keeps it wrapping exactly once — do not
  remove it or the ring will gap or overlap.
- G's badge is bottom-**right** on purpose: bottom-left is where Next parks its
  dev indicator.
- Nothing animates on load. The motion is a 2px hover settle (A, B, F), D's
  72s linear ring, and G's badge fade — all off or reduced under
  `prefers-reduced-motion`.

## How this was verified

The Browser pane cannot verify G: a backgrounded pane fires no scroll events
and no rAF, so the badge never pins there. Both checks below drive a real
headless Chromium against the running dev server and touch no build artifacts —
deliberately *not* `npx playwright test`, whose `webServer` runs `next build`
and pulls the build dir out from under a live dev server.

- badge pins / un-pins, under both motion preferences
- 7 directions × 6 widths (375 → 3840), no horizontal overflow

