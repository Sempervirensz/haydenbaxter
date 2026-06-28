"use client";

// Local-only Labs hub. Lists every route/experiment from LAB_GROUPS with a live
// filter. Rendered only by the dev-only /admin/labs route, so it never ships.

import { useMemo, useState } from "react";
import { LAB_GROUPS } from "@/data/labsRegistry";
import "./labs-hub.css";

export default function LabsHub() {
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LAB_GROUPS;
    return LAB_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter(
        (i) => i.label.toLowerCase().includes(q) || i.path.toLowerCase().includes(q)
      ),
    })).filter((g) => g.items.length > 0);
  }, [query]);

  const total = LAB_GROUPS.reduce((n, g) => n + g.items.length, 0);
  const shown = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <main className="labs">
      <header className="labs__head">
        <div>
          <p className="labs__kicker">Admin · local only</p>
          <h1 className="labs__title">Labs &amp; tools</h1>
          <p className="labs__sub">
            Every experiment in one place. Dev-only — this page is excluded from the
            production build.
          </p>
        </div>
        <input
          type="search"
          className="labs__search"
          placeholder={`Filter ${total} routes…`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </header>

      {shown === 0 ? (
        <p className="labs__empty">No routes match “{query}”.</p>
      ) : (
        <div className="labs__groups">
          {groups.map((g) => (
            <section key={g.title} className="labs__group">
              <h2 className="labs__groupTitle">
                {g.title} <span className="labs__count">{g.items.length}</span>
              </h2>
              <ul className="labs__list">
                {g.items.map((item) => (
                  <li key={item.path}>
                    <a className="labs__item" href={item.path}>
                      <span className="labs__itemLabel">{item.label}</span>
                      <span className="labs__itemPath">{item.path}</span>
                      {item.note && <span className="labs__itemNote">{item.note}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
