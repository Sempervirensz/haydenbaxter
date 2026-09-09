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
// IT IS A DRAFTING SCREEN, AND IT IS A SOLO ONE
//
// The sheet chrome is `WorkTogetherSolo`'s, attribute for attribute, because
// the Drafting system reads those attributes and this screen has to be one of
// the three rather than an exception among them:
//
//   data-system="drafting"   the readability floor (--ink-2/3/4 and --hair-2),
//                            metadata on the system hue, the button ranks
//   data-actions="rule"      the button row: filled primary, ruled secondary
//   data-solo="true"         on BOTH `.cpp-paths` and `.cpp-path`, and it is
//                            load-bearing, not decoration. Drafting guards its
//                            gutter rule and its registration tick with
//                            `:not([data-solo])`; without the flag this screen
//                            would draw a vertical rule down the middle of one
//                            column and turn the tick into a bullet.
//
// `.cpp-path__ghost` is NOT rendered, and that is a change from the version
// this comment used to describe. Drafting scopes the registration tick away
// from solo screens and hands the path's hue to the numeral instead — "the tick
// where paths are paired, the numeral where one stands alone" — which was
// written when Experience was still `WorkTogetherSolo`'s two-block sheet with
// no other brass in it.
//
// This composition does have other brass: `.xp__num` on the 中文 figure is
// `--accent-ink` at display scale, and it is the only other non-neutral colour
// in the sheet. So the hue survives the numeral's removal, on a mark two orders
// of magnitude larger than a 9px callout in the gutter. Numbers here name the
// three top-level destinations only; this screen IS destination 03 and does not
// also need to say so.
//
// WHY THE BODY IS SPLIT OUT
//
// `ExperienceRecord` is the composition; `ExperienceScreen` is that composition
// inside the paper sheet the chapter opens. The lab renders the record alone,
// inside its own frame, so the two cannot drift into different designs the way
// a copied JSX block would.

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
          the employers are the harder proof and still lead.

          Each entry is its own element rather than a run of text with
          separators between: Drafting sets a spec row with hairline dividers
          instead of middots, and a rule can only hang off an element. */}
      <div className="xp__notes">
        <p className="xp__foot">
          {CAREER.map((s) => (
            <span key={s.id} className="xp__item">
              {s.company}
            </span>
          ))}
        </p>
        <div className="xp__schools">
          {EDUCATION.map((e) => (
            <p key={e.id} className="xp__foot xp__foot--edu">
              <span className="xp__item">{e.programShort}</span>
              <span className="xp__item">{e.schoolShort}</span>
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
      data-system="drafting"
      data-actions="rule"
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

      {/* `data-path="supply"` is what production's ACCENT_FOR map already
          resolved Experience to, so the brass hue and its grooves are the ones
          the section ships with. */}
      <div className="cpp-paths xp-screen__paths" data-solo="true">
        <article
          className="cpp-path xp-screen__body"
          data-path="supply"
          data-state="closed"
          data-solo="true"
        >
          <ExperienceRecord />

          <div className="cpp-path__actions xp__actions">
            <Action action={d.primary} kind="primary" />
            {d.secondary && <Action action={d.secondary} kind="ghost" />}
          </div>
        </article>
      </div>
    </section>
  );
}
