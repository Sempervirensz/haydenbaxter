"use client";

// Mobile Work section — the <1024px branch of WorkSectionResponsive.
//
// This is the production home for the four APPROVED mobile card designs
// (WorldPulse B · Emerging Tech B · Supply Chain A · Consulting C). It replaces
// ONLY the four detail-card bodies. Everything that binds Work into the rest of
// the site is reused verbatim from the legacy WorkSection:
//
//   • the same `#work` anchor + `useWorkScroll` hook  → CD scroll + chapter
//     state on tablets, and the same ≤640px touch short-circuit on phones
//   • the same landing chapter markup (CD player + `.cd-disc` + TOC list)
//   • the same `.work__chapter--detail` scroll tracks (300vh tablet / auto
//     phone) and the same sticky `.work__screen` positioning
//
// so scroll height, timing, chapter progression, and the hand-off into About
// are unchanged. Only the card CONTENT differs — the glass `work__detail-head`
// frame is replaced by each approved card, which carries its own chapter rail
// (reading the same number/name from WORK_SCREENS).
//
// The legacy WorkSection.tsx is left intact for the labs that still import it.

import { WORK_LANDING, WORK_SCREENS, WORK_SCROLL_CONFIG } from "@/data/work";
import { useWorkScroll } from "@/hooks/useWorkScroll";
import MobileWorldPulseCard from "./mobile/MobileWorldPulseCard";
import MobileEtbCard from "./mobile/MobileEtbCard";
import MobileSupplyChainCard from "./mobile/MobileSupplyChainCard";
import MobileConsultingCard from "./mobile/MobileConsultingCard";
import "./mobile/work-mobile-cards.css";

const CARD_BY_ID: Record<number, () => React.JSX.Element> = {
  1: MobileWorldPulseCard,
  2: MobileEtbCard,
  3: MobileSupplyChainCard,
  4: MobileConsultingCard,
};

export default function WorkSectionMobile() {
  const { ref, activeLabel } = useWorkScroll();

  const trackList = WORK_SCROLL_CONFIG.zones.filter((z) => z.label !== "");

  return (
    <section id="work" ref={ref} className="work work--mobile">
      {/* Landing chapter — copied verbatim from WorkSection so the CD player,
          `.cd-disc` (which useWorkScroll spins on tablet), and the TOC list all
          behave identically. */}
      <div className="work__chapter work__chapter--landing" style={{ zIndex: 1 }}>
        <article className="work__screen work__screen--landing">
          <ol className="wl-c2__list" aria-label={WORK_LANDING.title}>
            {trackList.map((zone, i) => {
              const isActive = zone.label === activeLabel;
              return (
                <li
                  key={zone.label}
                  className={`wl-c2__item ${isActive ? "is-active" : ""}`}
                >
                  <span className="wl-c2__num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="wl-c2__name">{zone.label}</span>
                </li>
              );
            })}
          </ol>

          <div className="cd-player-wrap" aria-hidden="true">
            <img src="/playershellpngtransparent.png" alt="" className="cd-player-shell" />
            <img src="/playerforeground.png" alt="" className="cd-player-fg" />
            <div className="cd-disc-overlay">
              <div className="cd-disc" />
            </div>
          </div>
        </article>
      </div>

      {WORK_SCREENS.map((screen, idx) => {
        const Card = CARD_BY_ID[screen.id];
        return (
          <div
            key={screen.id}
            className="work__chapter work__chapter--detail"
            style={{ zIndex: idx + 2 }}
          >
            {/* `.work__screen` keeps the sticky-on-tablet positioning; the
                `.wmob-screen` modifier drops the glass frame and establishes the
                query container the card sizes against. */}
            <div className="work__screen wmob-screen">
              <div className="wm-chapter">
                {Card ? <Card /> : null}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
