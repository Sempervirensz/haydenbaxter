# CTA Interaction Lab

An isolated playground for the final-section CTA. It reproduces enough of the
production Consulting card to judge the interaction honestly, then branches
**LET'S WORK TOGETHER** into the three things a visitor could actually want.

**Concept A (Rail) shipped.** The production Work section now renders it at both
breakpoints — `ConsultingHeroStage` (desktop) and `MobileConsultingCard`
(mobile) both mount `src/components/work/WorkTogether.tsx`. B and C stay here
for comparison and have not been deleted.

---

## Run it

```bash
npm run dev
```

Then open <http://localhost:3000/cta-lab>.

The lab is noindexed, listed under **Consulting** in `/admin/labs`, and skips
the site splash.

> **If clicks appear to do nothing**, check that only one `next dev` is running
> against this folder. Two dev servers share `.next` and the symptom is exactly
> this: the page serves, every chunk returns 200, React never hydrates, and
> every `onClick` silently no-ops. See trap 3 in `AGENTS.md`.

---

## The information architecture

The section answers exactly three reasons someone arrives here. They are stated
as actions, not as business categories, and nothing sits underneath a parent
term like "Advisory & Partnerships":

| | Path | Supporting idea |
| --- | --- | --- |
| 01 | **Start a Consulting Project** | AI systems and supply-chain strategy. |
| 02 | **Explore WorldPulse** | Pilots, partnerships, customers, and investment conversations. |
| 03 | **Review My Experience** | Resume, leadership background, and selected work. |

Each one resolves into **one complete screen**. There are no tabs, no capability
menus, and no second decision layer anywhere past the opening screen — the
visitor makes one choice and gets the whole answer.

- **Consulting** shows *AI Systems* and *Supply Chain* side by side, always both
  visible. Nobody has to pick a discipline before they can understand the offer
  or get in touch. Ends on **Discuss a project**, with **Send an email** as a
  restrained second option.
- **WorldPulse** stands alone as an active venture, not a consulting capability.
  It names the five conversations that are open — customers, pilot partners,
  strategic collaborators, commercial partners, investors — and ends on
  **Explore WorldPulse** / **Discuss a partnership**. No traction, customers,
  funding, or results are claimed, because the repo contains none.
- **Experience** is one founder-led overview: leadership on the left, selected
  work on the right, a credential strip (Nike · Disney · Aosom · Mandarin ·
  M.S. AI in Business), ending on the resume with LinkedIn beside it.

---

## Interaction states

One reducer drives all three concepts — `useCtaFlow.ts`. Two levels, and the
second is terminal:

| Step | What's on screen |
| --- | --- |
| `intro` | The CTA, alone |
| `paths` | The three paths |
| `destination` | One complete screen. Nothing branches out of it. |

`{ step, path }` is the whole model. `back` steps up exactly one level, so Back
and Escape mean the same thing everywhere, and there is exactly **one** back
control at each level: the stage pill at `paths`, and **Back to options** inside
the screen at `destination` (the stage pill stands down rather than doubling it).

Concepts differ only in how a level is *rendered*, which is what makes them
comparable. There are no ad-hoc class toggles: layout is driven by `data-step`
and `data-motion` on `.ctal-stage`, nothing else.

---

## Where each iteration stands

### A · Rail — **shipped.**

The CTA is a serif headline low in the frame. Pressing it demotes the headline
to a mono eyebrow and three full-width rows rise in, staggered — an index, not a
menu. Choosing a row slides the other two out, pins the chosen row under the
eyebrow as the live header of what follows (its chevron flips to `↑`), and
unfurls the screen in place beneath it.

Why it wins:

- **The storytelling model is literal.** The row you pressed becomes the header
  of the screen you're reading. Nothing arrives from off-screen.
- **The three paths are legible before any motion runs** — it reads correctly
  as a static index, so reduced motion costs it nothing.
- **Narrow is a consequence, not a patch.** A vertical list is already the right
  shape on a phone; the rows just tighten.
- **It leaves the most room for the screen**, because the pinned row is a single
  line of type rather than a plate.

On narrow the screen scrolls with the action bar stuck to its bottom, so the one
next step is always reachable without hunting for it.

**Production note.** `WorkTogether` takes the photo as a `media` prop and renders
it inside itself rather than letting the host paint it behind. `.wt` is the
backdrop root for the blur ladder, so a host-owned photo sits outside what
`backdrop-filter` can sample — the dim still lands and the blur silently does
nothing, which reads as "too dark" rather than as a bug. This was caught during
promotion; keep the plate inside `.wt`.

### B · Split — **updated, kept for comparison.**

The DYMO plate reads `LET'S / WORK / TOGETHER` across two hairline seams.
Pressing it splits the plate three ways; the middle line of each segment
crossfades into a path label while index and supporting lines unfold above and
below. The same three DOM nodes carry the label from `intro` through to the
header of the destination, so the branch is unmistakably caused by the click.

Kept because it owns the tactile DYMO entry better than anything else here, and
that entry is worth stealing. Not the recommendation because past that first
beat it does the same job as Rail with less room: the header ribbon is a
three-line plate competing with the screen for vertical space, and stacking
three wide plates on narrow softens the "split" that justifies the concept.

