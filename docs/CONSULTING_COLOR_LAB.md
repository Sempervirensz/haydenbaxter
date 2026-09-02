# Consulting colour lab

**Route:** `/consulting-color-lab` (dev only — `page.dev.tsx`, noindexed via
`NON_PUBLIC_PREFIXES`, listed in `/admin/labs`)
**Branch:** `codex/feat-consulting-color-lab`
**Status:** exploration. **Nothing is promoted.** `src/components/work/**` is
untouched; the shipped Consulting screen renders exactly as it did.

---

## The question

Can a restrained accent system give the Consulting screen visual hierarchy
without turning it into a product landing page?

## What is being compared

Four stages over **identical copy, identical markup and identical
interaction** — the shipped panel as a control, plus three directions. The
three top-level bars above the sheet are production in all four, so any
difference you see between two stages is a difference in the treatment and
nothing else.

Each stage is the real "Let's work together" composition — the same
photograph, the same grain, the same depth ladder — because the sheet has to
be judged sitting on the dark ground it actually sits on.

There is also one independent axis, **Masthead**, applied to all four equally
(see below).

---

## What "muted" turns out to mean

Before designing anything, the shipped ink ramp was measured against the
`#f5f4f1` sheet it sits on. Ratios below are the values the browser actually
renders, not estimates:

| Token | Carries | Ratio | AA (4.5:1) |
|---|---|---|---|
| `--ink-1` | Path name (serif) | 17.1:1 | pass |
| `--ink-2` | Credits line | 7.8:1 | pass |
| `--ink-3` | Lede · both summaries · secondary button | **4.2:1** | **fail** |
| `--ink-4` | Eyebrow · both kickers · both track numerals | **2.6:1** | **fail** |

Two of the four steps fail, and between them they carry everything on the
panel except the two names. So "feels muted" is a readability defect first and
a taste question second.

Three other findings came out of the same pass:

1. **The serif names render at 78% opacity permanently.** `tracklist` dims
   `.cpp-path__name` and restores it on `:hover` or `[data-state="open"]` —
   and production ships with nothing openable, so the restore rule can only
   ever fire on hover. The two largest elements on the sheet are held back the
   entire time the panel is on screen.
2. **At rest the panel carries exactly one coloured element** — the primary
   button's 45%-alpha outline. Every accent the palette defines is gated
   behind an open state production never reaches.
3. **The section has no heading-level anchor.** `CONSULTING_SCREEN.title`
   ("Strategy that ships.") has been in `src/data/consultingPaths.ts` all
   along and the shipped masthead does not render it; the section opens on a
   13px grey lede.

Finding 3 became the Masthead switch rather than being folded into one
direction, so it can be judged without confounding the colour comparison.

---

## The shared floor

All three directions start from the same lifted ink ramp — `--ink-3` to 0.68
and `--ink-4` to 0.62 — and take the names off the 78% hold. That is
deliberate: the ramp is a defect fix, not a flavour, and no direction should
be able to "win" by being the only one that fixed it. Dimming is not deleted,
it is re-pointed: the *unhovered sibling* recedes when one column is hovered,
so hovering does something instead of merely undoing a default.

Measured after the fix — every element passes AA in all three directions:

| | Control | Drafting | Letterpress | Index |
|---|---|---|---|---|
| Eyebrow | 2.6 ✗ | 6.9 | 5.3 | 5.1 |
| Lede | 4.2 ✗ | 6.3 | 9.9 | 6.3 |
| Kicker | 2.6 ✗ | 6.9 | 6.5 / 5.3 | 6.6 / 5.4 |
| Summary | 4.2 ✗ | 10.3 | 9.9 | 10.3 |
| Secondary button | 4.2 ✗ | 10.3 | 9.9 | 10.3 |
| Primary button | 6.6 / 4.6 | 7.2 | 15.3 | 7.3 / 6.3 |

What each direction *owns* is what it does with colour on top of that.

---

