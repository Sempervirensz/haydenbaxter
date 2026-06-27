"use client";

// Design Lab shell — a modular creative testing space. The intro frames the
// purpose; the live experiment(s) render in full; planned ones show as quiet
// placeholder cards. To add an experiment: add it to LAB_EXPERIMENTS and, if
// "live", render its component in the switch below.

import { DESIGN_LAB_INTRO, LAB_EXPERIMENTS } from "@/data/designLab";
import Link from "next/link";
import FourCardThreshold from "@/components/design-lab/FourCardThreshold";
import "./design-lab.css";

function LiveExperiment({ id }: { id: string }) {
  switch (id) {
    case "four-card-threshold":
      return <FourCardThreshold />;
    default:
      return null;
  }
}

export default function DesignLab() {
  const live = LAB_EXPERIMENTS.filter((e) => e.status === "live");
  const planned = LAB_EXPERIMENTS.filter((e) => e.status === "planned");

  return (
    <main className="dlab">
      <header className="dlab__intro">
        <p className="dlab__kicker">{DESIGN_LAB_INTRO.kicker}</p>
        <h1 className="dlab__title">{DESIGN_LAB_INTRO.title}</h1>
        <p className="dlab__lede">{DESIGN_LAB_INTRO.lede}</p>
      </header>

      {live.map((exp) => (
        <section key={exp.id} className="dlab__experiment" id={exp.id}>
          <div className="dlab__expHead">
            <span className="dlab__expNum">{exp.num}</span>
            <span className="dlab__expName">{exp.title}</span>
            <span className="dlab__expStatus dlab__expStatus--live">Live</span>
          </div>
          {exp.href ? (
            <div className="dlab__fullLink">
              <p className="dlab__fullBlurb">{exp.blurb}</p>
              <Link href={exp.href} className="dlab__openBtn">
                Open the full mirror <span aria-hidden="true">→</span>
              </Link>
            </div>
          ) : (
            <LiveExperiment id={exp.id} />
          )}
        </section>
      ))}

      <section className="dlab__planned" aria-label="Planned experiments">
        <p className="dlab__plannedKicker">More experiments</p>
        <div className="dlab__plannedGrid">
          {planned.map((exp) => (
            <article key={exp.id} className="dlab__card" id={exp.id}>
              <div className="dlab__cardTop">
                <span className="dlab__cardNum">{exp.num}</span>
                <span className="dlab__cardStatus">Planned</span>
              </div>
              <h3 className="dlab__cardTitle">{exp.title}</h3>
              <p className="dlab__cardBlurb">{exp.blurb}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="dlab__foot">
        <span>Design Lab · not indexed · experiments only</span>
      </footer>
    </main>
  );
}
