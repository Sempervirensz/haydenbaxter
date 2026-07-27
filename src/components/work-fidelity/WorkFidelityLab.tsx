"use client";

// Mobile Work — fidelity variations lab.
//
// Batch 6. Review surface for 4 cards × 3 variations, plus a sequence mode that
// plays a chosen combination as one vertical Work journey.
//
// The lab exists to make the DESKTOP RELATIONSHIP visible: every variation
// carries the list of production elements it is contractually preserving, and
// the desktop source it was adapted from, side by side with the phone.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  CARDS,
  SHARED_RULES,
  type CardKey,
  type VariantKey,
} from "@/data/workMobileVariants";
import WorldPulseCard from "./cards/WorldPulseCard";
import EtbCard from "./cards/EtbCard";
import SupplyChainCard from "./cards/SupplyChainCard";
import ConsultingCard from "./cards/ConsultingCard";
import "./work-fidelity.css";
import "./work-fidelity-lab.css";

const PRESETS = [
  { label: "SE (1st)", w: 320, h: 568 },
  { label: "SE (2/3)", w: 375, h: 667 },
  { label: "Android", w: 360, h: 740 },
  { label: "iPhone 15", w: 393, h: 852 },
  { label: "Pro Max", w: 430, h: 932 },
];

type Combo = Record<CardKey, VariantKey>;

const DEFAULT_COMBO: Combo = {
  worldpulse: "c",
  etb: "b",
  supply: "b",
  consulting: "b",
};

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function CardRender({
  card,
  variant,
  scrollRootRef,
  motion,
}: {
  card: CardKey;
  variant: VariantKey;
  scrollRootRef: React.RefObject<HTMLElement | null>;
  motion: boolean;
}) {
  if (card === "worldpulse")
    return (
      <WorldPulseCard variant={variant} scrollRootRef={scrollRootRef} motion={motion} />
    );
  if (card === "etb") return <EtbCard variant={variant} />;
  if (card === "supply") return <SupplyChainCard variant={variant} motion={motion} />;
  return (
    <ConsultingCard variant={variant} scrollRootRef={scrollRootRef} motion={motion} />
  );
}

/** Device mode — `?device=1`.
 *
 *  Reviewing a mobile design inside a simulated phone frame ON a phone is
 *  pointless: you get a ~340px box inside a 393px screen, with the lab's own
 *  chrome competing for space. Device mode drops the frame and the chrome and
 *  lets the real viewport BE the container, which is also the only way the
 *  container queries get exercised against genuine phone dimensions.
 *
 *  Query params so a specific variation can be opened directly from a phone
 *  without tapping through a control panel:
 *    ?device=1                     → full sequence, recommended combo
 *    ?device=1&card=etb&v=b        → one card, one variation
 *    &still=1                      → simulate reduced motion
 */
function readDeviceParams() {
  if (typeof window === "undefined") return null;
  const q = new URLSearchParams(window.location.search);
  if (q.get("device") !== "1") return null;
  const card = q.get("card") as CardKey | null;
  const v = q.get("v") as VariantKey | null;
  return {
    card: card && CARDS.some((c) => c.key === card) ? card : null,
    variant: v && ["a", "b", "c"].includes(v) ? v : null,
    still: q.get("still") === "1",
  };
}

