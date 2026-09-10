// CONCEPT 03 — WHAT TO BRING ME
//
// Thesis: identity by fit. Never describe the person; show the problems they
// can be handed and let the reader recognise their own.
//
// Structure per row: the visitor's words → what the problem usually turns out
// to be → what Hayden does with it → the existing offer it resolves into.
// The reframe line is the load-bearing one. It is the only thing on the page
// that demonstrates judgement rather than asserting it.
//
// "Who's answering" arrives LAST and small. That inversion is the concept: on
// the live page the credentials come first and the problems never come at all.
//
// Accessibility note: this is not a disclosure widget. Every answer is in the
// DOM and on screen — a problem statement a visitor has to click to see the
// answer to is a worse version of the live Personas cards, not a better one.

import { ASKS, FACTS } from "@/data/identityLab";
import { Eyebrow, Rule } from "./parts";

export default function Asks() {
  return (
    <div className="ilab-c ilab-asks">
      <Eyebrow>Start here</Eyebrow>

      <p className="ilab-asks__lede">
        The fastest way to know whether I am useful to you is to see whether
        any of these sound like your week.
      </p>

      <div className="ilab-asks__list">
        {ASKS.map((ask) => (
          <article key={ask.question} className="ilab-ask">
            <p className="ilab-ask__q">“{ask.question}”</p>
            <p className="ilab-ask__reframe">{ask.reframe}</p>
            <p className="ilab-ask__a">{ask.answer}</p>
            <p className="ilab-ask__resolves">
              <span className="ilab-ask__resolves-label">Becomes</span>
              {ask.resolves}
            </p>
          </article>
        ))}
      </div>

      <Rule />

      {/* Deliberately the smallest thing in the section. */}
      <section className="ilab-asks__who" aria-labelledby="ilab-who-h">
        <h3 className="ilab-sub" id="ilab-who-h">
          Who’s answering
        </h3>
        <p className="ilab-asks__who-body">
          Hayden Baxter. {FACTS.yearsAsia} in sourcing, procurement, and
          traceability — {FACTS.brands.join(", ")} — working in Mandarin across
          China, Vietnam, and Indonesia. Now founder at WorldPulse, building
          Digital Product Passports, with an M.S. in Artificial Intelligence in
          Business and five shipped AI products behind the advice.
        </p>
      </section>
    </div>
  );
}
