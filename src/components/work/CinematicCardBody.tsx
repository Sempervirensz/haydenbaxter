"use client";

// Shared cinematic card content — one project rendered in the cinematic frame.
// Used by both the standalone lab stack (CinematicWorkStack) and the merged Work
// section (WorkSectionCinematic) so the two never diverge.
//
//   - 01 WorldPulse   media  — full-bleed photo + hover-revealed frosted glass
//   - 02 AI & Emerging Tech panel — the deployed candy-bar gallery (ETBDetail)
//   - 03 Supply Chain  panel — the deployed globe + journey (SupplyChainDetail)
//   - 04 Consulting    media — cityscape + its built-in reveal (ConsultingHeroStage)
//
// Renders the card BODY + the header + the dim layer; the parent supplies the
// surrounding <article className="cstack__card …"> and the chapter wrapper.

import { WORK_SCREENS, type WorkScreen } from "@/data/work";
import ETBDetail from "@/components/work/ETBDetail";
import SupplyChainDetail from "@/components/work/SupplyChainDetail";
import ConsultingHeroStage from "@/components/work/ConsultingHeroStage";

export type CardId = 1 | 2 | 3 | 4;
export type CardKind = "media" | "panel";

export interface CardMeta {
  id: CardId;
  num: string;
  name: string;
  tagline: string;
  kind: CardKind;
}

export const CINEMATIC_CARDS: CardMeta[] = [
  { id: 1, num: "01", name: "WorldPulse", tagline: "Digital product passports, made human.", kind: "media" },
  { id: 2, num: "02", name: "AI & Emerging Tech Builds", tagline: "Small tools, sharpened into systems.", kind: "panel" },
  { id: 3, num: "03", name: "Supply Chain", tagline: "Eight years across Asia, systemized.", kind: "panel" },
  { id: 4, num: "04", name: "Consulting", tagline: "Strategy that ships.", kind: "media" },
];

function screenOf(type: WorkScreen["type"]): WorkScreen | undefined {
  return WORK_SCREENS.find((s) => s.type === type);
}

interface Props {
  card: CardMeta;
  /** Drives Supply Chain globe reveal + Consulting reveal. */
  isActive: boolean;
  /** WorldPulse frosted-glass open state (hover/focus also open it via CSS). */
  peek: boolean;
  onTogglePeek: () => void;
}

export default function CinematicCardBody({ card, isActive, peek, onTogglePeek }: Props) {
  const body = (() => {
    switch (card.id) {
      case 1: {
        const wp = screenOf("full");
        const full = wp && wp.type === "full" ? wp.full : null;
        return (
          <>
            <div className="cstack__hero">
              <div
                className="cstack__heroImg"
                style={{ backgroundImage: 'url("/WorldPulseCostal3.0.webp")' }}
              />
            </div>
            <div className="cstack__scrim" aria-hidden="true" />
            {/* Option C — balanced safe zones: headline sits in the clean upper-left
                sky band; the trigger + panel live bottom-right, each clear of the
                subject and of each other. */}
            <p className="cstack__caption">{card.tagline}</p>
            <div className="cstack__foot">
              <div className={`cstack__infoWrap ${peek ? "is-peek" : ""}`}>
                {/* Invisible hover bridge — spans the gap between the trigger and the
                    panel so pointer travel never leaves the group and the panel can't
                    vanish mid-reach (kept a real element so overflow:auto can't clip it). */}
                <span className="cstack__bridge" aria-hidden="true" />
                <div className="cstack__glass" role="group" aria-label="WorldPulse details">
                  <span className="cstack__glassSheen" aria-hidden="true" />
                  <span className="cstack__glassLabel">WorldPulse · Founder</span>
                  {full?.caption.map((para, i) => (
                    <p key={i} className="cstack__glassText">{para}</p>
                  ))}
                  {full && (
                    <a
                      className="cstack__glassLink"
                      href={full.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {full.link.label}
                      <span className="cstack__glassArrow" aria-hidden="true">→</span>
                    </a>
                  )}
                </div>
                <button
                  type="button"
                  className="cstack__infoBtn"
                  onClick={onTogglePeek}
                  aria-expanded={peek}
                >
                  Explore WorldPulse <span aria-hidden="true">▸</span>
                </button>
              </div>
            </div>
          </>
        );
      }
      case 2: {
        const etb = screenOf("emerging-tech-builds");
        return (
          <div className="cstack__panelBody">
            <div className="etb-gallery__shell cstack__etbShell">
              {etb && etb.type === "emerging-tech-builds" && <ETBDetail data={etb.etb} />}
            </div>
          </div>
        );
      }
      case 3: {
        const sc = screenOf("supply-chain");
        return (
          <div className="cstack__panelBody cstack__panelBody--sc">
            {sc && sc.type === "supply-chain" && (
              <SupplyChainDetail data={sc.supplyChain} isActive={isActive} />
            )}
          </div>
        );
      }
      case 4:
        return (
          <>
            <div className="cstack__scrim cstack__scrim--head" aria-hidden="true" />
            <div className="cstack__consulting">
              <ConsultingHeroStage isActive={isActive} />
            </div>
          </>
        );
      default:
        return null;
    }
  })();

  return (
    <>
      {body}
      <header className="cstack__head">
        <span className="cstack__num">
          {card.num} — {card.name}
        </span>
        <span className="cstack__line" />
      </header>
      <div className="cstack__dim" aria-hidden="true" />
    </>
  );
}