### C · Fold — **updated, likely removal candidate.**

Reworked from a two-leaf hinge into a trifold: the middle leaf settles flat and
the outer two swing open from the seams that touch it. Choosing a leaf lets it
become the screen; the other two fold away behind.

It is the most cinematic of the three, and it's the one to cut. The entire idea
*is* the fold, and reduced motion has to flatten it — at which point it's three
plain plates in a column and the concept has nothing left. Betting the section's
signature moment on an effect a meaningful slice of visitors never see is the
wrong trade for a CTA that has to convert.

**Nothing has been deleted.** All three remain in the switcher, all three carry
the new three-path IA, and the lab panel shows each one's status inline.

---

## Redundancy

Rail and Split converge once a path is chosen — same screen, same shared-element
premise, different chrome. If one is dropped for redundancy it should be Split,
not Rail. Fold is the weakest independent of that overlap, for the reduced-motion
reason above.

The suggested end state is **Rail's structure with Split's plate as the entry
gesture**: the DYMO plate splits into the three row headers, then hands off to
the editorial rail. That keeps the handcrafted button language at the moment of
decision and the editorial restraint everywhere after it.

---

## Lab panel

Bottom-right, collapsible, deliberately not in the portfolio's visual language
so it never reads as part of the composition being judged.

- **Concept** — A / B / C with each one's status shown inline (switching resets
  the flow)
- **Viewport** — Desktop · Narrow (390px) · Both, side by side against one
  shared flow state
- **Section label** — `Consulting` vs `Work Together`
- **Motion** — force reduced motion, plus a readout of the OS preference
- **Flow** — live state readout, back-one-level, reset
- **Verdict** — why the selected concept holds its status

Viewport switching is real, not a mock: `.ctal-stage` is a size container and
every layout rule is a `@container` query, so the 390px frame behaves exactly
as a phone does.

---

## Content

All copy lives in `src/data/workTogether.ts` — the production source, which the
live section renders. `src/data/ctaLab.ts` re-exports it and adds only lab-only
things (the concept roster, the split segments, the section-label toggle), so the
lab and the site can't drift. The source of each fact is noted inline. Nothing is invented — everything traces to `consultingOffers.ts`,
`work.ts`, `about.ts`, `siteContent.ts`, or `connect.ts`.

Positioning guardrails: Hayden is a founder running WorldPulse who takes
selective consulting work. The Experience screen presents **background and
record**, never availability, and there is no "hire me" / "open to work" /
"looking for a job" / "available for employment" language anywhere.

**No resume asset exists in `public/`** — `git ls-files` has no PDF anywhere in
the repo — so the Experience screen's primary action is **Request the resume**
(a pre-subjected mailto) rather than a link that would 404. This is live in
production in that state. Commit the document under `public/` and set
`RESUME_HREF` in `src/data/workTogether.ts`; the action becomes **View resume**
automatically, with no other change.

---

## Files

```
src/app/cta-lab/page.tsx                  route (noindex)
src/data/ctaLab.ts                        three paths, three destinations, copy
src/components/cta-lab/
  CtaLab.tsx                              shell — owns settings + one flow
  useCtaFlow.ts                           the state machine
  usePrefersReducedMotion.ts              OS preference, live
  StageFrame.tsx                          environment: bg, blur, vignette,
                                          grain, section header, back, Escape
  Destination.tsx                         the one complete screen, shared
  LabControls.tsx                         experiment panel
  concepts/RailConcept.tsx                A — recommended
  concepts/SplitConcept.tsx               B — comparison
  concepts/FoldConcept.tsx                C — likely removal
  concepts/types.ts                       shared concept props
  cta-lab.css                             all styling, scoped .ctal-
```

`DetailPanel.tsx` was removed — it was the tabbed panel, and tabs are exactly
what the rework deletes. `Destination.tsx` replaces it.

Production files the promotion touched:

```
src/data/workTogether.ts                  the three paths + destinations (live)
src/components/work/WorkTogether.tsx      the interaction, both breakpoints
src/components/work/WorkTogetherScreen.tsx  the destination screen
src/components/work/work-together.css     all styling, scoped .wt- / .wt-screen-
src/components/work/ConsultingHeroStage.tsx        desktop host
src/components/work/mobile/MobileConsultingCard.tsx  mobile host
```

Three further files were touched for lab registration only:
`src/components/Splash.tsx` (`/cta-lab` in `NO_SPLASH_ROUTES`),
`src/data/site.ts` (`NON_PUBLIC_PREFIXES`), `src/data/labsRegistry.ts`
(the `/admin/labs` hub entry).

---

## Accessibility

- Every state is expressed as a static rule, so `data-motion="reduced"` just
  removes the tweening — nothing is left mid-flight. The 3D fold flattens
  rather than snapping.
- One Back control per level, always present past `intro`. Escape does the same.
- Focus moves to the new level's entry point on each transition
  (`data-autofocus`); in the side-by-side compare only the desktop stage claims
  focus.
- At `intro` the Split plate is announced as one CTA, not three buttons.
- Concepts gate the destination on `step === "destination"`, so an inconsistent
  state can't render a screen on top of the options.
