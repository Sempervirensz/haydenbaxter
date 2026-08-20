# Consulting paths lab — `/consulting-paths-lab`

A redesign of **one panel**: the answer behind *Start a Consulting Project*.

Nothing in production imports anything from this folder. `WorkTogether.tsx`,
`WorkTogetherScreen.tsx`, `work-together.css`, and `workTogether.ts` are
untouched.

## The question

The live section answers the consulting choice with a single paper panel that
lists **AI Systems** and **Supply Chain** as two read-only blocks over one
generic *Discuss a project* button. Both disciplines are visible; neither is
actionable on its own, so the ask stays generic even when the visitor's need
is not.

This lab models the alternative: **two named paths, side by side**, each an
offer in its own right.

## The scheme

The lab boots on the combination chosen out of it, not on the control direction
it started from:

| Axis | Chosen | Resolves to |
| --- | --- | --- |
| Direction | **Tracklist** | the Work card's own CD track listing |
| Palette | **Cobalt & Brass** | `#2563eb` / `#d8b15a` — the site's own two, nothing new |
| Surface | **Paper** | the off-white sheet the destination screens ship on |
| Type | **Auto** | House — DM Serif Display · DM Sans · DM Mono |
| Buttons | **Auto** | CTA `cue`, top-bar chrome `rule` |
| Track style | **Player** | transport key leads, scrub line fills across the title |
| Play key | **Plain** | stubby solid wedge, no ring, no offset edge |
| Top bars | **Skinned** | the three choices follow the skin |
| Consulting answer | **Two paths** | the redesign, not production |

Width, Open screen and Motion are viewing settings, not part of the scheme.

Everything else stays in the panel. Dossier in particular is still there as the
control — it is what the shipped panel would look like with a second column, and
the argument for all of this is made against it.

## Five axes

| Axis | Options |
| --- | --- |
| **Direction** | Dossier · Ledger · Plate · Marquee · Blueprint · Tracklist |
| **Palette** | Cobalt & Brass · Graphite & Gold · Signal · Patina |
| **Surface** | Paper · Ink · Black · Glass |
| **Type** | House · Editorial · Technical · Press (each direction names its own) |
| **Buttons** | Tint · Candy · DYMO · Rule · Frosted · Slab · Solid · Outline · Pill · Offset · Gradient · Etched · Split · Stamp · Cue |
| **Top bars** | Skinned · Production |

The surface, palette and type sections of the CSS only ever set custom
properties; the direction and button sections only ever consume them. That is what makes the combinations viewable without hand-drawing
each one — and it is also the constraint that keeps a direction honest: one that
needs a hard-coded hex has stopped being a skin and become a fork.

`Width → All five` renders every direction at once, in the palette and surface
currently set, each with a path already expanded. Judging five skins by clicking
a radio button five times compares each one against your memory of the last.

### The five directions

- **Dossier** — the shipped panel's own vocabulary: two tinted cards, serif
  names, mono kickers, capability chips. The control the other four argue
  against.
- **Ledger** — no cards at all. Outlined index numerals, a hairline spine
  between the columns, leader-dot capability rows, CTAs as ruled text links.
  The quietest and most typographic; also the one that suffers most on a busy
  photograph, which is what the Surface axis is for.
- **Plate** — the DYMO system pushed forward. The kicker is a real embossed
  plate on a 1.2° rotation that straightens when the path opens, the
  capabilities are keycaps, and the CTA has a hard coloured edge that collapses
  under the press.
- **Marquee** — poster scale. A solid accent band over an oversized serif name,
  capabilities on one mono line, a solid accent CTA, and a two-column detail
  once the panel is wide enough to need one.
- **Blueprint** — spec sheet. Hairline grid, corner registration ticks,
  numbered capability rows, mono throughout, accent reduced to rules and
  numerals.
