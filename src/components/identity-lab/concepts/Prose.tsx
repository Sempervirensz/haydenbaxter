"use client";

// THE CAREER ARC, IN PROSE — one set of words, three treatments.
//
// Format: brianlovin.com/about. Plain first-person prose where "I got here
// by…" turns a range of work into a trajectory, because Hayden's credibility
// IS the order.
//
// TWO TIERS OF EMPHASIS
// 145 words of unbroken prose is unscannable — the honest weakness of the
// format as first built. So the copy now carries its own emphasis as data:
//
//   em    a phrase a scanner needs. Renders <strong>. Never interactive.
//   term  a phrase worth going deeper on. Renders a button that opens one
//         supporting detail, addressed to a named audience.
//
// THE RULE THE REVEAL IS BUILT ON
// The passage makes its full argument BEFORE anything is opened. What a term
// reveals is supplementary depth for one named audience, never a load-bearing
// claim — so this is a standard disclosure (`aria-expanded` + `aria-controls`,
// collapsed panels `hidden`), correctly announced and openable by a screen
// reader, rather than the visually-held-back pattern PersonasSection needs.
// That distinction is the whole point: Personas hid its actual content behind
// hover, which is what made it a bad widget. Nothing essential is in here.
//
// The slot is height-reserved and holds a prompt at rest, so opening a detail
// changes what is in the slot and never what is above it — the prose you were
// reading does not move.
//
// `plain` renders the identical copy with the terms as inert <strong>, which
// is the "just bolded" answer — and it is also exactly what every treatment
// degrades to without JavaScript.

import { useCallback, useEffect, useState } from "react";
import {
  ARC,
  PROSE_SIGNOFF,
  TERMS,
  getTerm,
  type Segment,
  type TermId,
} from "@/data/identityLab";
import { Bleed } from "./parts";

export default function Prose({
  deep = false,
  ground = false,
}: {
  /** Marked terms become operable and the detail slot appears. */
  deep?: boolean;
  ground?: boolean;
}) {
  const [open, setOpen] = useState<TermId | null>(null);

  const toggle = useCallback(
    (id: TermId) => setOpen((cur) => (cur === id ? null : id)),
    []
  );

  // ESC closes, matching the rest of the site's disclosure behaviour.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const renderSeg = (seg: Segment, i: number) => {
    if (typeof seg === "string") return seg;

    if ("em" in seg) {
      return (
        <strong key={i} className="ilab-em">
          {seg.text}
        </strong>
      );
    }

    // A marked term. Inert in the `plain` treatment — same words, same weight,
    // no affordance — so the two can be compared on emphasis alone.
    if (!deep) {
      return (
        <strong key={i} className="ilab-em">
          {seg.text}
        </strong>
      );
    }

    const isOpen = open === seg.term;
    return (
      <button
        key={i}
        type="button"
        className="ilab-term"
        data-on={isOpen || undefined}
        aria-expanded={isOpen}
        aria-controls={`ilab-detail-${seg.term}`}
        onClick={() => toggle(seg.term)}
      >
        {seg.text}
      </button>
    );
  };

  return (
    <section
      className={`ilab-prose ${ground ? "ilab-prose--ground" : ""}`.trim()}
    >
      {ground && (
        <Bleed
          src="/consulting/hero-2.webp"
          alt=""
          w={3440}
          h={1440}
          position="58% 52%"
        />
      )}

      <div className="ilab-prose__body">
        {ARC.map((para, p) => (
          <p
            key={p}
            /* The opening paragraph carries the section and does the audience
               triage, so it takes the serif and a step up. The rest stay in the
               body sans — a whole passage in display serif stops reading as
               someone talking and becomes a pull quote. */
            className={p === 0 ? "ilab-prose__p ilab-prose__p--lead" : "ilab-prose__p"}
          >
            {para.map(renderSeg)}
          </p>
        ))}

        {deep && (
          /* Height-reserved. At rest it holds a prompt rather than collapsing,
             so opening a detail changes what is in the slot and never what is
             above it. */
          <div className="ilab-detail" data-on={open !== null || undefined}>
            <p className="ilab-detail__rest" hidden={open !== null}>
              Five highlighted terms go deeper.
            </p>

            {TERMS.map((t) => (
              <div
                key={t.id}
                id={`ilab-detail-${t.id}`}
                className="ilab-detail__item"
                data-on={open === t.id || undefined}
                hidden={open !== t.id}
              >
                <p className="ilab-detail__label">
                  <span>{t.label}</span>
                  <span className="ilab-detail__audience">{t.audience}</span>
                </p>
                <p className="ilab-detail__body">{getTerm(t.id).body}</p>
              </div>
            ))}
          </div>
        )}

        <p className="ilab-prose__signoff">{PROSE_SIGNOFF}</p>
      </div>
    </section>
  );
}
