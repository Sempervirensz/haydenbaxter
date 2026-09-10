// CONCEPT 03 — PLATE
//
// Identity as an object, not a passage.
//
// The site's single best visual idea is a physical CD player resting on blue
// velvet. This puts the site's other signature material — the DYMO emboss — on
// that same ground, and lets the object be the section.
//
// `usethisbackground.webp` is the velvet the Work stack already uses, so the
// section is not introducing a surface; it is borrowing the one the homepage
// is built on.
//
// 24 words of prose. The five facts are labels, not sentences: nothing here is
// said twice, which is the habit this whole lab exists to break.

import { PLATE, STRIP } from "@/data/identityLab";

export default function Plate() {
  return (
    <section className="ilab-plate">
      <img
        className="ilab-plate__ground"
        src="/usethisbackground.webp"
        alt=""
        width={2048}
        height={896}
        loading="lazy"
        decoding="async"
      />

      <div className="ilab-plate__object">
        {/* The stamped name — the largest emboss on the site, and the only
            place this concept says who it is about. */}
        <p className="ilab-plate__stamp">{PLATE.stamp}</p>

        <p className="ilab-plate__line">{PLATE.line}</p>

        <ul className="ilab-plate__facts">
          {STRIP.map((f) => (
            <li key={f} className="ilab-plate__fact">
              {f}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
