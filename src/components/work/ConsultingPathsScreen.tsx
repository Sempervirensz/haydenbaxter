"use client";

// "Start a Consulting Project" — TWO paths, side by side.
//
// WHAT IT REPLACED
//
// One paper panel listing AI Systems and Supply Chain as read-only blocks over
// a single generic "Discuss a project" button (WorkTogetherScreen +
// workTogether.ts → CONSULTING). Both disciplines were visible, but neither was
// actionable on its own.
//
// Here each discipline is a named engagement with its own offers and its own
// CTA, and the two sit as equals — no primary, no rank. The visitor commits to
// a conversation about the thing they actually came for.
//
// THE SCHEME IS WRITTEN ON, NOT STRIPPED OUT
//
// The five `data-` attributes below name the combination the site ships out of
// the lab's axes, and `consulting-paths.css` is the lab stylesheet filtered to
// exactly them. They stay in the markup on purpose: the filter keeps selectors
// byte-identical, so removing an attribute here would drop a point of
// specificity and start resolving ties by source order the other way. Change
// the scheme in the lab, then in `scripts/extract-consulting-scheme.mjs`.
//
// `data-open` and `data-state` are pinned to their resting values rather than
// dropped for the same reason: the stylesheet's at-rest rules select on
// `[data-open="none"]` and `[data-state="closed"]`, so those literals are what
// hold the panel's present appearance now that nothing expands.

import {
  CONSULTING_PATHS,
  CONSULTING_SCREEN,
  type ConsultingPath,
} from "@/data/consultingPaths";
import type { DestinationAction } from "@/data/workTogether";
import "@/components/work/consulting-paths.css";

export default function ConsultingPathsScreen({ onBack }: { onBack: () => void }) {
  return (
    <section
      className="cpp-screen"
      aria-label="Start a Consulting Project"
      data-open="none"
      data-layout="tracklist"
      data-palette="cobalt-brass"
      data-surface="paper"
      data-type="house"
      data-button="cue"
    >
      <header className="cpp-screen__head">
        <span className="cpp-screen__eyebrow">{CONSULTING_SCREEN.eyebrow}</span>
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
          <p className="cpp-screen__lede">{CONSULTING_SCREEN.lede}</p>
        </div>

        <div className="cpp-paths">
          {CONSULTING_PATHS.map((path) => (
            <PathPanel key={path.id} path={path} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PathPanel({ path }: { path: ConsultingPath }) {
  const d = path.detail;

  /* The named offers, unless the path opts out with `badges: []`. Rendering an
     empty <span> rather than nothing would leave the strip's own 10px top
     margin behind as a gap under the summary, so it comes out of the tree
     entirely and the column closes up on its own. */
  const badges = path.badges ?? d.engagements.map((e) => e.title);

  return (
    <article className="cpp-path" data-path={path.id} data-state="closed">
      <div className="cpp-path__base">
        {/* Decorative, and only some directions draw it: the index at poster
            scale behind the name. Ledger outlines it, Marquee fills it faintly,
            everything else hides it. */}
        <span className="cpp-path__ghost" aria-hidden="true">
          {path.index}
        </span>

        {/* The identity block. Not a control: it discloses nothing, so it is
            not a button — a focusable element that does nothing on Enter is a
            lie to a keyboard user. */}
        <div className="cpp-path__head" data-cpp-head={path.id}>
          <span className="cpp-path__rule" aria-hidden="true" />
          <span className="cpp-path__kicker">
            <span className="cpp-path__index">{path.index}</span>
            <span className="cpp-path__kickerText">{path.kicker}</span>
          </span>
          <span className="cpp-path__name">{path.name}</span>
          <span className="cpp-path__summary">{path.summary}</span>

          {/* WHAT THE OFFER ACTUALLY IS. Without these a visitor scanning the
              pair sees two disciplines and no products — nothing to want.
              The AI side opts out: it leads with an invitation rather than a
              product, and the capability line under it carries that instead. */}
          {badges.length > 0 && (
            <span className="cpp-path__offers">
              {badges.map((b) => (
                <span key={b} className="cpp-path__offer">
                  {b}
                </span>
              ))}
            </span>
          )}

          <span className="cpp-path__caps">
            {path.capabilities.map((c) => (
              <span key={c} className="cpp-path__cap">
                {c}
              </span>
            ))}
          </span>
        </div>

        <div className="cpp-path__actions">
          <Action action={path.primary} kind="primary" />
          <Action action={path.secondary} kind="ghost" />
        </div>
      </div>
    </article>
  );
}

export function Action({
  action,
  kind,
}: {
  action: DestinationAction;
  kind: "primary" | "ghost";
}) {
  const external = action.external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <a className={`cpp-action cpp-action--${kind}`} href={action.href} {...external}>
      <span className="cpp-action__label">{action.label}</span>
    </a>
  );
}
