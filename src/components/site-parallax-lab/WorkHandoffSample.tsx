"use client";

// Sticky Depth Handoff — isolated lab driven by the REAL Work detail cards
// 01–04 (WorldPulse / Emerging Tech Builds / Supply Chain / Consulting).
//
// Each card is the production `.work__screen--detail` glass panel rendering the
// actual detail component. Consulting reuses the ORIGINAL main-site design
// (ConsultingHeroStage → the reveal button that pops up offer options leading
// into the book-a-call dossier) — NOT the deleted cinema scroll effect. Because
// it's a regular panel, it sinks in the handoff like every other card.
//
// The handoff adds a per-frame sink + dim as the next card slides up and covers
// the current one. A Variation switcher tunes how aggressive that depth feels.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { WORK_SCREENS, type WorkScreen } from "@/data/work";
import WorldPulseDetail from "@/components/work/WorldPulseDetail";
import ETBDetail from "@/components/work/ETBDetail";
import SupplyChainDetail from "@/components/work/SupplyChainDetail";
import ConsultingHeroStage from "@/components/work/ConsultingHeroStage";
import "./site-parallax-lab.css";
import "./work-handoff.css";

// All four Work cards — every one is a regular panel that can sink in the handoff.
const SCREENS = WORK_SCREENS;

type VariationId = "site-true" | "deep" | "subtle";

const VARIATIONS: Record<
  VariationId,
  { label: string; desc: string; sinkY: number; sinkScale: number; dim: number }
> = {
  "site-true": {
    label: "Site-true",
    desc: "Production card size; gentle sink + dim as the next covers it.",
    sinkY: 0.04,
    sinkScale: 0.07,
    dim: 0.55,
  },
  deep: {
    label: "Deep sink",
    desc: "Cards recede further and darken more — strong depth stack.",
    sinkY: 0.075,
    sinkScale: 0.14,
    dim: 0.72,
  },
  subtle: {
    label: "Subtle",
    desc: "Barely-there handoff — cards stay flat with a light dim.",
    sinkY: 0.018,
    sinkScale: 0.03,
    dim: 0.32,
  },
};

const VARIATION_ORDER: VariationId[] = ["site-true", "deep", "subtle"];

// Per-card cinematic color temperature (soft-light grade). On-brand: cool
// coastal, indigo tech, warm map, golden night-city.
const GRADE: Record<number, string> = {
  1: "#1f7a99",
  2: "#5350a8",
  3: "#b8852f",
  4: "#9a6320",
};

// Brand-appropriate image wash for the two non-photo cards (ETB / Supply Chain)
// so they feel as immersive as the photo cards.
const BAND_IMAGE: Record<number, string> = {
  2: "/assets/atomicos-demo/atomicos-overview.webp",
  3: "/assets/mapmaster.webp",
};

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function DetailBody({ screen, isActive }: { screen: WorkScreen; isActive: boolean }) {
  switch (screen.type) {
    case "full":
      return <WorldPulseDetail data={screen.full} />;
    case "emerging-tech-builds":
      return <ETBDetail data={screen.etb} />;
    case "supply-chain":
      return <SupplyChainDetail data={screen.supplyChain} isActive={isActive} />;
    case "consulting":
      // Original main-site consulting interaction: button → options → book-a-call.
      return <ConsultingHeroStage isActive={isActive} />;
    default:
      return null;
  }
}

