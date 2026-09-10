// CONCEPT 04 — MARGIN
//
// A photograph, annotated by hand.
//
// The argument is the order: Mandarin, then the factory floor, then AI. Written
// as a timeline it is a résumé; written as three notes in the margin of a
// photograph it is a person telling you the one thing worth knowing.
//
// Uses `--font-cursive` (Caveat), which the site loads and almost never
// renders. That is the point — it belongs to this world without repeating any
// existing section's look.
//
// The notes are real text, tied to the frame by hairline leaders. Baking them
// into the image would index as nothing and would not scale.
//
// 20 words of prose. It cannot grow: there is nowhere to put more.

import { MARGIN, MARGIN_NOTES } from "@/data/identityLab";
import { ChapterRule, FactStrip } from "./parts";

export default function Margin() {
  return (
    <section className="ilab-margin">
      <ChapterRule label="About" />

      <div className="ilab-margin__stage">
        <figure className="ilab-margin__frame">
          <img
            src="/about/portrait.webp"
            alt="Portrait"
            width={1350}
            height={1800}
            loading="lazy"
            decoding="async"
          />
        </figure>

        {/* Leaders are decorative; the notes read as an ordered list, because
            the order is the entire argument. */}
        <ol className="ilab-margin__notes">
          {MARGIN_NOTES.map((note, i) => (
            <li key={note} className={`ilab-note-${i + 1}`}>
              <span className="ilab-margin__leader" aria-hidden="true" />
              <span className="ilab-margin__hand">{note}</span>
            </li>
          ))}
        </ol>
      </div>

      <h3 className="ilab-margin__headline">{MARGIN.headline}</h3>
      <FactStrip className="ilab-margin__strip" />
    </section>
  );
}
