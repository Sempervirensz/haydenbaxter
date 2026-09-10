// CONCEPT 02 — TRIPTYCH
//
// Show the three rooms instead of describing them.
//
// The live Personas section states the triad for the sixth time, as three job
// titles with nine résumé bullets under them. This is the same three areas in
// 27 words and three pictures — the site's own section imagery, so it reads as
// a contents page for the Work chapters rather than as a new claim.
//
// The AI panel carries the four product marks instead of a photograph. Four
// real marks in a row say "shipped things" faster than a picture of a screen,
// and they are the actual evidence.

import { PANELS, TRIPTYCH } from "@/data/identityLab";
import { ChapterRule } from "./parts";

export default function Triptych() {
  return (
    <section className="ilab-tri">
      <div className="ilab-tri__head">
        <ChapterRule label="About" />
        <h3 className="ilab-tri__headline">{TRIPTYCH.headline}</h3>
      </div>

      <div className="ilab-tri__grid">
        {PANELS.map((panel) => (
          <article key={panel.label} className="ilab-tri__panel">
            <div
              className={`ilab-tri__panel-art ${panel.img?.src.includes("supply-chain") ? "ilab-tri__panel-art--map" : ""}`.trim()}
            >
              {panel.img ? (
                <img
                  src={panel.img.src}
                  alt={panel.img.alt}
                  width={panel.img.w}
                  height={panel.img.h}
                  loading="eager"
                  decoding="async"
                  style={
                    panel.img.position
                      ? { objectPosition: panel.img.position }
                      : undefined
                  }
                />
              ) : (
                <ul className="ilab-tri__panel-marks">
                  {panel.marks?.map((m) => (
                    <li key={m.src}>
                      <img
                        src={m.src}
                        alt={m.alt}
                        width={1024}
                        height={1024}
                        loading="eager"
                        decoding="async"
                      />
                    </li>
                  ))}
                </ul>
              )}
              <span className="ilab-tri__panel-scrim" aria-hidden="true" />
            </div>

            <h4 className="ilab-tri__panel-label">{panel.label}</h4>
            <p className="ilab-tri__panel-line">{panel.line}</p>
          </article>
        ))}
      </div>

      <p className="ilab-tri__closer">{TRIPTYCH.closer}</p>
    </section>
  );
}
