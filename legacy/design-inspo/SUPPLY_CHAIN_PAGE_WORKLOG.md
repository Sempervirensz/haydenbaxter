# Supply Chain Page Worklog (Section 03 / 04)

Date compiled: 2026-02-24

This document records the full implementation history and debugging path for the Supply Chain section of the portfolio work page, including:

- what was requested
- what was built
- what broke / why
- what was changed in response
- what is currently active
- what can be restored later

This is intentionally detailed so future work can start from the current state without re-learning the same dead ends.

## Scope

This worklog is about the `Supply Chain` section (`03 / 04`) in the modular portfolio app under:

- `app/data/site-content.js`
- `app/renderers/page.js`
- `app/features/supply-consulting.js`
- `style.css`

It also references local assets used during the iterations:

- `assets/pacific-map.png`
- `assets/mapmaster.jpeg`
- `assets/east-asia.png`
- `assets/north-america-west.png`
- root originals: `MapMaster.jpeg`, `East Asia.png`, `North America West.png`

## User Direction Changes (Chronological Summary)

The user’s direction evolved significantly over time, and that directly drove the implementation history:

1. Build polished `Supply Chain` + `Consulting` sections to complete the Work page.
2. Make Supply Chain visually stronger (art-first hero).
3. Use animated map-based framing (East Asia + North America / Pacific concept).
4. Avoid hard seams / obvious masks / broken clipping.
5. Improve composition (Pacific basin feel, not a center slot).
6. Improve mobile separately (not just scaled desktop).
7. Fix geographic alignment (coherence across the Pacific).
8. Abandon split-asset base composition; use one master Pacific image instead.
9. Temporarily remove all hero text to focus on map composition.
10. Stop patching the old magazine/card layout and create a new minimalist landing-style Supply Chain view.

## High-Level Phases of Work

## Phase 1: Supply Chain + Consulting sections were added (data-driven, modal-based)

### What was built

- `Supply Chain` section (`03 / 04`) with:
  - hero region
  - proof drawer
  - featured card + supporting cards
  - modal details
- `Consulting` section (`04 / 04`) with:
  - typographic hero
  - offer cards
  - proof framing
  - modal details

### Goal

Finish the Work page with premium, credible sections that match the design system and remain AI-editable.

### Design system constraints carried from earlier work

- dark theme
- premium polish
- skimmable + deeper detail via modal
- coherent across all four work sections

## Phase 2: Art-first Supply Chain hero experiments (split-map concept)

### Concept explored

An animated, cinematic split-map hero:

- East Asia / Russia visual on left
- North America / Alaska visual on right
- quote rising in center gap
- dark “Pacific” negative space for readability

### Initial implementation direction

- split panels with separate map crops
- seam mask / quote lane
- scroll-triggered reveal using `IntersectionObserver`

### Problems encountered

- looked like two rectangular panels with a harsh center gap
- visible black seam / “window cutout” artifacts
- masking felt accidental / bug-like
- center darkness read as layered occlusion, not intentional composition

## Phase 3: Hero composition debugging (split/cutout implementations)

### Root cause found (important)

A CSS selector leakage issue caused the `split-cutout` variant to inherit split-layout seam/overlay rules:

- selectors like:
  - `.scs-hero:not(.is-east-sweep) ...`
  - were also matching cutout variants unintentionally

This stacked multiple dark overlays and created the “black cross” / chopped look.

### Fix applied

Selectors were tightened to exclude additional variants (including later `is-master-pacific`):

- `style.css` selectors updated around:
  - `style.css:2167`
  - `style.css:2172`
  - `style.css:2186`
  - `style.css:2200`
  - `style.css:2206`

### Result

The obvious overlay stacking bug was reduced, but the composition still felt boxed/geometric due to the underlying split-panel approach.

## Phase 4: Split cutout PNG approach (East Asia / North America cutouts)

### What was attempted

Using user-provided transparent/cutout-looking continent images:

- `East Asia.png`
- `North America West.png`

Copied into `assets/` as:

