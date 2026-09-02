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
// Round two added a second contact sheet: Drafting is the direction going
// forward, and its button row has four iterations of its own. "Drafting rows"
// shows all four at once for the same reason.
//
// Nothing on the live site imports any of this.

import { useEffect, useState } from "react";
import {
  DEFAULT_ACTIONS,
  DEFAULT_TREATMENT,
  DRAFTING_ACTIONS,
  MASTHEADS,
  SHIPPED_CONTRAST,
  TREATMENTS,
  getTreatment,
  type ActionsId,
  type MastheadId,
  type TreatmentId,
} from "@/data/consultingColorLab";
import { usePrefersReducedMotion } from "@/components/cta-lab/usePrefersReducedMotion";
import ConsultingColorStage from "./ConsultingColorStage";
import "@/components/work/work-together.css";
import "./consulting-color-lab.css";

type ViewportMode = "gallery" | "rows" | "desktop" | "narrow";

export default function ConsultingColorLab() {
  const [view, setView] = useState<ViewportMode>("gallery");
  const [treatment, setTreatment] = useState<TreatmentId>(DEFAULT_TREATMENT);
  const [masthead, setMasthead] = useState<MastheadId>("production");
  const [actions, setActions] = useState<ActionsId>(DEFAULT_ACTIONS);
  const [forceReduced, setForceReduced] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);

  const osReduced = usePrefersReducedMotion();
  const reduced = osReduced || forceReduced;
  const active = getTreatment(treatment);
  const row = DRAFTING_ACTIONS.find((a) => a.id === actions) ?? DRAFTING_ACTIONS[0];
  const showRows = treatment === "drafting" || view === "rows";

  /* The panel only earns a gutter of its own from 1440px up. Narrower than
     that it is a fixed overlay sitting on the very thing being judged, so it
     starts collapsed. Done in an effect so server and first client render
     agree. */
  useEffect(() => {
    if (window.innerWidth < 1440) setPanelOpen(false);
  }, []);

  const singleLabel = `${active.label}${
    treatment === "drafting" ? ` · ${row.label}` : ""
  } — ${view === "narrow" ? "390px container" : "desktop"}`;

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
              actions={actions}
              primary={i === 0}
              label={t.label}
              note={t.thesis}
            />
          ))
        ) : view === "rows" ? (
          DRAFTING_ACTIONS.map((a, i) => (
            <ConsultingColorStage
              key={a.id}
              width="gallery"
              treatment="drafting"
              masthead={masthead}
              actions={a.id}
              primary={i === 0}
              label={`Drafting · ${a.label}`}
              note={a.note}
            />
          ))
        ) : (
          <ConsultingColorStage
            width={view}
            treatment={treatment}
            masthead={masthead}
            actions={actions}
            primary
            label={singleLabel}
            note={treatment === "drafting" ? row.note : active.thesis}
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
                  ? "All four directions at once. The only way to compare skins rather than remember them."
                  : view === "rows"
                    ? "Drafting four times, one button row each, on 1200px cards so Equal and Split clear their container gates."
                    : "One direction, full size. Use the chips below to switch."
              }
              wide
            >
              {(
                [
                  ["gallery", "All four"],
                  ["rows", "Drafting rows"],
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
                    if (view === "gallery" || view === "rows") setView("desktop");
                  }}
                  label={t.label}
                  hint={t.thesis}
                />
              ))}
            </Group>

            {/* Only meaningful for Drafting; hidden otherwise so the panel
                does not offer a control that changes nothing. */}
            {showRows && (
              <Group label="Drafting · button row" hint={row.note} wide>
                {DRAFTING_ACTIONS.map((a) => (
                  <Toggle
                    key={a.id}
                    on={actions === a.id}
                    onClick={() => {
                      setActions(a.id);
                      setTreatment("drafting");
                      if (view === "gallery" || view === "rows") setView("desktop");
                    }}
                    label={a.label}
                    hint={a.note}
                  />
                ))}
              </Group>
            )}

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

              {treatment === "drafting" && (
                <>
                  <h3 className="ccl-arg__label">Button row · {row.label}</h3>
                  <p className="ccl-arg__body">{row.note}</p>
                  <p className="ccl-arg__body ccl-arg__body--trade">{row.tradeoff}</p>
                </>
              )}
            </section>

            {/* The measured version of "muted". Printed in the panel because
                two of these four rows are the reason this is a readability
                fix and not only a taste one. */}
            <section className="ccl-arg ccl-arg--data">
              <h3 className="ccl-arg__label">Shipped ink ramp, on #f5f4f1</h3>
              <table className="ccl-table">
                <tbody>
                  {SHIPPED_CONTRAST.map((r) => (
                    <tr key={r.token} data-pass={r.passes ? "true" : "false"}>
                      <th scope="row">{r.token}</th>
                      <td>{r.role}</td>
                      <td className="ccl-table__ratio">{r.ratio}</td>
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
