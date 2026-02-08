interface SuitIconProps {
  suit: "club" | "heart" | "diamond" | "spade";
  className?: string;
}

export default function SuitIcon({ suit, className = "" }: SuitIconProps) {
  return (
    <svg
      viewBox="0 0 120 140"
      width={120}
      height={140}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {suit === "club" && (
        <g fill="currentColor">
          {/* Top lobe */}
          <path d="M60 8 C60 8 40 8 35 28 C30 48 45 55 60 48 C75 55 90 48 85 28 C80 8 60 8 60 8Z" />
          {/* Left lobe */}
          <path d="M22 72 C10 55 18 35 38 38 C48 40 55 48 58 55 C50 65 38 70 28 65 C18 60 14 68 22 72Z" />
          {/* Right lobe */}
          <path d="M98 72 C110 55 102 35 82 38 C72 40 65 48 62 55 C70 65 82 70 92 65 C102 60 106 68 98 72Z" />
          {/* Stem */}
          <path d="M54 65 Q56 85 48 105 Q44 112 40 115 L80 115 Q76 112 72 105 Q64 85 66 65 Z" />
          {/* Ornate inner details */}
          <g fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3">
            <path d="M60 18 C55 18 48 22 46 32 C44 42 50 48 60 44 C70 48 76 42 74 32 C72 22 65 18 60 18Z" />
            <path d="M38 45 C32 42 26 48 30 55 C34 62 42 62 48 55" />
            <path d="M82 45 C88 42 94 48 90 55 C86 62 78 62 72 55" />
            {/* Decorative eye/face in top lobe */}
            <ellipse cx="60" cy="30" rx="8" ry="5" />
            <circle cx="56" cy="29" r="1.5" fill="currentColor" opacity="0.4" />
            <circle cx="64" cy="29" r="1.5" fill="currentColor" opacity="0.4" />
          </g>
          {/* Leaf veins in lobes */}
          <g stroke="currentColor" strokeWidth="0.5" opacity="0.2" fill="none">
            <path d="M60 15 L60 44" />
            <path d="M55 20 Q58 28 60 35" />
            <path d="M65 20 Q62 28 60 35" />
            <path d="M30 52 L50 52" />
            <path d="M70 52 L90 52" />
          </g>
        </g>
      )}
      {suit === "heart" && (
        <g fill="currentColor">
          {/* Main heart shape */}
          <path d="M60 115 C60 115 8 72 8 38 C8 15 28 5 45 12 C52 16 57 22 60 30 C63 22 68 16 75 12 C92 5 112 15 112 38 C112 72 60 115 60 115Z" />
          {/* Inner decorative heart outline */}
          <path
            d="M60 98 C60 98 22 65 22 40 C22 24 35 16 46 22 C52 25 57 32 60 40 C63 32 68 25 74 22 C85 16 98 24 98 40 C98 65 60 98 60 98Z"
            fill="none"
            stroke="white"
            strokeWidth="1.2"
            opacity="0.25"
          />
          {/* Ornate inner pattern — paisley/floral */}
          <g fill="none" stroke="white" strokeWidth="0.8" opacity="0.2">
            {/* Central vine */}
            <path d="M60 35 Q55 50 60 65 Q65 80 60 95" />
            {/* Left scrollwork */}
            <path d="M45 35 Q35 45 40 55 Q45 65 38 72" />
            <path d="M30 42 Q25 50 30 58" />
            {/* Right scrollwork */}
            <path d="M75 35 Q85 45 80 55 Q75 65 82 72" />
            <path d="M90 42 Q95 50 90 58" />
            {/* Top decorative curls */}
            <path d="M42 18 Q38 12 32 16" />
            <path d="M78 18 Q82 12 88 16" />
            {/* Small flower/medallion at center */}
            <circle cx="60" cy="55" r="8" />
            <circle cx="60" cy="55" r="4" />
          </g>
          {/* Small dots for texture */}
          <g fill="white" opacity="0.15">
            <circle cx="40" cy="45" r="1.5" />
            <circle cx="80" cy="45" r="1.5" />
            <circle cx="50" cy="70" r="1.5" />
            <circle cx="70" cy="70" r="1.5" />
            <circle cx="60" cy="85" r="1.5" />
          </g>
        </g>
      )}
      {suit === "diamond" && (
        <g fill="currentColor">
          {/* Main diamond */}
          <path d="M60 5 L110 68 L60 132 L10 68 Z" />
          {/* Inner diamond outline */}
          <path
            d="M60 18 L98 68 L60 118 L22 68 Z"
            fill="none"
            stroke="white"
            strokeWidth="1.2"
            opacity="0.25"
          />
          {/* Second inner diamond */}
          <path
            d="M60 32 L86 68 L60 104 L34 68 Z"
            fill="none"
            stroke="white"
            strokeWidth="0.8"
            opacity="0.18"
          />
          {/* Center ornament */}
          <g fill="none" stroke="white" strokeWidth="0.8" opacity="0.2">
            <circle cx="60" cy="68" r="12" />
            <circle cx="60" cy="68" r="6" />
            {/* Cross lines */}
            <line x1="60" y1="56" x2="60" y2="80" />
            <line x1="48" y1="68" x2="72" y2="68" />
            {/* Corner embellishments */}
            <path d="M60 18 Q55 28 50 35" />
            <path d="M60 18 Q65 28 70 35" />
            <path d="M60 118 Q55 108 50 101" />
            <path d="M60 118 Q65 108 70 101" />
          </g>
          {/* Point accents */}
          <g fill="white" opacity="0.15">
            <circle cx="60" cy="14" r="2" />
            <circle cx="104" cy="68" r="2" />
            <circle cx="60" cy="124" r="2" />
            <circle cx="16" cy="68" r="2" />
          </g>
        </g>
      )}
      {suit === "spade" && (
        <g fill="currentColor">
          {/* Main spade shape */}
          <path d="M60 5 C60 5 5 52 5 80 C5 100 22 110 40 104 C48 101 55 94 60 84 C65 94 72 101 80 104 C98 110 115 100 115 80 C115 52 60 5 60 5Z" />
          {/* Stem */}
          <path d="M54 88 Q56 105 48 118 Q44 124 40 128 L80 128 Q76 124 72 118 Q64 105 66 88 Z" />
          {/* Inner spade outline */}
          <path
            d="M60 22 C60 22 18 58 18 80 C18 94 28 100 40 96 C48 93 55 86 60 78 C65 86 72 93 80 96 C92 100 102 94 102 80 C102 58 60 22 60 22Z"
            fill="none"
            stroke="white"
            strokeWidth="1.2"
            opacity="0.25"
          />
          {/* Ornate inner details */}
          <g fill="none" stroke="white" strokeWidth="0.8" opacity="0.2">
            {/* Central vine */}
            <path d="M60 30 Q55 50 60 70 Q62 78 60 84" />
            {/* Left scroll */}
            <path d="M40 65 Q30 72 32 82 Q34 90 40 92" />
            {/* Right scroll */}
            <path d="M80 65 Q90 72 88 82 Q86 90 80 92" />
            {/* Top decorative element */}
            <path d="M55 35 Q50 42 52 50" />
            <path d="M65 35 Q70 42 68 50" />
            {/* Center medallion */}
            <circle cx="60" cy="60" r="8" />
            <circle cx="60" cy="60" r="4" />
          </g>
          {/* Texture dots */}
          <g fill="white" opacity="0.15">
            <circle cx="40" cy="72" r="1.5" />
            <circle cx="80" cy="72" r="1.5" />
            <circle cx="60" cy="45" r="1.5" />
            <circle cx="50" cy="85" r="1.5" />
            <circle cx="70" cy="85" r="1.5" />
          </g>
        </g>
      )}
    </svg>
  );
}