function DeviceMode({
  card,
  variant,
  still,
}: {
  card: CardKey | null;
  variant: VariantKey | null;
  still: boolean;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  // The page itself scrolls, so the drift/scroll hooks measure against the
  // document element rather than a lab frame.
  const scrollRootRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    scrollRootRef.current = document.documentElement;
  }, []);

  const list = card ? CARDS.filter((c) => c.key === card) : CARDS;

  return (
    <div className={`wfd ${still ? "wf--still" : ""}`} ref={rootRef}>
      <div className="wf">
        {list.map((c) => (
          <div className="wf-chapter" key={c.key}>
            <CardRender
              card={c.key}
              variant={variant ?? DEFAULT_COMBO[c.key]}
              scrollRootRef={scrollRootRef}
              motion={!still}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WorkFidelityLab() {
  const [device, setDevice] = useState<ReturnType<typeof readDeviceParams>>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setDevice(readDeviceParams());
    setReady(true);
  }, []);

  const [mode, setMode] = useState<"single" | "sequence">("single");
  const [cardKey, setCardKey] = useState<CardKey>("worldpulse");
  const [combo, setCombo] = useState<Combo>(DEFAULT_COMBO);
  const [w, setW] = useState(393);
  const [h, setH] = useState(852);
  const [motion, setMotion] = useState(true);
  const [still, setStill] = useState(false);
  const [showRef, setShowRef] = useState(true);

  const singleRef = useRef<HTMLDivElement | null>(null);
  const seqRef = useRef<HTMLDivElement | null>(null);

  const card = useMemo(() => CARDS.find((c) => c.key === cardKey)!, [cardKey]);
  const variant = combo[cardKey];
  const variantDef = card.variants.find((v) => v.key === variant)!;
  const activePreset = PRESETS.find((p) => p.w === w && p.h === h)?.label ?? "Custom";

  const setVariant = useCallback(
    (v: VariantKey) => setCombo((c) => ({ ...c, [cardKey]: v })),
    [cardKey]
  );

  const jump = useCallback((i: number) => {
    const el = seqRef.current;
    if (!el) return;
    el.scrollTop = i * el.clientHeight;
  }, []);

  // Render nothing until the query string has been read, so the lab chrome
  // never flashes on a phone before device mode takes over.
  if (!ready) return null;
  if (device) {
    return (
      <DeviceMode card={device.card} variant={device.variant} still={device.still} />
    );
  }

  return (
    <div className={`wfl ${still ? "wf--still" : ""}`}>
      <aside className="wfl__panel">
        <div>
          <span className="wfl__kicker">Lab · Batch 6 · fidelity-first</span>
          <h1 className="wfl__title">Mobile Work — variations</h1>
          <p className="wfl__sub">
            Three mobile translations of each production Work card. Every
            variation preserves its desktop card&rsquo;s signature elements; they
            differ in flow and motion, not identity.
          </p>
        </div>

        <div className="wfl__group">
          <span className="wfl__groupLabel">View</span>
          <div className="wfl__seg">
            <button
              type="button"
              className={`wfl__segBtn ${mode === "single" ? "is-on" : ""}`}
              onClick={() => setMode("single")}
            >
              One card
            </button>
            <button
              type="button"
              className={`wfl__segBtn ${mode === "sequence" ? "is-on" : ""}`}
              onClick={() => setMode("sequence")}
            >
              Full sequence
            </button>
          </div>
        </div>

        <div className="wfl__group">
          <span className="wfl__groupLabel">
            {mode === "sequence" ? "Jump to chapter" : "Card"}
          </span>
          <div className="wfl__cards">
            {CARDS.map((c, i) => (
              <button
                key={c.key}
                type="button"
                className={`wfl__card ${cardKey === c.key ? "is-on" : ""}`}
                onClick={() => {
                  setCardKey(c.key);
                  if (mode === "sequence") jump(i);
                }}
              >
                <span className="wfl__cardNum">{c.num}</span>
                <span className="wfl__cardName">{c.name}</span>
                <span className="wfl__cardVar">{combo[c.key].toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="wfl__group">
          <span className="wfl__groupLabel">
            Variation — {card.name}
          </span>
          {card.variants.map((v) => (
            <button
              key={v.key}
              type="button"
              className={`wfl__variant ${variant === v.key ? "is-on" : ""}`}
              onClick={() => setVariant(v.key)}
            >
              <span className="wfl__variantKey">{v.key.toUpperCase()}</span>
              <span className="wfl__variantLabel">{v.label}</span>
              <span className="wfl__variantTags">
                {v.motion.parallax && <i title="Parallax">P</i>}
                {v.motion.scrollDynamic && <i title="Scroll dynamic">S</i>}
                {v.motion.strongMotion && <i title="Stronger motion">M</i>}
              </span>
            </button>
          ))}
        </div>

        <div className="wfl__group">
          <span className="wfl__groupLabel">Device</span>
          <div className="wfl__presets">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                className={`wfl__preset ${activePreset === p.label ? "is-on" : ""}`}
                onClick={() => {
                  setW(p.w);
                  setH(p.h);
                }}
              >
                <span>{p.label}</span>
                <span className="wfl__presetDim">{p.w}×{p.h}</span>
              </button>
            ))}
          </div>
          <label className="wfl__slider">
            <span className="wfl__sliderMeta"><span>W</span><span>{w}px</span></span>
            <input type="range" min={320} max={480} value={w}
              onChange={(e) => setW(clamp(Number(e.target.value), 320, 480))} />
          </label>
          <label className="wfl__slider">
            <span className="wfl__sliderMeta"><span>H</span><span>{h}px</span></span>
            <input type="range" min={540} max={960} value={h}
              onChange={(e) => setH(clamp(Number(e.target.value), 540, 960))} />
          </label>
        </div>

        <div className="wfl__group">
          <span className="wfl__groupLabel">Motion</span>
          <button
            type="button"
            className={`wfl__btn ${motion ? "is-on" : ""}`}
            aria-pressed={motion}
            onClick={() => setMotion((v) => !v)}
          >
            Motion {motion ? "· on" : "· off"}
          </button>
          <button
            type="button"
            className={`wfl__btn ${still ? "is-on" : ""}`}
            aria-pressed={still}
            onClick={() => setStill((v) => !v)}
          >
            Simulate reduced motion {still ? "· on" : "· off"}
          </button>
          <button
            type="button"
            className={`wfl__btn ${showRef ? "is-on" : ""}`}
            aria-pressed={showRef}
            onClick={() => setShowRef((v) => !v)}
          >
            Desktop reference {showRef ? "· shown" : "· hidden"}
          </button>
        </div>

        <nav className="wfl__links">
          <Link href="/site-parallax-lab/work-cinema" className="wfl__btn">
            Desktop cinematic stack
          </Link>
          <Link href="/site-parallax-lab/work-mobile" className="wfl__btn">
            ← Batch 5 (rejected)
          </Link>
        </nav>
      </aside>

      <main className="wfl__stage">
        <div className="wfl__frames">
          <figure className="wfl-phone">
            <div className="wfl-phone__shell" style={{ width: w, height: h }}>
              {mode === "single" ? (
                <div className="wfl-phone__screen" ref={singleRef}>
                  <div className="wf">
                    <div className="wf-chapter">
                      <CardRender
                        key={`${cardKey}-${variant}`}
                        card={cardKey}
                        variant={variant}
                        scrollRootRef={singleRef}
                        motion={motion && !still}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="wfl-phone__screen" ref={seqRef}>
                  <div className="wf">
                    {CARDS.map((c) => (
                      <div className="wf-chapter" key={c.key}>
                        <CardRender
                          key={`${c.key}-${combo[c.key]}`}
                          card={c.key}
                          variant={combo[c.key]}
                          scrollRootRef={seqRef}
                          motion={motion && !still}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <figcaption className="wfl-phone__cap">
              {mode === "sequence"
                ? `Sequence · ${CARDS.map((c) => combo[c.key].toUpperCase()).join(" ")}`
                : `${card.name} · ${variantDef.label}`}{" "}
              · {w}×{h}
            </figcaption>
          </figure>

          {showRef && mode === "single" && (
            <figure className="wfl-ref">
              <figcaption className="wfl-ref__cap">Desktop source</figcaption>
              <p className="wfl-ref__src">{card.desktopSource}</p>
              <h3 className="wfl-ref__h">Preserved in every variation</h3>
              <ul className="wfl-ref__list">
                {card.preserve.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </figure>
          )}
        </div>

        <section className="wfl__notes">
          <div>
            <h2>
              {card.num} · {card.name} — {variantDef.label}
              <span className="wfl__badge">{variant.toUpperCase()}</span>
            </h2>
            <p className="wfl__lede">{variantDef.purpose}</p>
            {variantDef.changed !== "—" && (
              <p className="wfl__changed">
                <strong>Changed vs A:</strong> {variantDef.changed}
              </p>
            )}
            <h3>Motion tested here</h3>
            <p className="wfl__motionLine">
              {variantDef.motion.parallax || variantDef.motion.scrollDynamic ||
              variantDef.motion.strongMotion ? (
                <>
                  {variantDef.motion.parallax && <span>Parallax</span>}
                  {variantDef.motion.scrollDynamic && <span>Scroll dynamic</span>}
                  {variantDef.motion.strongMotion && <span>Stronger motion</span>}
                </>
              ) : (
                <em>None — static composition by design.</em>
              )}
            </p>
          </div>

          <div>
            <h2>Shared structural rules</h2>
            <p className="wfl__lede">
              What holds four different compositions together as one Work
              section — without flattening them into one template.
            </p>
            <dl className="wfl__rules">
              {SHARED_RULES.map((r) => (
                <div key={r.label}>
                  <dt>{r.label}</dt>
                  <dd>{r.rule}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
    </div>
  );
}
