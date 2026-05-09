"use client";

// Consulting offer dossier — off-white "file" card hovering over the blurred
// hero. Content is intentionally concise: capability title, descriptor, six
// bullets, then a single "Start a conversation" CTA group with two actions.

import type { ConsultingOffer } from "@/data/consultingOffers";
import { CALENDLY_URL, CONNECT_LINKS } from "@/data/connect";

interface Props {
  offer: ConsultingOffer;
  onClose: () => void;
}

export default function OfferDossier({ offer, onClose }: Props) {
  const emailHref =
    CONNECT_LINKS.find((l) => l.id === "email")?.href ??
    "mailto:haydenjbaxter@gmail.com";

  return (
    <div className="cht-dos">
      <div className="cht-dos__card">
        <div className="cht-dos__cardHead">
          <span className="cht-dos__eyebrow">Capability</span>
          <button
            type="button"
            className="cht-dos__close"
            onClick={onClose}
            aria-label="Close offer detail"
          >
            Close
          </button>
        </div>

        <h3 className="cht-dos__title">{offer.name}</h3>
        <p className="cht-dos__descriptor">{offer.descriptor}</p>

        <ul className="cht-dos__bullets">
          {offer.bullets.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <div className="cht-dos__convo">
          <h4 className="cht-dos__convoHeading">Start a Conversation</h4>
          <p className="cht-dos__convoSupport">
            Exploring a project, workflow, or idea? Let&rsquo;s talk through it.
          </p>
          <div className="cht-dos__convoActions">
            <a
              className="cht-dos__convoBtn cht-dos__convoBtn--primary"
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a 30-Minute Call
            </a>
            <a
              className="cht-dos__convoBtn cht-dos__convoBtn--ghost"
              href={emailHref}
            >
              Send an Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
