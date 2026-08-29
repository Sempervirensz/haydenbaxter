"use client";

// Consulting colour lab — /consulting-color-lab.
//
// One question: can a restrained accent system give the Consulting screen
// visual hierarchy without turning it into a product landing page?
//
// Four stages, one control and three directions, all rendering the same copy
// and the same interaction. The shell owns the axes and nothing else.
//
// Default view is the contact sheet, because judging four skins by clicking a
// chip four times compares each one against your memory of the last. Side by
// side it is one look.
//
// Nothing on the live site imports any of this.

import { useEffect, useState } from "react";
import {
  DEFAULT_TREATMENT,
  MASTHEADS,
  SHIPPED_CONTRAST,
  TREATMENTS,
  getTreatment,
  type MastheadId,
  type TreatmentId,
} from "@/data/consultingColorLab";
import { usePrefersReducedMotion } from "@/components/cta-lab/usePrefersReducedMotion";
import ConsultingColorStage from "./ConsultingColorStage";
import "@/components/work/work-together.css";
import "./consulting-color-lab.css";

type ViewportMode = "gallery" | "desktop" | "narrow";

export default function ConsultingColorLab() {
  const [view, setView] = useState<ViewportMode>("gallery");
  const [treatment, setTreatment] = useState<TreatmentId>(DEFAULT_TREATMENT);
  const [masthead, setMasthead] = useState<MastheadId>("production");
  const [forceReduced, setForceReduced] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);

  const osReduced = usePrefersReducedMotion();
  const reduced = osReduced || forceReduced;
  const active = getTreatment(treatment);

  /* The panel only earns a gutter of its own from 1440px up. Narrower than
     that it is a fixed overlay sitting on the very thing being judged, so it
     starts collapsed. Done in an effect so server and first client render
     agree. */
  useEffect(() => {
    if (window.innerWidth < 1440) setPanelOpen(false);
  }, []);

  return (
    <main
      className="ccl-root"
      data-viewport={view}
      data-motion={reduced ? "reduced" : "full"}
    >
      <div className="ccl-stages">
        {view === "gallery" ? (
          TREATMENTS.map((t, i) => (
            <ConsultingColorStage
              key={t.id}
              width="gallery"
              treatment={t.id}
              masthead={masthead}
              primary={i === 0}
              label={t.label}
              note={t.thesis}
            />
          ))
        ) : (
          <ConsultingColorStage
            width={view}
            treatment={treatment}
            masthead={masthead}
            primary
            label={`${active.label} — ${view === "narrow" ? "390px container" : "desktop"}`}
            note={active.thesis}
          />
        )}
      </div>

      <aside className="ccl-panel" data-open={panelOpen ? "true" : "false"}>
        <button
          type="button"
          className="ccl-panel__toggle"
          onClick={() => setPanelOpen((o) => !o)}
          aria-expanded={panelOpen}
        >
          {panelOpen ? "Hide controls" : "Controls"}
        </button>

        {panelOpen && (
          <div className="ccl-panel__body">
            <h1 className="ccl-panel__title">Consulting colour</h1>
            <p className="ccl-panel__note">
              One control and three directions over the same copy, the same
              markup and the same interaction. The three bars above the sheet
              are production in all four — only the sheet varies.
            </p>

            <Group
              label="View"
              hint={
                view === "gallery"
                  ? "All four at once. The only way to compare skins rather than remember them."
                  : "One direction, full size. Use the chips below to switch."
              }
            >
              {(
                [
                  ["gallery", "All four"],
                  ["desktop", "Desktop"],
                  ["narrow", "390px"],
                ] as [ViewportMode, string][]
              ).map(([id, label]) => (
                <Toggle
                  key={id}
                  on={view === id}
                  onClick={() => setView(id)}
                  label={label}
                />
              ))}
            </Group>

            <Group label="Direction" hint={active.thesis} wide>
              {TREATMENTS.map((t) => (
                <Toggle
                  key={t.id}
                  on={treatment === t.id}
                  onClick={() => {
                    setTreatment(t.id);
                    if (view === "gallery") setView("desktop");
                  }}
                  label={t.label}
                  hint={t.thesis}
                />
              ))}
            </Group>

            <Group
              label="Masthead"
              hint={MASTHEADS.find((m) => m.id === masthead)?.note}
              wide
            >
              {MASTHEADS.map((m) => (
                <Toggle
                  key={m.id}
                  on={masthead === m.id}
                  onClick={() => setMasthead(m.id)}
                  label={m.label}
                  hint={m.note}
                />
              ))}
            </Group>

            <Group label="Motion">
              <Toggle
                on={forceReduced}
                onClick={() => setForceReduced((r) => !r)}
                label={osReduced ? "Force (OS already on)" : "Force reduced motion"}
              />
            </Group>

            {/* The argument for whatever is selected, so the reasoning is
                beside the thing rather than in a document you have to hold in
                your head while looking at it. */}
            <section className="ccl-arg">
              <h2 className="ccl-arg__name">
                {active.label}
                <span className="ccl-arg__temp">{active.temperature}</span>
              </h2>

              <h3 className="ccl-arg__label">What changed</h3>
              <ul className="ccl-arg__list">
                {active.changed.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>

              <h3 className="ccl-arg__label">What it solves</h3>
              <p className="ccl-arg__body">{active.solves}</p>

              <h3 className="ccl-arg__label">Tradeoff</h3>
              <p className="ccl-arg__body">{active.tradeoff}</p>
            </section>

            {/* The measured version of "muted". Printed in the panel because
                two of these four rows are the reason this is a readability
                fix and not only a taste one. */}
            <section className="ccl-arg ccl-arg--data">
              <h3 className="ccl-arg__label">Shipped ink ramp, on #f5f4f1</h3>
              <table className="ccl-table">
                <tbody>
                  {SHIPPED_CONTRAST.map((row) => (
                    <tr key={row.token} data-pass={row.passes ? "true" : "false"}>
                      <th scope="row">{row.token}</th>
                      <td>{row.role}</td>
                      <td className="ccl-table__ratio">{row.ratio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="ccl-arg__foot">
                WCAG AA for normal text is 4.5:1. Two of the four fail, and
                between them they carry the lede, both summaries, the
                secondary button, the eyebrow, both kickers and both track
                numerals — i.e. everything except the names.
              </p>
            </section>
          </div>
        )}
      </aside>
    </main>
  );
}

/** One axis. The note for the current selection sits under the label rather
    than inside every chip — the paths lab learned that the hard way, with a
    panel that ran 700px past the bottom of the window. */
function Group({
  label,
  hint,
  wide,
  children,
}: {
  label: string;
  hint?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`ccl-group ${wide ? "ccl-group--wide" : ""}`.trim()}>
      <h2 className="ccl-group__label">{label}</h2>
      {hint && <p className="ccl-group__hint">{hint}</p>}
      <div className="ccl-group__items">{children}</div>
    </section>
  );
}

function Toggle({
  on,
  onClick,
  label,
  hint,
}: {
  on: boolean;
  onClick: () => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      className="ccl-toggle"
      data-on={on ? "true" : "false"}
      aria-pressed={on}
      onClick={onClick}
      title={hint}
    >
      {label}
    </button>
  );
}