## Direction A — Drafting  ·  cool, technical

**Thesis: colour means action, not category.**

### What changed
- Paper cooled to a blue-grey drafting stock; hairlines re-mixed from slate
  rather than pure black, so the neutrals sit in the accent's family.
- Kicker and track numeral set in cobalt at rest, preceded by a small square
  registration tick — the tick is the *only* place the two paths differ
  chromatically.
- The numeral becomes a drawing callout (`01 /`).
- A real gutter rule between the two columns.
- The credits line re-set as a spec row with hairline dividers.
- **Primary: a solid cobalt fill on both paths**, sized by its label, not
  stretched to the column.
- **Secondary: no pill at all** — mono uppercase over a 1px rule that thickens
  and turns cobalt on hover.
- Brass survives only as the supply path's tick and numeral.

### Why
The shipped scheme gives each path a hue and then paints that hue onto that
path's button, so blue and gold are simultaneously saying "this is which
discipline" and "this is the thing to press". Two jobs, two families, neither
read cleanly. Here one system blue owns every call to action, and the path
hues retreat to identity marks where they cannot be mistaken for controls.

### What it solves
Primary vs. secondary becomes unmistakable at a glance — a filled control
against a text link, not two outlined pills of the same weight. The gutter
rule is what stops the pair reading as one wide block of grey.

### Tradeoffs
- Contradicts the shipped comment arguing each path's CTA should carry that
  path's hue, so the button no longer proves which conversation you are
  starting.
- Two solid fills is the loudest this site has been on a light surface. It is
  the direction most at risk of reading as a product page.
- Cooling the paper is a change to the site's surface vocabulary, not just to
  this panel — it would need to be reconciled with the other paper screens.

---

## Direction B — Letterpress  ·  warm, editorial

**Thesis: hierarchy from scale and material, not from more colour.**

### What changed
- Paper warmed toward a printed stock; hairlines warmed to match.
- The summary re-set at reading size (`--text-body-sm`) on a 44ch measure with
  more leading.
- **The track numeral goes poster-scale** — serif, in the path's own hue at low
  alpha, anchoring each column's top-left. No new DOM: `.cpp-path__ghost` is
  already in the markup and two other layouts already draw it this way.
- Kicker on a brass hairline; brass becomes the section's connective accent
  while each path keeps its hue for numeral and kicker.
- **Primary: a DYMO plate** — dark slab, mono uppercase, hard bottom edge, a
  press state on `:active`, and a 3px cap in the path's hue.
- Secondary stays a hairline pill, lifted to legible ink.

### Why
The sheet has no entry point: the eye arrives on a 13px grey lede and meets
two serif names of equal weight with nothing saying where a column starts.
A poster figure gives each column a beginning, and the scale then drops
cleanly into name → summary → ask. The plate is the site's most recognisable
control and this panel currently uses it nowhere.

### What it solves
The strongest answer to "the path the eye takes". It is also the direction
that most obviously belongs to *this* site rather than to a palette.

### Tradeoffs
- Two dark plates at the foot of a light sheet are heavy, and they pull the
  eye to the bottom before the copy is read.
- The emboss is a dark-surface idiom; on paper it has to be argued for.
- The largest departure of the three — it changes surface, type scale and
  control vocabulary at once, so it is the hardest to land incrementally.

---

## Direction C — Index  ·  between, closest to shipped

**Thesis: the panel is not short of colour. It is short of contrast, and of
colour doing a job.**

### What changed
- The shared ramp, and nothing else neutral.
- Kicker and track numeral take the path's own hue **at rest** — the single
  largest change, moving the metadata layer from 2.6:1 grey to 6.6:1 / 5.4:1
  colour.
- `.cpp-path__rule` — in the markup already, hidden by `tracklist` — returns as
  a lane bar in the gutter that grows on hover.
- A 4.5% hue wash per column lifting on hover, with the hairline above it
  taking the path's hue.
