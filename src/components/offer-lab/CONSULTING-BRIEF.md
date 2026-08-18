# The Consulting offer page — context and current work

A short brief for anyone (human or model) picking this up cold. Pairs with
`CONSULTING-CODE-HANDOFF.md`, which carries the actual implementation.

Sibling docs: `DECISION.md` (why the offers are routes — settled),
`ART-DIRECTION-BRIEF.md` (the original commission).

---

## Context

**What it is.** One of three offer pages — Consulting, WorldPulse, Experience —
each a real route at `/offer-lab/[offer]`. You reach them from a CTA row at the
end of the Work section: three near-white "candy bar" buttons over a night
photograph of a winged-victory statue. That row is **live in production**.

**Why pages and not panels.** Settled in `DECISION.md` and not reopened. The
offers needed URLs — an offer you cannot link, share, bookmark or index is a
business-development gap, not a styling one. Being pages also removed nested
scrolling and the 22px blur the old in-card panel needed in order to be
readable over the photograph.

**The site's rules.** Dark-only. Gold `#d8b15a` is the single accent; `#2563eb`
is what the destination screens use. On dark, blue lifts to `#7aa2ff` to clear
contrast; on paper, gold darkens to `#8a6a1f`. Paper (`#f5f4f1` / `#111116`) is
a *surface the site already owns*, not a light theme. Mono labels at
`--track-dymo`, editorial serif headings, clean sans body.

---

## The problem

Structurally correct, visually inert:

1. **No imagery** — the site's strongest asset (the photography) was thrown away.
2. **No motion** — the site has grounded scroll-driven motion; these had none.
3. **One tonal value** top to bottom, one accent, no rhythm.
4. **No movements** — one continuous column, no beats.
5. **None of the signature furniture** — no DYMO plates, no candy bars.
6. **It did not continue the door it came through.** You press a near-white bar
   over a photograph and land somewhere with none of that vocabulary.

**Second problem.** The three offers are not parallel, but one template
pretended they were. Consulting is a *service* (scope, method, how to start).
WorldPulse is a *venture* (positioning, audience, what conversation is open).
Experience is a *credential* (record, proof). Forcing three jobs through one
shape is why every layout compromised somewhere.

---

## What changed

### 1. Six art directions (`direction` axis)

Switchable in the lab, each leading with a different asset, each with a stated
**cost** alongside what it buys:

| | Leads with | Cost |
| --- | --- | --- |
| **Cinematic** | The photograph | Spends Consulting's plate on all three offers; heavy asset |
| **Chaptered** | Scroll movements + rail | Real machinery; thin chapters if content is short |
| **Alternating** | Dark/paper surface rhythm | Accent inverts mid-scroll; two token sets in one page |
| **Furniture** | DYMO plates + candy bars | The bar is a *control* elsewhere — false affordance risk |
| **Broadsheet** | Editorial typography | Desktop-only character; collapses below 760px |
| **Baseline** | — (the control) | It is the thing being replaced |

### 2. Per-offer templates (`template` axis)

Section order and emphasis now follow the job. **No copy was rewritten** — the
same material from `src/data/workTogether.ts`, rearranged:

- **Service** (Consulting): the `note` is literally a method statement, so it is
  promoted to a *How it works* movement; `signals` are literally engagement
  names (AI Roadmap Sprint, MVP Prototype Sprint), so they become *Engagements*.
- **Venture** (WorldPulse): block 2 is already titled "Conversations open now" —
  an audience list, not a second capability list — so it is promoted to *Who
  this is for*.
- **Credential** (Experience): `signals` are Nike, Disney, Aosom, fluent
  Mandarin, an M.S. in AI. That is proof, and proof leads for a credential, so
  the strip moves *above* the blocks.

A `uniform` mode forces all three through the service shape, so the old
compromise stays visible rather than becoming invisible by being fixed.

### 3. Expanded arrival (`chrome` axis) — the chosen direction

Cinematic was selected, then refined so the page reads as the Work chapter
**continuing** rather than as a separate document:

- The photograph carries over from the card you pressed in.
- The three choice bars ride at the top of the plate, with the pressed one
  filled cobalt.
