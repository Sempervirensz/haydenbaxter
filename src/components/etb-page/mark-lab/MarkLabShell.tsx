"use client";

/* Shared chrome for the per-project mark labs — the project switcher, the
 * direction rail, the collapse rule and the keyboard shortcuts.
 *
 * THIS IS TOOLING, NOT A DESIGN SYSTEM. It renders a switcher and nothing
 * else: no hero, no type, no colour, no opinion about how any mark should be
 * presented. Each project's art direction lives entirely in its own folder
 * (`../cortex`, `../atomicos`, `../casebrief`) in its own hero component and
 * its own scoped stylesheet, and none of them import from each other. The
 * whole point of the exercise is that Cortex, AtomicOS and CaseBrief end up
 * looking like different projects — sharing the review harness is what makes
 * them comparable, not what makes them the same. */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MARK_LABS } from "./labs";
import "./mark-lab.css";

export interface MarkLabDirection<T extends string = string> {
  id: T;
  label: string;
  note: string;
  /** Rail heading this direction sits under, e.g. "Round one". */
  group: string;
}

interface Props<T extends string> {
  /** Names the mark under review — used for the rail's accessible name. */
  title: string;
  directions: MarkLabDirection<T>[];
  value: T;
  onChange: (id: T) => void;
  /** The page under test. */
  children: ReactNode;
}

export default function MarkLabShell<T extends string>({
  title,
  directions,
  value,
  onChange,
  children,
}: Props<T>) {
  const [railOpen, setRailOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Narrow, the rail is a fixed overlay sitting on top of the exact thing
  // being judged — so it starts collapsed. Done in an effect so the server
  // and the first client render agree.
  useEffect(() => {
    if (window.innerWidth < 1100) setRailOpen(false);
  }, []);

  /* Number keys jump to a direction; left/right step between projects.
   *
   * Comparing treatments means going back and forth a lot, and reaching for
   * the rail each time loses the before/after that makes the difference
   * visible. Digits and arrows do not collide — and arrows are Left/Right
   * specifically so Up/Down still scroll the page. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;

      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const here = MARK_LABS.findIndex((lab) => lab.path === pathname);
        if (here === -1) return;
        const step = e.key === "ArrowRight" ? 1 : -1;
        const next = MARK_LABS[(here + step + MARK_LABS.length) % MARK_LABS.length];
        e.preventDefault();
        router.push(next.path);
        return;
      }

      const direction = directions[Number(e.key) - 1];
      if (direction) onChange(direction.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [directions, onChange, pathname, router]);

  /* Grouped in declaration order, so the rail reads as a history rather than a
   * menu of equals. */
  const groups = useMemo(
    () =>
      directions.reduce<{ title: string; items: MarkLabDirection<T>[] }[]>(
        (acc, direction) => {
          const last = acc[acc.length - 1];
          if (last && last.title === direction.group) last.items.push(direction);
          else acc.push({ title: direction.group, items: [direction] });
          return acc;
        },
        [],
      ),
    [directions],
  );

  const active = directions.find((d) => d.id === value) ?? directions[0];
  const toggleRail = useCallback(() => setRailOpen((open) => !open), []);

  return (
    <div className="cxlab" data-rail={railOpen ? "open" : "closed"}>
      {children}

      <aside className="cxlab-rail" aria-label={`${title} directions`}>
        <button
          type="button"
          className="cxlab-rail__toggle"
          onClick={toggleRail}
          aria-expanded={railOpen}
        >
          {railOpen ? "Hide" : "Directions"}
        </button>

        {railOpen ? (
          <div className="cxlab-rail__body">
            <p className="cxlab-rail__title">Mark lab</p>

            {/* Real links, not state: each lab owns its own route, and a
                shared URL should land on the lab it names. */}
            <nav className="cxlab-rail__labs" aria-label="Mark labs">
              {MARK_LABS.map((lab) => {
                const current = lab.path === pathname;
                return (
                  <Link
                    key={lab.path}
                    href={lab.path}
                    className="cxlab-lab"
                    data-active={current}
                    aria-current={current ? "page" : undefined}
                  >
                    {lab.label}
                  </Link>
                );
              })}
            </nav>

            {groups.map((group) => (
              <div key={group.title} className="cxlab-rail__group">
                <p className="cxlab-rail__groupTitle">{group.title}</p>
                <div className="cxlab-rail__set" role="group">
                  {group.items.map((direction) => (
                    <button
                      key={direction.id}
                      type="button"
                      className="cxlab-btn"
                      data-active={direction.id === value}
                      aria-pressed={direction.id === value}
                      onClick={() => onChange(direction.id)}
                    >
                      <span className="cxlab-btn__key" aria-hidden="true">
                        {directions.indexOf(direction) + 1}
                      </span>
                      <span>{direction.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <p className="cxlab-rail__note">{active.note}</p>
            <p className="cxlab-rail__keys">
              <kbd>1</kbd>–<kbd>{directions.length}</kbd> directions ·{" "}
              <kbd>←</kbd>
              <kbd>→</kbd> projects
            </p>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