- **Primary: filled with the path's own hue**, and this is the one place the
  direction refuses to be symmetrical:

  | | Fill | Label | Ratio |
  |---|---|---|---|
  | AI | `#1e4ebe` (the text-safe ink) | white | 7.3:1 |
  | Supply | `#b8924a` (the hue itself) | near-black | 6.3:1 |

  Running cobalt and brass through one recipe is what makes a two-accent
  palette look cheap: brass dark enough to carry white type stops being brass
  and becomes olive. The shipped palette already declares two inks per hue
  (`--ai-on`, `--sup-on`) for exactly this reason.
- Secondary stays the shipped outline pill and only gains legibility.

### Why
This is the control-adjacent direction and it is here as a real test, not
filler. Nothing decorative is added — no new marks, no new type sizes, no
change of surface. Each accent gets exactly three jobs (kicker, lane bar, CTA
fill) and is used for nothing else.

### What it solves
If this reads as enough, the finding is that the muting was a contrast defect
wearing a colour costume, and the correct fix touches four tokens and one
opacity rather than redesigning the panel.

### Tradeoffs
- The most conservative of the three: if the real fault is that the section
  has no focal point, this does not add one.
- A brass fill beside a cobalt fill can read as two primaries competing rather
  than as two equal paths.
- Two full-width filled bars at the foot of the sheet is still a lot of
  saturation for a panel whose argument is restraint.

---

## A defect all four share

`.cpp-path__actions` is a wrapping flex row and `.cpp-action--primary` is
`flex: 1 1 auto`, so whether the secondary fits beside the primary depends on
how long that path's secondary label happens to be — and it does. "View
Selected AI Work" fits on the AI side; "View Supply Chain Experience" does not
on the supply side. Production wears that as two pills at slightly different
widths and it passes unnoticed. Put a filled control on one side of that row
and the same wrap draws one column as a small button beside a link and the
other as a full-bleed button above one.

Drafting fixes it by stacking the two ranks. **It is present in production
today** and is worth fixing regardless of which direction is chosen.

---

## Round two — Drafting's button row

Drafting is the direction going forward. The first question asked of it was
whether its buttons are straight and aligned. **They already are**, measured on
a 1180px card:

| | Stack (as first shown) |
|---|---|
| Both primaries on one y | yes |
| Both secondaries on one y | yes |
| Primary boxes identical across columns | yes, 233.6px |
| Left edges flush, primary to secondary | yes |
| **Secondary rule length** | **210px vs 283px** |

One thing is unequal: the secondary's underline runs the length of its label,
and "View Selected AI Work" is 69px shorter than "View Supply Chain
Experience". That single edge is what reads as not-quite-aligned once you look
for it.

Four rows, on the `[data-actions]` axis. All four keep the thesis — one system
blue, a filled primary, a quiet secondary — and change only geometry.

| Row | What it equalises | Cost |
|---|---|---|
| **Stack** | Everything except the secondary's rule length. | The two columns end 69px apart. |
| **Rule** | The underline spans the full column, so both columns end on the same line. One property changes. | A full-width rule reads slightly more like a divider than an underlined link. |
| **Equal** | Four identical boxes — same width in a column and across both, same height. | Gives up the text link for an outlined box, narrowing the rank gap from filled-vs-link to filled-vs-outlined. |
| **Split** | One row, one baseline: primary flush left, link flush right. Row outer edges straight in both columns. | Most horizontal of the four; puts both ranks at equal optical height, flattening the hierarchy slightly. |

### The constraint that shapes all of them

"View Supply Chain Experience" is 283px of type. In the 4-up contact sheet a
column has about 290px of usable width, so any row that puts that label in a
box with real padding cannot fit on one line there.

`equal` and `split` are therefore gated behind container queries (1000px and
1180px of card) and fall back to `stack` below them — gated on the
**container**, never on `flex-wrap`. Wrapping is per-item: it would fold the
supply column and leave the AI column on one line, which is the exact
asymmetry this axis exists to remove. Both columns degrade together or neither
does.

