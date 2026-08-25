# AtomicOS mark — art direction

**Lab:** `/atomicos-mark-lab` · **Production page:** `/emerging-tech-builds/atomic-os` (unchanged)

## The question

Same question as Cortex's lab — how prominent should the mark be, and what
shape does that prominence take — with deliberately different answers, because
this is a different object.

The AtomicOS mark is **cream thread on near-black fabric**: monochrome,
austere, photographed square. Cortex's problems don't exist here (no grey
ground to hide, no nine thread colours to place), so none of Cortex's
treatments are offered.

| # | Direction | What it does |
| --- | --- | --- |
| 1 | Current | Today's hero, as the baseline to argue against. |
| 2 | **A · Free float** | No frame at all. The fabric is crushed to page black so only the cream stitching remains, at 340px, sitting in the type as though set with it. |
| 3 | **B · Orbit field** | The atom bigger than the hero, bled left and dropped to a structural whisper. The title sets into the space the orbits leave — the mark becomes the layout. |
| 4 | **C · Ledger plate** | The austere read, and the closest to the mark's own character: two hairlines, the mark centred small between them, mono metadata either side. A spec sheet, not a poster. |
| 5 | **D · Cadence row** | The mark repeated five times, fading right. AtomicOS is a product about repetition, so the logo becomes the rhythm rather than a single stamp. An argument no other build here could borrow. |

## The technique, measured

The whole folder rests on one thing: **the mark's ground is already the page's
ground**, so it needs no plate, no crop and no frame — just a crush.

The fabric samples at luminance **18/255**; the page is `#0a0a0a`, which is 10.
CSS filters apply as `v' = ((v × brightness) − 0.5) × contrast + 0.5`, so
`brightness(0.88) contrast(1.7)` gives:

| | in | out |
| --- | --- | --- |
| fabric | 0.071 | **0** |
| cream | 1.000 | 1 (held) |
| midtone | 0.500 | 0.40 (modelling survives) |

Two things that cost time and should not be rediscovered:

- The mask **must** be `closest-side`. The default `farthest-corner` puts the
  circle's edge at the corner, which leaves the left and right edges of the
  frame ~67% opaque — the square stays plainly visible. That was the first
  version's bug and it looked like the crush had failed when it hadn't.
- Every offset is expressed against `--aos-float-size` / `--aos-cadence-size`
  rather than hard-coded, because the atom only fills the middle ~53% of its
  frame. Hard-coded pulls either leave a gap or slide the kicker under the
  orbits, and both break the moment the clamp changes.

## Moving between labs

The rail's top row switches projects — `/cortex-mark-lab`,
`/atomicos-mark-lab`, `/casebrief-mark-lab`. They are real `<Link>`s, not
state, so a shared URL lands on the lab it names. `←` / `→` cycle between them
and wrap; `1`–`n` still pick a direction within the current lab. The route list
lives in `../mark-lab/labs.ts`.

## Scope

AtomicOS only. Cortex and CaseBrief have their own folders, own heroes, own
stylesheets — everything here is scoped under `.aos-skin`. The three labs share
`../mark-lab/MarkLabShell` and nothing else, and that is a switcher, not a
design system: it renders a rail and has no opinion about any mark.

## Shipping a direction

1. Import `atomicos-mark.css` and `AtomicOSMarkHero` from
   `src/app/emerging-tech-builds/atomic-os/page.tsx`.
2. Wrap `<ProjectDetailPage>` in `<div className="aos-skin" data-aos-variant="…">`
   and pass `hero={<AtomicOSMarkHero … />}`.
3. Delete the losing branches and their CSS.
4. Drop `/atomicos-mark-lab` from `labsRegistry.ts` and `Splash.tsx`'s
   `NO_SPLASH_ROUTES`, or keep it as the record of the decision.
