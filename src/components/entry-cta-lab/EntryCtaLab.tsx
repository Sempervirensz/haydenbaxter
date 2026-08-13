"use client";

// Lab shell for the entry route choice. Owns the iteration and the reset; the
// experience itself lives in EntryCtaGate.
//
// Reset works by remounting the gate under a new key rather than by threading
// reset props through CardDeck and the gate. That clears every piece of state in
// one move — flipped cards, the soft lock, the Work section's scroll machinery —
// and it keeps CardDeck untouched, which matters because it is the production
// component this lab renders.

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  DEFAULT_INDICATOR,
  DEFAULT_VARIANT,
  INDICATOR_DESIGNS,
  INDICATOR_PARAM,
  ROUTE_VARIANTS,
  VARIANT_CHANNEL,
  VARIANT_PARAM,
  isIndicatorDesign,
  isRouteVariant,
  type IndicatorDesign,
  type RouteVariant,
} from "@/data/entryCtaLab";
import EntryCtaGate from "./EntryCtaGate";
import "./entry-cta-lab.css";

export default function EntryCtaLab({ children }: { children: React.ReactNode }) {
  const [variant, setVariant] = useState<RouteVariant>(DEFAULT_VARIANT);
  const [indicator, setIndicator] = useState<IndicatorDesign>(DEFAULT_INDICATOR);
  const [run, setRun] = useState(0);

  const restart = useCallback(() => {
    setRun((n) => n + 1);
    // Back to the top so the next run starts where a visitor would.
    // `auto`, not `smooth`: this is a harness control, not part of the
    // experience, and it must also be correct under reduced motion.
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // Client-only. The controls are lab furniture, and the iteration comes from
  // the URL — neither belongs in the exported HTML, and reading `location` on
  // the server is not possible anyway.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    const v = params.get(VARIANT_PARAM);
    if (isRouteVariant(v)) setVariant(v);
    const i = params.get(INDICATOR_PARAM);
    if (isIndicatorDesign(i)) setIndicator(i);
  }, []);

  // Driven by the responsive viewer, which frames this route in an iframe and
  // cannot reach its React state any other way.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data;
      if (!data || data.source !== VARIANT_CHANNEL) return;
      if (data.action === "variant" && isRouteVariant(data.value)) setVariant(data.value);
      else if (data.action === "indicator" && isIndicatorDesign(data.value)) {
        setIndicator(data.value);
      } else if (data.action === "reset") restart();
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [restart]);

  /** Keep the URL in step so a setting can be linked or reloaded into. */
  const syncUrl = useCallback((key: string, value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.replaceState(null, "", url);
  }, []);

  const pick = useCallback(
    (next: RouteVariant) => {
      setVariant(next);
      syncUrl(VARIANT_PARAM, next);
    },
    [syncUrl]
  );

  const pickIndicator = useCallback(
    (next: IndicatorDesign) => {
      setIndicator(next);
      syncUrl(INDICATOR_PARAM, next);
    },
    [syncUrl]
  );

  const active = ROUTE_VARIANTS.find((v) => v.id === variant);
  const activeIndicator = INDICATOR_DESIGNS.find((d) => d.id === indicator);

  const control = mounted ? (
    <div className="ecta__labInner">
      <p className="ecta__labLegend">Flip indicator</p>
      <div className="ecta__labRow" role="group" aria-label="Flip indicator design">
        {INDICATOR_DESIGNS.map((d) => (
          <button
            key={d.id}
            type="button"
            className={`ecta__labBtn ${d.id === indicator ? "is-on" : ""}`}
            aria-pressed={d.id === indicator}
            aria-label={`Indicator ${d.index} — ${d.label}`}
            onClick={() => pickIndicator(d.id)}
          >
            <span className="ecta__labBtnIndex">{d.index}</span>
            <span className="ecta__labBtnName">{d.label}</span>
          </button>
        ))}
      </div>

      {activeIndicator && <p className="ecta__labNote">{activeIndicator.note}</p>}

      <p className="ecta__labLegend">Route choice</p>
      <div className="ecta__labRow" role="group" aria-label="Route choice iteration">
        {ROUTE_VARIANTS.map((v) => (
          <button
            key={v.id}
            type="button"
            className={`ecta__labBtn ${v.id === variant ? "is-on" : ""}`}
            aria-pressed={v.id === variant}
            aria-label={`Iteration ${v.index} — ${v.label}`}
            onClick={() => pick(v.id)}
          >
            <span className="ecta__labBtnIndex">{v.index}</span>
            <span className="ecta__labBtnName">{v.label}</span>
          </button>
        ))}
      </div>

      {active && <p className="ecta__labNote">{active.note}</p>}

      <div className="ecta__labRow">
        <button type="button" className="ecta__reset" onClick={restart}>
          <span aria-hidden="true">↺</span> Reset run
        </button>
        {/* Its own class, not `.ecta__reset`: two elements sharing that class
            makes every `.ecta__reset` locator ambiguous. */}
        <Link href="/entry-cta-lab/viewer" className="ecta__labLink">
          ⤢ Display sizes
        </Link>
      </div>
    </div>
  ) : null;

  return (
    <EntryCtaGate key={run} variant={variant} indicator={indicator} labControl={control}>
      {children}
    </EntryCtaGate>
  );
}
