"use client";

import { WORK_SCREENS, type WorkScreen } from "@/data/work";
import WorldPulseDetail from "@/components/work/WorldPulseDetail";
import ETBDetail from "@/components/work/ETBDetail";
import SupplyChainDetail from "@/components/work/SupplyChainDetail";
import ConsultingDetail from "@/components/work/ConsultingDetail";

export interface CardData {
  id: string;
  num: string;
  name: string;
  screen: WorkScreen;
  accent: string;
}

export const CARDS: CardData[] = [
  {
    id: "worldpulse",
    num: "01",
    name: "WorldPulse",
    screen: WORK_SCREENS[0],
    accent: "#2a6b4f",
  },
  {
    id: "etb",
    num: "02",
    name: "Emerging Tech",
    screen: WORK_SCREENS[1],
    accent: "#4a3d8f",
  },
  {
    id: "supply-chain",
    num: "03",
    name: "Supply Chain",
    screen: WORK_SCREENS[2],
    accent: "#8f5a2a",
  },
  {
    id: "consulting",
    num: "04",
    name: "Consulting",
    screen: WORK_SCREENS[3],
    accent: "#2a5a8f",
  },
];

function DetailBody({ screen }: { screen: WorkScreen }) {
  switch (screen.type) {
    case "full":
      return <WorldPulseDetail data={screen.full} />;
    case "emerging-tech-builds":
      return <ETBDetail data={screen.etb} />;
    case "supply-chain":
      return <SupplyChainDetail data={screen.supplyChain} isActive />;
    case "consulting":
      return <ConsultingDetail data={screen.consulting} isActive />;
    default:
      return null;
  }
}

export default function CardContent({ card }: { card: CardData }) {
  return (
    <div className="sl-card" style={{ "--card-accent": card.accent } as React.CSSProperties}>
      <span className="sl-card__sheen" aria-hidden="true" />
      <header className="sl-card__header">
        <span className="sl-card__num">{card.num} / 04</span>
        <h3 className="sl-card__name">
          {card.screen.logo ? (
            <img
              src={card.screen.logo.src}
              alt={card.screen.logo.alt}
              className="sl-card__logo"
            />
          ) : (
            card.name
          )}
        </h3>
        <span className="sl-card__line" />
      </header>
      <div className="sl-card__content">
        <DetailBody screen={card.screen} />
      </div>
    </div>
  );
}