- The offer unfurls downward from that row.
- The sticky back bar and the "also worth a look" footer are **gone** — the row
  is the navigation, so switching offers is sideways movement, not backtracking.

Two deliberate departures from the homepage's own behaviour:

- **Unchosen bars set back to 0.9, not the homepage's 0.45.** There, a panel has
  opened below and is the focus. Here the row *is* the navigation and there is
  no footer repeating it — at 0.45 over a near-black sky the bars stopped
  reading as near-white plates and looked disabled.
- **The current bar is a `<span aria-current="page">`, not a link.** Navigating
  to the page you are already on is a dead control.

`chrome=standalone` keeps the old shell switchable for comparison.

---

## Hard constraints (still in force)

- **Do not touch the live homepage.** `src/app/page.tsx`, `WorkTogether.tsx`,
  `work-together.css`. Borrow their vocabulary; never edit them. The travelling
  row is **copied** from `.wt__row`, not imported.
- Labs only, under `/offer-lab` and `/cta-lab`.
- All copy from `src/data/workTogether.ts` via `src/data/offerLab.ts`. Invent none.
- Dark-only. No new brand colour.
- Respect `prefers-reduced-motion`; keyboard access and visible focus.

---

## Traps that have already cost time here

1. **A container query never matches the element that establishes the
   container.** `container-type` goes on `.ofd-shell` / `.ofr-shell`, never on
   the element the queries style. Fails silently.
2. **A missing stylesheet does not error** — it renders naked markup while every
   structural test passes. Import CSS on the component that needs it and assert
   *computed styles*.
3. **`backdrop-filter` costs sharpness even at `blur(0px)`.** Omit it until
   there is something to blur for. One was found declared over an *opaque*
   background — pure cost, zero effect.
4. **`animation-fill-mode: both` pins the end state** and kills hover/press. Use
   `backwards`, and make the base style the final state.
5. **`ch` resolves against the element's own font-size.** A measure set on a
   wrapper while the display size lives on its child silently produces a column
   a third of the intended width.
6. **One writer on `.next` only.** A second `next dev` on the same folder gives
   `ENOENT .next/server/app/**/page.js`, routes flapping 200/404/500, and an
   empty `page.css` — which looks exactly like trap 2 and is not. A hard reload
   does not fix it.

---

## Where it stands

Built and verified: 39 automated checks green across 1440 / 768 / 390, three
offers, six directions. Homepage confirmed untouched by computed style (zero
`.ofr`/`.ofd`, exactly one `.wt`, three bars, no cobalt at rest).

**Open decisions:**

- The statue now appears on all three offer pages, so an association that was
  Consulting's is being spent three times. Decide: whole-chapter identity, or a
  different frame per offer.
- `/cta-lab/in-site` renders a near-copy of the shipped row (`.ctar-btn`, `→`)
  rather than the shipped component (`.wt__row`, `›`), because closing that gap
  means teaching the production `WorkTogether` to accept `offerHref`.

**To see it:** `/cta-lab/in-site` → scroll to chapter 04 → press a bar. Or
`/offer-lab/consulting?direction=cinematic&chrome=expanded`. All six side by
side at `/offer-lab/directions`.

---

## File map

| Path | Role |
| --- | --- |
| `src/data/workTogether.ts` | Production copy. The only source of words. |
| `src/data/offerLab.ts` | Re-exports copy + the layout/surface rosters. |
| `src/data/offerDirections.ts` | Directions, per-offer templates, chrome axis. |
| `src/components/offer-lab/directions/OfferDirectionScreen.tsx` | Renders movements per template. |
| `src/components/offer-lab/directions/offer-directions.css` | All six direction skins. |
| `src/components/offer-lab/OfferChoiceRow.tsx` | The travelling row (copied from `.wt__row`). |
| `src/components/offer-lab/offer-expanded.css` | The expanded arrival. |
| `src/components/offer-lab/OfferPage.tsx` | Page shell; picks expanded vs standalone. |
| `src/components/offer-lab/OfferRouteClient.tsx` | Reads every axis from the query string. |
| `src/components/offer-lab/DirectionsCompare.tsx` | `/offer-lab/directions` comparison. |