- **Tracklist** — the CD track listing the site already owns. Built from
  `.wl-c2__*` in `globals.css`, the listing beside the spinning disc on the Work
  landing card: a mono numeral gutter, DM Serif Display titles on a hairline,
  inactive rows dropped in opacity, the active one at full and stepped 4px
  right. Capabilities set as a run-on credits line the way a sleeve sets
  personnel, and the panel carries faint concentric grooves pressed in the
  path's own hue. Its CTA is **Cue** — a play glyph in its own ring.

  Its type is **House and stays House**: this is the direction arguing that the
  panel should sound like the rest of the site, so borrowing anyone else's face
  would be arguing the opposite.

  Three things it tried and dropped, recorded so they don't come back:

  - **Stacking the three top-level tracks at every width.** As a column on a
    desktop it read as a phone layout parked in the corner, and it cost the
    sheet about 150px that the liner notes and both path panels needed. The
    listing spans on desktop and stacks only under 700px.

  - Capabilities as numbered **index points** (`01.1`, `01.2`…) with a dotted
    leader out to the margin. Five capabilities are not five tracks inside a
    track — they are the credits block — and the leader led nowhere on purpose,
    because the only thing a sleeve prints there is a runtime and there is no
    true runtime to print. A leader to nothing reads as a rendering fault.
  - A **sleeve-flip** that hid the index points when a track opened, to buy the
    liner notes room. The credits line is about a hundred pixels shorter than
    five ruled rows, so it hands the room over without taking anything off the
    page, and the flip retired with the problem it solved.

### Making the three choices read as controls

The quiet directions took the listing idea too literally. Ledger, Blueprint and
especially Tracklist drew the three top-level choices as type on a hairline at
two-thirds opacity — faithful to `.wl-c2__item`, and wrong for the job. That
element is a passive contents list driven by scroll position; these three are
the only navigation in the section and the first thing anyone has to press. A
visitor who presses none of them never sees the consulting answer at all,
however good it is.

Every skinned row now carries a real affordance:

- **The chevron is a ring**, 30px, not a punctuation mark — and it fills with
  the path's hue on hover, focus, and while open. The directions that already
  fill their rows (Candy, Solid, Gradient, DYMO…) keep it as an outline: an
  accent fill on an accent plate is a hole.
- **Rest contrast comes up.** Production drops the unchosen rows to `0.45` the
  moment one opens — right for three candy plates where the open one is the
  subject, wrong for a row of controls, because at 45% over a photograph the
  other two stop looking pressable. They sit at 0.82–0.9 now, and the selected
  state is carried by the wash and the filled ring instead.

  That override takes seven classes:
  `.wt__rows:has(.wt__row.is-current) .wt__row:not(.is-current)` scores (0,5,0)
  — `:has()` and `:not()` take their argument's specificity — so a four-class
  override loses to it silently.
- **Tracklist's tracks became tabs**: horizontal padding gives the hover wash
  somewhere to live, the top corners round, and the shared rule caps them. The
  row stops being three words on a line and becomes an object with edges.

### Track style — six drawings of the three choices

`Track style` appears only when Direction is Tracklist, because only Tracklist
draws its choices this way. Same markup, same content, same interaction in all
six — the CTA row lab's model, applied to the CD direction:

| | |
| --- | --- |
| **Tabs** | Padded wash, rounded top corners, the shared rule capping them |
| **Card** | The whole choice is a tile — border, fill, a real lift on hover |
| **Rail** | A thick accent rail on the leading edge, growing as you approach |
| **Case** | A jewel case: double hairline frame, index in the corner |
| **Player** | Transport control leads, and a scrub line fills across the title |
| **Liner** | Type alone, with an accent rule sweeping in under the title |

All six share one transport control: the chevron the markup already carries is
zeroed and redrawn in CSS as a **play key**, which becomes a pause while that
track is open.

An earlier pass spun a conic sweep around the ring on hover. It is gone: the
ring closing and filling is already the whole signal, and a second thing moving
around it turned a control into an ornament.

