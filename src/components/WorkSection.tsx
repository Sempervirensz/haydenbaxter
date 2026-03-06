"use client";

import { WORK_LANDING, WORK_SCREENS } from "@/data/work";
import { useWorkScroll } from "@/hooks/useWorkScroll";

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

          <div className="cd-slot" aria-hidden="true">
            <div className="cd-disc" style={{ transform: `rotate(${cdDeg}deg)` }} />
          </div>
          <div className="cd-active-label">{activeLabel}</div>
        </article>

        {WORK_SCREENS.map((screen, idx) => {
          const detailScreenIndex = idx + 1;
          return (
            <article
              key={screen.id}
              className={`work__screen work__screen--detail ${
                screenIndex === detailScreenIndex ? "is-active" : ""
              } ${screenIndex > detailScreenIndex ? "is-past" : ""}`}
            >
              <header className="work__detail-head">
                <span className="work__detail-num">{screen.number}</span>
                <h3 className="work__detail-name">{screen.name}</h3>
                <span className="work__detail-line" />
              </header>

              <div className="work-detail-card">
                <p className="work-detail-card__eyebrow">{screen.title}</p>
                <p className="work-detail-card__desc">{screen.description}</p>
                <ul className="work-detail-card__list">
                  {screen.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
