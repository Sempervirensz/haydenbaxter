"use client";

// All six directions, one under another, at one width.
//
// The main lab shows ONE direction at a time against a control panel, which is
// the right tool for judging a single treatment and the wrong one for choosing
// between six. This route exists to be scrolled: same offer, same surface,
// same copy, six skins, so the comparison is direct rather than remembered.
//
// Each direction is preceded by its own cost, because the decision is a
// trade-off and reading "what it buys" alone is how you pick the wrong one.

import { useState } from "react";
import { PATHS, getPath, type OfferSurfaceId, type PathId } from "@/data/offerLab";
import {
  OFFER_DIRECTIONS,
  OFFER_TEMPLATE_MODES,
  getKind,
  resolveTemplate,
  type OfferTemplateModeId,
} from "@/data/offerDirections";
import OfferRender from "./OfferRender";
import "./offer-lab.css";
import "./directions/offer-directions.css";
import "./directions-compare.css";

export default function DirectionsCompare() {
  const [offer, setOffer] = useState<PathId>("consulting");
  const [surface, setSurface] = useState<OfferSurfaceId>("dark");
  const [templateMode, setTemplateMode] = useState<OfferTemplateModeId>("perOffer");

  const path = getPath(offer);
  const kind = getKind(offer);
  const template = resolveTemplate(offer, templateMode);

  return (
    <main className="ofdc">
      <header className="ofdc__head">
        <h1 className="ofdc__title">Offer directions — side by side</h1>
        <p className="ofdc__sub">
          Six treatments of the same offer. Same copy, same surface, same
          template — only the art direction changes.
        </p>

        <div className="ofdc__controls">
          <div className="ofdc__group" role="group" aria-label="Offer">
            {PATHS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`ofdc__btn ${offer === p.id ? "is-active" : ""}`}
                aria-pressed={offer === p.id}
                onClick={() => setOffer(p.id)}
              >
                {p.destination.eyebrow}
              </button>
            ))}
          </div>

          <div className="ofdc__group" role="group" aria-label="Surface">
            {(["dark", "paper"] as OfferSurfaceId[]).map((s) => (
              <button
                key={s}
                type="button"
                className={`ofdc__btn ${surface === s ? "is-active" : ""}`}
                aria-pressed={surface === s}
                onClick={() => setSurface(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="ofdc__group" role="group" aria-label="Template">
            {OFFER_TEMPLATE_MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`ofdc__btn ${templateMode === m.id ? "is-active" : ""}`}
                aria-pressed={templateMode === m.id}
                onClick={() => setTemplateMode(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <p className="ofdc__readout">
          <strong>{path.destination.eyebrow}</strong> is a <strong>{kind}</strong>.{" "}
          {template.premise} Movements:{" "}
          {template.sections.map((s) => s.label).join(" · ")}
        </p>
      </header>

      {OFFER_DIRECTIONS.map((dir) => (
        <section key={dir.id} className="ofdc__item">
          <div className="ofdc__meta">
            <h2 className="ofdc__name">{dir.name}</h2>
            <p className="ofdc__note">{dir.note}</p>
            <p className="ofdc__buys">
              <span className="ofdc__tag">Buys</span> {dir.buys}
            </p>
            <p className="ofdc__cost">
              <span className="ofdc__tag ofdc__tag--cost">Costs</span> {dir.cost}
            </p>
            <p className="ofdc__links">
              <a
                href={`/offer-lab/${offer}?direction=${dir.id}&surface=${surface}&template=${templateMode}`}
              >
                Open as a real page →
              </a>
            </p>
          </div>

          <div className="ofdc__stage">
            <OfferRender
              path={path}
              direction={dir.id}
              layout="editorial"
              surface={surface}
              templateMode={templateMode}
              idPrefix={`ofdc-${dir.id}`}
            />
          </div>
        </section>
      ))}
    </main>
  );
}
