"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./consulting-parallax-lab.css";

type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

const ROUTES = [
  {
    id: "ai",
    num: "01",
    name: "AI systems",
    summary: "Prototype a workflow, then harden the handoff.",
    accent: "#8fbf9a",
  },
  {
    id: "supply",
    num: "02",
    name: "Supply chain",
    summary: "Turn field knowledge into traceable operating logic.",
    accent: "#d7b46a",
  },
  {
    id: "worldpulse",
    num: "03",
    name: "WorldPulse",
    summary: "Shape product passports into something people can use.",
    accent: "#8fb7c7",
  },
] as const;

const FILES = [
  {
    code: "DOSSIER A",
    title: "Clarity sprint",
    detail: "Map the problem, name the constraints, define the first shippable proof.",
    accent: "#d7b46a",
  },
  {
    code: "DOSSIER B",
    title: "Prototype build",
    detail: "Make the workflow tangible enough to evaluate with real users and real data.",
    accent: "#8fbf9a",
  },
  {
    code: "DOSSIER C",
    title: "Operator handoff",
    detail: "Convert the concept into process, governance, documentation, and next moves.",
    accent: "#cf6f5f",
  },
] as const;

const SIGNALS = [
  ["AI systems", 7, 18, 0.24, -0.18, -6],
  ["Traceability", 58, 14, 0.12, 0.2, 4],
  ["Prototype", 24, 34, 0.3, 0.08, 7],
  ["Governance", 70, 40, 0.18, -0.12, -4],
  ["Supplier ops", 9, 58, 0.1, 0.14, 5],
  ["Workflow", 48, 64, 0.28, -0.16, -8],
  ["Data model", 76, 72, 0.2, 0.18, 6],
  ["Handoff", 29, 78, 0.14, -0.22, -3],
] as const;

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

