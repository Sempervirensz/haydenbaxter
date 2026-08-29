"use client";

// 07 — RECORD. The archival object label.
//
// Restrained information design: mono field names in a narrow left column,
// values right, a hairline between every field. The reference is a museum
// object label or the notes page of an annual report — a form that carries
// authority because it does not argue.
//
// Two deliberate calls inside it. The employers are compressed into ONE field
// rather than given a row each, because the brands marquee at the top of the
// page has already introduced all three and repeating them at full weight is
// the redundancy this section keeps paying for. And CURRENT is the last field,
// so the record resolves on the venture rather than opening with it.

import { CAREER, EDUCATION, FIGURES, PHASE_LABEL } from "@/data/experienceLab";
import { ConceptActions } from "./parts";

const OPS = CAREER.filter((c) => c.phase === "operations");
const CURRENT = CAREER[CAREER.length - 1];

export default function Record() {
  return (
    <div className="xlab xlab--record">
      <dl className="xlab-record__fields">
        <div className="xlab-record__field">
          <dt>{PHASE_LABEL.operations}</dt>
          <dd>
            <span className="xlab-record__lead">
              {OPS.map((s) => s.company).join(", ")}
            </span>
            <span className="xlab-record__sub">
              {OPS.map((s) => s.role).join(" · ")}
            </span>
          </dd>
        </div>

        <div className="xlab-record__field">
          <dt>Scale</dt>
          <dd>
            <span className="xlab-record__lead">{FIGURES[0].inline}</span>
            <span className="xlab-record__lead">{FIGURES[1].inline}</span>
          </dd>
        </div>

        <div className="xlab-record__field">
          <dt>Language</dt>
          <dd>
            <span className="xlab-record__lead">
              English, <span lang="zh">中文</span>
            </span>
            <span className="xlab-record__sub">Fluent Mandarin</span>
          </dd>
        </div>

        <div className="xlab-record__field">
          <dt>Education</dt>
          <dd>
            {EDUCATION.map((e) => (
              <span key={e.id} className="xlab-record__pair">
                <span className="xlab-record__lead">{e.school}</span>
                <span className="xlab-record__sub">{e.programShort}</span>
              </span>
            ))}
          </dd>
        </div>

        <div className="xlab-record__field" data-current="true">
          <dt>Current</dt>
          <dd>
            <span className="xlab-record__lead">{CURRENT.company}</span>
            <span className="xlab-record__sub">
              {CURRENT.role} · {PHASE_LABEL.technology}
            </span>
          </dd>
        </div>
      </dl>

      <ConceptActions />
    </div>
  );
}
