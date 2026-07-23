"use client";

// Site Parallax Lab — a single scrollable "vision reel" that re-imagines
// every homepage section with its own parallax system.
//
// Engine: one rAF loop. Each panel is a [data-plx-scene]; its progress is
// the scene center's position relative to the viewport center, normalized
// to -1 (below) … 0 (centered) … +1 (above). Children declare motion via
// data attributes (rates in fractions of viewport height), and the loop
// writes transforms directly — no animated CSS variables (Safari recalc
// cliff, same pattern as useWorkScroll / ConsultingCinema).
//
//   data-plx-y="0.18"      vertical drift rate (positive = lags scroll)
//   data-plx-x="-0.4"      horizontal shear rate
//   data-plx-scale="0.05"  recedes by this much as the scene leaves center
//   data-plx-fade="0.7"    fades by this much as the scene leaves center
//   data-plx-rot="3"       degrees of settle rotation at the scene edges
//
// The Work panel runs a dedicated sticky-stack handoff (outgoing chapter
// sinks while the next slides over) — see the stack block in tick().

import { useEffect, useRef, useState } from "react";
import { SITE_CONTENT } from "@/data/siteContent";
import { CARDS } from "@/data/cards";
import { ABOUT_DATA } from "@/data/about";
import { CONNECT_LINKS } from "@/data/connect";
import {
  PLX_PANELS,
  PLX_INTRO,
  PLX_JOURNAL_MOCKS,
} from "@/data/siteParallaxLab";
import "./site-parallax-lab.css";

const STACK_CHAPTERS = [
  {
    id: "worldpulse",
    label: "01 — WorldPulse",
    image: "/WorldPulseCostal3.0.png",
    line: "Digital product passports, made human.",
  },
  {
    id: "supply",
    label: "02 — Supply Chain",
    image: "/assets/mapmaster.webp",
    line: "Eight years across Asia, systemized.",
  },
  {
    id: "consulting",
    label: "03 — Consulting",
    image: "/consulting/hero-2.png",
    line: "Strategy that ships.",
  },
];

/** Per-photo motion for the About collage: [yRate, innerCounterRate, settle deg] */
const COLLAGE_MOTION = [
  [0.16, -0.1, -1.6],
  [0.05, -0.06, 1.2],
  [0.24, -0.12, -1.0],
  [0.1, -0.08, 1.8],
  [0.2, -0.1, -1.4],
] as const;

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