export default function ConsultingParallaxLab() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const intensityRef = useRef(1);
  const motionRef = useRef(true);
  const [intensity, setIntensity] = useState(1);
  const [motionOn, setMotionOn] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  intensityRef.current = intensity;
  motionRef.current = motionOn;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

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
    let rafId = 0;
    let running = false;
    let vh = window.innerHeight;

    const collect = () => {
      scenes = Array.from(root.querySelectorAll<HTMLElement>("[data-cplx-scene]"));
      items = Array.from(
        root.querySelectorAll<HTMLElement>(
          "[data-cplx-y], [data-cplx-x], [data-cplx-scale], [data-cplx-fade], [data-cplx-rot]"
        )
      ).flatMap((el) => {
        const scene = el.closest<HTMLElement>("[data-cplx-scene]");
        if (!scene) return [];
        return [
          {
            el,
            scene,
            y: parseFloat(el.dataset.cplxY ?? "0"),
            x: parseFloat(el.dataset.cplxX ?? "0"),
            scale: parseFloat(el.dataset.cplxScale ?? "0"),
            fade: parseFloat(el.dataset.cplxFade ?? "0"),
            rot: parseFloat(el.dataset.cplxRot ?? "0"),
          },
        ];
      });
    };

    const tick = () => {
      const k = motionRef.current ? intensityRef.current : 0;
      const progressByScene = new Map<HTMLElement, number>();

      for (const scene of scenes) {
        const r = scene.getBoundingClientRect();
        const span = vh / 2 + r.height / 2;
        const p = span > 0 ? (r.top + r.height / 2 - vh / 2) / span : 0;
        progressByScene.set(scene, clamp(p, -1, 1));
      }

      for (const item of items) {
        const p = progressByScene.get(item.scene) ?? 0;
        const away = Math.abs(p);
        const parts: string[] = [];

        if (item.x || item.y) {
          parts.push(
            `translate3d(${p * item.x * vh * k}px, ${p * item.y * vh * k}px, 0)`
          );
        }
        if (item.scale) parts.push(`scale(${1 - away * item.scale * k})`);
        if (item.rot) parts.push(`rotate(${p * item.rot * k}deg)`);

        item.el.style.transform = parts.length ? parts.join(" ") : "";
        if (item.fade) item.el.style.opacity = String(1 - away * item.fade * k);
      }

      if (running) rafId = requestAnimationFrame(tick);
    };

    const onResize = () => {
      vh = window.innerHeight;
      collect();
    };

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (visible && !running) {
          running = true;
          rafId = requestAnimationFrame(tick);
        } else if (!visible && running) {
          running = false;
          cancelAnimationFrame(rafId);
        }
      },
      { rootMargin: "20% 0px" }
    );

    collect();
    io.observe(root);
    window.addEventListener("resize", onResize);

    return () => {
      io.disconnect();
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      items.forEach((item) => {
        item.el.style.transform = "";
        item.el.style.opacity = "";
      });
    };
  }, [reducedMotion]);

  return (
    <div
      ref={rootRef}
      className={`cplx ${!motionOn || reducedMotion ? "cplx--off" : ""}`}
    >
      <aside className="cplx__dock" aria-label="Parallax controls">
        <span className="cplx__dockTitle">Parallax range</span>
        <label className="cplx__slider">
          <span>
            <span>Intensity</span>
            <span>{Math.round(intensity * 100)}%</span>
          </span>
          <input
            type="range"
            min={0}
            max={1.6}
            step={0.05}
            value={intensity}
            onChange={(event) => setIntensity(Number(event.target.value))}
          />
        </label>
        <button
          type="button"
          className="cplx__toggle"
          aria-pressed={motionOn && !reducedMotion}
          onClick={() => setMotionOn((value) => !value)}
          disabled={reducedMotion}
        >
          {reducedMotion ? "Reduced motion" : motionOn ? "Motion on" : "Motion off"}
        </button>
      </aside>

      <header className="cplx__intro" data-cplx-scene>
        <div className="cplx__introImage" data-cplx-y="-0.08" data-cplx-scale="-0.04">
          <img src="/consulting/hero-2.png" alt="" draggable={false} />
        </div>
        <div className="cplx__introShade" aria-hidden="true" />
        <div className="cplx__introCopy" data-cplx-y="0.12" data-cplx-fade="0.28">
          <p className="cplx__kicker">Lab / Consulting Parallax</p>
          <h1>Depth, routing, files, signal.</h1>
          <p>
            Four scroll studies for pushing the Consulting page past a flat hero
            without losing the dark portfolio language.
          </p>
        </div>
      </header>

      <section className="cplx__scene cplx__scene--camera" data-cplx-scene>
        <SceneHeader code="Study 01" title="Camera Push" />
        <div className="cplx__sticky">
          <div className="camera__city" data-cplx-y="-0.05" data-cplx-scale="-0.1">
            <img src="/consulting/hero-2.png" alt="" draggable={false} />
          </div>
          <div className="camera__blur" data-cplx-y="0.08" data-cplx-scale="0.05" />
          <div className="camera__frame" data-cplx-y="0.22" data-cplx-fade="0.25">
            <span className="cplx__dymo">Arrival</span>
            <h2>Consulting becomes a slow camera move.</h2>
            <p>
              Background image, glass wash, labels, and CTA plane all travel at
              different speeds so the hero reads as a scene.
            </p>
          </div>
          <div className="camera__plate camera__plate--near" data-cplx-y="0.34" data-cplx-x="-0.08">
            Strategy
          </div>
          <div className="camera__plate camera__plate--far" data-cplx-y="-0.16" data-cplx-x="0.1">
            Systems
          </div>
        </div>
      </section>

      <section className="cplx__scene cplx__scene--routes" data-cplx-scene>
        <SceneHeader code="Study 02" title="Route Split" />
        <div className="cplx__sticky routes">
          <div className="routes__axis" aria-hidden="true" />
          <div className="routes__copy" data-cplx-y="0.1" data-cplx-fade="0.2">
            <span className="cplx__dymo">Choose a lane</span>
            <h2>One cinematic entry breaks into three consulting paths.</h2>
          </div>
          <div className="routes__cards">
            {ROUTES.map((route, index) => (
              <article
                key={route.id}
                className="routes__card"
                data-cplx-x={String((index - 1) * -0.18)}
                data-cplx-y={String(0.18 + index * 0.06)}
                data-cplx-rot={String((index - 1) * 5)}
                style={{ "--accent": route.accent } as CSSVars}
              >
                <span>{route.num}</span>
                <h3>{route.name}</h3>
                <p>{route.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cplx__scene cplx__scene--files" data-cplx-scene>
        <SceneHeader code="Study 03" title="Dossier Stack" />
        <div className="cplx__sticky files">
          <div className="files__image" data-cplx-y="-0.1" data-cplx-scale="-0.06">
            <img src="/consulting/mobile-statue.png" alt="" draggable={false} />
          </div>
          <div className="files__stack">
            {FILES.map((file, index) => (
              <article
                key={file.code}
                className="files__card"
                data-cplx-y={String(0.26 - index * 0.08)}
                data-cplx-x={String((index - 1) * 0.08)}
                data-cplx-rot={String((index - 1) * -7)}
                style={
                  {
                    "--accent": file.accent,
                    "--rest-y": `${index * 26}px`,
                    "--rest-rot": `${(index - 1) * 2.5}deg`,
                  } as CSSVars
                }
              >
                <span>{file.code}</span>
                <h3>{file.title}</h3>
                <p>{file.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cplx__scene cplx__scene--signals" data-cplx-scene>
        <SceneHeader code="Study 04" title="Signal Cloud" />
        <div className="cplx__sticky signals">
          <div className="signals__photo" data-cplx-y="-0.08" data-cplx-scale="-0.08">
            <img src="/consulting/hero-2.png" alt="" draggable={false} />
          </div>
          <div className="signals__center" data-cplx-y="0.16" data-cplx-fade="0.2">
            <span className="cplx__dymo">Consulting vocabulary</span>
            <h2>The UI can turn labels into depth.</h2>
          </div>
          <div className="signals__cloud" aria-label="Consulting signal labels">
            {SIGNALS.map(([label, left, top, y, x, rot]) => (
              <span
                key={label}
                className="signals__label"
                data-cplx-y={String(y)}
                data-cplx-x={String(x)}
                data-cplx-rot={String(rot)}
                style={{ left: `${left}%`, top: `${top}%` } as CSSVars}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="cplx__outro" data-cplx-scene>
        <p data-cplx-y="0.08">Candidate treatments only. The useful pieces can be ported one at a time.</p>
      </footer>
    </div>
  );
}

function SceneHeader({ code, title }: { code: string; title: string }) {
  return (
    <header className="cplx__sceneHead">
      <span>{code}</span>
      <h2>{title}</h2>
    </header>
  );
}