The "Drafting rows" view in the lab renders on 1200px cards for this reason;
at the normal 4-up width all four would resolve to Stack.

### Two bugs found while building it

- `align-items: stretch` on Rule's row widened the **primary** to full column
  as well. Drafting's action row is a column flex, so the cross axis is
  horizontal. Only the secondary should stretch, and it now asks for itself
  with `align-self`.
- Equal's boxes came out 3px apart in height. Drafting's base row sets
  `align-items: flex-start` for its flex layout, and that property carries
  into grid where it governs the block axis — so `grid-auto-rows: 1fr` had
  nothing to show. `align-items: stretch` on the grid fixes it.

Both are the kind of thing that measures instantly and eyeballs as "fine".

## Recommendation

**Index**, with the Masthead switch on.

It is the only direction that can be argued purely on measurements: it fixes
every failing contrast row, un-dims the names, and gives each accent a defined
job — while adding no new decoration, no new surface and no new control
vocabulary. That makes it the cheapest to promote and the easiest to defend
against "why does the site look different now".

Letterpress is the stronger *composition* and the more distinctive page, and
if the goal is a section that feels authored rather than corrected, it is the
one to develop. It is a bigger change and should be treated as one.

Drafting is the most useful as a diagnostic: its button pair is the clearest
statement of primary-vs-secondary of the three, and that idea is portable into
either of the others without taking the cool paper with it.

---

## Verification

- `npx tsc --noEmit` — clean.
- `npm run check:assets` — clean.
- `npm run check:scale` — two pre-existing failures in `src/app/globals.css`
  (the perf probe); unmodified by this branch. The checker skips `-lab/` paths
  by design.
- Contrast measured in Chromium against the composited ground for every
  element in the table above.
- Hover verified to change colour, not only transform, in all three directions
  — so no affordance disappears under reduced motion.
- Under `prefers-reduced-motion: reduce`, zero elements inside `.cpp-screen`
  report a transition or animation. The lab also carries its own Force
  reduced motion switch.
- Checked at desktop and in the 390px container (the sheet's own container
  query, not a viewport approximation).
- No console errors on any stage.

## How to look at it

```
npm run dev
open http://localhost:3000/consulting-color-lab
```

Opens on the contact sheet — all four at once, which is the only way to
compare skins rather than remember them. The controls panel carries each
direction's argument and tradeoffs beside the thing itself.

## Files

| File | What |
|---|---|
| `src/app/consulting-color-lab/page.dev.tsx` | Route. No new fonts — House scheme only. |
| `src/components/consulting-color-lab/ConsultingColorLab.tsx` | Shell: axes + the written argument. |
| `src/components/consulting-color-lab/ConsultingColorStage.tsx` | One framed `.wt` stage. |
| `src/components/consulting-color-lab/ConsultingColorScreen.tsx` | Production markup + `data-treatment`. |
| `src/components/consulting-color-lab/consulting-color-lab.css` | Lab chrome + the three treatments. |
| `src/data/consultingColorLab.ts` | Treatment metadata, theses, tradeoffs, measured ratios. |
| `src/data/labsRegistry.ts` | Hub entry. |
| `src/data/site.ts` | `NON_PUBLIC_PREFIXES`. |

## If a direction is promoted

The merge is small and mechanical:

1. Move that treatment's block out of `consulting-color-lab.css` into
   `src/components/consulting-paths-lab/consulting-paths-lab.css` as a new
   axis value, then re-run `node scripts/extract-consulting-scheme.mjs` so the
   shipped `consulting-paths.css` is regenerated rather than hand-edited (it
   says so at the top of the file).
2. Delete `ConsultingColorScreen.tsx` — it exists only so production could stay
   untouched during the exploration.
3. The shared ramp and the un-dimmed names should go in **whichever** direction
   wins, including none of them: they are a defect fix on their own.
