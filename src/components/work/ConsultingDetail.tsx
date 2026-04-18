"use client";

import { useEffect, useState } from "react";
import type { ConsultingData } from "@/data/work";
import { CONNECT_LINKS, WECHAT_ID, CALENDLY_URL } from "@/data/connect";
import TagPills from "@/components/work/TagPills";

interface ConsultingDetailProps {
  data: ConsultingData;
  isActive?: boolean;
}

function statusClass(status: string): string {
  return status.toLowerCase() === "reserved"
    ? "cns-badge cns-badge--reserved"
    : "cns-badge cns-badge--offer";
}

export default function ConsultingDetail({ data, isActive }: ConsultingDetailProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeOfferId, setActiveOfferId] = useState(data.offers[0]?.id ?? "");

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && drawerOpen) setDrawerOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  // Load Calendly script when drawer opens
  useEffect(() => {
    if (!drawerOpen) return;
    if (document.querySelector('script[src*="calendly.com/assets/external/widget.js"]')) return;
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);
  }, [drawerOpen]);

  const activeOffer = data.offers.find((o) => o.id === activeOfferId) ?? data.offers[0];

  return (
    <section className="cns-photo" data-cns-section>
      <picture>
        <source
          media="(max-width: 640px)"
          srcSet="/Mobile%20Statue%20Consulting.png"
        />
        <img
          className="cns-photo__img"
          src="/consulting-hero.png"
          alt="Night cityscape"
        />
      </picture>

      {/* Menu button */}
      <button
        className={`tag cns-photo__menu ${drawerOpen ? "cns-photo__menu--open" : ""}`}
        type="button"
        onClick={() => setDrawerOpen(!drawerOpen)}
        aria-expanded={drawerOpen}
        aria-controls="cns-drawer"
      >
        {drawerOpen ? "Close" : "Menu"}
      </button>

      {/* Backdrop */}
      <div
        className={`cns-photo__backdrop ${drawerOpen ? "is-open" : ""}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        id="cns-drawer"
        className={`cns-photo__drawer ${drawerOpen ? "is-open" : ""}`}
        role="dialog"
        aria-label="Consulting details"
      >
        <div className="cns-photo__scroll">
          {/* Hero copy */}
          <header className="cns-photo__header">
            <p className="cns-photo__eyebrow">{data.eyebrow}</p>
            <h4 className="cns-photo__title">{data.heroTitle}</h4>
            <p className="cns-photo__subtitle">{data.heroSubtitle}</p>
          </header>

          {/* Offers */}
          <div className="cns-photo__offers">
            {data.offers.map((offer) => (
              <article
                key={offer.id}
                className={`cns-photo__card ${offer.id === activeOffer.id ? "is-active" : ""}`}
              >
                <button
                  className="cns-photo__card-btn"
                  type="button"
                  onMouseEnter={() => setActiveOfferId(offer.id)}
                  onFocus={() => setActiveOfferId(offer.id)}
                  onClick={() => setActiveOfferId(offer.id)}
                >
                  <div className="cns-photo__card-head">
                    <h5 className="cns-photo__card-title">{offer.title}</h5>
                    <span className={statusClass(offer.status)}>{offer.status}</span>
                  </div>
                  <p className="cns-photo__card-liner">{offer.oneLiner}</p>
                  <ul className="cns-photo__card-deliverables">
                    {offer.deliverables.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                  <div className="cns-photo__card-tags">
                    <TagPills tags={offer.tags} className="cns-pill" />
                  </div>
                </button>
              </article>
            ))}
          </div>

          {/* Proof tiles */}
          <div className="cns-photo__proof">
            <h5 className="cns-photo__section-title">Proof framing</h5>
            <p className="cns-photo__section-sub">
              Problem &rarr; approach &rarr; deliverable
            </p>
            <div className="cns-photo__proof-list">
              {data.proofTiles.map((tile) => (
                <article key={tile.title} className="cns-photo__proof-card">
                  <div className="cns-photo__proof-name">{tile.title}</div>
                  <div className="cns-photo__proof-client">{tile.clientType}</div>
                  <div className="cns-photo__proof-row">
                    <span>Problem</span>
                    <p>{tile.problem}</p>
                  </div>
                  <div className="cns-photo__proof-row">
                    <span>Approach</span>
                    <p>{tile.approach}</p>
                  </div>
                  <div className="cns-photo__proof-row">
                    <span>Deliverable</span>
                    <p>{tile.deliverable}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div className="cns-photo__connect">
            <h5 className="cns-photo__section-title">Connect</h5>
            <div className="cns-photo__connect-grid">
              {CONNECT_LINKS.map((link) => {
                if (link.href === null) {
                  return (
                    <span key={link.id} className="tag tag--connect tag--display">
                      {link.label}
                      <span className="connect__id">{WECHAT_ID}</span>
                    </span>
                  );
                }
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    className="tag tag--connect"
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
            <div
              className="calendly-inline-widget cns-photo__calendly"
              data-url={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=0a0a0a&text_color=f3f3f3&primary_color=ffffff`}
            />
          </div>

          {/* Footer identity */}
          <footer className="cns-photo__footer">
            <p className="cns-photo__identity">{data.identityLine}</p>
            <p className="cns-photo__founder">{data.founderLine}</p>
          </footer>
        </div>
      </div>
    </section>
  );
}
