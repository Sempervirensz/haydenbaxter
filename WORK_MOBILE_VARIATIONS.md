# Mobile Work — Fidelity Variations (Batch 6)

Twelve mobile translations — three per Work card — each anchored to its
production desktop source. Written 2026-07-23.

---

## STATUS: LAB ONLY — nothing promoted, nothing committed

**Route:** `/site-parallax-lab/work-mobile-variants` — registered in the labs
hub, covered by `/site-parallax-lab` in `NON_PUBLIC_PREFIXES`, emits `noindex`,
absent from the sitemap.

Supersedes [WORK_MOBILE_SYSTEM.md](WORK_MOBILE_SYSTEM.md) (Batch 5), which drifted
into a separate redesign. Batch 5's route is left in place for comparison.

---

## What changed from the rejected Batch 5 concepts

| Batch 5 (rejected) | Batch 6 |
|---|---|
| ETB became a **row list with screenshot thumbnails** — the candy bars were deleted | The candy-bar stack is back: cream gradient, Cobalt Select, sheen sweep, mono caps at 0.22em, chevron. Values **copied** from `.etb-bar` |
| Supply Chain **dropped the WebGL globe** for a flat map band | The real `RealisticGlobe` is mounted, with production's own mobile framing (`clouds`, `lonOffset -69`, `latOffset 40`) and true journey coordinates |
| Consulting was **re-composed bottom-weighted** with a booking CTA and offer chips | Production's three-state Stage is preserved: cursive quote → glass CTA → frosted wash + candy paths → off-white dossier |
| One universal **bottom sheet** for all four cards | Each card keeps its own disclosure metaphor: WorldPulse's frosted glass, ETB's Project File, Supply Chain's inline rail expansion, Consulting's offer file |
| A **new design system** (`.mws`) with its own tokens | No new system. Materials are copied from `work-details.css`, `cinematic-work-stack.css`, and `consulting-hero-transition.css` |

The governing rule this time: **if a value here disagrees with production CSS,
this file is wrong.** Stated at the top of `work-fidelity.css`.

### What was preserved from the original mobile implementation
- **Supply Chain's `sc-journey--rail` layout** — production *already* ships a
  mobile design here (globe pinned top, vertical timeline below, progressive dot
  reveal at 320ms, then auto-select). Variation A is that layout; B and C change
  only how scrolling relates to it.
- **ETB's mobile overlay** — `ETBDetail` already pushes a full-screen Project
  File under 767px. Variations A and C keep it.
- **Consulting's mobile art direction** — production swaps to
  `mobile-statue` at ≤640px. All three variations use it.

---

## The twelve variations

### 01 · WorldPulse
*Desktop source: `CinematicCardBody` card 1 — full-bleed coastal photo, mono rail, serif headline, hover-revealed frosted glass dossier.*

| | Label | Relationship to desktop |
|---|---|---|
| **A** | Production Faithful | Same layers in the same order. The dossier anchors to the bottom edge because a portrait frame has no room for it to float beside the headline — the only structural concession, and it is forced by the viewport. |
| **B** | Smoother Flow | A, with the founder lede on the card and the CTA never gated behind a tap. |
| **C** | Cinematic Parallax | A, plus three-plane drift. **Uses parallax.** |

The glass keeps desktop's exact material (`blur(26px) saturate(1.7)`, inset
highlight, 22px radius) but darkens its tint — a light frost over sunlit photo
drops body copy under 4.5:1.

### 02 · AI & Emerging Tech Builds
*Desktop source: `ETBDetail` — the candy-bar stack.*

| | Label | Relationship to desktop |
|---|---|---|
| **A** | Production Faithful | Bars stack vertically; tapping fills cobalt and pushes the Project File — what production already does under 767px. |
| **B** | Inline Dossier | Bar expands in place; the rest of the stack stays visible. Sticky section header. **Changes the scroll dynamic.** |
| **C** | Cobalt Depth | Desktop weights the hovered bar `flex: 1.15`; touch gets the same emphasis plus a lift while neighbours recede. **Stronger motion.** |

**The real translation problem:** desktop drives all of this from `:hover`,
which does not exist on touch. Every variation fires the same visual state from
*activation* instead — including the sheen sweep, which now runs on tap.