- `assets/east-asia.png`
- `assets/north-america-west.png`

### Why

To avoid ocean-heavy split crops and preserve continent silhouettes against black.

### Problems encountered

1. Geographic mismatch:
   - PNGs were exported from different framing/crops/aspect ratios
   - did not naturally align as one Pacific basin view

2. Composition still boxed:
   - container geometry (rectangular panels) remained visually dominant
   - center gap still read as a slot

3. Mobile composition broke:
   - desktop composition assumptions did not translate

### What was improved

- separate per-side crop/scale controls
- mobile-specific composition rules
- softer stage-level vignettes
- reduced inward reach of continents

### Limitation documented

This approach remained a CSS approximation because the source images were not exported from one shared source framing.

## Phase 5: Geographic alignment tuning (split/cutout)

### User request

Focus only on geographic coherence:

- East Asia and Alaska/North America should feel like same map framing/projection

### What was found

The PNGs were different dimensions and framing:

- `East Asia.png` and `North America West.png` did not share a single crop/zoom baseline

### CSS approximation controls added

Per-side variables (desktop cutout mode) to tune:

- left/right scale
- x offset
- y offset

These helped visually but did not fully solve the source mismatch.

### Key conclusion

True fix = single source image (or re-export both from one source).

## Phase 6: Single master Pacific image direction (preferred)

### User direction

Stop aligning separate continent assets. Use one full Pacific map image as source of truth.

### Implemented direction

- Single-source Pacific map based hero variants:
  - `pacific-master`
  - later `is-master-pacific` map-only variant

### Why this was the right direction

It guarantees geographic coherence by construction because both coastlines come from the same image:

- Asia/Russia and Alaska/North America are just different crops of one source

## Phase 7: MapMaster integration

### What was done

User-provided `MapMaster.jpeg` was wired as the new source image.

Files involved:

- source (root): `MapMaster.jpeg`
- runtime asset: `assets/mapmaster.jpeg`

Wiring in code:

- data config points to `mapAsset: "/assets/mapmaster.jpeg"`
- CSS fallback `--scs-map-url` also set to `assets/mapmaster.jpeg`

### Why this mattered

This replaced mixed/split-source geographic composition with a single coherent map source.

## Phase 8: Temporary text removal for composition-only map pass

### User request

Remove center text entirely so the map composition can be evaluated on its own.

### What was done

- hid quote/text layers for the master-map composition pass
- kept hero frame / dark styling / map visual
- reduced some vignette intensity to inspect coastlines more clearly

### Intent

Evaluate map composition as a visual object first, then reintroduce text later.

## Phase 9: `is-master-pacific` single-layer master map variant

### What was built

A new Supply Chain hero variant using an injected single master map layer:

- class: `.is-master-pacific`
- injected nodes:
  - `.scs-hero__map-master`
  - `.scs-hero__map-overlay--vignette`
  - `.scs-hero__map-overlay--topfade`

### JS wiring

In `app/features/supply-consulting.js`:

- `initSupplyHero(...)` toggles:
  - `is-master-pacific`
- `ensureMasterPacificLayers()` injects map and overlays

Key references:

- `app/features/supply-consulting.js:159`
- `app/features/supply-consulting.js:189`

### CSS support

In `style.css`:

- `.scs-hero.is-master-pacific` block
- hides legacy hero internals (panels / seam / quote lane / quote)
- adds new map/overlay styling

Key references:

- `style.css:2377`
- `style.css:2413`

### Problem encountered (major)

The hero repeatedly rendered as a black box in browser screenshots.

## Phase 10: Black hero debugging (master map variant)

### Observed symptom

`Supply Chain` hero frame was visible, but map area remained fully black.

### Likely cause chain

The new variant hid legacy layers successfully, but the new master map layer path/rendering path remained brittle.

Possible contributors considered and tested:

- injected layer not present
- CSS selector scoping collision
- stale browser cache
- background image not applied to injected node
- later CSS override
- stage/background layer order

### Fix attempts made

