"use client";

import { WORK_LANDING, WORK_SCREENS, type WorkScreen } from "@/data/work";
import { useWorkScroll } from "@/hooks/useWorkScroll";
import WorldPulseDetail from "@/components/work/WorldPulseDetail";
import ETBDetail from "@/components/work/ETBDetail";
import SupplyChainDetail from "@/components/work/SupplyChainDetail";
import ConsultingDetail from "@/components/work/ConsultingDetail";

function DetailBody({ screen, isActive }: { screen: WorkScreen; isActive: boolean }) {
  switch (screen.type) {
    case "full":
      return <WorldPulseDetail data={screen.full} />;
    case "emerging-tech-builds":
      return <ETBDetail data={screen.etb} />;
    case "supply-chain":
      return <SupplyChainDetail data={screen.supplyChain} isActive={isActive} />;
    case "consulting":
      return <ConsultingDetail data={screen.consulting} isActive={isActive} />;
    default:
      return null;
  }
}

export default function WorkSection() {
  const { ref, screenIndex, cdDeg, activeLabel, hintHidden } = useWorkScroll();

  return (
    <section id="work" ref={ref} className="work">
      <div className="work__inner">
        <article
          className={`work__screen work__screen--landing ${
            screenIndex === 0 ? "is-active" : ""
          } ${screenIndex > 0 ? "is-past" : ""}`}
        >
          <h2 className="wl-title">{WORK_LANDING.title}</h2>
          <p className="wl-quote">{WORK_LANDING.quote}</p>

          <div className={`scroll-hint ${hintHidden ? "is-hidden" : ""}`}>
            <div className="scroll-hint__mouse" />
            <span className="scroll-hint__text">{WORK_LANDING.scrollHint}</span>
          </div>

          <div className="cd-player-wrap" aria-hidden="true">
            <img src="/playershellpngtransparent.png" alt="" className="cd-player-shell" />
            <img src="/playerforeground.png" alt="" className="cd-player-fg" />
            <div className="cd-disc-overlay">
              <div className="cd-disc" style={{ '--cd-deg': `${cdDeg}deg` } as React.CSSProperties} />
            </div>
          </div>
          <div className="cd-active-label">{activeLabel}</div>
        </article>

        {WORK_SCREENS.map((screen, idx) => {
          const detailScreenIndex = idx + 1;
          const isActive = screenIndex === detailScreenIndex;

          return (
            <article
              key={screen.id}
              className={`work__screen work__screen--detail ${
                isActive ? "is-active" : ""
              } ${screenIndex > detailScreenIndex ? "is-past" : ""}`}
            >
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
          );
        })}
      </div>
    </section>
  );
}
