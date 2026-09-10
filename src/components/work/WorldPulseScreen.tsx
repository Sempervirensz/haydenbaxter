"use client";

// "Explore WorldPulse" — path 02 of the Consulting chapter.
//
// What it replaced and why is documented at the top of `src/data/worldpulse.ts`,
// with the measurements that decided it.
//
// THE COMPOSITION
//
// One claim at display scale, then the scope and the ask as two mono spec rows,
// then the buttons. That order is the argument: the shipped
// version opened with a founder paragraph and pushed "Investors" — the one
// conversation this path exists to start — into the fifth slot of a right-hand
// column, where a rule meant for the consulting pair then hid it on every
// phone. This inverts the weight the way `ExperienceScreen` did for the
// operating record.
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
// `.cpp-path__ghost` is NOT rendered, matching the other two screens: numbers
// name the three top-level destinations, and this screen IS destination 02.
// Drafting hands a solo screen's hue to that numeral, but WorldPulse's `ai`
// accent #1e4ebe is the system hue #1b4bb8 to the eye, so nothing is lost —
// the hue still reads on the kickers and on the primary button.
//
// WHY THERE ARE NO `.cpp-path__cap` CHIPS
//
// Not an aesthetic preference. `.cpp-path[data-state="closed"]
// .cpp-path__cap:nth-child(n + 4)` is `display: none` below the 700px turn,
// the solo opt-out beneath it loses on source order at equal specificity, and
// this screen carries both attributes on one element. A spec row is the shape
// Drafting already uses for a list that must survive at every width.

import { CLAIM, COVERS, OPEN_TO, type SpecRow } from "@/data/worldpulse";
import { getPath, type PathDef } from "@/data/workTogether";
import { Action } from "@/components/work/ConsultingPathsScreen";
import "@/components/work/consulting-paths.css";
import "@/components/work/worldpulse-screen.css";

function Spec({ row }: { row: SpecRow }) {
  return (
    <div className="wp__spec">
      {/* No `.cpp-path__rule`. Drafting sets it to `display: none` — the accent
          bar belongs to the paired layout — so rendering it here would be an
          element that draws nothing, which is how the old sheet accumulated
          the chrome this screen exists to remove. */}
      <span className="cpp-path__kicker">
        <span className="cpp-path__kickerText">{row.label}</span>
      </span>
      <p className="wp__row">
        {row.items.map((item) => (
          <span key={item} className="wp__item">
            {item}
          </span>
        ))}
      </p>
    </div>
  );
}

/**
 * The venture itself, with no sheet around it — the same split
 * `ExperienceScreen` uses, so the lab and the shipped section cannot drift into
 * different designs the way a copied JSX block would.
 */
export function WorldPulseRecord() {
  return (
    <div className="wp">
      <p className="wp__claim">{CLAIM}</p>

      <div className="wp__specs">
        <Spec row={COVERS} />
        <Spec row={OPEN_TO} />
      </div>
    </div>
  );
}

export default function WorldPulseScreen({ onBack }: { onBack: () => void }) {
  const path: PathDef = getPath("worldpulse");
  const d = path.destination;

  return (
    <section
      className="cpp-screen wp-screen"
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

      <div className="cpp-screen__body">
        <div className="cpp-screen__masthead">
          <h3 className="cpp-screen__title">{d.title}</h3>
        </div>

        {/* `data-path="ai"` is what production's ACCENT_FOR map already
            resolved WorldPulse to, so the cobalt hue and its grooves are the
            ones the section ships with. */}
        <div className="cpp-paths wp-screen__paths" data-solo="true">
          <article
            className="cpp-path wp-screen__body"
            data-path="ai"
            data-state="closed"
            data-solo="true"
          >
            <WorldPulseRecord />

            <div className="cpp-path__actions wp__actions">
              <Action action={d.primary} kind="primary" />
              {d.secondary && <Action action={d.secondary} kind="ghost" />}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