1. CSS fallback on stage:
   - `style.css` updated so `.scs-hero.is-master-pacific .scs-hero__stage` also paints the map

2. JS inline image application:
   - `applyMasterPacificImage(...)` added in `initSupplyHero(...)`
   - applies `cfg.mapAsset` directly to:
     - stage
     - `.scs-hero__map-master`

3. CSS fallback moved to hero container:
   - `style.css` updated so `.scs-hero.is-master-pacific` itself paints the map
   - stage made transparent in that variant

4. Cache busting:
   - repeated bumps to `style.css` and module query strings in:
     - `index.html`
     - `app/main.js`

### Why this was still painful

The hero was being iterated through multiple variants and selectors over many passes, so the legacy hero architecture remained a noisy surface for debugging.

This directly led to the next request (and final direction): stop patching the old layout.

## Phase 11: New minimal Supply Chain landing variant (current active direction)

### User request (explicit)

Stop patching the old magazine-style layout. Build a new minimalist landing experience for Supply Chain and hide everything else (but keep it in codebase/DOM).

### What was implemented

A new Supply Chain variant:

- `viewMode: "minimal-supply-chain-landing"`
- section class applied at runtime:
  - `.scs--minimalLanding`
- new standalone visual component added:
  - `.scs-minimalLanding`

### Visible elements in this variant

- Work screen header (already outside the Supply Chain section markup):
  - `03 / 04`
  - `Supply Chain`
- large minimalist Pacific map slide (`.scs-minimalLanding`)
- empty text-safe region placeholder (`.scs-minimalLanding__textSafe`, hidden visual placeholder only)

### Hidden (but preserved) content

All old Supply Chain dense content remains in the DOM and codebase, but is hidden via CSS in minimal mode:

- `.scs-hero`
- `.scs-proof`
- `.scs-head`
- `.scs-layout`
- `.scs-modal`

Selector:

- `style.css:1962`

### New minimal component architecture

Renderer adds (before legacy Supply Chain content):

- `div.scs-minimalLanding`
  - `div.scs-minimalLanding__map`
  - `div.scs-minimalLanding__overlay--vignette`
  - `div.scs-minimalLanding__overlay--edgeFade`
  - `div.scs-minimalLanding__textSafe`

Reference:

- `app/renderers/page.js:288`

### New runtime initializer

`initSupplyMinimalLanding(root, heroConfig)`:

- reuses existing `heroArt` map config
- reads `mapAsset`, `masterPacificX`, `masterPacificY`, `masterPacificScale`
- converts `masterPacificScale` to zoom
- applies map crop/zoom to the new minimal component
- uses `IntersectionObserver` for subtle reveal

Reference:

- `app/features/supply-consulting.js:326`

### Why this is more stable

- It no longer depends on the old split-panel hero DOM/CSS stack.
- It uses one master map source (`MapMaster`) and a single visual layer.
- It uses a feature flag on the section root rather than destructive markup changes.

## Current Active State (as of this file)

### Active Supply Chain mode

- `minimal-supply-chain-landing`

Configured at:

- `app/data/site-content.js:249`

### Current map source and crop defaults

- `mapAsset: "/assets/mapmaster.jpeg"`
- `masterPacificX: "47%"`
- `masterPacificY: "45%"`
- `masterPacificScale: "114%"`

Config references:

- `app/data/site-content.js:251`
- `app/data/site-content.js:254`
- `app/data/site-content.js:255`
- `app/data/site-content.js:256`

### Current visible behavior (intended)

- only top bar + large map slide are visually dominant
- legacy Supply Chain content is hidden but preserved
- no split seam, no quote lane, no heavy card stack

## Files Touched for Supply Chain Work (Primary)

### Data / feature flags / hero art values

- `app/data/site-content.js`

### Supply Chain renderer (markup)

- `app/renderers/page.js`

### Supply Chain behavior (hero variants, proof drawer, minimal landing)

- `app/features/supply-consulting.js`

### Styling (all Supply Chain variants, minimal landing)

- `style.css`