The key is **drawn, not typed**. `▶` is a squat, near-equilateral glyph whose
proportions vary by font; a tape-deck transport key is a long shallow wedge, and
no character in DM Mono is that shape. It is 20 × 11 — close to 2 : 1 — and the
ring is transparent until you reach for it, because a permanent ring around a
permanent wedge is a web button, while a wedge that a ring closes around is a
transport control.

`Play key` offers four side by side:

- **Solid** — one colour, taken from the ring: grey at rest, inverting to the
  sheet's own white inside a filled ring.
- **Offset** — a cream key with the accent printed a hair off register down its
  flat edge, the way an old sleeve's second plate lands a fraction left of the
  first. Drawn with a `clip-path` over a two-stop gradient, because a border
  triangle is one solid colour by construction and this key needs two. The edge
  switches to the sheet's black once the ring fills — an accent edge on an
  accent ring is an edge you cannot see.
- **Short** — the same offset printing on a stubby 15 × 17 wedge, slightly
  taller than wide where the other two are a long 20 × 11. And nothing around
  it: no ring, no fill, no glow, in any state. Hover is the key itself
  brightening to white and stepping forward, which is all the feedback a mark
  this size needs, and it leaves the row's own wash to say "this one".
- **Plain** — Short with the offset edge dropped: one flat fill on the wedge and
  on both pause bars, no accent anywhere in the mark, so the only colour left in
  the row is the wash behind it.

An earlier pass drew an actual CD in the row — grooves, centre hole, label ring,
spinning up on hover. It was a picture of a CD rather than a button, and it is
gone; the disc language lives in the panel's grooves and in the play control.

**Sizing.** These inherited `.wl-c2__item`'s restraint wholesale — 17→26px titles
at 78% white — and on a 1600px card that is fine print on a photograph. Titles
now run to 36px at near-full brightness, the rows carry 18px of padding, and the
hit target went from roughly 330×90 to 330×120. Note that `cqw` is measured
against the stage and the lab's control panel takes ~500px of it: the clamp that
renders 24px in the lab renders 34px on a production card.

### Making the offer obvious

Three things were wrong with the pair at rest, and they were the same thing —
the panels read as editorial rather than as something you can buy:

1. **The engagements only existed once a path was expanded.** A visitor scanning
   the section saw two disciplines and no products: nothing to want, and no
   reason to press. Each path now names its two engagements up front —
   `detail.engagements[].title`, the same ones the panel opens onto — as an
   accent strip directly under the summary, above the quieter capability list.
   The hierarchy is now *products, then capabilities*.
2. **Nothing said the panel opened.** The only hint was a line of mono at
   `--text-label` that read as a caption. It is a control now: a pill with a
   ringed chevron that fills with the accent on hover, and the copy says what is
   behind it — "See what's included" rather than "More detail", which described
   the mechanism instead of the thing.
3. **Hover did almost nothing.** The whole panel now takes the accent wash, its
   border lifts, it rises 2px with a coloured shadow, the title turns accent and
   the two offer chips brighten a beat apart.

All of it is skeleton-level and token-driven, so every direction gets it — and
each direction restates it in its own language where the default would give the
direction away: Ledger's offers are type on a rule (it boxes nothing), Plate's
press like keycaps, Blueprint's are dashed, and Ledger's hover is its outlined
numeral coming up rather than a wash across type with no panel under it.

### Colour

Each palette declares, per path, the hue as an rgb triplet plus **two** inks —
one for light surfaces, one for dark. That split is not belt-and-braces:
`#2563eb` clears 4.5:1 on `#f5f4f1` and fails badly on black; gold does the
reverse. It is the same `--ctar-accent-ink` / `--ctar-accent-pap` split the CTA
row lab makes.

Cobalt & Brass is the site's own pair and introduces nothing new. Graphite &
Gold drops to one accent. Signal runs the same relationship hotter. Patina —
verdigris against rust — is a genuine departure and is labelled as one in the
panel.

### Buttons

