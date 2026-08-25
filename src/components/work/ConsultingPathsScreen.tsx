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
// Here each discipline is a named engagement with its own detail and its own
// CTA, and the two sit as equals — no primary, no rank. The visitor commits to
// a conversation about the thing they actually came for.
//
// THE EXPANSION IS UPWARD, AND THAT IS THE WHOLE INTERACTION
//
// The pair is anchored to the BOTTOM of the sheet, and each panel's detail
// block sits ABOVE its base block in the DOM. So choosing a path grows it up
// into the space over the row while the name, the summary and the CTA hold
// their exact position — the button you were reaching for never moves out from
// under the cursor, and nothing below is pushed off the panel. Neither path is
// replaced, dismissed, or navigated away from: the other one stays legible the
// entire time, one click away.
//
// The reveal is a `grid-template-rows: 0fr → 1fr` transition, which animates to
// the content's real height without measuring it in JS and without a scroll
// handler. It carries no interactive elements, so collapsing it with
// `aria-hidden` cannot strand focus.
//
// THE SCHEME IS WRITTEN ON, NOT STRIPPED OUT
//
// The five `data-` attributes below name the combination the site ships out of
// the lab's axes, and `consulting-paths.css` is the lab stylesheet filtered to
// exactly them. They stay in the markup on purpose: the filter keeps selectors
// byte-identical, so removing an attribute here would drop a point of
// specificity and start resolving ties by source order the other way. Change
// the scheme in the lab, then in `scripts/extract-consulting-scheme.mjs`.

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CONSULTING_PATHS,
  CONSULTING_SCREEN,
  type ConsultingPath,
  type ConsultingPathId,
} from "@/data/consultingPaths";
import type { DestinationAction } from "@/data/workTogether";
import "@/components/work/consulting-paths.css";

