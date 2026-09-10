// CONCEPT 01 — THROUGHLINE
//
// Thesis: it has been one job the whole time.
//
// The three areas are demoted from identities to rooms the same method gets
// practised in. That demotion is the entire idea: the live page presents them
// as three things Hayden IS, which is what forces it to restate the triad
// everywhere. Here they are three places one thing HAPPENS, so the section can
// state them once and the rest of the page stops having to re-introduce them.
//
// No disclosure, no tabs, no hover. Everything is on screen at once — a
// visitor should be able to read the whole argument without touching anything.

import { METHOD, ROOMS, FACTS } from "@/data/identityLab";
import { Eyebrow, Rule } from "./parts";

export default function Throughline() {
  return (
    <div className="ilab-c ilab-through">
      <Eyebrow>The short version</Eyebrow>

      {/* The thesis. Held at display size because it is the one sentence the
          rest of the homepage is allowed to stop repeating. */}
      <p className="ilab-through__thesis">
        I make complicated operations legible — first to the people running
        them, then to the software that runs them.
      </p>

      <p className="ilab-through__sub">
        That is the whole job. It has looked like sourcing, like traceability,
        and like AI, but it has been one job the entire time.
      </p>

      <Rule />

      {/* The method, named. Three moves, mono-labelled — this is the part the
          live site never says out loud anywhere. */}
      <section className="ilab-through__method" aria-labelledby="ilab-method-h">
        <h3 className="ilab-sub" id="ilab-method-h">
          How it actually goes
        </h3>
        <ol className="ilab-through__moves">
          {METHOD.map((m, i) => (
            <li key={m.label} className="ilab-through__move">
              <span className="ilab-through__num">{`0${i + 1}`}</span>
              <span className="ilab-through__move-label">{m.label}</span>
              <span className="ilab-through__move-line">{m.line}</span>
            </li>
          ))}
        </ol>
        <p className="ilab-through__bridge">{FACTS.bridge}</p>
      </section>

      <Rule />

      {/* The three rooms. Same method, three settings — each carrying its own
          credibility inline so Nike / Disney / the builds land as evidence of
          the argument rather than as a separate credential strip. */}
      <section className="ilab-through__rooms" aria-labelledby="ilab-rooms-h">
        <h3 className="ilab-sub" id="ilab-rooms-h">
          Where it shows up
        </h3>
        <div className="ilab-through__grid">
          {ROOMS.map((r) => (
            <article key={r.room} className="ilab-room">
              <h4 className="ilab-room__title">{r.room}</h4>
              <p className="ilab-room__area">{r.area}</p>
              <p className="ilab-room__line">{r.line}</p>
              <p className="ilab-room__proof">{r.proof}</p>
            </article>
          ))}
        </div>
      </section>

      <p className="ilab-through__closer">
        The résumé reads as three careers. It has been one, practised in three
        places.
      </p>
    </div>
  );
}
