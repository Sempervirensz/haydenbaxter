"use client";

import { WORK_LANDING, WORK_SCREENS, WORK_SCROLL_CONFIG, type WorkScreen } from "@/data/work";
import { useWorkScroll } from "@/hooks/useWorkScroll";
import WorldPulseDetail from "@/components/work/WorldPulseDetail";
import ETBDetail from "@/components/work/ETBDetail";
import SupplyChainDetail from "@/components/work/SupplyChainDetail";
import ConsultingHeroStage from "@/components/work/ConsultingHeroStage";

function DetailBody({ screen, isActive }: { screen: WorkScreen; isActive: boolean }) {
  switch (screen.type) {
    case "full":
      return <WorldPulseDetail data={screen.full} />;
    case "emerging-tech-builds":
      return <ETBDetail data={screen.etb} />;
    case "supply-chain":
      return <SupplyChainDetail data={screen.supplyChain} isActive={isActive} />;
    case "consulting":
      return <ConsultingHeroStage isActive={isActive} />;
    default:
      return null;
  }
}

export default function WorkSection() {
  const { ref, screenIndex, cdDeg, activeLabel } = useWorkScroll();

  const trackList = WORK_SCROLL_CONFIG.zones.filter((z) => z.label !== "");

  return (
    <section id="work" ref={ref} className="work">
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
              <div className="cd-disc" style={{ '--cd-deg': `${cdDeg}deg` } as React.CSSProperties} />
            </div>
          </div>
        </article>
      </div>

      {WORK_SCREENS.map((screen, idx) => {
        const detailScreenIndex = idx + 1;
        const isActive = screenIndex === detailScreenIndex;

        return (
          <div
            key={screen.id}
            className="work__chapter work__chapter--detail"
            style={{ zIndex: idx + 2 }}
          >
            <article className="work__screen work__screen--detail">
              <header className="work__detail-head">
                <span className="work__detail-num">{screen.number}</span>
                <h3 className="work__detail-name">
                  {screen.logo ? (
                    <img
                      src={screen.logo.src}
                      alt={screen.logo.alt}
                      className="detail-logo"
                    />
                  ) : (
                    screen.name
                  )}
                </h3>
                <span className="work__detail-line" />
              </header>

              <DetailBody screen={screen} isActive={isActive} />
            </article>
          </div>
        );
      })}
    </section>
  );
}
