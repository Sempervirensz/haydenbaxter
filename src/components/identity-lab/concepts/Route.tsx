// CONCEPT 02 — THE ROUTE
//
// Thesis: the ORDER is the differentiator.
//
// The live site already owns this timeline — it sits inside the Supply Chain
// chapter as four dated stops. What it does not do is say why the sequence
// matters. Each stop here carries a second line stating what it made possible
// for the stop after it, so the section accumulates instead of listing.
//
// The fifth stop is new only in the sense that it is the present: WorldPulse
// and the AI work, positioned as the thing the first four made possible.
//
// Photography: one frame, not five. The live About gallery is a five-photo
// collage that says nothing; a single image anchored to the route is doing
// more work with less.

import { ROUTE } from "@/data/identityLab";
import { Eyebrow } from "./parts";

export default function Route() {
  return (
    <div className="ilab-c ilab-route">
      <Eyebrow>The order matters</Eyebrow>

      <p className="ilab-route__lede">
        Plenty of people know AI. Fewer know sourcing. The thing worth knowing
        about me is the order — I learned the factory floor in Mandarin first,
        and came to AI last, which is why the AI work starts from an operating
        model instead of from a model.
      </p>

      <ol className="ilab-route__list">
        {ROUTE.map((stop, i) => (
          <li key={stop.year} className="ilab-stop">
            {/* The spine. Decorative — the ordered list already carries
                sequence for anyone not seeing it. */}
            <span className="ilab-stop__spine" aria-hidden="true">
              <span className="ilab-stop__dot" />
            </span>

            <div className="ilab-stop__body">
              <p className="ilab-stop__when">
                <span className="ilab-stop__year">{stop.year}</span>
                <span className="ilab-stop__place">{stop.place}</span>
              </p>
              <p className="ilab-stop__fact">{stop.fact}</p>
              <p className="ilab-stop__voice">{stop.voice}</p>
            </div>

            {/* The compounding, stated. Skipped after the last stop, which has
                nothing after it to enable. */}
            {i < ROUTE.length - 1 && (
              <p className="ilab-stop__carry" aria-hidden="true">
                which made the next one possible
              </p>
            )}
          </li>
        ))}
      </ol>

      {/* No caption. The obvious one — "supplier networks across China,
          Vietnam, and Indonesia" — would be a claim about what the photograph
          shows, and it does not show that. The route already states the fact
          at the stop it belongs to. */}
      <figure className="ilab-route__figure">
        <img
          src="/about/pano.webp"
          alt="On location — panorama"
          width={2600}
          height={922}
          loading="lazy"
          decoding="async"
        />
      </figure>

      <p className="ilab-route__closer">AI came last on purpose.</p>
    </div>
  );
}
