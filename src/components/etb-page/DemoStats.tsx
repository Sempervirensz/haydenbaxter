import type { ETBStat } from "@/data/work";

interface Props {
  stats: ETBStat[];
}

/** Glanceable "by the numbers" tiles surfaced above the screenshot wall.
 *  DYMO-flavored: inset emboss, mono labels, editorial value. */
export default function DemoStats({ stats }: Props) {
  return (
    <section className="etb-stats" aria-label="By the numbers">
      <ul className="etb-stats__grid">
        {stats.map((stat) => (
          <li key={stat.label} className="etb-stat">
            <span className="etb-stat__icon" aria-hidden="true">
              <StatIcon name={stat.icon} />
            </span>
            <span className="etb-stat__label">{stat.label}</span>
            <span className="etb-stat__value">{stat.value}</span>
            <span className="etb-stat__detail">{stat.detail}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function StatIcon({ name }: { name?: ETBStat["icon"] }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "pulse":
      return (
        <svg {...common}>
          <path d="M3 12h3l2-5 4 10 2-5h7" />
        </svg>
      );
    case "trend-up":
      return (
        <svg {...common}>
          <path d="M3 17 10 10l4 4 7-7" />
          <path d="M14 7h7v7" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
          <path d="M7 14h2M11 14h2M15 14h2M7 17h2M11 17h2" />
        </svg>
      );
    case "checklist":
      return (
        <svg {...common}>
          <path d="M4 7l2 2 3-3" />
          <path d="M4 14l2 2 3-3" />
          <path d="M13 8h7M13 15h7" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common}>
          <path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
        </svg>
      );
    case "bot":
      return (
        <svg {...common}>
          <rect x="4" y="8" width="16" height="11" rx="3" />
          <path d="M12 4v4M8 13h.01M16 13h.01" />
          <path d="M9 17h6" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
  }
}