### Cache busting / bootstrapping

- `app/main.js`
- `index.html`

## Root Causes & Lessons Learned

## 1) Variant layering under shared selectors is brittle

The old hero evolved through multiple visual strategies but lived under one shared `.scs-hero` architecture. Small selector mistakes produced large visual artifacts.

Lesson:

- new visual concepts should use explicit variant classes or separate components, not incremental overrides on a complex shared stack

## 2) Split-asset geography is fragile

Even with careful offsets/scales, separate exported images rarely align cleanly unless they come from the exact same source framing/projection.

Lesson:

- use a single master source for geographic compositions whenever possible

## 3) Composition debugging is easier without text overlays

Removing the text temporarily was useful because it exposed whether the composition itself was working.

Lesson:

- isolate visual composition first, then layer content back in

## Tunable Values (Current Minimal Variant)

These are the primary values for the new minimalist Supply Chain landing:

### Data-level (preferred)

In `app/data/site-content.js` (`supplyChain.heroArt`):

- `masterPacificX`
- `masterPacificY`
- `masterPacificScale`
- `mapAsset`

### CSS-level defaults / fallback tuning

In `style.css` (`.scs-minimalLanding` block, around `style.css:1851`):

- `--scs-minimal-map-x`
- `--scs-minimal-map-y`
- `--scs-minimal-map-zoom`
- `--scs-minimal-map-opacity`
- `--scs-minimal-edge-vignette`
- `--scs-minimal-top-fade`
- `--scs-minimal-bottom-fade`

## How to Restore Legacy Supply Chain View (without losing anything)

### Option A: Switch off minimal mode in data (recommended)

In `app/data/site-content.js`, change:

- `viewMode: "minimal-supply-chain-landing"`

to:

- remove `viewMode`, or
- set to a different value

The legacy hero/proof/cards/modal are still in code and will render again.

### Option B: Temporarily disable the CSS hide rules

In `style.css`, comment/remove the `.scs--minimalLanding` hide block:

- `.scs--minimalLanding .scs-hero`
- `.scs--minimalLanding .scs-proof`
- `.scs--minimalLanding .scs-head`
- `.scs--minimalLanding .scs-layout`
- `.scs--minimalLanding .scs-modal`

## Known Open Questions / Follow-up Work

1. Confirm the new minimal variant is rendering the map correctly in the browser (user screenshot before this final shift still showed black from older variant).
2. Add a dominant sentence into `.scs-minimalLanding__textSafe` once composition is approved.
3. Tune desktop crop/zoom for strongest Pacific negative space (text-safe region).
4. Do a dedicated mobile composition pass for the minimal variant (independent crop and zoom).
5. Add a runtime toggle (or data flag switch) between minimal and legacy Supply Chain views for quick review.

## Suggested Phase 2 Plan (Minimal Variant)

1. Lock desktop composition (crop/zoom/vignette only).
2. Add single-line text (one sentence).
3. Add subtle motion (slow drift/parallax or opacity reveal only).
4. Mobile-specific composition pass.
5. Optional: add an explicit “View details” overlay trigger that restores the proof drawer and legacy content on demand.

## Quick Reference: Current Relevant Code Anchors

- Supply Chain mode flag:
  - `app/data/site-content.js:249`
- Minimal landing markup:
  - `app/renderers/page.js:288`
- Minimal landing initializer:
  - `app/features/supply-consulting.js:326`
- Section mode class toggle:
  - `app/features/supply-consulting.js:709`
- Minimal landing CSS block:
  - `style.css:1851`
- Minimal mode hide rules:
  - `style.css:1962`
- Legacy master-pacific hero variant (still present, not deleted):
  - `style.css:2377`

## Notes for Future AI-Assisted Edits

- Prefer editing the new minimal component first (`.scs-minimalLanding`) rather than touching `.scs-hero`.
- Keep legacy Supply Chain content untouched unless explicitly restoring that version.
- If a map render issue happens again, test the minimal component directly (single map layer) before debugging legacy hero variants.

