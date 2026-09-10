// CONCEPT 01 — STATEMENT
//
// One sentence, held at scale, over a photograph. Nothing else.
//
// This is the WorldPulse chapter's layout applied to a person: mono chapter
// rule top-left, a short serif headline, one supporting line, one DYMO strip.
// The site already proves that composition works — it is the best-looking
// thing on the homepage — so the concept is mostly an argument that About
// deserves the same treatment the Work chapters get.
//
// 22 words of prose. Production's About + Personas is 216.

import { STATEMENT } from "@/data/identityLab";
import { Bleed, ChapterRule, FactStrip } from "./parts";

export default function Statement() {
  return (
    <section className="ilab-stmt">
      <Bleed
        src="/consulting/hero-2.webp"
        alt=""
        w={3440}
        h={1440}
        position="58% 52%"
      />

      <div className="ilab-stmt__body">
        <ChapterRule label="About" />
        <h3 className="ilab-stmt__headline">{STATEMENT.headline}</h3>
        <p className="ilab-stmt__line">{STATEMENT.line}</p>
        <FactStrip className="ilab-stmt__strip" />
      </div>
    </section>
  );
}
