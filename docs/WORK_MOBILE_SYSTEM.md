# Mobile Work System (Batch 5)

All four Work chapters — WorldPulse, Emerging Tech Builds, Supply Chain,
Consulting — as one phone sequence. Written 2026-07-23.

---

## STATUS: LAB ONLY — nothing promoted, nothing committed

**Route:** `/site-parallax-lab/work-mobile` — registered in the labs hub,
covered by the existing `/site-parallax-lab` entry in `NON_PUBLIC_PREFIXES`,
emits `noindex`, absent from the sitemap.

Desktop (≥1024px) untouched. Production mobile still renders the original
`WorkSection`. See [WORLDPULSE_MOBILE_LAB.md](WORLDPULSE_MOBILE_LAB.md) for the
Batch 4 concept work this builds on.

---

## The shared system — eight rules

Four cards read as one portfolio because they obey the same rules, not because
they share a template.

| Rule | Contract |
|---|---|
| **Card frame** | One card per chapter, `100cqh`, 6px inset, 18px radius, hairline edge + filmic inner shadow. The desktop stack's frame, scaled down. |
| **Rail** | Mono chapter rail top-left: `01 / 04 — WorldPulse`. **The ordinal is the navigation cue** — no pager, dots, or progress bar spends space on a screen that has none. |
| **Typography** | Serif headline `clamp(23–33px)`, mono label 9.5px/0.24em, sans body 13–14px/1.55, mono CTA. Identical on all four. |
| **Spacing** | One `--mws-gutter` token: 18px, 14px under a 344px container. Every rail, body, foot and bleed references it. |
| **Touch targets** | Nothing interactive under 44px. Primary CTA is a full-width pill, 50px minimum. |
| **Disclosure** | One frosted bottom sheet, four cards. Handle closes, scrim dismisses, Escape closes, focus moves in and back, `inert` while shut. |
| **Motion** | **One rAF loop for the whole sequence.** Chapter handoff on all four; image drift on the two photo cards only. IO-gated, transform-only, off under reduced motion. |
| **Gestures** | Vertical page scroll is the only gesture. No horizontal paging, no nested scrollers except inside an open sheet. |

### Shared vs card-specific

**Shared:** the frame, rail, type scale, gutter token, both control shapes
(white CTA pill / glass trigger pill), `MobileSheet`, `ChapterRail`, the
sequence motion hook, the media-band primitive, focus ring, reduced-motion
handling.

**Card-specific:** what each composition does with them — see below.

---

## The four cards

### 01 · WorldPulse — Passport Sheet *(approved, carried over intact)*

Geometry unchanged from Batch 4 and not up for casual revision: the hero is
2.36:1, a portrait crop keeps ~19.6% of its width, **38%** is the one anchor
holding both the phone and her face, and a bottom-anchored headline would need
the image scaled ~1.75× (cropping the subject away). Hence all resting text in
the top band, one CTA at the base over her hand. Sheet at `48cqh` — solved from
her face height (~52% of the photo), not chosen.

*Card-specific:* the coordinated media re-frame on open — the only card where the
photo moves in response to the sheet. Image drift.

**Changes for the sequence:** systemic only — now uses the shared sheet and rail.

### 02 · Emerging Tech Builds — The Shelf

The desktop card is the deployed candy-bar gallery: filters, sorts, slide-in
dossier. None of it belongs in a phone card. Instead **the resting state is the
evidence**: a real AtomicOS dashboard bled to the card edges, above four builds
as rows carrying their own product screenshots, category and status. You learn
these are real systems in about two seconds without tapping. Tapping a row raises
the sheet with that project's own hook and description, then hands off to its
existing detail page.

*Card-specific:* the only sheet with four different contents selected by which row
you tapped. Real screenshots as thumbnails, so the card is proof rather than a
list of buttons. Concept builds show their brand mark inset instead of filling
the tile — a visible, honest difference from a shipped build. No photo, so no
drift.

OpenClaw is excluded: five rows overflows a 568px card and it is the least
developed concept. The evidence band uses production's own
`defaultSelectedId`, so the lab can't disagree with the site about which build
leads.

### 03 · Supply Chain — The Crossing

