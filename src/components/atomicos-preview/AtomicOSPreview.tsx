"use client";

import { useMemo, useState } from "react";
import {
  ATOMICOS_AGENTS,
  ATOMICOS_ASSISTANT,
  ATOMICOS_DEADLINES,
  ATOMICOS_FOCUS,
  ATOMICOS_GOALS,
  ATOMICOS_HERO,
  ATOMICOS_INSIGHTS,
  ATOMICOS_PRIORITIES,
  ATOMICOS_QUICK_ACTIONS,
  ATOMICOS_TASKS,
  type TaskColumn,
} from "@/data/atomicosPreview";
import "./atomicos-preview.css";

const COLUMN_ORDER: { id: TaskColumn; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "waiting", label: "Waiting" },
  { id: "done", label: "Completed" },
];

const CONTEXT_CLASS: Record<string, string> = {
  School: "ao-task__ctx--school",
  "Job search": "ao-task__ctx--job",
  Startup: "ao-task__ctx--start",
  Personal: "ao-task__ctx--life",
};

function contextKey(ctx: string): string {
  return CONTEXT_CLASS[ctx] ?? "ao-task__ctx--def";
}

export default function AtomicOSPreview() {
  const [activeTab, setActiveTab] = useState<"board" | "list">("board");

  const tasksByColumn = useMemo(() => {
    const m: Record<TaskColumn, typeof ATOMICOS_TASKS> = {
      today: [],
      week: [],
      waiting: [],
      done: [],
    };
    for (const t of ATOMICOS_TASKS) {
      m[t.column].push(t);
    }
    return m;
  }, []);

  return (
    <div className="ao-root">
      <header className="ao-topbar" role="banner">
        <div className="ao-topbar__in">
          <div className="ao-brand">
            <span className="ao-brand__mark" aria-hidden="true">
              Ao
            </span>
            <span className="ao-brand__name">AtomicOS</span>
            <span className="ao-brand__tag">Preview</span>
          </div>
          <div className="ao-cmd" role="search" aria-label="Command palette (demo)">
            <span className="ao-cmd__icon" aria-hidden="true" />
            <span className="ao-cmd__ph">Search or run a command…</span>
            <kbd className="ao-cmd__kbd">⌘K</kbd>
          </div>
          <div className="ao-topbar__right">
            <span className="ao-topbar__dot" aria-hidden="true" />
            <span className="ao-user" aria-label="Account (demo)">
              HB
            </span>
          </div>
        </div>
      </header>

      <section className="ao-hero" aria-labelledby="ao-hero-title">
        <div className="ao-hero__glow" aria-hidden="true" />
        <div className="ao-hero__inner">
          <p className="ao-hero__eyebrow">Personal command center</p>
          <h1 className="ao-hero__title" id="ao-hero-title">
            {ATOMICOS_HERO.name}
          </h1>
          <p className="ao-hero__tagline">{ATOMICOS_HERO.tagline}</p>
          <p className="ao-hero__desc">{ATOMICOS_HERO.description}</p>
        </div>
      </section>

      <main className="ao-main">
        <div className="ao-grid ao-grid--command">
          <section className="ao-panel" aria-labelledby="ao-priorities-title">
            <h2 className="ao-panel__h" id="ao-priorities-title">
              Today’s priorities
            </h2>
            <ol className="ao-pri">
              {ATOMICOS_PRIORITIES.map((p, i) => (
                <li key={p.id} className="ao-pri__row">
                  <span className="ao-pri__idx">{i + 1}</span>
                  <span className="ao-pri__label">{p.label}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="ao-panel" aria-labelledby="ao-goals-title">
            <h2 className="ao-panel__h" id="ao-goals-title">
              Active goals
            </h2>
            <ul className="ao-goals">
              {ATOMICOS_GOALS.map((g) => (
                <li key={g.id} className="ao-goal">
                  <div className="ao-goal__head">
                    <span className="ao-goal__label">{g.label}</span>
                    <span className="ao-goal__pct">{g.progress}%</span>
                  </div>
                  <div className="ao-goal__bar" role="img" aria-label={`${g.progress} percent`}>
                    <span className="ao-goal__fill" style={{ width: `${g.progress}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <div className="ao-panel ao-panel--ring" role="img" aria-label="Focus score">
            <h2 className="ao-panel__h">Focus score</h2>
            <div className="ao-focus">
              <div className="ao-focus__ring">
                <span className="ao-focus__num">{ATOMICOS_FOCUS.score}</span>
                <span className="ao-focus__sub">/ 100</span>
              </div>
              <p className="ao-focus__label">{ATOMICOS_FOCUS.label}</p>
              <p className="ao-focus__hint">{ATOMICOS_FOCUS.hint}</p>
            </div>
          </div>

          <section className="ao-panel" aria-labelledby="ao-deadlines-title">
            <h2 className="ao-panel__h" id="ao-deadlines-title">
              Upcoming deadlines
            </h2>
            <ul className="ao-dl">
              {ATOMICOS_DEADLINES.map((d) => (
                <li key={d.id} className="ao-dl__row">
                  <div>
                    <span className="ao-dl__t">{d.label}</span>
                    <span className="ao-dl__scope">{d.scope}</span>
                  </div>
                  <span className="ao-dl__when">{d.when}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="ao-row ao-row--ai">
          <section className="ao-panel ao-panel--wide ao-panel--assistant" aria-labelledby="ao-ai-title">
            <div className="ao-asst__head">
              <h2 className="ao-panel__h" id="ao-ai-title">
                {ATOMICOS_ASSISTANT.title}
              </h2>
              <span className="ao-pill ao-pill--ok">{ATOMICOS_ASSISTANT.status}</span>
            </div>
            <div className="ao-asst__chips">
              {ATOMICOS_ASSISTANT.suggestions.map((s) => (
                <button key={s} type="button" className="ao-chip">
                  {s}
                </button>
              ))}
            </div>
            <p className="ao-asst__msg">{ATOMICOS_ASSISTANT.lastReply}</p>
            <div className="ao-asst__input">
              <input type="text" className="ao-input" placeholder="Message AtomicOS…" readOnly />
              <button type="button" className="ao-btn ao-btn--sm ao-btn--primary">
                Send
              </button>
            </div>
          </section>

          <section className="ao-panel" aria-label="Quick actions (demo)">
            <h2 className="ao-panel__h">Quick actions</h2>
            <div className="ao-qa">
              {ATOMICOS_QUICK_ACTIONS.map((a) => (
                <button key={a.id} type="button" className="ao-btn ao-btn--ghost">
                  {a.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        <section className="ao-panel" aria-labelledby="ao-agents-title">
          <h2 className="ao-panel__h" id="ao-agents-title">
            Agent workspace
          </h2>
          <div className="ao-agent-grid">
            {ATOMICOS_AGENTS.map((a) => (
              <article key={a.id} className="ao-agent">
                <div className="ao-agent__head">
                  <h3 className="ao-agent__name">{a.name}</h3>
                  <span className="ao-pill ao-pill--neu">{a.status}</span>
                </div>
                <p className="ao-agent__k">Current task</p>
                <p className="ao-agent__v">{a.currentTask}</p>
                <p className="ao-agent__k">Suggested next action</p>
                <p className="ao-agent__next">{a.nextAction}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="ao-row ao-row--split">
          <section className="ao-panel ao-panel--grow" aria-labelledby="ao-tasks-title">
            <div className="ao-panel__tool">
              <h2 className="ao-panel__h" id="ao-tasks-title">
                Tasks
              </h2>
              <div className="ao-seg" role="tablist" aria-label="Task view">
                <button
                  type="button"
                  className={`ao-seg__btn ${activeTab === "board" ? "is-on" : ""}`}
                  role="tab"
                  aria-selected={activeTab === "board"}
                  onClick={() => setActiveTab("board")}
                >
                  Board
                </button>
                <button
                  type="button"
                  className={`ao-seg__btn ${activeTab === "list" ? "is-on" : ""}`}
                  role="tab"
                  aria-selected={activeTab === "list"}
                  onClick={() => setActiveTab("list")}
                >
                  All
                </button>
              </div>
            </div>
            {activeTab === "board" ? (
              <div className="ao-board">
                {COLUMN_ORDER.map((col) => (
                  <div key={col.id} className="ao-col">
                    <div className="ao-col__head">
                      <span className="ao-col__name">{col.label}</span>
                      <span className="ao-col__count">{tasksByColumn[col.id].length}</span>
                    </div>
                    <ul className="ao-col__list">
                      {tasksByColumn[col.id].map((t) => (
                        <li key={t.id} className="ao-task">
                          <span className={`ao-task__ctx ${contextKey(t.context)}`}>{t.context}</span>
                          <span className="ao-task__title">{t.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="ao-listview">
                {ATOMICOS_TASKS.map((t) => (
                  <li key={t.id} className="ao-listview__row">
                    <span className={`ao-task__ctx ${contextKey(t.context)}`}>{t.context}</span>
                    <span className="ao-listview__title">{t.title}</span>
                    <span className="ao-listview__col">{colLabel(t.column)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="ao-panel ao-panel--insights" aria-labelledby="ao-in-title">
            <h2 className="ao-panel__h" id="ao-in-title">
              Insights
            </h2>
            <div className="ao-in">
              <h3 className="ao-in__sub">Weekly momentum</h3>
              <p className="ao-in__p">{ATOMICOS_INSIGHTS.momentum}</p>
              <h3 className="ao-in__sub">Patterns detected</h3>
              <ul className="ao-in__ul">
                {ATOMICOS_INSIGHTS.patterns.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <h3 className="ao-in__sub">Suggested adjustment</h3>
              <p className="ao-in__callout">{ATOMICOS_INSIGHTS.suggestion}</p>
            </div>
          </section>
        </div>
      </main>

      <footer className="ao-foot">
        <span className="ao-foot__b">AtomicOS</span>
        <span className="ao-foot__n">Front-end preview · mock data · no auth</span>
      </footer>
    </div>
  );
}

function colLabel(c: TaskColumn): string {
  const f = COLUMN_ORDER.find((x) => x.id === c);
  return f?.label ?? c;
}
