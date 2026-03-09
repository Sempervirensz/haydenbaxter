"use client";

import { useEffect, useMemo, useState } from "react";
import type { ConsultingData, ConsultingOffer } from "@/data/work";
import DetailModal from "@/components/work/DetailModal";
import GlyphBlock from "@/components/work/GlyphBlock";
import TagPills from "@/components/work/TagPills";

interface ConsultingDetailProps {
  data: ConsultingData;
}

/* Vercel clean-URLs strips .html → serve at /dist/index.
   next dev needs the explicit /dist/index.html.            */
const GLOBE_PARAMS = "?embed=1&v=20260224-pointer-flow";
const GLOBE_BASE = "/experiments/particle-globe-lab/dist/index";

function statusClass(status: string): string {
  return status.toLowerCase() === "reserved"
    ? "cns-badge cns-badge--reserved"
    : "cns-badge cns-badge--offer";
}

export default function ConsultingDetail({ data }: ConsultingDetailProps) {
  const [globeSrc, setGlobeSrc] = useState(GLOBE_BASE + GLOBE_PARAMS);
  useEffect(() => {
    const h = window.location.hostname;
    if (h === "localhost" || h === "127.0.0.1") {
      setGlobeSrc(GLOBE_BASE + ".html" + GLOBE_PARAMS);
    }
  }, []);

  const defaultOfferId = data.offers[0]?.id ?? "";
  const [activeOfferId, setActiveOfferId] = useState(defaultOfferId);
  const [modalOfferId, setModalOfferId] = useState<string | null>(null);

  const activeOffer = useMemo(
    () => data.offers.find((offer) => offer.id === activeOfferId) ?? data.offers[0],
    [activeOfferId, data.offers]
  );

  const modalOffer = useMemo(
    () =>
      modalOfferId
        ? data.offers.find((offer) => offer.id === modalOfferId) ?? null
        : null,
    [modalOfferId, data.offers]
  );

  return (
    <section className="cns" data-cns-section>
      <div className="cns-hero">
        <div className="cns-hero__copy">
          <p className="cns-hero__eyebrow">{data.eyebrow}</p>
          <h4 className="cns-hero__title">{data.heroTitle}</h4>
          <p className="cns-hero__subtitle">{data.heroSubtitle}</p>
          <p className="cns-hero__identity">{data.identityLine}</p>
          <p className="cns-hero__founder">{data.founderLine}</p>
        </div>

        <div className="cns-hero__orbWrap" aria-label="Interactive particle globe preview">
          <div className="cns-hero__orbShell">
            <div className="cns-hero__orbHalo" aria-hidden="true" />
            <iframe
              className="cns-hero__orbEmbed"
              src={globeSrc}
              title="Interactive monochrome particle globe"
              loading="eager"
              scrolling="no"
            />
          </div>
          <p className="cns-hero__orbLabel">Interactive signal field · pointer reactive</p>
        </div>
      </div>

      <div className="cns-layout">
        <div className="cns-offers" data-cns-offers role="list">
          {data.offers.map((offer) => (
            <article
              key={offer.id}
              className={`cns-offerCard ${offer.id === activeOffer?.id ? "is-active" : ""}`}
              role="listitem"
            >
              <button
                className="cns-offerCard__button"
                type="button"
                data-cns-offer={offer.id}
                aria-label={`Open ${offer.title} details`}
                onMouseEnter={() => setActiveOfferId(offer.id)}
                onFocus={() => setActiveOfferId(offer.id)}
                onClick={() => {
                  setActiveOfferId(offer.id);
                  setModalOfferId(offer.id);
                }}
              >
                <span className="cns-offerCard__sheen" aria-hidden="true" />
                <div className="cns-offerCard__head">
                  <div className="cns-offerCard__meta">
                    <h5 className="cns-offerCard__title">{offer.title}</h5>
                  </div>
                  <span className={statusClass(offer.status)}>{offer.status}</span>
                </div>

                <p className="cns-offerCard__oneLiner">{offer.oneLiner}</p>

                <div className="cns-offerCard__expand">
                  <ul className="cns-offerCard__deliverables">
                    {offer.deliverables.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <div className="cns-offerCard__tags">
                    <TagPills tags={offer.tags} className="cns-pill" />
                  </div>
                </div>
              </button>
            </article>
          ))}
        </div>

        <aside className="cns-proof" aria-labelledby="cns-proof-title">
          <div className="cns-proof__head">
            <h5 className="cns-proof__title" id="cns-proof-title">
              Proof framing
            </h5>
            <p className="cns-proof__subtitle">
              Problem → approach → deliverable (generic client types, no logos).
            </p>
          </div>
          <div className="cns-proof__list" data-cns-proof-list>
            {data.proofTiles.map((tile) => (
              <article key={tile.title} className="cns-proofCard">
                <div className="cns-proofCard__title">{tile.title}</div>
                <div className="cns-proofCard__clientType">{tile.clientType}</div>
                <div className="cns-proofCard__row">
                  <span>Problem</span>
                  <p>{tile.problem}</p>
                </div>
                <div className="cns-proofCard__row">
                  <span>Approach</span>
                  <p>{tile.approach}</p>
                </div>
                <div className="cns-proofCard__row">
                  <span>Deliverable</span>
                  <p>{tile.deliverable}</p>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </div>

      <DetailModal
        isOpen={Boolean(modalOffer)}
        onClose={() => setModalOfferId(null)}
        classPrefix="cns-modal"
        eyebrow="Consulting offer"
        labelledBy="cns-modal-title"
        describedBy="cns-modal-desc"
      >
        {modalOffer ? (
          <div className="cns-modalBody">
            <div className="cns-modalBody__hero">
              <GlyphBlock
                prefix="cns-modalBody"
                title={modalOffer.title}
                subtitle={modalOffer.status || "Offer"}
              />
              <div className="cns-modalBody__heroCopy">
                <div className="cns-modalBody__eyebrow">Consulting offer</div>
                <div className="cns-modalBody__titleRow">
                  <h3 className="cns-modalBody__title" id="cns-modal-title">
                    {modalOffer.title}
                  </h3>
                  <span className={statusClass(modalOffer.status)}>
                    {modalOffer.status}
                  </span>
                </div>
                <p className="cns-modalBody__oneLiner" id="cns-modal-desc">
                  {modalOffer.oneLiner}
                </p>
                <p className="cns-modalBody__bestFor">
                  <strong>Best for:</strong> {modalOffer.bestFor}
                </p>
              </div>
            </div>

            <div className="cns-modalBody__grid">
              <section className="cns-modalBody__main">
                <h4 className="cns-modalBody__sectionTitle">Deliverables</h4>
                <ul className="cns-modalBody__deliverables">
                  {modalOffer.deliverables.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>

                <div className="cns-modalBody__tags">
                  <TagPills tags={modalOffer.tags} className="cns-pill" />
                </div>

                <div className="cns-modalBody__pavd">
                  {modalOffer.modalSections.map((section) => (
                    <div key={section.label} className="cns-modalBody__section">
                      <div className="cns-modalBody__sectionLabel">{section.label}</div>
                      <p className="cns-modalBody__sectionText">{section.text}</p>
                    </div>
                  ))}
                </div>
              </section>

              <aside className="cns-modalBody__aside">
                <div className="cns-modalBody__panel">
                  <div className="cns-modalBody__miniLabel">System snapshot</div>
                  <ul className="cns-modalBody__list">
                    {modalOffer.systemSnapshot.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
                <div className="cns-modalBody__panel">
                  <div className="cns-modalBody__miniLabel">Engagement shape</div>
                  <ul className="cns-modalBody__list">
                    <li>No pricing table. Scope first.</li>
                    <li>Capability-first framing for recruiters + clients.</li>
                    <li>Built to hand off clearly to internal teams.</li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        ) : null}
      </DetailModal>
    </section>
  );
}
