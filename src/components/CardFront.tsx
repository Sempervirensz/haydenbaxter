import type { CardData } from "@/data/cards";

interface CardFrontProps {
  card: CardData;
}

export default function CardFront({ card }: CardFrontProps) {
  const isRed = card.color === "red";
  const textColor = isRed ? "#b91c1c" : "#1a1a1a";

  return (
    <div className="w-full h-full bg-white relative select-none overflow-hidden">
      {/* Real playing card face image — completely unobscured */}
      <img
        src={card.faceImage}
        alt={`${card.rank} of ${card.suit}s`}
        className="w-full h-full object-contain"
        draggable={false}
      />
    </div>
  );
}
