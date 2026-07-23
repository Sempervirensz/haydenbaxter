"use client";

import { NARRATIVE_VARIANTS } from "@/data/narrativeLab";
import BrandsCarousel from "@/components/BrandsCarousel";
import "./narrative-lab.css";

export default function NarrativeLab() {
  const active = NARRATIVE_VARIANTS.find((variant) => variant.id === "proof_first") ?? NARRATIVE_VARIANTS[0];

  if (!active) return null;

  return (
    <main className="nl-page bg-[#0a0a0a]">
      <section className="flex flex-col items-center relative bg-[#0a0a0a] overflow-hidden nl-hero-shell" aria-live="polite">
        <nav
          className="nl-nav"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          <span className="text-white text-xs sm:text-sm font-medium tracking-wide">Hayden Baxter</span>
          <div className="nav-tags flex items-center gap-2 sm:gap-3">
            <span className="tag tag--nav">Work</span>
            <span className="tag tag--nav">WorldPulse</span>
            <span className="tag tag--nav">About</span>
            <span className="tag tag--nav">Journal</span>
            <span className="tag tag--cta">Book a Call</span>
          </div>
        </nav>

        <div className="nl-hero-copy">
          <p className="text-[10px] sm:text-sm tracking-[0.12em] sm:tracking-[0.2em] uppercase text-white/60 mb-3 sm:mb-6 nl-eyebrow">
            {active.hero.eyebrow}
          </p>
          <h1 className="text-[28px] sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.08] sm:leading-[1.04] max-w-5xl nl-headline">
            {active.hero.headline}
          </h1>
          <p className="nl-subhead">{active.hero.subhead}</p>
        </div>
      </section>

      <section className="bg-[#0a0a0a] relative pb-8 nl-real-rhythm">
        <div className="nl-route-cards">
          <article className="nl-route-card">
            <p className="nl-route-label">AI Builds</p>
            <p>Agents, workflow tools, and product prototypes built around real constraints.</p>
          </article>
          <article className="nl-route-card">
            <p className="nl-route-label">WorldPulse</p>
            <p>A venture path focused on digital product passports, provenance, and product storytelling.</p>
          </article>
          <article className="nl-route-card">
            <p className="nl-route-label">Supply Chain</p>
            <p>Experience across sourcing, supplier systems, governance, and cross-border execution.</p>
          </article>
          <article className="nl-route-card">
            <p className="nl-route-label">Consulting</p>
            <p>Practical support for roadmap, prototyping, and implementation.</p>
          </article>
        </div>
      </section>

      <BrandsCarousel />

      <section className="work nl-work-stage">
        <div className="work__screen work__screen--landing nl-work-frame">
          <ol className="wl-c2__list" aria-label="Narrative sections">
            <li className={`wl-c2__item ${active.worldPulse.priority === "primary" ? "is-active" : ""}`}>
              <span className="wl-c2__num">01</span>
              <span className="wl-c2__name">WorldPulse</span>
            </li>
            <li className={`wl-c2__item ${active.emergingTech.priority === "primary" ? "is-active" : ""}`}>
              <span className="wl-c2__num">02</span>
              <span className="wl-c2__name">Emerging Tech Builds</span>
            </li>
            <li className={`wl-c2__item ${active.supplyChain.priority === "primary" ? "is-active" : ""}`}>
              <span className="wl-c2__num">03</span>
              <span className="wl-c2__name">Supply Chain</span>
            </li>
            <li className={`wl-c2__item ${active.consulting.priority === "primary" ? "is-active" : ""}`}>
              <span className="wl-c2__num">04</span>
              <span className="wl-c2__name">Consulting</span>
            </li>
          </ol>

          <div className="cd-player-wrap" aria-hidden="true">
            <img src="/playerforeground.png" alt="" className="cd-player-fg" />
            <div className="cd-disc-overlay">
              <div className="cd-disc" style={{ "--cd-deg": "-18deg" } as React.CSSProperties} />
            </div>
          </div>
        </div>
      </section>

      <section className="nl-sections">
        <article className={`nl-section-card ${active.worldPulse.priority === "primary" ? "is-primary" : ""}`}>
          <p className="nl-section-label">WorldPulse</p>
          <h3>{active.worldPulse.heading}</h3>
          <p>{active.worldPulse.framing}</p>
        </article>

        <article className={`nl-section-card ${active.emergingTech.priority === "primary" ? "is-primary" : ""}`}>
          <p className="nl-section-label">Emerging Tech / Past Builds</p>
          <h3>{active.emergingTech.heading}</h3>
          <p>{active.emergingTech.framing}</p>
        </article>

        <article className={`nl-section-card ${active.supplyChain.priority === "primary" ? "is-primary" : ""}`}>
          <p className="nl-section-label">Supply Chain</p>
          <h3>{active.supplyChain.heading}</h3>
          <p>{active.supplyChain.framing}</p>
        </article>

        <article className={`nl-section-card ${active.consulting.priority === "primary" ? "is-primary" : ""}`}>
          <p className="nl-section-label">Consulting</p>
          <h3>{active.consulting.heading}</h3>
          <p>{active.consulting.framing}</p>
        </article>
      </section>

      <section className="nl-flow-rail" aria-label="Section order preview">
        <article className="nl-flow-card">
          <p className="nl-flow-label">About</p>
          <p>{active.aboutJournalConnect.about}</p>
        </article>
        <article className="nl-flow-card">
          <p className="nl-flow-label">Journal</p>
          <p>{active.aboutJournalConnect.journal}</p>
        </article>
        <article className="nl-flow-card">
          <p className="nl-flow-label">Connect</p>
          <p>{active.aboutJournalConnect.connect}</p>
        </article>
      </section>
    </main>
  );
}
