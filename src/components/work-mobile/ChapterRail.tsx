"use client";

// Shared chapter rail. Pinned top-left on every card.
//
// The ordinal ("01 / 04") IS the navigation cue for the sequence — it tells you
// where you are and how much is left without spending a pager, dots, or a
// progress bar on a screen that has none to spare. Both the ordinal and the
// name come from production data, so the rail cannot disagree with what the
// desktop stack shows.

export default function ChapterRail({
  ordinal,
  name,
  tone = "onPhoto",
}: {
  ordinal: string;
  name: string;
  /** onPhoto adds a shadow so the rail survives sunlit imagery. */
  tone?: "onPhoto" | "onPanel";
}) {
  return (
    <header className={`mws-rail mws-rail--${tone}`}>
      <span className="mws-rail__num">
        {ordinal} — {name}
      </span>
      <span className="mws-rail__line" aria-hidden="true" />
    </header>
  );
}
