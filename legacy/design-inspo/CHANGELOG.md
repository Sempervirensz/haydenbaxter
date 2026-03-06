# Changelog — Hayden Baxter Portfolio Site

> Covers all changes across the full design conversation, including both the initial session and the current continuation.

---

## Session 1 — Foundation & Core Layout

### Navbar — Heavy Emboss Buttons
- Replaced default nav buttons with deeply embossed DYMO-label style, sourced from `heavy-emboss.html` reference file.
- Font set to `DM Mono`; layered `inset` box shadows for debossed effect; `text-shadow` for stamped-ink look.
- Hover/active states adjusted for tactile press feedback.

### Hero Section
- Large headline: *"I build thoughtful products where data, design, and the human experience converge."*
- Subheading: *"I'm Hayden — founder & product builder."*

### Splash Screen (Pre-Page Greeting)
- Full-screen overlay flashes multi-language greetings before fading into the site: `Hello`, `你好`, `Olá`, `नमस्ते`, `こんにちは`.
- Text styled small and thin per user request (initial version was too large).
- Sequenced with `setTimeout`; fades out to reveal main content.

### Brand Carousel
- Removed the old tagline section (*"Building products at the intersection of data, design, and the real world"*).
- Replaced with an infinitely scrolling brand carousel: **Nike**, **Disney**, **AOSOM**.
- `@keyframes scroll-brands` animation; `::before`/`::after` pseudo-elements for edge fade.
- Footer disclaimer: *"Logos are trademarks of their respective owners. Shown for identification only."*

### Work Section — Initial Card Layout
- Scroll-driven sticky section with multiple full-screen "screens."
- Landing screen with "Work" heading, *"Rooted in outcome and action"* quote, and four numbered square cards (WorldPulse, Emerging Tech, Supply Chain, Consulting).
- Cards animated from stacked pile to evenly spaced row (inspired by `nivedhanirmal.com`).

### Work Section — Page Turn Transition
- Implemented 3D page-turn (peel) effect for transitioning between screens.
- **Reverted** — user felt it looked "too much like a scrapbook."

### Work Section — Vertical Slide Transition
- Replaced page turn with clean vertical slide animation (`translateY`).
- Fixed edge-peeking glitch with `visibility: hidden` on past screens.

### Work Detail Pages — Magazine Spread Layout
- User selected "Iteration D — Magazine Spread" from five proposed layouts.
- Each project gets a full-screen detail page with: project heading, featured write-up with screenshot placeholder, stat bar, and side cards (sub-projects with tech tags).
- Four detail screens: WorldPulse, Emerging Tech, Supply Chain, Consulting.

### Work Section — Scroll Progress Indicator
- Added pill-style progress dots and `01 / 04` counter to track position within the Work section.

---

## Session 1 — CD Player Landing

### Iridescent CD (v1)
- Replaced the four square cards with a half-visible rotating CD in a "slot."
- CSS-only disc with `conic-gradient`, `radial-gradient`, iridescent sheen, and track-line pattern.
- Labels (WorldPulse, Emerging Tech, Supply Chain, Consulting) positioned at 90° intervals.
- Scroll-driven rotation logic with hold zones and an active label below the disc.

### Burned CD-R Redesign (v2)
- Overhauled disc to look like a hand-burned CD-R with permanent marker writing.
- Added Google Font `Permanent Marker` for label text.
- Oversized disc (`clamp(420px, 70vw, 740px)`), gold/champagne radial gradient, grain texture pseudo-element.
- Added inner hub ring, realistic center hole, CD-R branding (`CD-R`, `700MB 52X 80MIN`), ruled lines.
- Responsive scaling for mobile breakpoints.

### CD Scroll Dynamics (v1)
- Implemented weighted hold zones with an `ease()` interpolation function.
- Configurable dwell times per label; accelerating spin-out at the end before transitioning to detail pages.

---

## Session 2 — Current Session (CD Photo Overlay & Tuning)

### Real CD Photo Overlay (Change 1)
- **Replaced the entire CSS-drawn disc with the user's actual photograph** of a burned CD-R.
- First photo (`cd.png` v1): WorldPulse at ~10 o'clock position.
- Stripped all inner HTML from `.cd-disc` (hub, hole, brand text, marker labels, ruled lines) — all baked into the photo.
- Simplified `.cd-disc` CSS to: `background: url('cd.png') center / cover no-repeat;` with `border-radius: 50%`.
- Removed all orphaned CSS rules: `.cd-hole`, `.cd-hub`, `.cd-brand`, `.cd-brand__name`, `.cd-brand__spec`, `.cd-brand__icon`, `.cd-label` (all nth-child variants), `.cd-lines`, `.cd-line`, `.cd-disc::before`.

### CD Rotation Offset — First Attempt (Change 2)
- Added `CD_OFFSET` variable to adjust starting rotation for the photo.
- Tried `CD_OFFSET = -120` — overshot; Supply Chain/Consulting showed instead of WorldPulse.
- Corrected to `CD_OFFSET = 60` — WorldPulse centered at top of visible half-disc.
- All zone `deg` values derived from offset: `CD_OFFSET`, `CD_OFFSET - 90`, `CD_OFFSET - 180`, etc.
- Fallback return in `getCdState` updated to use `CD_OFFSET`.

