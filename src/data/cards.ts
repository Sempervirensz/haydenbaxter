export interface CardData {
  id: number;
  rank: string;
  suit: "club" | "heart" | "diamond" | "spade";
  color: "black" | "red";
  title: string;
  description: string;
  faceImage: string;
  backVariant: "black" | "red";
  bunchedTransform: {
    translateX: number;
    translateY: number;
    rotate: number;
    scale: number;
  };
}

/* `bunchedTransform.translateY` was -65 / +20 while the bunched pose was never
   actually visible — progress was pinned to 1 on most viewports, so nothing ever
   rendered it. Now that the scroll-dealt entry starts there, it is the first
   thing a visitor sees, and at that amplitude the fan rode up THROUGH the
   headline: measured 25px of overlap at 820x1180 and 1280x780, 41px at 1440x900
   and 57px at 1920x1080, covering the last line of "…sustainability meets
   next-gen tech."
   Flattened to -20 / +8. The horizontal throw (±100 / ±40) and the rotation
   (±24 / ±12) are untouched — those are what make the deck read as a bunched
   fan; the vertical rise was only ever adding overlap. Phones were already
   clear (22px) and gain a little more. */
export const CARDS: CardData[] = [
  {
    id: 0,
    rank: "J",
    suit: "club",
    color: "black",
    title: "JACK OF ALL TRADES",
    description: "Range is the strategy, not the compromise.",
    faceImage: "/images/cards/jack-of-clubs.svg",
    backVariant: "black",
    bunchedTransform: { translateX: 100, translateY: 8, rotate: -24, scale: 0.95 },
  },
  {
    id: 1,
    rank: "Q",
    suit: "heart",
    color: "red",
    title: "QUEEN OF VISION",
    description: "Shapes ideas with taste, direction, and emotional precision.",
    faceImage: "/images/cards/queen-of-hearts.svg",
    backVariant: "red",
    bunchedTransform: { translateX: 40, translateY: -20, rotate: -12, scale: 1 },
  },
  {
    id: 2,
    rank: "K",
    suit: "diamond",
    color: "red",
    title: "KING OF STRATEGY",
    description: "Sees the system, finds the pattern, and builds with intent.",
    faceImage: "/images/cards/king-of-diamonds.svg",
    backVariant: "red",
    bunchedTransform: { translateX: -40, translateY: -20, rotate: 12, scale: 1 },
  },
  {
    id: 3,
    rank: "A",
    suit: "spade",
    color: "black",
    title: "ACE OF EXECUTION",
    description: "Turns strong ideas into real, polished outcomes.",
    faceImage: "/images/cards/ace-of-spades-mountain-card.webp",
    backVariant: "black",
    bunchedTransform: { translateX: -100, translateY: 8, rotate: 24, scale: 0.95 },
  },
];
