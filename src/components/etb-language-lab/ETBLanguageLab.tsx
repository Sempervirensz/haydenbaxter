"use client";

// ETB language lab — /etb-language-lab.
//
// THIS FRAMES THE REAL PAGE. It imports `ETBDetail` and `WORK_SCREENS` and
// rebuilds `/emerging-tech-builds`'s exact shell around them — same
// `.etb-gallery`, same rail, same `.etb-gallery__shell`. Nothing here is a
// reconstruction: a redrawn gallery would hide the findings that decide this,
// and every one of the four axes turns on a declaration that only exists
// against the live markup.
//
// Production imports nothing from here, and the lab changes nothing in
// `work-details.css`. Every axis is an ancestor-selector override in
// `etb-language-lab.css`, so approving a direction means promoting those
// declarations into `work-details.css` by hand — the diff is the lab's output.
//
// WHY THE ATTRIBUTES GO ON <html>
//
// `ETBDetail` portals its mobile dossier to `document.body` (see the
// `createPortal` at the bottom of that file), which escapes any wrapper this
// component could put them on. On <html> they reach the portal too, so the
// phone layout is judged under the same axes as the desktop one rather than
// silently rendering the shipped skin.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ETBDetail from "@/components/work/ETBDetail";
import { WORK_SCREENS, type ETBProject } from "@/data/work";
import { AXES, BEFORE, SHIPPED, type LabState } from "@/data/etbLanguageLab";
import "./etb-language-lab.css";

/** The plate's darker stop and the dossier card — the worst case each ink sits
 *  on. Dark type on a light ground gets worse as the ground darkens, so the
 *  bottom of `.etb-bar`'s gradient is the number that has to clear, not the
 *  #fefefe top. */
const PLATE_BG = "#f6f5f2";
const CARD_BG = "#f5f4f1";

