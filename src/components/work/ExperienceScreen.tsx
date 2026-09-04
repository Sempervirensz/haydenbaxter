"use client";

// "Review My Experience" — path 03 of the Consulting chapter.
//
// Out of the lab at /experience-lab, where it was direction 04 of eight. What
// it replaced and why is documented at the top of `src/data/experience.ts`.
//
// THE COMPOSITION
//
// Three figures at display scale, then the employers and the schools as one
// mono footnote beneath them. That order is the whole argument: the shipped
// version gave its largest object to its longest credential and rendered its
// strongest ones as word-sized chips, so this inverts the weight. The visitor
// has already met Nike, Disney and Aosom in the brands marquee near the top of
// the page — down here they are corroboration, not news, and they are sized
// accordingly.
//
// WHY THE BODY IS SPLIT OUT
//
// `ExperienceRecord` is the composition; `ExperienceScreen` is that composition
// inside the paper sheet the chapter opens. The lab renders the record alone,
// inside its own frame, so the two cannot drift into different designs the way
// a copied JSX block would.
//
// The sheet chrome, the accent and the two actions are unchanged from what
// shipped: `data-path="supply"` is what production's ACCENT_FOR map already
// resolved Experience to, so this keeps the brass hue and its grooves.

import { CAREER, EDUCATION, FIGURES } from "@/data/experience";
import { getPath, type PathDef } from "@/data/workTogether";
import { Action } from "@/components/work/ConsultingPathsScreen";
import "@/components/work/consulting-paths.css";
import "@/components/work/experience-screen.css";

/**
 * The record itself, with no sheet around it.
 *
 * `container-type: inline-size` is set on the root in CSS rather than here, and
 * it is the reason the type ramp behaves: the card (`.wt`) keeps widening past
 * 3400px while the sheet caps at 1696px (`--shell-consulting`), so a `cqw` read
 * against the card over-scales this composition on every ultrawide display. Its
 * own container makes every `cqw` below a share of the SHEET.
 */
export function ExperienceRecord() {
  return (
    <div className="xp">
      <dl className="xp__figs">
        {FIGURES.map((f) => (
          <div key={f.id} className="xp__fig" data-fig={f.id}>
            <dt className="xp__num" lang={f.id === "language" ? "zh" : undefined}>
              {f.figure}
            </dt>
            <dd className="xp__cap">{f.caption}</dd>
          </div>
        ))}
      </dl>

      {/* One citation block, not three peers. Spaced apart they read as three
          unrelated facts; held together they read as the evidence the figures
          rest on. The schools sit a rank below the employers in size and ink —
          the employers are the harder proof and still lead. */}
      <div className="xp__notes">
        <p className="xp__foot">
          {CAREER.map((s, i) => (
            <span key={s.id}>
              {i > 0 && <span className="xp__dot" aria-hidden="true" />}
              {s.company}
            </span>
          ))}
        </p>
        <div className="xp__schools">
          {EDUCATION.map((e) => (
            <p key={e.id} className="xp__foot xp__foot--edu">
              {e.programShort}
              <span className="xp__dot" aria-hidden="true" />
              {e.schoolShort}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ExperienceScreen({ onBack }: { onBack: () => void }) {
  const path: PathDef = getPath("experience");
  const d = path.destination;

  return (
    <section
      className="cpp-screen xp-screen"
      aria-label={path.label}
      data-open="none"
      data-layout="tracklist"
      data-palette="cobalt-brass"
      data-surface="paper"
      data-type="house"
      data-button="cue"
    >
      <header className="cpp-screen__head">
        <span className="cpp-screen__eyebrow">{d.eyebrow}</span>
        <button
          type="button"
          className="cpp-screen__back"
          onClick={onBack}
          data-wt-focus="destination"
        >
          <span aria-hidden="true">&larr;</span> Back to options
        </button>
      </header>

      {/* Carries the brass accent and the sleeve grooves the rest of the
          chapter draws, exactly as WorkTogetherSolo did for this path. */}
      <div className="cpp-path xp-screen__body" data-path="supply" data-state="closed">
        <ExperienceRecord />

        <div className="cpp-path__actions xp__actions">
          <Action action={d.primary} kind="primary" />
          {d.secondary && <Action action={d.secondary} kind="ghost" />}
        </div>
      </div>
    </section>
  );
}
