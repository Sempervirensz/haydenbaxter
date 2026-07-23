# Work Display Lab

Isolated sandbox for experimenting with the **top text / hero text treatment**
on the Work landing screen.

---

## What this tests

Three distinct text directions for the Work landing card header — all responding
to the same CD-disc scroll state as production:

| Concept | Name | Feel |
|---------|------|------|
| A | Pinned Masthead + Track Display | CD player readout — stable title, live track + sub-line |
| B | Ghost / Echo Typography | Album sleeve — large low-opacity echo behind clean masthead |
| C | Marquee / Track Listing | Liner notes — full track list, active item emphasized |

---

## How to run

```bash
npm run dev
# then open:
http://localhost:3000/work-display-lab
```

Switch concepts using the three buttons at the bottom of the screen.

---

## Where the adjustable values live

**All in `WorkDisplayLab.tsx` — top of file:**

```ts
const DEFAULT_CONCEPT = "A"       // which concept loads by default

const LAB_CONFIG = {
  title: "Work",                  // main heading
  quote: "Rooted in outcome...",  // sub-line (Concepts A + B)
  titleTopOffset: "...",          // vertical anchor of top text
  echoOpacity: 0.045,             // Concept B: ghost text opacity
  echoScale: 1,                   // Concept B: ghost text scale
  motionIntensity: 0.8,           // 0 = no animation, 1 = full speed
  trackListDimOpacity: 0.28,      // Concept C: dim track opacity
  tracks: [...],                  // track display names + sub-lines
}
```

**CSS variables (in `lab.css`):**

- `--readout-dur` — Concept A crossfade speed
- `--echo-dur` — Concept B echo fade speed
- `--marquee-dur` — Concept C scroll speed
- `--dim-opacity` — Concept C dim track opacity
- `--list-dur` — Concept C active transition speed

---

## Scroll state

Mirrors `useWorkScroll` from production — same zones, same breakpoints, same
lerp speed. The CD disc rotates identically to production. Scroll through the
full 500vh to see all four sections cycle.

---

## What's safe to promote

If a concept wins, here's what carries over:

### Concept A
- The masthead grid pattern (`wdl-a__masthead`) → replace `.wl-title` block
- Track readout (`wdl-a__readout`) → new element inside `work__screen--landing`
- Requires `activeLabel` from `useWorkScroll` — already available in `WorkSection.tsx`

### Concept B
- The `.wdl-b__echo` div → add as an absolute layer inside `work__screen--landing`
- The three-column grid → replace current centered layout
- Requires `activeLabel` from `useWorkScroll` — already available

### Concept C
- The `wdl-c__top` + `wdl-c__list` → replace entire top text block
- The marquee band can be extracted as a standalone component
- Requires `activeLabel` from `useWorkScroll` — already available

---

## Files

```
src/app/work-display-lab/
  page.tsx          — Next.js route (noindex)
  WorkDisplayLab.tsx — Main component + all 3 concepts + LAB_CONFIG
  lab.css           — Isolated styles (does not affect production)
  README.md         — This file
```