Two deliberate omissions. **No WebGL globe** — a three.js canvas for one
decorative sphere would be the heaviest thing in the sequence and buys nothing at
this size. **No markers plotted on the map** — the asset is Pacific-centred and
the stops don't fit it: New York lands at the right edge, SE Asia below the
bottom, so projected dots would read as a bug.

The map earns its place as a landscape band instead, because the story genuinely
is a crossing. Meaning is carried by the production hero's own four credential
lines, set in the same four type styles it uses, over a dated journey rail
(Taiwan → China → New York → SE Asia). Proof goes in the sheet where the three
tabs have room.

*Card-specific:* editorial type stack lifted from `heroArt.quoteLines`; the only
card with an internal timeline; tab state lives inside the sheet.

### 04 · Consulting — The Invitation

**The one card that inverts the system's layout rule, on purpose:** text sits at
the *bottom*, not the top. It can, because `mobile-statue.webp` was shot for
portrait — 900×2000, within 3% of the card's own aspect, so almost no crop — and
its lower half is still water with nothing in it.

That inversion is doing work: it signals the sequence has changed mode. Three
cards showed what was built and operated; this one asks for a conversation. It is
also the only card whose primary action leaves the portfolio — `CALENDLY_URL`
rather than a project.

*Card-specific:* bottom-weighted composition; booking CTA; two offer chips opening
the shared sheet with deliverables and best-fit. The reserved offer slot is
filtered out — not something to sell.

---

## The sequence story

> WorldPulse (building) → Emerging Tech (range) → Supply Chain (operating
> background) → Consulting (how that helps you)

Readable by scrolling alone. Every card's resting state states its own case; the
sheets reward curiosity rather than being required.

---

## Motion — one loop, and it earns its place

`useSequenceMotion` is a single rAF loop for the whole sequence, mirroring
`useCinematicParallax` but scoped to mobile. Four independent observers and four
loops is exactly what causes scroll jank on Safari.

It writes two things, both compositor-friendly:

- **`--mws-sink`** on each chapter — the handoff. The outgoing card sinks 5% and
  scales to 0.94 while a dim layer rises to 0.7 as the next chapter covers it.
  **This is most of why four different compositions read as one system**: it is
  the same depth move the approved desktop stack makes.
- **`--mws-plx`** on `[data-mws-drift]` — ±10px image drift, into a 12px bleed
  (not a `scale()`, which would cost horizontal crop the photo cards can't
  spare). Photo cards only; panel cards stay still by system rule.

Verified against live rects: sink ramps 0 → 0.53 → 1 exactly as each chapter is
covered; drift crosses zero when a card is centred.

**Verdict: yes, materially.** The handoff is the single strongest cohesion
signal in the batch — without it the cards read as four pages. The drift is
optional polish; the handoff is not.

---

## Files

### Created
- `src/data/workMobileSystem.ts` — content selectors over production data + the system contract.
- `src/components/work-mobile/MobileWorkSequence.tsx` — **the promotable artefact.** No lab chrome, no lab-only props.
- `src/components/work-mobile/MobileSheet.tsx` — the one disclosure pattern.
- `src/components/work-mobile/ChapterRail.tsx`
- `src/components/work-mobile/useSequenceMotion.ts`
- `src/components/work-mobile/cards/Card{WorldPulse,EmergingTech,SupplyChain,Consulting}.tsx`
- `src/components/work-mobile/work-mobile.css` — the system + card specifics.
- `src/components/work-mobile/WorkMobileLab.tsx` + `work-mobile-lab.css` — lab chrome only.
- `src/app/site-parallax-lab/work-mobile/page.tsx`

### Modified
- `src/data/labsRegistry.ts` — **one line.**

### Untouched (verified against HEAD)
`src/components/work/**`, `src/components/WorkSection.tsx`, `src/app/page.tsx`,
`src/app/globals.css`, `src/styles/work-details.css`, `src/data/work.ts`,
`src/data/site.ts`, and the Batch 4 WorldPulse lab.

---

## Content provenance

Everything reads from what production reads — `WORK_SCREENS`,
`CINEMATIC_CARDS` (chapter numbers + taglines, so the rail can't disagree with
desktop, including the pending ETB rename), `JOURNEY_STOPS`, `CALENDLY_URL`.
No copy is restated, so the lab cannot drift from the site.

