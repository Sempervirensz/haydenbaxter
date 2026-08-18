# CTA row lab — `/cta-lab`

The "Let's work together" section with its three choices already on screen,
in five iterations × two accents, wired to the real destination screens.

The live section opens on the headline alone; the three paths only exist once
you press it. This keeps the whole composition — the same cityscape, the same
serif headline low in the frame, the same grain and vignette — and puts the
choices underneath the headline as a small button row from the first frame.

```bash
npm run dev
```

Then open <http://localhost:3000/cta-lab>.

The three-concept interaction explorer that used to hold this path is unchanged
at [`/cta-lab/concepts`](../cta-lab/README.md).

> **If clicks appear to do nothing**, check that only one `next dev` is running
> against this folder. Two dev servers share `.next` and the symptom is exactly
> this: the page serves, every chunk returns 200, React never hydrates, and
> every `onClick` silently no-ops. See trap 3 in `AGENTS.md`.

---

## The iterations

All five render through one `CtaRowStage`. `data-variant` on `.ctar` changes
**only how a button is drawn** — the markup, the copy, the links, the layout
and the motion are identical across all five, which is what makes them
comparable rather than five different sections.

| | Iteration | What it is |
| --- | --- | --- |
| A | **ETB** *(default)* | The Emerging Tech Builds candy bar — see below. |
| B | **DYMO** | The label plate from the header nav and the connect row — mono, `--track-dymo`, `#1c1c1c`, deep inset emboss over a hard `0 3px 0 #0b0b0b` edge that collapses under a press. Primary ranked by accent ink on the lighter `.tag--cta` plate. Tilted 1.2° / 0.9° / 0.5°. |
| C | **Rule** | Type on a hairline, no plates. Primary marked by a 2px accent rule against the others' 1px white. |
| D | **Glass** | Frosted pills, hairline borders, the city readable through them. Accent hairline and accent ink on the primary. |
| E | **Editorial** | Paper fill on the primary, glass ghosts behind it. The accent appears only to mark the open one. |

### A · ETB — mirroring `/emerging-tech-builds`

Built against the real `.etb-bar` in `work-details.css`. These are verified
identical by computed style, not by eye:

| | |
| --- | --- |
| Surface | `linear-gradient(180deg, #fefefe, #f6f5f2)` |
| Radius | `14px` |
| Border | `rgba(255,255,255,0.28)` |
| Shadow | white inset top, dark inset bottom, `0 4px 16px rgba(0,0,0,.45)`, `0 1px 3px rgba(0,0,0,.3)` |
| Name | DM Mono, uppercase, `--track-dymo`, `#111116` |
| Summary | DM Mono, `rgba(17,17,22,0.62)`, 1-line clamp |

Plus the `›` chevron, the 105° sheen that wipes across on hover, and **Cobalt
Select** — the `#2563eb → #1d4ed8` fill — on hover and focus. Opening a bar
dims the other two to `opacity: 0.45 / saturate(0.8)`, the same recipe
`.etb-barStack.has-expanded` uses.

**Consulting is ranked by being already selected** — cobalt at rest. In a
language whose entire selection signal is the blue fill, that is the most
native way to say "this one."

Three deliberate departures from the source, all forced by the brief:

1. **A row, not a vertical stack.** The stack is the builds page's own layout;
   the brief here is one row on desktop. The surface, type and states carry the
   resemblance. Stacked on narrow, it becomes the bar stack for real.
2. **Type is `--text-control`, not `--text-base`.** `--track-dymo` is an `em`
   value, so the tracking *ratio* is identical but resolves to 2.73px against
   the real bar's 3.50px. At `--text-base` a single label runs ~700px and three
   cannot share a row — the size is what had to give.
3. **The fill follows the accent axis** rather than being hard-wired cobalt, so
   the same bar can be judged in gold. Blue is its native state, and those
   values are `.etb-bar`'s verbatim.

It is the only iteration whose buttons are not small: the summary line is what
makes an ETB bar an ETB bar.

Each one's verdict — what it costs and what it buys — is in the lab panel and
in `src/data/ctaRowLab.ts`.

### Accent

A second axis, independent of the skin, so a shape and a colour can be judged
separately rather than as eight fixed combinations.

