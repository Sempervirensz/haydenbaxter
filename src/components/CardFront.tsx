import type { CardData } from "@/data/cards";

interface CardFrontProps {
  card: CardData;
}

export default function CardFront({ card }: CardFrontProps) {
  const isRed = card.color === "red";
  const textColor = isRed ? "#b91c1c" : "#1a1a1a";
  const bgColor = isRed
    ? "rgba(255, 255, 255, 0.92)"
    : "rgba(255, 255, 255, 0.92)";

  return (
    <div className="w-full h-full bg-white relative select-none overflow-hidden">
      {/* Real playing card face image */}
      <img
        src={card.faceImage}
        alt={`${card.rank} of ${card.suit}s`}
        className="w-full h-full object-contain"
        draggable={false}
      />

      {/* Title + description overlay banner */}
      <div
        className="absolute inset-x-0 card-overlay-banner flex flex-col items-center gap-1 py-2 px-3"
        style={{
          background: bgColor,
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      >
        <h3
          className="card-overlay-title font-bold text-center leading-tight tracking-wider"
          style={{
            color: textColor,
            fontFamily: "var(--font-serif)",
          }}
        >
          {card.title}
        </h3>
        <p
          className="card-overlay-desc text-center leading-snug max-w-[220px] font-medium"
          style={{
            color: textColor,
            fontFamily: "var(--font-sans)",
          }}
        >
          {card.description}
        </p>
      </div>
    </div>
  );
}