### Fine-Tune Offset & Equal Hold Zones (Change 3)
- Nudged `CD_OFFSET` from 60 → **65** (shifted WorldPulse a couple degrees left per user request).
- Set first two sections (WorldPulse, Emerging Tech) to 26% hold ranges; Supply Chain and Consulting compressed.

### Equal Holds for All Sections (Change 4)
- User requested Supply Chain and Consulting also get full hold ranges.
- Since 4 × 26% > 100%, increased section height from 780vh → **1050vh**.
- All four sections set to equal 21% holds (221vh each — more absolute scroll than old 26% of 780vh).
- Zones: `[0.00, 0.21]`, `[0.24, 0.45]`, `[0.48, 0.69]`, `[0.72, 0.93]`, return `[0.95, 0.965]`.

### Longer Holds — Height Increase (Change 5)
- User wanted even longer holds.
- Section height: 1050vh → **1500vh**.
- Holds: 22% each (330vh per section).

### New CD Photo (Change 6)
- User provided a **new photograph** of the CD-R (different angle/orientation).
- Copied over `cd.png`, replacing the previous image.
- In the new photo, WorldPulse is already at 12 o'clock → set `CD_OFFSET = 0`.

### Slower Rotations & Smoother Feel (Change 7)
- User reported it felt "too clicky."
- Section height: 1500vh → **3000vh**.
- CSS transition: `180ms ease-out` → **`800ms cubic-bezier(.25, .1, .25, 1)`** for gliding rotation.
- Transition gaps between zones: 2% → **8%** (240vh per 90° rotation).
- Holds: 16% each (480vh per section).

### Even Longer Holds — Less Floaty (Change 8)
- User wanted more time locked at each position.
- Section height: 3000vh → **4500vh**.
- Holds: 16% → **19%** each (855vh per section).
- Transitions: 8% → **5%** (225vh — similar absolute distance to previous 240vh).

### Final Tuning — Tighter Transitions, Longer Locks (Change 9)
- User still felt it was "too floaty."
- Holds increased to **22%** each (990vh ≈ ~10 screen heights of pause).
- Transitions tightened to **3%** (135vh) — quicker, more deliberate rotations.
- Final zones: `[0.00, 0.22]`, `[0.25, 0.47]`, `[0.50, 0.72]`, `[0.75, 0.94]`, return `[0.97, 0.985]`.

---

## Files Modified

| File | Description |
|---|---|
| `index.html` | Primary site file — all HTML, CSS, and JS |
| `cd.png` | Real CD-R photograph used as disc background (replaced twice) |
| `heavy-emboss.html` | Reference file for navbar button style (read-only) |

---

## Summary of User Prompts (Session 2)

1. **"Can we use this exact image overlayed on the background?"** — Replace the CSS-drawn CD disc with the user's actual photograph of a burned CD-R.

2. **"See this is a bit off unfortunately, World Pulse is the first section and that is at 120 degrees on the current image"** — The CD photo has WorldPulse at a different angle than assumed; needs rotation offset so WorldPulse appears at top center.

3. **"World Pulse still needs to be adjusted a couple degrees to the left and each section should have a 26% hold range but the last few"** — Fine-tune the rotation offset and give each section equal hold time (message cut off regarding last sections).

4. **"Implement Supply Chain holds and Consulting holds all of 26%"** — Make all four main sections have equal, full-length hold ranges.

5. **"I need longer holds on each section — WorldPulse, Emerging Tech, Supply Chain, and Consulting"** — Increase the pause duration at every section.

6. **"Replace the disk with this disk photo"** — Swap in a new photograph of the CD-R (different angle where WorldPulse is at 12 o'clock).

7. **"Why, let's have slower rotations and longer holds, it feels too clicky"** — The rotation between sections is too abrupt; make transitions smoother and holds longer.

8. **"No it still rotates way too quickly"** — Further slow down the rotation speed between sections.

9. **"Okay give me a view so I can see how much in between each section"** — Show screenshots at each stage of the disc rotation for visual verification.

10. **"I like the transition between each section but I also want it to pause more on each section"** — The rotation speed is good now, but the disc needs to stay locked at each position for longer before moving.

11. **"Is it pausing equally for each section?"** — Confirm all four sections have identical hold durations.

12. **"It is just too floaty right now, there need to be longer locks at each section"** — Still not enough pause time; needs to feel more grounded.

13. **"Let's try option 2 yeah"** — Chose the approach of increasing hold percentages while tightening transitions (rather than increasing total height).

14. **"Build a changelog .md file of everything we have changed, extensive, and a summary of my prompts as well"** — This file.

---

## Current State (as of latest change)

```
Section height:    4500vh
CSS transition:    800ms cubic-bezier(.25, .1, .25, 1)
CD_OFFSET:         0

WorldPulse:        0%  – 22%  hold (990vh)  → 3% transition (135vh)
Emerging Tech:     25% – 47%  hold (990vh)  → 3% transition (135vh)
Supply Chain:      50% – 72%  hold (990vh)  → 3% transition (135vh)
Consulting:        75% – 94%  hold (855vh)  → 3% transition
WorldPulse return: 97% – 98.5% (brief lock → spin exit)
```
