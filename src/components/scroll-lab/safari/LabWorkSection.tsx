"use client";

import { memo, useEffect } from "react";
import { WORK_LANDING, WORK_SCREENS, WORK_SCROLL_CONFIG, type WorkScreen } from "@/data/work";
import WorldPulseDetail from "@/components/work/WorldPulseDetail";
import ETBDetail from "@/components/work/ETBDetail";
import SupplyChainDetail from "@/components/work/SupplyChainDetail";
import ConsultingHeroStage from "@/components/work/ConsultingHeroStage";
import { useWorkScrollLab } from "./useWorkScrollLab";
import type { LabConfig } from "./config";

function DetailBodyRaw({ screen, isActive, pauseGlobe }: {
  screen: WorkScreen;
  isActive: boolean;
  pauseGlobe: boolean;
}) {
  switch (screen.type) {
    case "full":
      return <WorldPulseDetail data={screen.full} />;
    case "emerging-tech-builds":
      return <ETBDetail data={screen.etb} />;
    case "supply-chain":
      // pause-offscreen variant: unmount globe-bearing detail entirely when
      // chapter isn't active so the Canvas + useFrame loops stop.
      if (pauseGlobe && !isActive) {
        return <div className="sc-journey" aria-hidden style={{ minHeight: "60vh" }} />;
      }
      return <SupplyChainDetail data={screen.supplyChain} isActive={isActive} />;
    case "consulting":
      return <ConsultingHeroStage isActive={isActive} />;
    default:
      return null;
  }
}

const DetailBody = memo(DetailBodyRaw);

interface LabWorkSectionProps {
  config: LabConfig;
}

export default function LabWorkSection({ config }: LabWorkSectionProps) {
  const { ref, screenIndex, activeLabel } = useWorkScrollLab({
    mode: config.scrollHook,
    cdTransform: config.cdTransform,
  });

  const trackList = WORK_SCROLL_CONFIG.zones.filter((z) => z.label !== "");

  // Apply rootCss variant by toggling classes on <html>. Cleaned up on unmount
  // so leaving the page restores normal behaviour.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("lab-scroll-active");
    if (config.rootCss === "safari-no-gutter") root.classList.add("lab-safari-no-gutter");
    if (config.rootCss === "safari-no-clip") root.classList.add("lab-safari-no-clip");
    return () => {
      root.classList.remove("lab-scroll-active", "lab-safari-no-gutter", "lab-safari-no-clip");
    };
  }, [config.rootCss]);

  const pauseGlobe = config.globe === "pause-offscreen";
  const Body = config.memoChapters === "on" ? DetailBody : DetailBodyRaw;

  return (
    <section
      id="work"
      ref={ref}
      className="work"
      data-lab="safari-scroll"
      data-lab-cards={config.safariCards}
      data-lab-sticky={config.sticky}
      data-lab-compositing={config.compositing}
    >
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

              <Body screen={screen} isActive={isActive} pauseGlobe={pauseGlobe} />
            </article>
          </div>
        );
      })}
    </section>
  );
}
