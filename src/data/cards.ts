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

export const CARDS: CardData[] = [
  {
    id: 0,
    rank: "J",
    suit: "club",
    color: "black",
    title: "JACK OF ALL TRADES",
    description: "Range is the strategy, not the compromise.",
    faceImage: "/cards/clubs_jack.svg",
    backVariant: "black",
    bunchedTransform: { translateX: 100, translateY: 20, rotate: -24, scale: 0.95 },
  },
  {
    id: 1,
    rank: "Q",
    suit: "heart",
    color: "red",
    title: "QUEEN OF VISION",
    description: "Shapes ideas with taste, direction, and emotional precision.",
    faceImage: "/cards/hearts_queen.svg",
    backVariant: "red",
    bunchedTransform: { translateX: 40, translateY: -65, rotate: -12, scale: 1 },
  },
  {
    id: 2,
    rank: "K",
    suit: "diamond",
    color: "red",
    title: "KING OF STRATEGY",
    description: "Sees the system, finds the pattern, and builds with intent.",
    faceImage: "/cards/diamonds_king.svg",
    backVariant: "red",
    bunchedTransform: { translateX: -40, translateY: -65, rotate: 12, scale: 1 },
  },
  {
    id: 3,
    rank: "A",
    suit: "spade",
    color: "black",
    title: "ACE OF EXECUTION",
    description: "Turns strong ideas into real, polished outcomes.",
    faceImage: "/cards/hf_20260210_001825_ff0bfcdc-a15d-4636-94e5-ef8ffc7cf4aa.jpeg",
    backVariant: "black",
    bunchedTransform: { translateX: -100, translateY: 20, rotate: 24, scale: 0.95 },
  },
];