| | Value | Where it comes from |
| --- | --- | --- |
| **Blue** *(default)* | `#2563eb` | What the destination screen **already** uses for its block labels, list bullets and primary action — so this is the option that matches the screens the row opens into. |
| **Gold** | `#d8b15a` | The site's single accent. |

Each needs three values, not one, because the same hue has to work as ink on a
near-black photograph *and* as ink on the screen's `#f5f4f1` paper:

- `--ctar-accent` — the true brand value. Borders, fills, non-text.
- `--ctar-accent-ink` — lifted until it clears as **text on dark**. `#2563eb`
  on near-black is about 3.5:1 and fails, so blue lifts to `#7aa2ff`; gold
  already clears and is unchanged.
- `--ctar-accent-pap` — darkened until it clears as **text on paper**.
  `#d8b15a` on `#f5f4f1` is about 1.9:1, so gold darkens to `#8a6a1f` — the
  value personas-lab landed on for exactly this problem.

Gold also retints the screen's own accented parts, scoped to the lab. Without
that you get a gold row on top of a blue panel, which is the mismatch this axis
exists to let you see. The production screen is untouched.

**Nothing here invents brand vocabulary.** The DYMO emboss is lifted from
`globals.css` `.tag`, the gold is `#d8b15a` (the site's single accent — the
privacy links, the footer focus ring, the personas cards and the 404 all use
it), the paper/ink pair is `--wt-paper` / `--wt-ink` from the destination
screens, and the white ramp is `--ink-body` / `--ink-muted` / `--ink-faint`
from `scale.css`.

---

## The flow

It is wired to the real screens. Each button opens the production
`WorkTogetherScreen`, imported unchanged — this lab is judging the way in, not
rewriting what it opens onto. Copy, links and structure are the live
section's, re-exported through `src/data/ctaRowLab.ts` from
`src/data/workTogether.ts` so the prototype can't drift from what ships.

**The interaction model differs from the live section on purpose:**

| | Live section | This lab |
| --- | --- | --- |
| At rest | The headline alone | The headline **and** the three choices |
| Choosing a path | The other two dismiss; the chosen row becomes the header | All three stay put; the screen opens underneath |
| Switching paths | Back, then forward | One click |

Keeping the row is what makes the premise — the choices are always visible —
true *after* the first click instead of only before it. The row becomes
persistent navigation: the current button is marked with the accent, its arrow
flips to `↑`, and pressing it again closes the screen.

When a screen opens, the serif headline demotes to a mono eyebrow to hand its
~90px to the panel, and the city pushes back to a 22px blur — the same trade
the live section makes at its `destination` level.

Consulting is the primary because it is the one path that is a direct
commercial ask, and the live section already ranks it `01` — the row makes the
existing hierarchy visual rather than asserting a new one.

---

## Lab panel

Bottom-right, collapsible, deliberately not in the portfolio's visual language
so it never reads as part of the composition being judged. Same shape as the
sibling lab's panel.

- **Iteration** — A / B / C / D / E, each with its one-line description
- **Accent** — Blue · Gold, applied to the row *and* the screen it opens
- **Viewport** — Desktop · Narrow (390px) · Both, side by side
- **Motion** — force reduced motion, plus a live readout of the OS preference
- **Verdict** — why the selected iteration holds up, and what it costs

Viewport switching is real, not a mock: `.ctar` is a size container and every
layout rule is a `@container` query, so the 390px frame behaves exactly as a
phone does.

Which screen is open is owned by the shell, not by a stage — so **Both** shows
one state at two widths rather than two independent ones, and the open screen
survives a viewport switch (changing the mode unmounts a stage, which would
otherwise drop it).

---

## Design

The photograph stays essentially sharp. With no interaction to move away from
there is no reason to push the city back — the live section's own `intro` level
sits at 0px blur for the same reason — so legibility comes from a scrim under
the copy block instead and the top of the frame stays photograph.

### States

| State | What happens |
| --- | --- |
| Rest | Per variant — see the table above. |
| Hover / focus | 1px lift and a colour shift, plus the primary's arrow sliding 4px. Two exceptions, both matching their source: the DYMO plate does **not** lift, because the nav and connect rows deliberately dropped the hover lift and a plate rising off its own hard edge reads as a sticker peeling; and the ETB bar does not lift either — it fills cobalt and runs its sheen instead. |
| Pressed | 1px down at 60ms. DYMO instead collapses its 3px hard edge and sinks 2px — the whole point of the plate. |
| Focus-visible | The section's white ring at 3px offset. DYMO uses the nav's thinner `1px rgba(255,255,255,0.32)`; Editorial's primary adds a dark halo so the ring clears its own paper fill. |