export default function ETBLanguageLab() {
  const [state, setState] = useState<LabState>(SHIPPED);
  const [panelOpen, setPanelOpen] = useState(true);
  /* Bumped by the MutationObserver below so the contrast readout re-measures
     when the PAGE changes state, not only when an axis does. */
  const [tick, setTick] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const screen = WORK_SCREENS.find((s) => s.type === "emerging-tech-builds");
  const etb = screen && screen.type === "emerging-tech-builds" ? screen.etb : null;

  /* Which projects are supply-chain, read from the real data rather than
     hardcoded — re-categorise a project and the discipline axis follows it. */
  const supplyIds = useMemo(
    () =>
      (etb?.projects ?? [])
        .filter((p: ETBProject) => p.category === "Supply Chain Apps")
        .map((p) => p.id),
    [etb],
  );

  /* Narrow, the panel is a fixed overlay sitting on the exact thing being
     judged, so it starts collapsed. In an effect so server and first client
     render agree. */
  useEffect(() => {
    if (window.innerWidth < 1180) setPanelOpen(false);
  }, []);

  /* The axes, on <html> — see the note at the top of this file. */
  useEffect(() => {
    const el = document.documentElement;
    el.setAttribute("data-etb-type", state.type);
    el.setAttribute("data-etb-accent", state.accent);
    el.setAttribute("data-etb-masthead", state.masthead);
    el.setAttribute("data-etb-paper", state.paper);
    return () => {
      for (const attr of ["type", "accent", "masthead", "paper"]) {
        el.removeAttribute(`data-etb-${attr}`);
      }
    };
  }, [state]);

  /* Tag which bars are supply-chain, and mirror the OPEN project's discipline
     onto <html>, by watching the real component.

     THIS IS THE LAB STANDING IN FOR A PRODUCTION CHANGE. The bars carry
     `data-etb-bar={project.id}`, but the dossier carries no project identity at
     all — `.etb-overlay` renders `<DossierCard>` with nothing naming which
     project is inside it — so per-project colour cannot reach the dossier in
     CSS today. If the discipline axis ships, `ETBDetail` needs one
     `data-discipline` attribute on `.etb-dos` and one on each `.etb-bar`. This
     effect is the stand-in that lets the direction be judged first; every
     declaration it switches on lives in the stylesheet, not here. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const sync = () => {
      /* Also the readout's clock. The panel measures the live page, so it has
         to recompute when the page changes state — not only when an axis
         moves. Opening a bar is what gives the dossier row something to
         measure at all. */
      setTick((t) => t + 1);
      let openDiscipline: string | null = null;

      for (const bar of root.querySelectorAll<HTMLElement>("[data-etb-bar]")) {
        const supply = supplyIds.includes(bar.dataset.etbBar ?? "");
        if (supply) bar.dataset.supply = "";
        else delete bar.dataset.supply;
        if (bar.classList.contains("is-active")) {
          openDiscipline = supply ? "supply" : "ai";
        }
      }

      if (openDiscipline) {
        document.documentElement.setAttribute("data-etb-open", openDiscipline);
      } else {
        document.documentElement.removeAttribute("data-etb-open");
      }
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => {
      observer.disconnect();
      document.documentElement.removeAttribute("data-etb-open");
      for (const bar of root.querySelectorAll<HTMLElement>("[data-etb-bar]")) {
        delete bar.dataset.supply;
      }
    };
  }, [supplyIds]);

  const set = useCallback(
    <K extends keyof LabState>(key: K, value: LabState[K]) =>
      setState((s) => ({ ...s, [key]: value })),
    [],
  );

  /* 1–4 step their axis to the next option, 0 and 9 are the two presets that
     matter. Stepping rather than selecting, because comparing means going back
     and forth and reaching for the panel each time loses the before/after. */
  useEffect(() => {
    const keys: (keyof LabState)[] = ["type", "accent", "masthead", "paper"];
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;

      if (e.key === "0") return setState(SHIPPED);
      if (e.key === "9") return setState(BEFORE);

      const index = Number(e.key) - 1;
      const axis = AXES[index];
      const key = keys[index];
      if (!axis || !key) return;

      setState((s) => {
        const options = axis.options.map((o) => o.id as string);
        const next = options[(options.indexOf(s[key]) + 1) % options.length];
        return { ...s, [key]: next };
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!etb) return null;

  const isShipped = matches(state, SHIPPED);
  const isBefore = matches(state, BEFORE);

  return (
    <div className="etl" ref={rootRef} data-panel={panelOpen ? "open" : "closed"}>
      {/* ---- The real page ---- */}
      <main className="etb-gallery">
        <div className="etb-gallery__rail">
          <Link href="/emerging-tech-builds" className="etb-gallery__back">
            <span aria-hidden="true">&larr;</span>
            <span>Back to home</span>
          </Link>
        </div>

        {/* Mirrors the masthead in src/app/emerging-tech-builds/page.tsx, and has
            to keep mirroring it — this shell is hand-copied from that route so
            the lab can wrap the real ETBDetail in the real chrome. Axis 3 has
            nothing to toggle if this drifts. */}
        <header className="etb-gallery__masthead">
          <p className="etb-gallery__kicker">{etb.credibilityLine}</p>
          <h1 className="etb-gallery__title">{etb.title}</h1>
        </header>

        <div className="etb-gallery__shell">
          <ETBDetail data={etb} />
        </div>
      </main>

      {/* ---- Lab chrome ---- */}
      <aside className="etl-panel" data-open={panelOpen ? "true" : "false"}>
        <button
          type="button"
          className="etl-panel__toggle"
          onClick={() => setPanelOpen((o) => !o)}
          aria-expanded={panelOpen}
        >
          {panelOpen ? "Hide controls" : "Controls"}
        </button>

        {panelOpen ? (
          <div className="etl-panel__body">
            <p className="etl-panel__title">ETB language lab</p>
            <p className="etl-panel__blurb">
              Direction B shipped. Each axis reverts its half of it on the live page, so the
              before/after stays checkable rather than being a claim in a commit message.
            </p>

            <div className="etl-presets" role="group" aria-label="Presets">
              <button
                type="button"
                className="etl-preset"
                data-active={isShipped}
                onClick={() => setState(SHIPPED)}
              >
                <span className="etl-preset__key" aria-hidden="true">0</span>
                Shipped
              </button>
              <button
                type="button"
                className="etl-preset"
                data-active={isBefore}
                onClick={() => setState(BEFORE)}
              >
                <span className="etl-preset__key" aria-hidden="true">9</span>
                Before B
              </button>
            </div>

            {AXES.map((axis, i) => {
              const key = (["type", "accent", "masthead", "paper"] as const)[i];
              return (
                <section key={axis.attr} className="etl-axis">
                  <p className="etl-axis__title">
                    <span className="etl-axis__key" aria-hidden="true">{i + 1}</span>
                    {axis.title}
                  </p>
                  <p className="etl-axis__premise">{axis.premise}</p>
                  <div className="etl-axis__set" role="group" aria-label={axis.title}>
                    {axis.options.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className="etl-opt"
                        data-active={state[key] === option.id}
                        aria-pressed={state[key] === option.id}
                        onClick={() => set(key, option.id)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <p className="etl-axis__note">
                    {axis.options.find((o) => o.id === state[key])?.note}
                  </p>
                </section>
              );
            })}

            <ContrastReadout state={state} tick={tick} />

            <p className="etl-panel__keys">
              <span>
                <kbd>1</kbd>&ndash;<kbd>4</kbd> step an axis
              </span>
              <span>
                <kbd>0</kbd> shipped <kbd>9</kbd> before B
              </span>
            </p>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Contrast readout

   The Paper axis is the one with a measurable answer rather than a visual one,
   and "unify the ramp" sounds free until you measure it. This reads the ink
   the page is ACTUALLY painting right now — not the token the lab thinks it
   set — composites it over the surface underneath, and prints the ratio.
   ------------------------------------------------------------------------ */

function ContrastReadout({ state, tick }: { state: LabState; tick: number }) {
  const [rows, setRows] = useState<{ label: string; ratio: number | null }[]>([]);

  useEffect(() => {
    /* Deferred by a task, not by a frame.

       Two reasons it cannot measure inline. React runs effects CHILD-FIRST, so
       this one fires before the parent effect that writes the axis attributes
       — measuring here reads the previous axis. And `requestAnimationFrame`,
       the obvious way to wait, never fires while the tab is backgrounded, so
       the readout came back empty every time the pane was hidden. A macrotask
       clears the parent effect and still runs in a hidden tab. */
    const id = window.setTimeout(() => {
      setRows([
        {
          /* A RESTING row specifically. The selected and hovered bars paint
             their summary white on a cobalt (or brass) fill, which is a
             different question with a different answer — measuring whichever
             bar happens to be first in the DOM reports 1.06:1 the moment
             anything is open, and that number is about the fill, not the ink
             ramp this panel exists to judge. */
          label: "Bar summary on plate",
          ratio: measure(
            ".etb-bar:not(.is-active):not(.is-hovered) .etb-bar__summary",
            PLATE_BG,
          ),
        },
        {
          label: "Dossier body on card",
          ratio: measure(".etb-dos__oneLiner", CARD_BG),
        },
      ]);
    }, 0);
    return () => window.clearTimeout(id);
  }, [state, tick]);

  return (
    <section className="etl-axis etl-readout">
      <p className="etl-axis__title">Measured contrast</p>
      {rows.map((row) => (
        <p key={row.label} className="etl-readout__row">
          <span>{row.label}</span>
          {row.ratio == null ? (
            <span className="etl-readout__na">open a bar</span>
          ) : (
            <span data-pass={row.ratio >= 4.5}>
              {row.ratio.toFixed(2)}:1 {row.ratio >= 4.5 ? "AA" : "FAIL"}
            </span>
          )}
        </p>
      ))}
      <p className="etl-axis__note">
        4.5:1 is the AA minimum for body copy. The dossier row needs a bar open to
        have anything to measure.
      </p>
    </section>
  );
}

function measure(selector: string, bgHex: string): number | null {
  const el = document.querySelector(selector);
  if (!el) return null;
  const fg = parseColor(getComputedStyle(el).color);
  if (!fg) return null;
  const bg = parseHex(bgHex);
  const composited: [number, number, number] = [
    fg[0] * fg[3] + bg[0] * (1 - fg[3]),
    fg[1] * fg[3] + bg[1] * (1 - fg[3]),
    fg[2] * fg[3] + bg[2] * (1 - fg[3]),
  ];
  const a = luminance(composited);
  const b = luminance(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

function parseColor(value: string): [number, number, number, number] | null {
  const m = value.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
  if (parts.length < 3 || parts.some(Number.isNaN)) return null;
  return [parts[0], parts[1], parts[2], parts[3] ?? 1];
}

function parseHex(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance([r, g, b]: [number, number, number]): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/* ------------------------------------------------------------------------ */

function matches(a: LabState, b: LabState): boolean {
  return (
    a.type === b.type &&
    a.accent === b.accent &&
    a.masthead === b.masthead &&
    a.paper === b.paper
  );
}
