"use client";

// The OTHER two tabs — Explore WorldPulse and Review My Experience.
//
// WHY THIS EXISTS
//
// An earlier pass restyled only the consulting answer and left these two on the
// old `WorkTogetherScreen`. That produced a section with two design systems in
// it: pick a tab and the sheet, the type, the borders and the buttons all
// changed underneath you.
//
// WHAT IS AND IS NOT REDESIGNED HERE
//
// Only the consulting answer is being redesigned — that was the brief, and it
// still holds. These two screens keep production's information architecture
// exactly: the same eyebrow, headline, lede, the same two titled blocks with
// the same items, the same credential strip, the same note, the same two
// actions in the same order. What changes is only what the axes control — the
// surface, the type, the accents, the panel chrome and the buttons — so the
// three tabs read as one system.
//
// Structurally this is the consulting sheet with one panel instead of two, and
// it reuses the same class names on purpose: every direction's rules (Ledger's
// hairlines, Plate's plates, Blueprint's grid and corner ticks, Marquee's
// bands) then apply to it for free, and a new direction gets these two screens
// without writing a line for them.

import type { PathDef } from "@/data/workTogether";
import { Action } from "@/components/work/ConsultingPathsScreen";
import "@/components/work/consulting-paths.css";

/**
 * Which of the palette's two hues each screen takes.
 *
 * Arbitrary but consistent, and easy to flip: WorldPulse is a product venture
 * so it takes the systems hue, and Experience is an operator's record so it
 * takes the supply-chain one. The alternative — a third neutral accent — was
 * worse: it made the palette look like it had three members when the whole
 * argument of the pair is that it has two.
 */
const ACCENT_FOR: Record<string, "ai" | "supply"> = {
  worldpulse: "ai",
  experience: "supply",
};

export default function WorkTogetherSolo({
  path,
  onBack,
}: {
  path: PathDef;
  onBack: () => void;
}) {
  const d = path.destination;
  const accent = ACCENT_FOR[path.id] ?? "ai";

  return (
    <section
      className="cpp-screen"
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

      <div className="cpp-screen__body">
        <div className="cpp-screen__masthead">
          <h3 className="cpp-screen__title">{d.title}</h3>
          <p className="cpp-screen__lede">{d.lede}</p>
        </div>

        <div className="cpp-paths" data-solo="true">
          <article className="cpp-path" data-path={accent} data-state="closed" data-solo="true">
            <div className="cpp-path__base">
              <span className="cpp-path__ghost" aria-hidden="true">
                {path.index}
              </span>

              <div className="cpp-solo__blocks">
                {d.blocks.map((block, i) => (
                  <div key={block.label} className="cpp-solo__block">
                    <span className="cpp-path__rule" aria-hidden="true" />
                    <span className="cpp-path__kicker">
                      <span className="cpp-path__index">{`0${i + 1}`}</span>
                      <span className="cpp-path__kickerText">{block.label}</span>
                    </span>
                    <span className="cpp-path__summary">{block.descriptor}</span>
                    <span className="cpp-path__caps">
                      {block.items.map((item) => (
                        <span key={item} className="cpp-path__cap">
                          {item}
                        </span>
                      ))}
                    </span>
                  </div>
                ))}
              </div>

              <ul className="cpp-path__signals">
                {d.signals.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>

              <p className="cpp-path__note">{d.note}</p>

              <div className="cpp-path__actions">
                <Action action={d.primary} kind="primary" />
                {d.secondary && <Action action={d.secondary} kind="ghost" />}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