Entrance is a 9px rise staggered 70ms per button, `backwards` fill so the
finished animation doesn't pin a transform and deaden hover and press. The
rotation is carried through the keyframes on `--btn-rot` — a keyframe setting
`translateY` alone would drop the DYMO tilt for the length of the animation and
snap it back at the end.

### Layout

`.ctar` is a size container and every rule is a `@container` query, so the
layout follows the composition's width, not the viewport's:

- **≥700px** — one row, buttons at their intrinsic width.
- **<700px** — stacked full width in the same order, labels allowed to wrap.
  Two variant-specific corrections here, both cases where a desktop-correct
  declaration inverts when the row becomes a column:
  - The DYMO tilt is zeroed — a tilted plate at full width overhangs its own
    column and clips against the card's rounded edge.
  - ETB bars drop to `flex: 0 0 auto`. `flex: 1 1 0` distributes *width* across
    the row, which is what `.etb-bar` does; stacked, that same declaration
    distributes *height*, and with a screen open the copy block is
    height-constrained — so the bars were squeezed to a fraction of their
    content and `overflow: hidden` silently clipped the labels.
- **≥1600px / ≥2400px** — the copy caps to `--shell-consulting` and the
  headline steps up, matching `work-together.css`'s large-display tiers.

Between roughly 700px and 950px the row *wraps* (2 + 1) rather than stacking —
`flex-wrap: wrap` is deliberate so nothing ever overflows the card. The two
contractual states, one row on desktop and a stack on mobile, both hold.

`.ctar` is a size container named **`ctar wt`**, and the second name is
load-bearing. `.wt-screen`'s own narrow and large-display rules in
`work-together.css` are `@container wt (...)` queries; without that name they
never match, and the screen silently keeps its two-column blocks and loses its
sticky action bar inside the 390px frame. The stage also has to declare
`--wt-paper`, `--wt-ink` and `--wt-ease` itself — that CSS is scoped under
`.wt`, which this stage is not, so the panel would otherwise render with an
invalid `background: var(--wt-paper)`, i.e. transparent.

### Accessibility

- The three choices are `<button>`s carrying `aria-expanded`, since they now
  disclose a panel rather than navigate away. The screen's own actions
  (Calendly, worldxpulse.com, the resume mailto) are still real links.
- Focus moves into the screen's **Back to options** when one opens, and back to
  the button that opened it when it closes — otherwise closing drops focus to
  `<body>` and a keyboard user loses their place in the row.
- Escape closes the screen, and only the focusable stage listens, so one
  keypress doesn't close both frames in a side-by-side compare.
- The row is a `<nav>` labelled by the "Three ways in" line above it.
- Each link carries its path's supporting line off-screen, plus "Opens in a new
  tab" where that applies, so the accessible name says more than the visible
  label without making the buttons bigger.
- In a side-by-side compare only the desktop stage is tabbable, so there is one
  tab sequence rather than two interleaved ones.
- The entrance is the only tween that moves anything, and both
  `prefers-reduced-motion: reduce` and the lab's own toggle remove it — the row
  is simply already there.

---

## Files

```
src/app/cta-lab/page.tsx                   route (noindex)
src/data/ctaRowLab.ts                      workTogether.ts re-export + variants
src/components/cta-row-lab/
  CtaRowLab.tsx                            shell — owns settings + which screen
  CtaRowStage.tsx                          the composition, one per width
  CtaRowControls.tsx                       experiment panel
  cta-row-lab.css                          all styling, scoped .ctar- / .ctarl-
```

Reused rather than copied, all unmodified: `WorkTogetherScreen` is the
production destination panel; `.cns-stage__img` and `.cns-stage__vignette` come
from `src/components/work/work-together.css` so the photograph gets exactly the
production treatment; `usePrefersReducedMotion` comes from the sibling lab.

Nothing on the live homepage imports any of this, and no production file was
changed.