---

## Tested

**Sizes:** 320×568 (SE 1st), 360×740, 375×667, 393×852, 430×932 — resting *and*
with all four disclosures open simultaneously. Zero horizontal overflow at every
size. On a 320×568 three of four sheets fit without internal scrolling; Supply
Chain's 95px is legitimate (three tabs of proof).

**Interaction:** click and keyboard. Full cycle verified with real key events on
the ETB card — open → focus enters sheet → Escape → focus returns to *the exact
row that was tapped* → sheet `inert` again → **frame did not scroll**.

**Motion:** handoff and drift verified against live rects and visually
mid-transition. Reduced-motion simulation confirmed to neutralise transforms,
remove the dim, and collapse transitions.

**Comparison:** production's current mobile Work section mounts beside the
proposal at the same size.

**Checks:** `npx tsc --noEmit` clean · `npm run check:assets` clean ·
`npm run build` clean (dev server stopped, `.next` removed first, per trap #3 in
`AGENTS.md`) · route builds at 9.27 kB / 140 kB First Load.

> `npm run lint` remains unusable in this repo — no ESLint config, drops into an
> interactive setup prompt. Pre-existing.

### Bugs found and fixed
1. **Inline sheet heights beat the short-phone container query** — SE-class
   screens silently kept tall-phone sheets and scrolled more than intended. The
   component now sets `--mws-sheet-default`; CSS resolves card override →
   default → fallback.
2. **Supply Chain's map was unreadable** full-bleed — same 2.36:1 problem as the
   WorldPulse hero. Became a capped landscape band with a radial mask.
3. **The evidence band lost its anchor** when generalised into `.mws-band` and
   fell back to centre, drifting between phone sizes.
4. **Unnamed scrim button in the tab order** — now always `aria-hidden`, since
   keyboard users close via Escape or the labelled handle.

> A recurring measurement trap: the headless preview pane goes `document.hidden`
> between tool calls, which pauses rAF, IntersectionObserver delivery, *and style
> recalc*. Several "failures" were frozen-renderer artifacts. Anything
> motion-related must be verified via screenshot (which forces a render), not by
> reading computed styles.

---

## Recommendation

**The system is ready for promotion in principle, but promote it as one change,
not card by card** — its coherence comes from the shared rules and the handoff,
so a partial promotion loses exactly what makes it work.

Two things I'd want settled first, both product calls rather than engineering:

1. **The ETB rename.** Chapter 02's rail reads from `CINEMATIC_CARDS`, which
   carries the in-progress "AI & Emerging Tech Builds" naming. That rename shares
   files with the PNG→WebP swap on `wip/labs-and-asset-optimization` — worth
   landing before or with this, not after.
2. **Does mobile keep the CD-scroll landing?** This sequence replaces the four
   detail screens, but production's mobile Work section opens with the CD player
   clock. The sequence assumes it is the whole Work section. Keeping the CD
   landing and feeding it into these four cards is the closer analogue of what
   desktop does — and is the larger call this batch deliberately did not make.

---

## Migration plan, if approved

1. **Land the ETB rename first** so chapter 02's rail is final.
2. Add `container-type: size` to the mobile Work section's card wrapper. The
   whole system is container-driven, so this is what makes it render correctly
   outside the lab — no other layout change.
3. Point `WorkSectionResponsive`'s `<1024px` branch at `MobileWorkSequence`
   instead of `WorkSection`, passing the section element as `scrollRootRef`.
   Decide the CD-landing question here.
4. Move `work-mobile.css` next to the component in `src/components/work/`, or
   leave it in place and import from the sequence (it is already fully scoped).
5. Swap the 6.7MB `WorldPulseCostal3.0.png` for the tracked **85KB `.webp`** —
   already in the repo, still unreferenced. Biggest single perf win available.
6. Drop the always-on `will-change` hints once motion is settled.
7. Keep the lab route: it is the only place the proposal and production can be
   compared side by side.

Separately, still worth fixing whenever `cinematic-work-stack.css` is next open:
its phone `background-position: 34%` cuts her face. **38%** is correct.