Fourteen recipes. Five are ports from the CTA row lab's variant axis
(`src/components/cta-row-lab/`), which drew them in turn from `globals.css .tag`,
the Emerging Tech Builds bar, the personas cards, and the destination screens'
own paper — so a decision made here can be argued against one already made
there. The rest are new: Pill, Offset (a hard shadow in the path's hue that the
press knocks the button down into), Gradient, Etched (cut into the sheet rather
than sitting on it), Split (label and arrow in two cells), and Stamp (dashed,
rotated 1.5°, straightening on hover).

They are named **Frosted** and **Slab**, not Glass and Ink, because Glass and Ink
are Surface options: two identically labelled chips in one panel is a control
that cannot be operated — you press the one you meant and the other one moves.

`Slab` is built out of the sheet's own two extremes, so it inverts for free: a
black slab with paper type on Paper, a paper slab with black type on Ink, Black
and Glass.

Every recipe dresses the primary **and** the ghost. A recipe that only styles the
primary leaves the second button reading as a leftover.

### The three top-level bars

The bars read from the same five axes: the direction sets their metrics, type
and numerals, the surface sets what they are made of, the palette lights the
selected one, and the Buttons axis sets their chrome. Ledger draws them as type
on hairlines, Plate as DYMO labels on alternating rotations, Marquee at poster
scale in the display serif, Blueprint as a numbered legend in dashed hairlines.

**Nothing about them changes but the drawing.** The three labels, their order,
their ledes, `aria-expanded`, the `<button>` semantics and Consulting leading
are all untouched — there is a test in the lab notes that asserts the rendered
rows are byte-identical between the two modes. `Top bars → Production` puts them
back to the Emerging Tech Builds candy plates in one click.

On **Auto**, a direction picks its own bar chrome, which is not always the recipe
its CTA takes: Dossier's CTA is the shipped screen's quiet accent wash while its
bars are the candy plate the site actually ships above the sheet. Choosing a
recipe explicitly governs both. Tracklist takes this furthest: its bars stop
being three plates and become the record's three tracks — numeral, serif title,
hairline, recede — which is `.wl-c2__item` at row scale. On desktop they span
the frame as a spread, three titles hanging off one rule with their track
numbers above them; on a phone they fall into the column listing `.wl-c2__item`
actually is, numeral in a gutter beside the title. All of it is scoped under
`.cpl-stage[data-rows="skin"]`, so `work-together.css` is untouched and
production keeps rendering exactly what it renders today.

Two failures worth recording, because both are the same shape — a recipe
repainting the bar's REST state ties on specificity with the base SELECTED state
and wins on source order:

- Candy left the chosen bar on its near-white plate while the label had already
  gone white. Unreadable, and it was the default view.
- Stamp's lifted accent ink measured 2.51:1 on its own 16% wash — the only
  selected state in the set that failed. It takes white now; the hue stays in
  the dashed border where that recipe actually carries it.

Every recipe that repaints `.wt__row` must repaint `.is-current` too.

### One skin across all three tabs

*Explore WorldPulse* and *Review My Experience* are drawn by
`ConsultingPathsSoloScreen` — the consulting sheet with one panel instead of two,
reusing the same class names so every direction's chrome reaches them without a
line written for them. Their **information architecture is production's,
unchanged**: same eyebrow, headline, lede, the same two titled blocks with the
same items, the same credential strip, note, and two actions. Only what the axes
control changes.

Without this, switching to Ink or Blueprint produced a section with two design
systems in it — pick a tab and the sheet, type, borders and buttons all changed
underneath you. `Consulting answer → Production` puts every screen back to
exactly what ships, which is what keeps the A/B fair.

WorldPulse takes the palette's systems hue and Experience takes the supply-chain
one. Arbitrary but consistent, and one line to flip: a third neutral accent was
worse, because it made the palette look like it had three members when the whole
argument of the pair is that it has two.

## What stays exactly as it shipped

