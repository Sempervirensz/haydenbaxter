// CONCEPT 05 — PROVENANCE
//
// Thesis: prove the product by using it.
//
// WorldPulse's argument is that supply chain data does not have to feel cold,
// hidden, or technical — that a Digital Product Passport can make origin,
// composition, and custody legible to whoever is holding the thing. This
// section applies that format to the person who builds them.
//
// The discipline that keeps it from being a gimmick is the `Verified` row:
// every claim names somewhere it can be checked. A passport whose claims
// cannot be checked is exactly the thing WorldPulse exists to replace, so a
// decorative version of this concept would argue against itself.
//
// Rendered as a real <dl>. The fields are definitions, and a description list
// is what a screen reader needs to read a passport as a record rather than as
// five unrelated lists.

import { PASSPORT } from "@/data/identityLab";
import { Eyebrow } from "./parts";

export default function Passport() {
  return (
    <div className="ilab-c ilab-pass">
      <Eyebrow>A passport, applied to a person</Eyebrow>

      <div className="ilab-pass__head">
        <p className="ilab-pass__name">Hayden Baxter</p>
        <p className="ilab-pass__desc">
          A Digital Product Passport records where a thing came from, what it is
          made of, whose hands it passed through, and which of its claims can be
          checked. It is what I build at WorldPulse. Applied here, to me.
        </p>
      </div>

      <dl className="ilab-pass__record">
        {PASSPORT.map((field) => (
          <div key={field.field} className="ilab-pass__row">
            <dt className="ilab-pass__field">
              <span className="ilab-pass__field-name">{field.field}</span>
              <span className="ilab-pass__field-hint">{field.hint}</span>
            </dt>
            <dd className="ilab-pass__values">
              {field.values.map((v) => (
                <span key={v.value} className="ilab-pass__value">
                  <span className="ilab-pass__value-main">{v.value}</span>
                  {v.note && (
                    <span className="ilab-pass__value-note">{v.note}</span>
                  )}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>

      <p className="ilab-pass__foot">
        Every line above points at somewhere it can be checked. That is the
        whole point of a passport, and it is the reason this section is not a
        list of adjectives.
      </p>
    </div>
  );
}