export default function SiteParallaxLab() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const intensityRef = useRef(1);
  const [intensity, setIntensity] = useState(1);
  const [motionOn, setMotionOn] = useState(true);
  const motionRef = useRef(true);

  intensityRef.current = intensity;
  motionRef.current = motionOn;

  const heroLines = [
    "I build AI products",
    "and supply chain systems",
    "where data, design, and the real world meet.",
  ];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("plx--off");
      return;
    }

    interface PlxItem {
      el: HTMLElement;
      scene: HTMLElement;
      y: number;
      x: number;
      scale: number;
      fade: number;
      rot: number;
    }

    let items: PlxItem[] = [];
    let scenes: HTMLElement[] = [];
    let stackChapters: HTMLElement[] = [];
    let rafId = 0;
    let running = false;
    let vh = window.innerHeight;

    const collect = () => {
      scenes = Array.from(root.querySelectorAll<HTMLElement>("[data-plx-scene]"));
      items = Array.from(
        root.querySelectorAll<HTMLElement>(
          "[data-plx-y], [data-plx-x], [data-plx-scale], [data-plx-fade], [data-plx-rot]"
        )
      ).flatMap((el) => {
        const scene = el.closest<HTMLElement>("[data-plx-scene]");
        if (!scene) return [];
        return [
          {
            el,
            scene,
            y: parseFloat(el.dataset.plxY ?? "0"),
            x: parseFloat(el.dataset.plxX ?? "0"),
            scale: parseFloat(el.dataset.plxScale ?? "0"),
            fade: parseFloat(el.dataset.plxFade ?? "0"),
            rot: parseFloat(el.dataset.plxRot ?? "0"),
          },
        ];
      });
      stackChapters = Array.from(
        root.querySelectorAll<HTMLElement>("[data-plx-chapter]")
      );
    };

    const tick = () => {
      const k = motionRef.current ? intensityRef.current : 0;

      // Scene progress: +1 scene below viewport center … -1 above.
      const progressByScene = new Map<HTMLElement, number>();
      for (const scene of scenes) {
        const r = scene.getBoundingClientRect();
        const span = vh / 2 + r.height / 2;
        progressByScene.set(
          scene,
          clamp((r.top + r.height / 2 - vh / 2) / span, -1, 1)
        );
      }

      for (const it of items) {
        const p = progressByScene.get(it.scene) ?? 0;
        const away = Math.abs(p);
        const parts: string[] = [];
        if (it.y || it.x) {
          parts.push(
            `translate3d(${p * it.x * vh * k}px, ${p * it.y * vh * k}px, 0)`
          );
        }
        if (it.scale) parts.push(`scale(${1 - away * it.scale * k})`);
        if (it.rot) parts.push(`rotate(${p * it.rot * k}deg)`);
        if (parts.length) it.el.style.transform = parts.join(" ");
        if (it.fade) it.el.style.opacity = String(1 - away * it.fade * k);
      }

      // Sticky depth handoff: each chapter sinks as the next covers it.
      for (let i = 0; i < stackChapters.length; i += 1) {
        const card = stackChapters[i].querySelector<HTMLElement>(".pstack__card");
        if (!card) continue;
        const next = stackChapters[i + 1];
        let p = 0;
        if (next) {
          const nr = next.getBoundingClientRect();
          p = clamp((vh * 0.92 - nr.top) / (vh * 0.8), 0, 1);
        }
        const sink = p * k;
        card.style.transform = `translate3d(0, ${-0.04 * sink * vh}px, 0) scale(${
          1 - 0.07 * sink
        })`;
        const dim = card.querySelector<HTMLElement>(".pstack__dim");
        if (dim) dim.style.opacity = String(0.55 * sink);
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

    collect();
    io.observe(root);
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const meta = PLX_PANELS;

  return (
    <div ref={rootRef} className="plx">
      {/* ---- Control dock ---- */}
      <aside className="plx__dock">
        <span className="plx__dockTitle">Parallax reel</span>
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
      </aside>

      {/* ---- Intro ---- */}
      <header className="plx__intro" data-plx-scene>
        <p className="plx__kicker">{PLX_INTRO.kicker}</p>
        <h1 className="plx__title" data-plx-y="0.06">
          {PLX_INTRO.title}
        </h1>
        <p className="plx__lede" data-plx-y="0.12">
          {PLX_INTRO.lede}
        </p>
        <span className="plx__hint" aria-hidden="true">
          {PLX_INTRO.hint} ↓
        </span>
      </header>

      {/* ---- PLX 01 · Hero — Depth Type ---- */}
      <section className="plx__panel plx__panel--hero" data-plx-scene>
        <PanelHead meta={meta.hero} />
        <div className="plx__heroStage">
          <div className="plx__heroGlow" data-plx-y="-0.12" aria-hidden="true" />
          <p className="plx__heroEyebrow" data-plx-y="0.2" data-plx-fade="0.6">
            {SITE_CONTENT.hero.eyebrow}
          </p>
          <h2 className="plx__heroHeading" aria-label={SITE_CONTENT.hero.heading}>
            {heroLines.map((line, i) => (
              <span
                key={line}
                className="plx__heroLine"
                data-plx-y={(0.16 - i * 0.05).toFixed(2)}
                data-plx-fade="0.35"
                data-plx-scale="0.04"
              >
                {line}
              </span>
            ))}
          </h2>
        </div>
      </section>

      {/* ---- PLX 02 · Card Deck — Fanned Depth ---- */}
      <section className="plx__panel" data-plx-scene>
        <PanelHead meta={meta.deck} />
        <div className="plx__deckRow">
          {CARDS.map((card, i) => (
            <figure
              key={card.id}
              className="plx__card"
              data-plx-y={(0.3 + (i % 2 === 0 ? 0.14 : 0) - i * 0.03).toFixed(2)}
              data-plx-rot={String((i - (CARDS.length - 1) / 2) * 2.4)}
            >
              <img src={card.faceImage} alt={card.title} loading="lazy" />
              <figcaption>
                <span className="plx__cardRank">
                  {card.rank}
                  {{ club: "♣", heart: "♥", diamond: "♦", spade: "♠" }[card.suit]}
                </span>
                {card.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---- PLX 03 · Brands — Scroll-Linked Marquee ---- */}
      <section className="plx__panel plx__panel--brands" data-plx-scene>
        <PanelHead meta={meta.brands} />
        <div className="plx__rails">
          {[0, 1].map((row) => (
            <div
              key={row}
              className="plx__rail"
              data-plx-x={row === 0 ? "-0.35" : "0.35"}
            >
              {Array.from({ length: SITE_CONTENT.brands.repeats * 3 }).map(
                (_, i) => {
                  const logo =
                    SITE_CONTENT.brands.logos[
                      (i + row) % SITE_CONTENT.brands.logos.length
                    ];
                  return logo.imageSrc ? (
                    <img
                      key={i}
                      src={logo.imageSrc}
                      alt={logo.label}
                      className="plx__logo"
                      loading="lazy"
                    />
                  ) : (
                    <span key={i} className="plx__logo plx__logo--text">
                      {logo.label}
                    </span>
                  );
                }
              )}
            </div>
          ))}
        </div>
        <p className="plx__brandsNote">{SITE_CONTENT.brands.context}</p>
      </section>

      {/* ---- PLX 04 · Work — Sticky Depth Handoff ---- */}
      <section className="plx__panel plx__panel--stack" data-plx-scene>
        <PanelHead meta={meta.work} sticky />
        <div className="plx__stack">
          {STACK_CHAPTERS.map((ch) => (
            <div key={ch.id} className="pstack__chapter" data-plx-chapter>
              <article className="pstack__card">
                <img src={ch.image} alt="" className="pstack__img" loading="lazy" />
                <div className="pstack__scrim" aria-hidden="true" />
                <div className="pstack__dim" aria-hidden="true" />
                <header className="pstack__head">
                  <span className="pstack__num">{ch.label}</span>
                  <span className="pstack__line" />
                </header>
                <p className="pstack__caption">{ch.line}</p>
              </article>
            </div>
          ))}
        </div>
      </section>

      {/* ---- PLX 05 · Connect — Label Cloud ---- */}
      <section className="plx__panel" data-plx-scene>
        <PanelHead meta={meta.connect} />
        <div className="plx__cloud">
          {[...CONNECT_LINKS.map((l) => l.label), "Book a Call"].map(
            (label, i) => (
              <span
                key={label}
                className="plx__dymo"
                data-plx-y={(0.08 + (i % 3) * 0.1).toFixed(2)}
                style={{
                  ["--tilt" as string]: `${((i * 7) % 5) - 2}deg`,
                  ["--size" as string]: i % 3 === 0 ? "1.25" : i % 3 === 1 ? "1" : "0.85",
                }}
              >
                {label}
              </span>
            )
          )}
        </div>
      </section>

      {/* ---- PLX 06 · About — Collage Depths ---- */}
      <section className="plx__panel" data-plx-scene>
        <PanelHead meta={meta.about} />
        <div className="plx__collage">
          {ABOUT_DATA.photos.map((photo, i) => {
            const [y, inner, rot] = COLLAGE_MOTION[i % COLLAGE_MOTION.length];
            return (
              <figure
                key={photo.src}
                className={`plx__frame plx__frame--${i + 1}`}
                data-plx-y={String(y)}
                data-plx-rot={String(rot)}
              >
                <img src={photo.src} alt={photo.alt} data-plx-y={String(inner)} loading="lazy" />
              </figure>
            );
          })}
        </div>
      </section>

      {/* ---- PLX 07 · Journal — Editorial Reveal ---- */}
      <section className="plx__panel" data-plx-scene>
        <PanelHead meta={meta.journal} />
        <div className="plx__posts">
          {PLX_JOURNAL_MOCKS.map((post, i) => (
            <article
              key={post.title}
              className="plx__post"
              data-plx-y={(0.14 + i * 0.09).toFixed(2)}
            >
              <div className="plx__postImg">
                <img src={post.image} alt="" data-plx-y="-0.08" loading="lazy" />
              </div>
              <span className="plx__postDate">{post.date}</span>
              <h3 className="plx__postTitle">{post.title}</h3>
              <p className="plx__postExcerpt">{post.excerpt}</p>
            </article>
          ))}
        </div>
        <p className="plx__mockNote">Post cards are mock content — art direction only.</p>
      </section>

      {/* ---- Outro ---- */}
      <footer className="plx__outro" data-plx-scene>
        <p data-plx-y="0.1">{PLX_INTRO.outro}</p>
      </footer>
    </div>
  );
}

function PanelHead({
  meta,
  sticky,
}: {
  meta: { num: string; name: string; section: string; note: string };
  sticky?: boolean;
}) {
  return (
    <header className={`plx__head ${sticky ? "plx__head--sticky" : ""}`}>
      <span className="plx__num">{meta.num}</span>
      <div className="plx__headText">
        <h2 className="plx__name">
          {meta.name}
          <span className="plx__section"> · {meta.section}</span>
        </h2>
        <p className="plx__note">{meta.note}</p>
      </div>
    </header>
  );
}
