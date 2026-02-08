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
    description: "I'm a generalist with expertise in multiple design disciplines",
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
    description: "Can create designs that form connections and steal hearts ;)",
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
    description: "My formula for great design: Zoom in, Zoom Out, Repeat",
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
    description: "Got an Idea? I've got the skills to make it real",
    faceImage: "/cards/spades_ace.svg",
    backVariant: "black",
    bunchedTransform: { translateX: -100, translateY: 20, rotate: 24, scale: 0.95 },
  },
];
