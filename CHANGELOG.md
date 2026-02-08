# Changelog

## 2026-02-07

### Changed: Card face titles

Updated the titles displayed on the card face overlays.

**Changes:**

#### `src/data/cards.ts`

- **Queen of Hearts** — renamed from "QUEEN OF EMPATHY" to "QUEEN OF VISION"
- **King of Diamonds** — renamed from "KING OF DETAIL" to "KING OF STRATEGY"
- Jack of Clubs ("JACK OF ALL TRADES") and Ace of Spades ("ACE OF EXECUTION") kept as-is.

---

## 2026-02-07

### Fixed: Card flip black flash on first click

When clicking a card for the first time, there was a brief black flash (~250ms) before the flip animation completed. This was caused by the browser lazily compositing the hidden card face, allowing the dark page background (`#0a0a0a`) to bleed through during the transition.

**Changes:**

#### `src/app/globals.css`

- **`.card-face`**
  - Added `background: white` — ensures a solid background is always behind card content so the dark page background never shows through during compositing delays.
  - Added `transform: translateZ(0)` — promotes both card faces to GPU-composited layers immediately on page load, rather than lazily on first flip.
  - Added `will-change: transform` — hints to the browser to pre-allocate GPU resources for the transform animation.
  - Added `-webkit-backface-visibility: hidden` — Safari/WebKit prefix for backface-visibility to ensure cross-browser consistency.

- **`.card-back`**
  - Updated transform from `rotateY(180deg)` to `rotateY(180deg) translateZ(0)` — preserves the GPU layer promotion alongside the existing rotation.

#### `src/app/layout.tsx`

- Added `<link rel="preload">` tags for all four card face SVG images (`clubs_jack.svg`, `hearts_queen.svg`, `diamonds_king.svg`, `spades_ace.svg`) so the browser fetches them eagerly on page load instead of waiting until the flip reveals them.
