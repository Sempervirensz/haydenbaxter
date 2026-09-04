"use client";

// The Consulting screen, structurally identical to what ships.
//
// This is a copy of `src/components/work/ConsultingPathsScreen.tsx` with two
// additions and nothing else:
//
//   1. `data-treatment` on the root, which is the only hook the lab stylesheet
//      uses. With it unset ("control") the panel resolves entirely against
//      `consulting-paths.css` and renders exactly as the site does.
//   2. `data-masthead`, an independent axis that restores the heading the
//      production masthead omits.
//
// It is a copy rather than a prop threaded through the shipped component
// because the brief is explicit that production is not to be touched during
// the exploration. If a direction is promoted, the merge is small: the CSS
// moves into `consulting-paths.css` under the same axis attribute, and this
// file is deleted.
//
// The five `data-` attributes below are pinned to their shipped values for the
// reason the production file documents at length — the stylesheet's selectors
// carry them, so dropping one loses a point of specificity and starts
// resolving ties by source order the other way.

import {
  CONSULTING_PATHS,
  CONSULTING_SCREEN,
  type ConsultingPath,
} from "@/data/consultingPaths";
import type { DestinationAction } from "@/data/workTogether";
import type { ActionsId, MastheadId, TreatmentId } from "@/data/consultingColorLab";
import "@/components/work/consulting-paths.css";
import "./consulting-color-lab.css";

interface Props {
  onBack: () => void;
  treatment: TreatmentId;
  masthead: MastheadId;
  /** Drafting's button row. Written for every treatment; only Drafting's
      stylesheet matches it. */
  actions?: ActionsId;
}

export default function ConsultingColorScreen({
  onBack,
  treatment,
  masthead,
  actions = "stack",
}: Props) {
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
      // Control writes no attribute at all, so there is nothing for the lab
      // sheet to match and the panel is the shipped article byte for byte.
      {...(treatment === "control" ? {} : { "data-treatment": treatment })}
      // Drafting's system — ramp, metadata colour, gutter rule, spec row,
      // button ranks — is shared by two treatments, and only the sheet colour
      // separates them. `data-system` carries everything that ports to the
      // other screens; `data-treatment` carries the part that does not.
      {...(treatment === "drafting" || treatment === "portable"
        ? { "data-system": "drafting" }
        : {})}
      data-masthead={masthead}
      data-actions={actions}
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
          {/* Same axis for every treatment, so it never confounds the colour
              comparison. h3 rather than h2: inside the Work section this sits
              under "Let's work together". */}
          {masthead === "headline" && (
            <h3 className="cpp-screen__title">{CONSULTING_SCREEN.title}</h3>
          )}
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

  /* The named offers, unless the path opts out with `badges: []`. Both current
     paths do, so no strip renders — carried over so the lab and production
     agree about an empty strip leaving the tree rather than rendering as a
     zero-height flex row with its own top margin. */
  const badges = path.badges ?? d.engagements.map((e) => e.title);

  return (
    <article className="cpp-path" data-path={path.id} data-state="closed">
      <div className="cpp-path__base">
        {/* The track number in the gutter. Decorative in most directions;
            Letterpress promotes it to a poster figure. */}
        <span className="cpp-path__ghost" aria-hidden="true">
          {path.index}
        </span>

        {/* Not a control: it discloses nothing, so it is not a button. */}
        <div className="cpp-path__head" data-cpp-head={path.id}>
          <span className="cpp-path__rule" aria-hidden="true" />
          <span className="cpp-path__kicker">
            <span className="cpp-path__index">{path.index}</span>
            <span className="cpp-path__kickerText">{path.kicker}</span>
          </span>
          <span className="cpp-path__name">{path.name}</span>
          <span className="cpp-path__summary">{path.summary}</span>

          {badges.length > 0 && (
            <span className="cpp-path__offers">
              {badges.map((b) => (
                <span key={b} className="cpp-path__offer">
                  {b}
                </span>
              ))}
            </span>
          )}

          {path.capabilities.length > 0 && (
            <span className="cpp-path__caps">
              {path.capabilities.map((c) => (
                <span key={c} className="cpp-path__cap">
                  {c}
                </span>
              ))}
            </span>
          )}
        </div>

        <div className="cpp-path__actions">
          <Action action={path.primary} kind="primary" />
          <Action action={path.secondary} kind="ghost" />
        </div>
      </div>
    </article>
  );
}

function Action({
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
