import Image from "next/image";
import type { CardData } from "@/data/cards";

interface CardFrontProps {
  card: CardData;
}

export default function CardFront({ card }: CardFrontProps) {
  return (
    <div className="w-full h-full bg-white relative select-none overflow-hidden">
      <Image
        src={card.faceImage}
        alt={`${card.rank} of ${card.suit}s`}
        fill
        sizes="(max-width: 640px) 25vw, 280px"
        className="object-contain"
        loading="lazy"
        draggable={false}
      />
    </div>
  );
}
