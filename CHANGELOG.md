# Changelog

## 2026-02-07

### Fixed: Caption not centered under each card (desktop + mobile)

On desktop, the caption text below each card was not properly centered. The old approach used `absolute left-1/2 -translate-x-1/2` inside a flex wrapper, but the wrapper's width wasn't locked to the card width, causing misalignment — especially on edge cards.

**Changes:**

#### `src/app/globals.css`

- Added `.card-column` — a new wrapper class with `width: var(--card-width)` that ensures the caption's parent is always exactly the card's width. Uses `flex-direction: column` and `align-items: center` for clean vertical stacking.
- Added `.card-caption` — replaces the old absolute-positioned caption with a normal-flow element. Uses `width: var(--card-width)` and `text-align: center` so text wraps and centers within the card's width.
- Updated `.card-perspective-wrapper` to `width: 100%` and `flex-shrink: 0` since the outer `.card-column` now owns the width and shrink behavior.
- Added responsive `margin-top` for `.card-caption` at the 1024px breakpoint.

#### `src/components/PlayingCard.tsx`

- Replaced the outer `<div className="relative flex flex-col items-center">` with `<div className="card-column">`.
- Replaced the absolute-positioned caption with a normal-flow `.card-caption` div. No more `left-1/2`, `translateX(-50%)`, or `w-max` — the caption simply sits in the flex column, constrained to the card width.

---

## 2026-02-07

### Fixed: Mobile caption bleeding off screen

On mobile, the card caption (title + description) was centered under each individual card. For edge cards (Jack on the far left, Ace on the far right), the caption was wider than the card and overflowed off-screen.

Replaced the per-card mobile caption with a single shared caption area centered below the entire card row. Desktop captions remain per-card and unchanged.

**Changes:**

#### `src/components/PlayingCard.tsx`

- Per-card caption is now hidden on mobile (`hidden sm:block`). Desktop behavior unchanged.
- Removed mobile-specific size classes (`text-[10px]`, `text-[8px]`, `mt-1`) since the caption no longer renders on small screens.

#### `src/components/CardDeck.tsx`

- Added `activeCard` lookup based on `lastFlippedId` + `flippedCards` state.
- Wrapped card row and new caption in a flex column layout.
- Added a shared mobile caption `<div>` (`sm:hidden`) below the card row that displays the active card's title and description, centered with full viewport width available.
- Simplified the `showCaption` prop — on mobile it's always `false` (captions handled by the shared area), on desktop it's `flippedCards.has(card.id)` as before.

---

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
