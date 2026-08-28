"use client";

import { WORK_LANDING, WORK_SCREENS, WORK_SCROLL_CONFIG, type WorkScreen } from "@/data/work";
import { useWorkScroll } from "@/hooks/useWorkScroll";
import WorldPulseDetail from "@/components/work/WorldPulseDetail";
import ETBDetail from "@/components/work/ETBDetail";
import SupplyChainDetail from "@/components/work/SupplyChainDetail";
import ConsultingHeroStage from "@/components/work/ConsultingHeroStage";
import WorkChapterList from "@/components/work/WorkChapterList";
import ScrollCue from "@/components/work/ScrollCue";

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
  const { ref, screenIndex, activeLabel } = useWorkScroll();

  return (
    <section id="work" ref={ref} className="work">
      <div className="work__chapter work__chapter--landing" style={{ zIndex: 1 }}>
        <article className="work__screen work__screen--landing">
          <WorkChapterList activeLabel={activeLabel} />

          <div className="cd-player-wrap" aria-hidden="true">
            <img src="/playershellpngtransparent.png" alt="" className="cd-player-shell" />
            <img src="/playerforeground.png" alt="" className="cd-player-fg" />
            <div className="cd-disc-overlay">
              <div className="cd-disc" />
            </div>
          </div>

          <ScrollCue />
        </article>
      </div>

      {WORK_SCREENS.map((screen, idx) => {
        const detailScreenIndex = idx + 1;
        const isActive = screenIndex === detailScreenIndex;

        const screenModifier =
          screen.type === "consulting" ? " work__screen--consulting" : "";

        return (
          <div
            key={screen.id}
            className="work__chapter work__chapter--detail"
            style={{ zIndex: idx + 2 }}
          >
            <article className={`work__screen work__screen--detail${screenModifier}`}>
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
