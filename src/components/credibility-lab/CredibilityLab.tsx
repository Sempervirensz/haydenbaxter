"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PersonasSection from "@/components/PersonasSection";
import ConnectSection from "@/components/ConnectSection";
import AboutSection from "@/components/AboutSection";
import JournalSection from "@/components/JournalSection";
import SiteFooter from "@/components/SiteFooter";
import { RESUME_HREF } from "@/data/workTogether";
import {
  CREDIBILITY_CONCEPTS,
  IMPACT_ITEMS,
  PROOF_ITEMS,
  QUICK_ANSWERS,
  TESTIMONIAL,
  type CredibilityConceptId,
} from "@/data/credibilityLab";
import "./credibility-lab.css";

function ProofCards() {
  return (
    <section className="clab-proof" aria-labelledby="clab-proof-title">
      <div className="clab-shell">
        <div className="clab-section-head">
          <span className="clab-kicker">Selected proof</span>
          <h2 id="clab-proof-title" className="clab-title">
            The work behind the positioning.
          </h2>
          <p className="clab-lede">
            Three examples that connect strategy, operating experience, and hands-on build work.
          </p>
        </div>

        <div className="clab-proof-grid">
          {PROOF_ITEMS.map((item) => (
            <article key={item.id} className="clab-proof-card">
              <span className="clab-proof-card__eyebrow">{item.eyebrow}</span>
              <h3 className="clab-proof-card__title">{item.title}</h3>
              <p className="clab-proof-card__body">{item.body}</p>
              <div className="clab-tags" aria-label="Capabilities">
                {item.tags.map((tag) => (
                  <span key={tag} className="clab-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="clab-proof-actions">
          <Link className="clab-action clab-action--primary" href="/emerging-tech-builds">
            View AI & emerging tech builds
          </Link>
          <a className="clab-action clab-action--ghost" href={RESUME_HREF} target="_blank" rel="noopener noreferrer">
            View resume
          </a>
        </div>
      </div>
    </section>
  );
}

function ImpactStrip() {
  return (
    <section className="clab-impact" aria-labelledby="clab-impact-title">
      <div className="clab-shell">
        <div className="clab-section-head clab-section-head--compact">
          <span className="clab-kicker">Selected impact</span>
          <h2 id="clab-impact-title" className="clab-title">
            A few numbers worth remembering.
          </h2>
        </div>

        <dl className="clab-impact-grid">
          {IMPACT_ITEMS.map((item) => (
            <div key={item.label} className="clab-impact-item">
              <dt className="clab-impact-item__figure">{item.figure}</dt>
              <dd className="clab-impact-item__copy">
                <span className="clab-impact-item__label">{item.label}</span>
                <span className="clab-impact-item__note">{item.note}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Testimonial({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`clab-quote ${compact ? "clab-quote--compact" : ""}`.trim()} aria-labelledby="clab-quote-title">
      <div className="clab-shell clab-quote__shell">
        <span className="clab-kicker">What others say</span>
        <h2 id="clab-quote-title" className="visually-hidden">
          Recommendation
        </h2>
        <blockquote className="clab-quote__text">
          “{TESTIMONIAL.quote}”
        </blockquote>
        <div className="clab-quote__credit">
          <strong>{TESTIMONIAL.name}</strong>
          <span>{TESTIMONIAL.role}</span>
          <span>{TESTIMONIAL.formerRole}</span>
        </div>
        <p className="clab-source-flag">{TESTIMONIAL.status}</p>
      </div>
    </section>
  );
}

function QuickAnswers() {
  return (
    <section className="clab-faq" aria-labelledby="clab-faq-title">
      <div className="clab-shell clab-faq__layout">
        <div className="clab-section-head clab-section-head--compact">
          <span className="clab-kicker">Quick answers</span>
          <h2 id="clab-faq-title" className="clab-title">
            The questions that usually come before a conversation.
          </h2>
        </div>

        <div className="clab-faq__list">
          {QUICK_ANSWERS.map((item, index) => (
            <details key={item.question} className="clab-faq__item" open={index === 0}>
              <summary className="clab-faq__question">
                <span>{item.question}</span>
                <span className="clab-faq__plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="clab-faq__answer">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Dossier() {
  return (
    <section className="clab-dossier" aria-labelledby="clab-dossier-title">
      <div className="clab-shell">
        <div className="clab-dossier__sheet">
          <div className="clab-dossier__head">
            <div>
              <span className="clab-kicker">Evidence dossier</span>
              <h2 id="clab-dossier-title" className="clab-title">
                Proof, compressed.
              </h2>
            </div>
            <a className="clab-action clab-action--primary" href={RESUME_HREF} target="_blank" rel="noopener noreferrer">
              View resume
            </a>
          </div>

          <div className="clab-dossier__rows">
            {PROOF_ITEMS.map((item) => (
              <article key={item.id} className="clab-dossier__row">
                <span className="clab-dossier__meta">{item.eyebrow}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>

          <dl className="clab-dossier__figures">
            {IMPACT_ITEMS.map((item) => (
              <div key={item.label}>
                <dt>{item.figure}</dt>
                <dd>{item.label}</dd>
              </div>
            ))}
          </dl>

          <div className="clab-dossier__quote">
            <blockquote>“{TESTIMONIAL.quote}”</blockquote>
            <p>
              <strong>{TESTIMONIAL.name}</strong>
              <span>{TESTIMONIAL.role}</span>
            </p>
            <span className="clab-source-flag">{TESTIMONIAL.status}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function AfterPersonas({ concept }: { concept: CredibilityConceptId }) {
  if (concept === "impact") return <ImpactStrip />;
  if (concept === "dossier") return <Dossier />;
  return <ProofCards />;
}

function AfterAbout({ concept }: { concept: CredibilityConceptId }) {
  if (concept === "dossier") return null;
  if (concept === "impact") return <Testimonial compact />;
  return (
    <>
      <Testimonial />
      <QuickAnswers />
    </>
  );
}

export default function CredibilityLab() {
  const [concept, setConcept] = useState<CredibilityConceptId>("receipts");
  const active = useMemo(
    () => CREDIBILITY_CONCEPTS.find((item) => item.id === concept) ?? CREDIBILITY_CONCEPTS[0],
    [concept]
  );

  return (
    <div className="clab-page">
      <header className="clab-toolbar">
        <div className="clab-toolbar__brand">
          <span className="clab-toolbar__kicker">Lab · homepage credibility</span>
          <strong>Proof + recommendation + quick answers</strong>
          <p>
            Current-site context only. No production component is modified.
          </p>
        </div>

        <div className="clab-toolbar__controls" role="tablist" aria-label="Credibility direction">
          {CREDIBILITY_CONCEPTS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={concept === item.id}
              className={`clab-toolbar__button ${concept === item.id ? "is-active" : ""}`.trim()}
              onClick={() => setConcept(item.id)}
            >
              <span>{item.index}</span>
              {item.name}
            </button>
          ))}
        </div>

        <div className="clab-toolbar__readout">
          <strong>{active.thesis}</strong>
          <span>{active.note}</span>
        </div>
      </header>

      <main className="clab-site" id="main">
        <div className="clab-placement clab-placement--first">
          <span>Context starts here</span>
          <strong>Existing Personas section</strong>
        </div>

        <PersonasSection />

        <div className="clab-placement">
          <span>New insertion point</span>
          <strong>Immediately after Personas</strong>
        </div>

        <AfterPersonas concept={concept} />

        <ConnectSection />
        <AboutSection />

        {concept !== "dossier" && (
          <div className="clab-placement">
            <span>New insertion point</span>
            <strong>Immediately after About</strong>
          </div>
        )}

        <AfterAbout concept={concept} />

        <JournalSection />
        <SiteFooter />
      </main>
    </div>
  );
}