- The three top-level choices — *Start a Consulting Project*, *Explore
  WorldPulse*, *Review My Experience* — in the same order, the same candy-bar
  plate, the same Cobalt Select behaviour.
- The WorldPulse and Experience screens: the production `WorkTogetherScreen`,
  imported unchanged.
- The composition: photograph, grain, scrim, the serif headline in the sky.

The lab's **Consulting answer** toggle switches only the consulting panel
between the two paths and today's production screen, so the A/B is a fair one.

## The interaction

Selecting a path **expands it upward**. The pair is anchored to the floor of
the sheet and each panel's detail block sits *above* its base block, so the
name, the summary and the CTA hold their exact position while the panel grows
into the space over them. Nothing is replaced and nothing navigates: the other
path stays legible at 0.72 opacity, one click away.

Mechanically:

- `grid-template-rows: 0fr → 1fr` reveals the detail at its real height with no
  measurement and no scroll handler.
- The sheet is content-sized at rest and claims the frame on open, animated as
  `min-height` (`align-self` cannot tween).
- A height budget derived from the frame — `grid-auto-rows: minmax(0, 1fr)` on
  the pair, `max-height: 100%` on the panel, `min-height: 0` on the reveal —
  guarantees the detail is the only thing that can give. It scrolls inside
  itself rather than pushing the CTA off the card.
- The bottom of a scrolling detail block fades, and only while there is
  something below it (measured on open and on scroll).

**Stacked (`@container wt (max-width: 700px)`) the detail opens downward
instead.** "Upward" is a property of a pair anchored to the floor of a fixed
card; on a phone the sheet is a scrolling column, and expanding upward pushed
the panel's own name and buttons off the top of the frame. `column-reverse`
keeps the identity and the ask on screen and lets the detail flow into the
scroll. The chevron follows the direction the panel actually opens.

## Accessibility

- Each path head is a `<button>` with `aria-expanded` and `aria-controls`; the
  reveal carries no focusable content, so collapsing it cannot strand focus.
- Escape collapses an expanded path first, then leaves the consulting screen.
- Focus rings are drawn in the path's own hue; both inks clear 4.5:1 on the
  `#f5f4f1` paper.
- Every transition here is inside `.wt`, so production's reduced-motion block
  already switches all of it off; the lab's own toggle mirrors it for machines
  without the OS setting on.

## Files

| File | Owns |
| --- | --- |
| `src/app/consulting-paths-lab/page.tsx` | the route |
| `ConsultingPathsLab.tsx` | shell, settings, flow state |
| `ConsultingPathsStage.tsx` | a copy of the production composition with one screen swapped |
| `ConsultingPathsScreen.tsx` | the two-path answer |
| `consulting-paths-lab.css` | lab chrome (`.cpl-`), the token layers, the five directions, the eight CTA recipes |
| `src/data/consultingPathsLab.ts` | copy (every line sourced inline) + the axis definitions |
| `src/app/consulting-paths-lab/page.tsx` | the three lab-only fonts |

## Fonts

House is DM Serif Display / DM Sans / DM Mono — exactly what `app/layout.tsx`
loads for the site. Editorial (Instrument Serif), Technical (Space Grotesk) and
Press (Fraunces) are loaded **only** by this route. Promoting one of them is a
decision about the whole site, not about this panel.

## If this ships

The merge is small: give `WorkTogether` an optional screen-renderer prop, move
`.cpp-` into `work-together.css`, fold the copy into `workTogether.ts`, and
delete `ConsultingPathsStage.tsx` — it exists only because production had to
stay untouched while this was being judged.

Open questions worth a decision first:

1. **Two CTAs or one.** Two identical *Discuss a project* buttons pointing at
   the same Calendly link is honest about the paths but repetitive on the
   sheet. A per-path Calendly event type would make the duplication earn its
   place.
2. **The void beside an expanded panel.** Bottom-aligning two columns of
   unequal height leaves white paper above the collapsed one. It reads as
   generous here; on a taller production card it will be larger.
