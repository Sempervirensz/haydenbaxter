# Experience Lab — `/experience-lab`

Eight directions for **one section**: path 03 of the Consulting chapter,
"Review My Experience". Nothing else on the Consulting page is in scope, and
production is untouched.

## What is being reviewed

In production the section is `WorkTogetherSolo` rendering
`workTogether.ts → EXPERIENCE.destination` into the paper sheet that unfurls
beneath the three track rows of `WorkTogether`. It is reached by pressing
**03 Review My Experience** inside chapter 04/04.

## What the lab renders

Each concept is drawn inside a replica of the real card — the statue plate, the
chapter rail, the demoted "LET'S WORK TOGETHER" eyebrow, and the three track
rows with 03 playing — using production's own markup and its two stylesheets
(`work-together.css`, `consulting-paths.css`). The brief's question is whether a
direction feels native to that, and an artboard cannot answer it.

`BASE` renders production's shipped screen through the real component, so the
comparison has a floor rather than a memory.

## The readout

Every frame reports the sheet's content height against the sheet's own height.
Measured on the live site at 402×874, the shipped section is **873px of content
in a 518px sheet** — 355px of the record below the fold of a nested scroller
that gives no sign of being scrollable, inside a card that is itself a scroll
stop.

The binding constraint is **390×844**, the shortest phone in the band under
review, which leaves the sheet **468×329**. Every concept is solved against that
number, not against the most generous phone in the band.

## Files

```
src/data/experienceLab.ts                     facts + concept metadata
src/components/experience-lab/
  ExperienceLab.tsx                           shell, switcher, compare, readout
  ExperienceCard.tsx                          the in-situ card replica
  experience-lab.css                          lab chrome + all eight concepts
  concepts/
    parts.tsx                                 shared actions + rule
    Ledger.tsx  Trajectory.tsx  Axes.tsx  Scale.tsx
    LinerNotes.tsx  Sentence.tsx  Record.tsx  Playhead.tsx
src/app/experience-lab/page.dev.tsx           dev-only route
```

Touched outside the lab: `src/data/site.ts` (noindex prefix) and
`src/data/labsRegistry.ts` (hub entry). Two lines. Deleting the four paths above
and reverting those two entries removes the experiment completely.

## Facts

`experienceLab.ts` carries the source material Hayden supplied. Two facts in it
— "100+ factories" and both universities — do not exist anywhere else in the
repo and are **not** carried into production by this file; it is read only by
`/experience-lab`. Nothing is invented: no dates, no titles, no metrics, no
clients beyond what was given.
