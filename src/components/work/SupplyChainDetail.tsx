"use client";

import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  SupplyChainData,
  SupplyChainItem,
} from "@/data/work";
import DetailModal from "@/components/work/DetailModal";
import GlyphBlock from "@/components/work/GlyphBlock";
import TagPills from "@/components/work/TagPills";

interface SupplyChainDetailProps {
  data: SupplyChainData;
  isActive: boolean;
}

function toZoom(value: string | undefined, fallback = "1.12"): string {
  if (!value) return fallback;
  const raw = value.trim();
  if (!raw) return fallback;
  if (raw.endsWith("%")) {
    const percent = Number.parseFloat(raw.slice(0, -1));
    if (!Number.isFinite(percent)) return fallback;
    return String(percent / 100);
  }
  const numeric = Number.parseFloat(raw);
  if (!Number.isFinite(numeric)) return fallback;
  if (numeric > 4) return String(numeric / 100);
  return String(numeric);
}

function normalizeLineStyle(style: string): string {
  const valid = new Set(["serif-heavy", "mono-caps", "sans-light", "serif-italic"]);
  return valid.has(style) ? style : "serif-heavy";
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export default function SupplyChainDetail({ data, isActive }: SupplyChainDetailProps) {
  const allItems = useMemo<SupplyChainItem[]>(
    () => [data.featured, ...data.supports],
    [data.featured, data.supports]
  );

  const defaultTabId = data.proofDrawer.tabs[0]?.id ?? "";
  const defaultSupportId = data.supports[0]?.id ?? "";

  const [isProofDrawerOpen, setProofDrawerOpen] = useState(false);
  const [activeTabId, setActiveTabId] = useState(defaultTabId);
  const [activeSupportId, setActiveSupportId] = useState(defaultSupportId);
  const [modalItemId, setModalItemId] = useState<string | null>(null);

  const quoteRef = useRef<HTMLDivElement>(null);

  const activeSupport = useMemo<SupplyChainItem | null>(
    () => data.supports.find((item) => item.id === activeSupportId) ?? data.supports[0] ?? null,
    [activeSupportId, data.supports]
  );

  const modalItem = useMemo<SupplyChainItem | null>(
    () => (modalItemId ? allItems.find((item) => item.id === modalItemId) ?? null : null),
    [allItems, modalItemId]
  );

  const landingStyle = useMemo(() => {
    const style: CSSProperties = {};
    const vars = style as CSSProperties & Record<string, string>;

    vars["--scs-minimal-map-url"] = `url("${data.heroArt.mapAsset}")`;
    vars["--scs-minimal-map-x"] = data.heroArt.masterPacificX || "47%";
    vars["--scs-minimal-map-y"] = data.heroArt.masterPacificY || "46%";
    vars["--scs-minimal-map-zoom"] = toZoom(data.heroArt.masterPacificScale, "1.12");
    return style;
  }, [data.heroArt]);

  useEffect(() => {
    const quoteEl = quoteRef.current;
    if (!quoteEl) return;

    const lines = Array.from(
      quoteEl.querySelectorAll<HTMLElement>(".scs-minimalLanding__line")
    );
    if (!lines.length) return;

    quoteEl.classList.remove("is-static-lit", "is-touch-fallback", "is-pointer-reveal");
    lines.forEach((line) => line.classList.remove("is-active"));

    if (!isActive) {
      quoteEl.style.setProperty("--scs-spot-alpha", "0");
      return;
    }

    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;

    if (isReducedMotion) {
      quoteEl.classList.add("is-static-lit");
      quoteEl.style.setProperty("--scs-spot-alpha", "0");
      return;
    }

    if (isCoarsePointer) {
      quoteEl.classList.add("is-touch-fallback");
      let clearTimer: number | undefined;

      const setActiveLine = (line: HTMLElement) => {
        lines.forEach((item) => item.classList.toggle("is-active", item === line));
        if (clearTimer) window.clearTimeout(clearTimer);
        clearTimer = window.setTimeout(() => {
          lines.forEach((item) => item.classList.remove("is-active"));
        }, 1800);
      };

      const listeners = lines.map((line) => {
        const onClick = () => setActiveLine(line);
        const onKeyDown = (event: KeyboardEvent) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setActiveLine(line);
          }
        };

        line.addEventListener("click", onClick);
        line.addEventListener("keydown", onKeyDown);
        return () => {
          line.removeEventListener("click", onClick);
          line.removeEventListener("keydown", onKeyDown);
        };
      });

      return () => {
        listeners.forEach((dispose) => dispose());
        if (clearTimer) window.clearTimeout(clearTimer);
      };
    }

    quoteEl.classList.add("is-pointer-reveal");

    const state = {
      targetX: 0.5,
      targetY: 0.5,
      currentX: 0.5,
      currentY: 0.5,
      targetAlpha: 0,
      alpha: 0,
      lastTime: 0,
      rafId: 0,
    };

    const setMasks = () => {
      const quoteRect = quoteEl.getBoundingClientRect();
      if (!quoteRect.width || !quoteRect.height) return;

      quoteEl.style.setProperty("--scs-spot-x", `${(state.currentX * 100).toFixed(2)}%`);
      quoteEl.style.setProperty("--scs-spot-y", `${(state.currentY * 100).toFixed(2)}%`);
      quoteEl.style.setProperty("--scs-spot-alpha", state.alpha.toFixed(4));

      lines.forEach((line) => {
        const rect = line.getBoundingClientRect();
        const localX = state.currentX * quoteRect.width - (rect.left - quoteRect.left);
        const localY = state.currentY * quoteRect.height - (rect.top - quoteRect.top);
        line.style.setProperty("--scs-line-spot-x", `${localX.toFixed(2)}px`);
        line.style.setProperty("--scs-line-spot-y", `${localY.toFixed(2)}px`);
      });
    };

    const tick = (time: number) => {
      if (!state.lastTime) state.lastTime = time;
      const dt = Math.min(0.05, (time - state.lastTime) / 1000 || 1 / 60);
      state.lastTime = time;

      const follow = 1 - Math.exp(-13 * dt);
      const alphaFollow = 1 - Math.exp(-10 * dt);

      state.currentX += (state.targetX - state.currentX) * follow;
      state.currentY += (state.targetY - state.currentY) * follow;
      state.alpha += (state.targetAlpha - state.alpha) * alphaFollow;

      setMasks();
      state.rafId = window.requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = quoteEl.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      state.targetX = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      state.targetY = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    };

    const onPointerEnter = (event: PointerEvent) => {
      state.targetAlpha = 1;
      onPointerMove(event);
    };

    const onPointerLeave = () => {
      state.targetAlpha = 0;
    };

    quoteEl.addEventListener("pointerenter", onPointerEnter);
    quoteEl.addEventListener("pointermove", onPointerMove);
    quoteEl.addEventListener("pointerleave", onPointerLeave);
    state.rafId = window.requestAnimationFrame(tick);

    return () => {
      quoteEl.removeEventListener("pointerenter", onPointerEnter);
      quoteEl.removeEventListener("pointermove", onPointerMove);
      quoteEl.removeEventListener("pointerleave", onPointerLeave);
      window.cancelAnimationFrame(state.rafId);
    };
  }, [isActive, data.heroArt.quoteLines]);

  const onTabsKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const list = data.proofDrawer.tabs;
    const index = list.findIndex((tab) => tab.id === activeTabId);
    if (index === -1) return;

    let nextIndex: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % list.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + list.length) % list.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = list.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      setActiveTabId(list[nextIndex].id);
    }
  };

  return (
    <section className="scs scs--minimalLanding" data-scs-section data-sc-iter="01">
      <div
        className={`scs-minimalLanding ${isActive ? "is-revealed" : ""}`}
        data-scs-minimal-landing
        style={landingStyle}
        aria-label="Supply Chain Pacific map composition"
      >
        <div className="scs-minimalLanding__map" data-scs-minimal-map aria-hidden="true" />
        <div
          className="scs-minimalLanding__overlay scs-minimalLanding__overlay--vignette"
          aria-hidden="true"
        />
        <div
          className="scs-minimalLanding__overlay scs-minimalLanding__overlay--edgeFade"
          aria-hidden="true"
        />

        <div className="scs-minimalLanding__quote" data-scs-minimal-quote ref={quoteRef}>
          {data.heroArt.quoteLines.map((line) => (
            <div
              key={line.text}
              className={`scs-minimalLanding__line scs-minimalLanding__line--${normalizeLineStyle(
                line.style
              )}`}
              tabIndex={0}
            >
              <span className="scs-minimalLanding__lineBase">{line.text}</span>
              <span className="scs-minimalLanding__lineLit">{line.text}</span>
              <span className="scs-minimalLanding__lineSheen">{line.text}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="scs-proof" aria-label="Supply chain operating proof details">
        <div className="scs-proof__row">
          <p className="scs-proof__label" id="scs-proof-row-label">
            {data.proofDrawer.promptLabel}
          </p>
          <button
            type="button"
            className="scs-proof__btn"
            aria-expanded={isProofDrawerOpen}
            aria-controls="scs-proof-drawer"
            aria-describedby="scs-proof-row-label"
            onClick={() => setProofDrawerOpen((prev) => !prev)}
          >
            {data.proofDrawer.buttonLabel}
          </button>
        </div>

        <div
          className={`scs-proof__drawer ${isProofDrawerOpen ? "is-open" : ""}`}
          id="scs-proof-drawer"
          aria-hidden={!isProofDrawerOpen}
        >
          <div className="scs-proof__drawerClip">
            <div className="scs-proof__drawerSurface">
              <div
                className="scs-proof__tabs"
                role="tablist"
                aria-label="Supply chain proof tabs"
                onKeyDown={onTabsKeyDown}
              >
                {data.proofDrawer.tabs.map((tab, index) => {
                  const isSelected = tab.id === activeTabId;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      className="scs-proof__tab"
                      role="tab"
                      id={`scs-proof-tab-${tab.id}`}
                      aria-selected={isSelected}
                      aria-controls={`scs-proof-panel-${tab.id}`}
                      tabIndex={isSelected ? 0 : -1}
                      data-scs-proof-index={index}
                      onClick={() => setActiveTabId(tab.id)}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="scs-proof__panels">
                {data.proofDrawer.tabs.map((tab) => {
                  const isSelected = tab.id === activeTabId;
                  return (
                    <section
                      key={tab.id}
                      className="scs-proof__panel"
                      role="tabpanel"
                      id={`scs-proof-panel-${tab.id}`}
                      aria-labelledby={`scs-proof-tab-${tab.id}`}
                      tabIndex={isSelected ? 0 : -1}
                      hidden={!isSelected}
                    >
                      <h4 className="scs-proof__panelTitle">{tab.title || tab.label}</h4>
                      <ul className="scs-proof__panelBullets">
                        {tab.bullets.slice(0, 3).map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                      <div className="scs-proof__panelTags">
                        <TagPills tags={tab.tags.slice(0, 3)} className="scs-proof__tag" />
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="scs-head">
        <p className="scs-head__eyebrow">{data.eyebrow}</p>
        <p className="scs-head__intro">{data.intro}</p>
        <p className="scs-head__bridge">{data.bridgeLine}</p>
      </div>

      <div className="scs-layout">
        <div className="scs-featureWrap">
          <button
            className="scs-feature"
            type="button"
            onClick={() => setModalItemId(data.featured.id)}
            aria-label={`Open ${data.featured.title} details`}
          >
            <span className="scs-feature__sheen" aria-hidden="true" />
            <div className="scs-feature__top">
              <div className="scs-feature__meta">
                <span className="scs-feature__badge">{data.featured.badge}</span>
                <h4 className="scs-feature__title">{data.featured.title}</h4>
                <p className="scs-feature__role">{data.featured.roleLine}</p>
              </div>
              <GlyphBlock
                prefix="scs-feature"
                title={data.featured.title}
                subtitle="Operator systems"
              />
            </div>

            <p className="scs-feature__oneLiner">{data.featured.oneLiner}</p>
            <ul className="scs-feature__bullets">
              {data.featured.bullets.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>

            <div className="scs-feature__tags">
              <TagPills tags={data.featured.tags} className="scs-pill" />
            </div>

            <div className="scs-feature__tools">
              <span className="scs-feature__toolsLabel">Tools / platforms</span>
              <div className="scs-feature__toolRow">
                <TagPills tags={data.featured.tools} className="scs-pill scs-pill--dim" />
              </div>
            </div>

            <div className="scs-feature__footer">
              <div className="scs-feature__signals">
                {data.featured.scopeSignals.map((line) => (
                  <span key={line} className="scs-token">
                    {line}
                  </span>
                ))}
              </div>

              {activeSupport ? (
                <div className="scs-feature__supportFocus">
                  <div className="scs-feature__supportLabel">Hover Preview</div>
                  <div className="scs-feature__supportTitle">{activeSupport.title}</div>
                  <p className="scs-feature__supportDesc">{activeSupport.oneLiner}</p>
                </div>
              ) : null}
            </div>
          </button>
        </div>

        <div className="scs-side">
          <ul className="scs-cards" role="list">
            {data.supports.map((item) => (
              <li key={item.id} className="scs-cardItem" role="listitem">
                <button
                  className={`scs-card ${item.id === activeSupport?.id ? "is-active" : ""}`}
                  type="button"
                  onMouseEnter={() => setActiveSupportId(item.id)}
                  onFocus={() => setActiveSupportId(item.id)}
                  onClick={() => {
                    setActiveSupportId(item.id);
                    setModalItemId(item.id);
                  }}
                  aria-label={`Open ${item.title} details`}
                >
                  <span className="scs-card__sheen" aria-hidden="true" />
                  <div className="scs-card__head">
                    <span className="scs-card__badge">{item.badge || "Support"}</span>
                    <GlyphBlock
                      prefix="scs-card"
                      title={item.title}
                      subtitle={item.kind === "support" ? "Support story" : undefined}
                    />
                  </div>
                  <h5 className="scs-card__title">{item.title}</h5>
                  <p className="scs-card__oneLiner">{item.oneLiner}</p>
                  <div className="scs-card__expand">
                    <ul className="scs-card__bullets">
                      {item.bullets.slice(0, 2).map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                    <div className="scs-card__tags">
                      <TagPills tags={item.tags} className="scs-pill scs-pill--soft" />
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          <div className="scs-side__note">Design × Domain knowledge × AI × Systems thinking.</div>
        </div>
      </div>

      <DetailModal
        isOpen={Boolean(modalItem)}
        onClose={() => setModalItemId(null)}
        classPrefix="scs-modal"
        eyebrow="Supply chain detail"
        labelledBy="scs-modal-title"
        describedBy="scs-modal-desc"
      >
        {modalItem ? (
          <div className="scs-modalBody">
            <div className="scs-modalBody__hero">
              <GlyphBlock
                prefix="scs-modalBody"
                title={modalItem.title}
                subtitle={modalItem.badge || "Supply chain"}
              />
              <div className="scs-modalBody__heroCopy">
                <div className="scs-modalBody__eyebrow">{modalItem.badge || "Detail"}</div>
                <h3 className="scs-modalBody__title" id="scs-modal-title">
                  {modalItem.title}
                </h3>
                {modalItem.roleLine ? (
                  <p className="scs-modalBody__role">{modalItem.roleLine}</p>
                ) : null}
                <p className="scs-modalBody__oneLiner" id="scs-modal-desc">
                  {modalItem.oneLiner}
                </p>
              </div>
            </div>

            <div className="scs-modalBody__grid">
              <section className="scs-modalBody__main">
                <h4 className="scs-modalBody__sectionTitle">What I built / drove</h4>
                <ul className="scs-modalBody__bullets">
                  {modalItem.bullets.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <div className="scs-modalBody__tags">
                  <TagPills tags={modalItem.tags} className="scs-pill" />
                </div>
                <div className="scs-modalBody__toolsWrap">
                  <div className="scs-modalBody__miniLabel">Tools / platforms</div>
                  <div className="scs-modalBody__tools">
                    <TagPills tags={modalItem.tools} className="scs-pill scs-pill--dim" />
                  </div>
                </div>
              </section>

              <aside className="scs-modalBody__aside">
                <div className="scs-modalBody__panel">
                  <div className="scs-modalBody__miniLabel">Scope signals</div>
                  <ul className="scs-modalBody__list">
                    {modalItem.scopeSignals.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
                <div className="scs-modalBody__panel">
                  <div className="scs-modalBody__miniLabel">System snapshot</div>
                  <ul className="scs-modalBody__list">
                    {modalItem.systemSnapshot.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        ) : null}
      </DetailModal>
    </section>
  );
}
