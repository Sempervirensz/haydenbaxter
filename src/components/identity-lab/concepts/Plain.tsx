// CONCEPT 04 — PLAIN TEXT
//
// Thesis: drop every title and just talk.
//
// The anti-brochure. No cards, no labels on the copy, no disclosure, no
// interaction of any kind. One sustained first-person passage, with the
// credential strip demoted to a mono index in the margin where it reads as
// quiet fact rather than as a claim being made.
//
// The margin is a real <aside> beside the prose on wide containers and a plain
// strip beneath it on narrow ones — never a floating overlay, because that
// would make the credentials compete with the sentence they are supporting.
//
// PHOTOGRAPHY
// One small portrait, at the head of the margin, sized like a byline. An
// earlier pass ran a full-measure image under the prose and it took over the
// section — which is the one thing a concept built on restraint cannot afford.
// The live About collage makes the same mistake five times over: five frames,
// none of them attached to anything being said.
//
// No eyebrow either. The shell already sets the "About" heading, and a mono
// label repeating it above the first sentence is exactly the furniture this
// direction exists to remove.

import { MARGIN, PLAIN } from "@/data/identityLab";

export default function Plain() {
  return (
    <div className="ilab-c ilab-plain">
      <div className="ilab-plain__layout">
        <div className="ilab-plain__prose">
          {PLAIN.map((para, i) => (
            <p
              key={para.slice(0, 32)}
              className={
                i === 0 ? "ilab-plain__p ilab-plain__p--lead" : "ilab-plain__p"
              }
            >
              {para}
            </p>
          ))}
        </div>

        <aside className="ilab-plain__margin" aria-label="Background, in brief">
          <img
            className="ilab-plain__portrait"
            src="/about/portrait.webp"
            alt="Portrait"
            width={1350}
            height={1800}
            loading="lazy"
            decoding="async"
          />
          <ul>
            {MARGIN.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
