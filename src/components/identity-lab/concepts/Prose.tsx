// THE CAREER ARC, IN PROSE — one format, two treatments.
//
// The format comes from brianlovin.com/about: plain first-person prose, now →
// before → before that, where "Before that…" turns a range of work into a
// trajectory. Applied here because Hayden's credibility IS the order — Mandarin,
// then the factory floor, then Fortune 100 operations, then AI — and prose is
// the only form that carries an order without becoming a résumé.
//
// TWO TREATMENTS, ONE SET OF WORDS
// `01 Plain` is type on the site's ground, which is what every reference site
// with this shape actually does. `02 Ground` sets the identical copy over a
// photograph. The copy does not change between them, so the comparison is
// purely about whether the image earns its place.
//
// WHAT IS DELIBERATELY ABSENT
//   · No section heading. The first three words are "I'm Hayden."
//   · No DYMO fact strip. The prose names Nike, Disney, Mandarin and the
//     master's in sequence; a strip would repeat them three lines later, which
//     is the redundancy this lab exists to remove.
//   · No cards, no grid, no disclosure, no interaction of any kind.

import { PROSE, PROSE_SIGNOFF } from "@/data/identityLab";
import { Bleed } from "./parts";

export default function Prose({ ground = false }: { ground?: boolean }) {
  return (
    <section className={`ilab-prose ${ground ? "ilab-prose--ground" : ""}`.trim()}>
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
        {PROSE.map((para, i) => (
          <p
            key={para.slice(0, 24)}
            /* The opening paragraph carries the section on its own, so it takes
               the serif. The rest stay in the body sans — a whole passage set
               in display serif stops being someone talking. */
            className={i === 0 ? "ilab-prose__p ilab-prose__p--lead" : "ilab-prose__p"}
          >
            {para}
          </p>
        ))}

        <p className="ilab-prose__signoff">{PROSE_SIGNOFF}</p>
      </div>
    </section>
  );
}