### 03 · Supply Chain
*Desktop source: `SupplyChainDetail` — `RealisticGlobe` + timeline.*

| | Label | Relationship to desktop |
|---|---|---|
| **A** | Production Faithful | Production's existing mobile rail, unchanged in structure. |
| **B** | Sticky Globe | Globe pins while the rail scrolls under it; the stop nearest the top selects itself. **Changes the scroll dynamic.** |
| **C** | Scroll-Linked Globe | Scroll drives longitude directly — the crossing becomes something you perform. **Scroll dynamic + stronger motion.** |

three.js is already a production dependency (`@react-three/fiber`, `drei`,
`three`), so mounting the real globe costs nothing new. The canvas is measured
and sized in pixels, as production does — CSS-scaling a fixed canvas blurs the
texture and misaligns the dot projection.

### 04 · Consulting
*Desktop source: `ConsultingHeroStage` / `Stage` — three states.*

| | Label | Relationship to desktop |
|---|---|---|
| **A** | Production Faithful | The three-state machine as it ships, in a portrait card. |
| **B** | Open Invitation | States 1+2 merged — on a phone the reveal gate costs more than it earns. Booking always one tap away. |
| **C** | Refined Motion | A's staging with production's own `buttonRise: 72px` / `buttonStagger: 90ms`. **Parallax + stronger motion.** |

The candy path buttons use consulting's own Cobalt Select
(`#2f7bff → #1d5fe0`) — the same motif as the ETB bars. **That shared cream →
cobalt language is site-wide, and is most of why the two cards feel like one
site.** It survived intact.

---

## Motion, by technique

- **Parallax:** WorldPulse C, Consulting C.
- **Scroll dynamic:** ETB B, Supply Chain B, Supply Chain C.
- **Stronger motion:** ETB C, Supply Chain C, Consulting C.
- **Deliberately static:** all four A variations, WorldPulse B, Consulting B.

Not applied uniformly, on purpose — that is what lets the lab show which
technique each card actually needs.

---

## Tested

**Sizes:** 320×568, 375×667, 360×740, 393×852, 430×932.

**Overflow sweep:** all 12 variations at 320×568, resting and expanded.
Zero real horizontal overflow. The only flag was `.wf-bar__sheen`, which
translates ±160% by design inside an `overflow: hidden` parent — verified
clipped, benign.

**Keyboard:** full cycle verified with real key events — open → focus enters the
panel → Escape → focus returns to the trigger → panel `inert` again → **frame
did not scroll** (the `preventScroll` guard holds).

**Motion:** three-plane parallax measured at image 9.86px / scrim 5.75px /
text 2.46px — correct depth ordering. Reduced motion neutralises transforms
(`transform: none`) and collapses transitions to 1ms.

**Sequence mode:** four chapters at exactly 852px each, 3408px total.

**Checks:** `tsc --noEmit` clean · `check:assets` clean · `build` clean
(dev server stopped, `.next` removed first). Route builds at 13.1 kB / 134 kB.

### Bug found and fixed
**ETB variation B's inline dossier was clipped and unreachable at 320×568** —
`flex: 1 1 auto` on the open bar capped it at the stack's height, so the stack's
`scrollHeight` never grew (`scrollable: 0` while the CTA sat 76px below the
fold). Bars now stay `flex: 0 0 auto` so an open one can push the stack taller;
the dossier is plain flow content inline, keeping its flex/overflow rules only
for the pushed overlay where it really is a flex child. Verified: bar grows to
525px, stack scrolls 285px, CTA reachable.

> Recurring environment trap: the headless preview pane goes `document.hidden`
> between tool calls, which pauses rAF, IntersectionObserver, style recalc, and
> makes synthetic clicks land inconsistently. Motion must be verified by
> screenshot (which forces a render) or by re-deriving the math from live rects.

---

## Recommendation

### 1. Strongest variation per card

