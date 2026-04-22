"use client";

// Consulting Offer Dossier — structural clone of ETB's OverlayDossier, but the
// dark outer shell is gone. What remains is the off-white "file" card hovering
// over the blurred background, with the close control tucked into the card.

import type { ConsultingOffer } from "@/data/consultingOffers";

function toSlug(v: string) {
  return v
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface Props {
  offer: ConsultingOffer;
  onClose: () => void;
}

export default function OfferDossier({ offer, onClose }: Props) {
  return (
    <div className="cht-dos">
      <div className="cht-dos__card">
        <div className="cht-dos__cardHead">
          <span className="cht-dos__eyebrow">Offer File</span>
          <button
            type="button"
            className="cht-dos__close"
            onClick={onClose}
            aria-label="Close offer detail"
          >
            Close
          </button>
        </div>

        <div className="cht-dos__meta">
          <span
            className={`cht-dos__status cht-dos__status--${toSlug(offer.status)}`}
          >
            {offer.status}
          </span>
          <span className="cht-dos__category">{offer.category}</span>
        </div>

        <h3 className="cht-dos__title">{offer.name}</h3>
        <p className="cht-dos__oneLiner">{offer.oneLiner}</p>
        <hr className="cht-dos__rule" />

        <ul className="cht-dos__bullets">
          {offer.bullets.slice(0, 3).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <div className="cht-dos__tags">
          {offer.tags.map((tag) => (
            <span key={tag} className="cht-dos__tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="cht-dos__notes">
          <span className="cht-dos__notesLabel">Engagement Notes</span>
          <ul className="cht-dos__notesList">
            {offer.systemNotes.slice(0, 3).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <button type="button" className="cht-dos__cta">
          Start a conversation &rarr;
        </button>
      </div>
    </div>
  );
}