export default function WorkHandoffSample() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const intensityRef = useRef(1);
  const variationRef = useRef<VariationId>("deep");
  const motionRef = useRef(true);

  const [intensity, setIntensity] = useState(1);
  const [variation, setVariation] = useState<VariationId>("deep");
  const [motionOn, setMotionOn] = useState(true);
  // Design-option toggles (independent, combinable).
  const [copyOver, setCopyOver] = useState(false);
  const [immersive, setImmersive] = useState(false);
  const [graded, setGraded] = useState(false);
  // Which card is most in view — drives Supply Chain reveal + Consulting button.
  const [activeId, setActiveId] = useState<number | null>(null);

  intensityRef.current = intensity;
  variationRef.current = variation;
  motionRef.current = motionOn;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("plx--off");
    }

    let chapters: HTMLElement[] = [];
    let rafId = 0;
    let running = false;
    let vh = window.innerHeight;
    const reduceMotion = root.classList.contains("plx--off");

    const collect = () => {
      chapters = Array.from(root.querySelectorAll<HTMLElement>("[data-plx-chapter]"));
    };

    const tick = () => {
      const v = VARIATIONS[variationRef.current];
      const k = motionRef.current ? intensityRef.current : 0;

      for (let i = 0; i < chapters.length; i += 1) {
        const card = chapters[i].querySelector<HTMLElement>(".work__screen--detail");
        if (!card) continue;
        const next = chapters[i + 1];
        let p = 0;
        if (next) {
          const nr = next.getBoundingClientRect();
          p = clamp((vh * 0.92 - nr.top) / (vh * 0.8), 0, 1);
        }
        const sink = p * k;
        card.style.transform = `translate3d(0, ${-v.sinkY * sink * vh}px, 0) scale(${
          1 - v.sinkScale * sink
        })`;
        const dim = card.querySelector<HTMLElement>(".ho-dim");
        if (dim) dim.style.opacity = String(v.dim * sink);

        // ---- Multi-plane image parallax ----
        // Drive depth from the card's progress through its chapter so the
        // imagery keeps drifting while the card is pinned. cp: -1 (entering) →
        // +1 (leaving); gated by motion intensity (k).
        const chr = chapters[i].getBoundingClientRect();
        const range = chr.height - vh;
        const cprog = range > 0 ? clamp(-chr.top / range, 0, 1) : 0.5;
        const drift = (cprog * 2 - 1) * k;

        // WorldPulse — coastal background recedes, phone foreground counter-moves,
        // tagline + intro copy float on their own planes.
        const bg = card.querySelector<HTMLElement>(".pd-full__bg");
        if (bg) bg.style.transform = `scale(1.12) translate3d(0, ${(drift * -3).toFixed(2)}%, 0)`;
        const hero = card.querySelector<HTMLElement>(".pd-full__hero");
        if (hero) hero.style.transform = `translate3d(0, ${(drift * 18).toFixed(1)}px, 0)`;
        const tagline = card.querySelector<HTMLElement>(".pd-full__tagline");
        if (tagline && window.innerWidth > 767) {
          tagline.style.transform = `translateY(calc(-50% + ${(drift * -30).toFixed(1)}px))`;
        }
        const wp = card.querySelector<HTMLElement>(".wp-description");
        if (wp) wp.style.transform = `translate3d(0, ${(drift * -12).toFixed(1)}px, 0)`;

        // Consulting — night-city statue photo recedes behind the offer buttons.
        const cht = card.querySelector<HTMLElement>(".cht-bg");
        if (cht) cht.style.transform = `scale(1.12) translate3d(0, ${(drift * -3).toFixed(2)}%, 0)`;

        // Immersive image wash (ETB / Supply Chain) — deeper parallax plane.
        const band = card.querySelector<HTMLElement>(".ho-band");
        if (band) band.style.transform = `scale(1.16) translate3d(0, ${(drift * -3.4).toFixed(2)}%, 0)`;
      }

      if (running) rafId = requestAnimationFrame(tick);
    };

    const onResize = () => {
      vh = window.innerHeight;
    };

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (visible && !running) {
          running = true;
          rafId = requestAnimationFrame(tick);
        } else if (!visible && running) {
          running = false;
          cancelAnimationFrame(rafId);
        }
      },
      { rootMargin: "10% 0px" }
    );

    // Track the most-visible card so each detail component knows when it's active
    // (Supply Chain plays its reveal; Consulting enables its button interaction).
    const ratios = new Map<number, number>();
    const activeObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = Number((e.target as HTMLElement).dataset.chapterId);
          ratios.set(id, e.intersectionRatio);
        }
        let best: number | null = null;
        let bestRatio = 0;
        ratios.forEach((r, id) => {
          if (r > bestRatio) {
            bestRatio = r;
            best = id;
          }
        });
        if (best !== null && bestRatio > 0.2) setActiveId(best);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    collect();
    if (!reduceMotion) io.observe(root);
    chapters.forEach((c) => activeObserver.observe(c));
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      activeObserver.disconnect();
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const rootClass = [
    "plx",
    "ho-root",
    copyOver ? "is-copy-over" : "",
    immersive ? "is-immersive" : "",
    graded ? "is-graded" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={rootRef} className={rootClass}>
      {/* ---- Control dock ---- */}
      <aside className="plx__dock">
        <span className="plx__dockTitle">Sticky Depth Handoff</span>

        <div className="ho-variants">
          {VARIATION_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              className={`ho-variant ${variation === id ? "is-on" : ""}`}
              onClick={() => setVariation(id)}
              aria-pressed={variation === id}
            >
              <span className="ho-variant__name">{VARIATIONS[id].label}</span>
              <span className="ho-variant__desc">{VARIATIONS[id].desc}</span>
            </button>
          ))}
        </div>

        <div className="ho-opts">
          <span className="ho-optsTitle">Design options</span>
          <button
            type="button"
            className={`ho-opt ${copyOver ? "is-on" : ""}`}
            onClick={() => setCopyOver((v) => !v)}
            aria-pressed={copyOver}
          >
            <span className="ho-opt__name">Copy over image</span>
            <span className="ho-opt__desc">Float WorldPulse intro on the photo</span>
          </button>
          <button
            type="button"
            className={`ho-opt ${immersive ? "is-on" : ""}`}
            onClick={() => setImmersive((v) => !v)}
            aria-pressed={immersive}
          >
            <span className="ho-opt__name">Immersive ETB / SC</span>
            <span className="ho-opt__desc">Parallax image wash on the UI cards</span>
          </button>
          <button
            type="button"
            className={`ho-opt ${graded ? "is-on" : ""}`}
            onClick={() => setGraded((v) => !v)}
            aria-pressed={graded}
          >
            <span className="ho-opt__name">Color grade</span>
            <span className="ho-opt__desc">Per-card cinematic temperature</span>
          </button>
        </div>

        <label className="plx__dial">
          <span className="plx__dialMeta">
            <span>Intensity</span>
            <span>{Math.round(intensity * 100)}%</span>
          </span>
          <input
            type="range"
            min={0}
            max={1.5}
            step={0.05}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
          />
        </label>
        <button
          type="button"
          className={`plx__toggle ${motionOn ? "is-on" : ""}`}
          onClick={() => setMotionOn((m) => !m)}
          aria-pressed={motionOn}
        >
          Motion {motionOn ? "on" : "off"}
        </button>
        <Link href="/site-parallax-lab" className="plx__toggle">
          ← Full reel
        </Link>
      </aside>

      {/* ---- Intro ---- */}
      <header className="plx__intro" data-plx-scene>
        <p className="plx__kicker">PLX 04 · Isolated sample</p>
        <h1 className="plx__title">Sticky Depth Handoff</h1>
        <p className="plx__lede">
          Your real Work cards 01–04 — WorldPulse, Emerging Tech Builds, Supply
          Chain, and Consulting — each pins, then sinks and dims as the next
          slides up over it. Consulting keeps its original button → options →
          book-a-call interaction. Switch variations in the dock to compare the
          depth feel.
        </p>
        <span className="plx__hint" aria-hidden="true">
          Scroll ↓
        </span>
      </header>

      {/* ---- Real Work cards inside the depth handoff ---- */}
      {SCREENS.map((screen, idx) => {
        const modifier =
          screen.type === "consulting" ? " work__screen--consulting" : "";
        return (
          <div
            key={screen.id}
            className="ho-chapter"
            data-plx-chapter
            data-chapter-id={screen.id}
            style={{ zIndex: idx + 1 }}
          >
            <article className={`work__screen work__screen--detail${modifier}`}>
              {BAND_IMAGE[screen.id] && (
                <div
                  className="ho-band"
                  style={{ backgroundImage: `url("${BAND_IMAGE[screen.id]}")` }}
                  aria-hidden="true"
                />
              )}
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

              <DetailBody screen={screen} isActive={activeId === screen.id} />

              <div
                className="ho-grade"
                style={{ background: GRADE[screen.id] }}
                aria-hidden="true"
              />
              <div className="ho-dim" aria-hidden="true" />
            </article>
          </div>
        );
      })}

      {/* ---- Outro ---- */}
      <footer className="plx__outro" data-plx-scene>
        <p>End of sample — all four Work cards, depth handoff, no cinema.</p>
      </footer>
    </div>
  );
}