| Card | Pick | Why |
|---|---|---|
| **WorldPulse** | **C · Cinematic Parallax** | The desktop card's whole character is cinematic depth. Three-plane drift is the only thing here that recovers it on a phone, and it degrades to A exactly when motion is off. |
| **ETB** | **B · Inline Dossier** | The full-screen push is production's weakest mobile moment — it hides the stack and loses your place. Expanding in place keeps all four builds on screen, which is the point of a candy-bar *stack*. |
| **Supply Chain** | **B · Sticky Globe** | The globe is the card's whole argument; letting it scroll away in variation A wastes it. B keeps it on screen without the interpretive risk of C. |
| **Consulting** | **B · Open Invitation** | The reveal gate is a desktop luxury. On the last chapter, whose only job is to start a conversation, an extra tap in front of the booking link is a real cost. |

### 2. Strongest four-card combination

**WorldPulse C · ETB B · Supply Chain B · Consulting B** — the lab's default
combo. Cinematic where the card is cinematic, structural improvement where
production's mobile behaviour is genuinely weak, and no card carrying motion it
does not need.

### 3. Motion that materially improved things
- **WorldPulse's three-plane drift** — the clearest win. It is the difference
  between a photo and a stage.
- **Sticky globe (SC B)** — technically a layout change, but it changes how the
  card feels more than any animation here.

### 4. Impressive but should not be promoted
- **Scroll-Linked Globe (SC C).** Genuinely the most striking thing in the
  batch, and I would not ship it. Tying rotation to scroll means the globe
  cannot spin idly, the geography reads as arbitrary mid-scroll, and it makes
  the section feel like a toy rather than a credential. Worth keeping in the lab.
- **Cobalt Depth (ETB C).** The lift is nice, but reweighting bars on tap makes
  the stack jump under the finger — the neighbour that just moved is the one you
  might have wanted next.

### 5. Should become shared mobile rules
Outer margin token, card proportion (one chapter = one card at 100cqh),
chapter rail with the `01 / 04` ordinal as the navigation cue, the typography
role split (serif/mono/sans/cursive), 44px touch minimum, expanded-state
contract (visible Close, Escape, focus return), production's
`cubic-bezier(0.22, 1, 0.36, 1)` at 420–620ms, and **cream → Cobalt Select as
the interaction signature**.

### 6. Should stay card-specific
Each card's disclosure metaphor — WorldPulse's frosted glass, ETB's Project
File, Supply Chain's inline rail expansion, Consulting's offer file. Flattening
these into one sheet is precisely what went wrong in Batch 5. Also card-specific:
the globe, the candy bars, the cursive quote, and the statue's bottom-weighted
composition.

### 7. Is another refinement batch needed?

**Yes — one focused pass, not a full batch.** Three things:

1. **The ETB rename.** "AI & Emerging Tech Builds" is in flight on
   `wip/labs-and-asset-optimization` and shares files with the PNG→WebP swap.
   This lab reads the name from `WORK_SCREENS`, so it picks the rename up for
   free — but the branch should land first.
2. **Does mobile keep the CD-scroll landing?** These twelve variations replace
   the four *detail* screens. Production's mobile Work opens with the CD player
   clock. Still the largest unanswered question, and still a product call.
3. **Sticky-globe scroll containment on real iOS.** Variation B nests a
   scrolling rail inside a scrolling page. It behaves in the lab, but
   `overscroll-behavior` needs checking on a physical device before promotion.

---

## Files

**Created:** `src/data/workMobileVariants.ts` (lab metadata only),
`src/components/work-fidelity/` (`WorkFidelityLab.tsx`, `parts.tsx`,
`useLayeredDrift.ts`, `work-fidelity.css`, `work-fidelity-lab.css`,
`cards/{WorldPulse,Etb,SupplyChain,Consulting}Card.tsx`),
`src/app/site-parallax-lab/work-mobile-variants/page.tsx`.

**Modified:** `src/data/labsRegistry.ts` — two lines.

**Untouched:** `src/components/work/**`, `src/components/WorkSection.tsx`,
`src/components/consulting-hero-transition/**`, `src/components/ui/realistic-globe.tsx`
(imported, not modified), `src/app/page.tsx`, `src/app/globals.css`,
`src/styles/work-details.css`, `src/data/work.ts`, `src/data/site.ts`.

All content reads from `WORK_SCREENS`, `scLab`, `consultingOffers`,
`consultingHeroTransition`, and `CALENDLY_URL` — no parallel copy system.