export default function ConsultingPathsScreen({ onBack }: { onBack: () => void }) {
  // One at a time. Two open panels in a height-constrained card means neither
  // has room for its detail, and the compare this screen exists for is between
  // the two OFFERS, not between two walls of text.
  const [openId, setOpenId] = useState<ConsultingPathId | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);

  const toggle = useCallback((id: ConsultingPathId) => {
    setOpenId((cur) => (cur === id ? null : id));
  }, []);

  // Escape collapses an expanded path before it reaches the stage, so the first
  // press closes the detail and the second leaves the consulting screen — the
  // usual innermost-first order.
  useEffect(() => {
    if (!openId) return;
    const root = rootRef.current;
    if (!root) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      setOpenId(null);
    };
    root.addEventListener("keydown", onKey);
    return () => root.removeEventListener("keydown", onKey);
  }, [openId]);

  return (
    <section
      ref={rootRef}
      className="cpp-screen"
      aria-label="Start a Consulting Project"
      data-open={openId ?? "none"}
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
          <h3 className="cpp-screen__title">{CONSULTING_SCREEN.title}</h3>
          <p className="cpp-screen__lede">{CONSULTING_SCREEN.lede}</p>
        </div>

        <div className="cpp-paths">
          {CONSULTING_PATHS.map((path) => (
            <PathPanel
              key={path.id}
              path={path}
              open={openId === path.id}
              dimmed={openId !== null && openId !== path.id}
              onToggle={() => toggle(path.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PathPanel({
  path,
  open,
  dimmed,
  onToggle,
}: {
  path: ConsultingPath;
  open: boolean;
  dimmed: boolean;
  onToggle: () => void;
}) {
  const detailId = `cpp-detail-${path.id}`;
  const d = path.detail;

  // On a short card the detail is taller than the room the panel can give it,
  // so it scrolls inside itself rather than pushing the CTA off the sheet. A
  // hard cut mid-sentence reads as broken text, so the panel fades its bottom
  // edge — but only while there is actually something below the fold, which is
  // the one thing CSS alone cannot know. Measured on open and on scroll, both
  // cheap and both already user-initiated; nothing runs at rest.
  const innerRef = useRef<HTMLDivElement | null>(null);
  const baseRef = useRef<HTMLDivElement | null>(null);
  const [more, setMore] = useState(false);

  const measure = useCallback(() => {
    const el = innerRef.current;
    if (!el) return setMore(false);
    setMore(el.scrollHeight - el.scrollTop - el.clientHeight > 4);
  }, []);

  useEffect(() => {
    if (!open) return setMore(false);
    // After the 420ms grid-rows reveal has settled on its final height.
    const t = window.setTimeout(() => {
      measure();
      // Stacked, the sheet is a scrolling column and the newly opened detail
      // can sit below the fold, so the press would appear to do nothing.
      //
      // It scrolls the IDENTITY BLOCK into view — not the detail, and not the
      // whole panel. Scrolling to the detail put the detail's top edge at the
      // top of the sheet and pushed the name and CTA off screen, which is the
      // exact failure the stacked layout reverses its blocks to avoid; an
      // expanded panel is taller than the sheet, so scrolling the panel lands
      // on whichever edge is nearer and can cut the name in half. The base
      // block always fits, so it always lands cleanly, with the detail
      // following it down the scroll. `nearest` leaves an already-visible
      // block alone, which is the side-by-side case — so this is inert at
      // desktop rather than guarded by a width check that would have to be
      // kept in sync with the CSS.
      baseRef.current?.scrollIntoView({
        block: "nearest",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    }, 460);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, [open, measure]);

  return (
    <article
      className="cpp-path"
      data-path={path.id}
      data-state={open ? "open" : "closed"}
      data-dimmed={dimmed ? "true" : "false"}
      data-more={more ? "true" : "false"}
    >
      {/* ABOVE the base block on purpose — this is what makes the growth read
          as upward rather than as a drawer pushing the CTA down the panel. */}
      <div className="cpp-path__reveal" id={detailId} aria-hidden={!open} inert={!open}>
        <div className="cpp-path__revealInner" ref={innerRef} onScroll={measure}>
          <p className="cpp-path__detailLede">{d.lede}</p>

          <ul className="cpp-path__engagements">
            {d.engagements.map((e) => (
              <li key={e.title} className="cpp-path__engagement">
                <span className="cpp-path__engagementMeta">{e.meta}</span>
                <h5 className="cpp-path__engagementTitle">{e.title}</h5>
                <p className="cpp-path__engagementBody">{e.body}</p>
              </li>
            ))}
          </ul>

          <ul className="cpp-path__signals">
            {d.signals.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>

          <p className="cpp-path__note">{d.note}</p>

          {/* Proof link. Lives inside the reveal, so `inert` is what keeps the
              collapsed panel's link out of the tab order — aria-hidden alone
              would strand focus on it. */}
          {d.proof && (
            <p className="cpp-path__proof">
              {d.proof.body}{" "}
              <Link className="cpp-path__proofLink" href={d.proof.action.href}>
                {d.proof.action.label} →
              </Link>
            </p>
          )}
        </div>
      </div>

      <div className="cpp-path__base" ref={baseRef}>
        {/* Decorative, and only some directions draw it: the index at poster
            scale behind the name. Ledger outlines it, Marquee fills it faintly,
            everything else hides it. */}
        <span className="cpp-path__ghost" aria-hidden="true">
          {path.index}
        </span>

        {/* The whole identity block is the control. A 300px-wide target beats a
            chevron, and the summary and capabilities are the label a visitor
            actually reads before deciding. */}
        <button
          type="button"
          className="cpp-path__head"
          aria-expanded={open}
          aria-controls={detailId}
          onClick={onToggle}
          data-cpp-head={path.id}
        >
          <span className="cpp-path__rule" aria-hidden="true" />
          <span className="cpp-path__kicker">
            <span className="cpp-path__index">{path.index}</span>
            <span className="cpp-path__kickerText">{path.kicker}</span>
          </span>
          <span className="cpp-path__name">{path.name}</span>
          <span className="cpp-path__summary">{path.summary}</span>

          {/* WHAT THE OFFER ACTUALLY IS, at rest.
              The engagements were only visible once a path was expanded, so a
              visitor scanning the pair saw two disciplines and no products —
              nothing to want, and no reason to press. These are the same
              `detail.engagements` the panel opens onto, named up front. */}
          <span className="cpp-path__offers">
            {d.engagements.map((e) => (
              <span key={e.title} className="cpp-path__offer">
                {e.title}
              </span>
            ))}
          </span>

          <span className="cpp-path__caps">
            {path.capabilities.map((c) => (
              <span key={c} className="cpp-path__cap">
                {c}
              </span>
            ))}
          </span>

          {/* Reads as a control rather than as a caption, and says what is
              behind it — "More detail" describes the mechanism, "See what's
              included" describes the thing the visitor wants. */}
          <span className="cpp-path__more">
            <span className="cpp-path__moreLabel">
              {open ? "Hide the detail" : "See what's included"}
            </span>
            {/* Points the way the panel actually moves: up to open, because the
                pair expands upward, and down to collapse. The stacked layout
                reverses both with `scaleY(-1)`, where it opens downward. */}
            <span className="cpp-path__chev" aria-hidden="true">
              {open ? "↓" : "↑"}
            </span>
          </span>
        </button>

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
