"use client";

// 06 — ONE SENTENCE. The direction that argues this is not a section.
//
// Every other concept accepts the premise that "My Experience" needs a
// structure — rows, bands, figures, fields. This one asks whether the moment
// needs anything more than one well-set thought, given that the visitor has
// already scrolled through WorldPulse, the AI builds and the supply-chain
// chapter to get here.
//
// The one mechanism it uses: evidence sits in full ink, connective prose
// recedes to --ink-3. Nothing is bolded, nothing is chipped, nothing is boxed —
// the proof simply reads darker than the sentence carrying it, so the four
// employers, the two figures and the language are legible at a glance and the
// sentence is still a sentence.

import { EDUCATION } from "@/data/experienceLab";
import { ConceptActions } from "./parts";

/** Full-ink evidence inside the receding sentence. */
function E({ children }: { children: React.ReactNode }) {
  return <em className="xlab-sentence__ev">{children}</em>;
}

export default function Sentence() {
  return (
    <div className="xlab xlab--sentence">
      <p className="xlab-sentence__body">
        <E>Eight-plus years</E> in global supply chain — across{" "}
        <E>Aosom</E>, <E>Disney</E> and <E>Nike</E> — supporting{" "}
        <E>100+ factories</E>, in <E>fluent Mandarin</E>. Now founder at{" "}
        <E>WorldPulse</E>, building <E>AI products</E> for the same supply
        chains.
      </p>

      {/* One degree, not two. The concept is a single thought and Mandarin is
          already inside the sentence, so Utah State is the redundancy it exists
          to cut — and the 40px that put it below the fold. */}
      <p className="xlab-sentence__foot">
        {EDUCATION[0].program}
        <span className="xlab-dot" aria-hidden="true" />
        {EDUCATION[0].schoolShort}
      </p>

      <ConceptActions />
    </div>
  );
}
