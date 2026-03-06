const COPY_LINES = [
  "Fortune 100 sourcing leader.",
  "8+ YEARS ACROSS ASIA.",
  "Fluent in Mandarin.",
  "Built supplier networks across China, Vietnam, and Indonesia."
];

const LINE_STYLES = [
  "dual-line--display",
  "dual-line--caps",
  "dual-line--sans",
  "dual-line--italic"
];

const DEFAULTS = {
  scrollMode: "ltr",
  hoverMode: "spotlight",
  baseOpacity: 0.26,
  glowStrength: 0.28,
  staggerAmount: 0.07,
  smoothingFactor: 0.22,
  revealMultiplier: 1,
  spotlightSize: 220,
  spotlightSoftness: 0.58,
  lineFadeMs: 360,
  sheenIntensity: 0.42
};

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (a, b, t) => a + (b - a) * t;

function smoothToward(current, target, response, dt) {
  if (response <= 0 || dt <= 0) return target;
  const alpha = 1 - Math.exp(-response * dt);
  return current + (target - current) * alpha;
}

function createDualLayerLine(text, styleClass, index) {
  const line = document.createElement("div");
  line.className = `dual-line ${styleClass}`;
  line.dataset.index = String(index);
  line.style.setProperty("--reveal", "0");
  line.style.setProperty("--hover-reveal", "0");
  line.style.setProperty("--line-lit", "1");
  line.style.setProperty("--sheen-progress", "0");
  line.style.setProperty("--sheen-progress-active", "0");

  const stack = document.createElement("span");
  stack.className = "dual-line__stack";

  const base = document.createElement("span");
  base.className = "dual-line__base";
  base.textContent = text;

  const lit = document.createElement("span");
  lit.className = "dual-line__lit";
  lit.textContent = text;

  const sheen = document.createElement("span");
  sheen.className = "dual-line__sheen";
  sheen.textContent = text;

  stack.append(base, lit, sheen);
  line.append(stack);
  return line;
}

function buildLines(container) {
  const lines = COPY_LINES.map((text, index) => createDualLayerLine(text, LINE_STYLES[index], index));
  container.replaceChildren(...lines);
  return lines;
}

function formatValue(id, value) {
  switch (id) {
    case "baseOpacity":
    case "glowStrength":
    case "staggerAmount":
    case "smoothingFactor":
    case "revealMultiplier":
    case "spotlightSoftness":
    case "sheenIntensity":
      return Number(value).toFixed(2);
    case "spotlightSize":
      return `${Math.round(Number(value))} px`;
    case "lineFadeMs":
      return `${Math.round(Number(value))} ms`;
    default:
      return String(value);
  }
}

class ControlsPanel {
  constructor(root) {
    this.root = root;
    this.noteEl = document.getElementById("controlsNote");
    this.inputs = {
      scrollMode: document.getElementById("scrollMode"),
      hoverMode: document.getElementById("hoverMode"),
      baseOpacity: document.getElementById("baseOpacity"),
      glowStrength: document.getElementById("glowStrength"),
      staggerAmount: document.getElementById("staggerAmount"),
      smoothingFactor: document.getElementById("smoothingFactor"),
      revealMultiplier: document.getElementById("revealMultiplier"),
      spotlightSize: document.getElementById("spotlightSize"),
      spotlightSoftness: document.getElementById("spotlightSoftness"),
      lineFadeMs: document.getElementById("lineFadeMs"),
      sheenIntensity: document.getElementById("sheenIntensity")
    };
    this.outputs = {
      baseOpacity: document.getElementById("baseOpacityOut"),
      glowStrength: document.getElementById("glowStrengthOut"),
      staggerAmount: document.getElementById("staggerAmountOut"),
      smoothingFactor: document.getElementById("smoothingFactorOut"),
      revealMultiplier: document.getElementById("revealMultiplierOut"),
      spotlightSize: document.getElementById("spotlightSizeOut"),
      spotlightSoftness: document.getElementById("spotlightSoftnessOut"),
      lineFadeMs: document.getElementById("lineFadeMsOut"),
      sheenIntensity: document.getElementById("sheenIntensityOut")
    };

    this.state = { ...DEFAULTS };
    this.listeners = [];
    this.handleInput = this.handleInput.bind(this);

    for (const [key, input] of Object.entries(this.inputs)) {
      input.value = String(DEFAULTS[key]);
      const eventName = input.tagName === "SELECT" ? "change" : "input";
      input.addEventListener(eventName, this.handleInput);
    }

    this.sync();
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  handleInput(event) {
    const target = event.currentTarget;
    const key = target.id;
    if (!(key in this.state)) return;

    if (target.tagName === "SELECT") {
      this.state[key] = target.value;
    } else {
      this.state[key] = Number(target.value);
    }

    this.sync();
    this.emit();
  }

  sync() {
    const s = this.state;
    this.root.dataset.scrollMode = s.scrollMode;
    this.root.dataset.hoverMode = s.hoverMode;
    this.root.style.setProperty("--line-base-opacity", String(s.baseOpacity));
    this.root.style.setProperty("--line-glow-strength", String(s.glowStrength));
    this.root.style.setProperty("--stagger-amount", String(s.staggerAmount));
    this.root.style.setProperty("--smoothing-factor", String(s.smoothingFactor));
    this.root.style.setProperty("--reveal-multiplier", String(s.revealMultiplier));
    this.root.style.setProperty("--spotlight-size", String(s.spotlightSize));
    this.root.style.setProperty("--spotlight-softness", String(s.spotlightSoftness));
    this.root.style.setProperty("--line-fade-ms", `${Math.round(s.lineFadeMs)}ms`);
    this.root.style.setProperty("--sheen-intensity", String(s.sheenIntensity));

    for (const [key, output] of Object.entries(this.outputs)) {
      output.value = formatValue(key, s[key]);
      output.textContent = formatValue(key, s[key]);
    }
  }

  setNote(text) {
    if (this.noteEl) this.noteEl.textContent = text;
  }

  emit() {
    for (const callback of this.listeners) callback({ ...this.state });
  }
}

class ScrollRevealSection {
  constructor(sectionEl, lineContainer, controls, reducedMotionQuery) {
    this.sectionEl = sectionEl;
    this.shellEl = sectionEl.querySelector(".demo__shell");
    this.lineContainer = lineContainer;
    this.lines = buildLines(lineContainer);
    this.controls = controls;
    this.reducedMotionQuery = reducedMotionQuery;
    this.smoothedProgress = reducedMotionQuery.matches ? 1 : 0;
    this.lineReveals = this.lines.map(() => (reducedMotionQuery.matches ? 1 : 0));
    this.lastActiveLine = 0;
  }

  applyControls() {
    if (this.reducedMotionQuery.matches) {
      this.smoothedProgress = 1;
      this.lineReveals.fill(1);
      this.paint();
    }
  }

  computeRawSectionProgress() {
    const rect = this.sectionEl.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    // Scroll progress math: normalize against this section's own bounds instead of global page scroll.
    const start = vh * 0.86;
    const span = rect.height + vh * 0.42;
    return clamp((start - rect.top) / Math.max(1, span));
  }

  update(dt) {
    const { staggerAmount, smoothingFactor, revealMultiplier, sheenIntensity } = this.controls.state;

    let sectionProgress = this.computeRawSectionProgress();
    sectionProgress = clamp(sectionProgress * revealMultiplier);
    if (this.reducedMotionQuery.matches) sectionProgress = 1;

    const response = 2 + (1 - smoothingFactor) * 14;
    this.smoothedProgress = this.reducedMotionQuery.matches
      ? 1
      : smoothToward(this.smoothedProgress, sectionProgress, response, dt * (0.65 + revealMultiplier * 0.45));

    const maxOffset = staggerAmount * (this.lines.length - 1);
    const revealWindow = Math.max(0.16, 1 - maxOffset);
    let strongestIndex = 0;
    let strongestValue = -1;

    for (let i = 0; i < this.lines.length; i += 1) {
      const start = i * staggerAmount;
      const lineProgress = clamp((this.smoothedProgress - start) / revealWindow);
      this.lineReveals[i] = lineProgress;

      const line = this.lines[i];
      line.style.setProperty("--reveal", lineProgress.toFixed(4));

      const sheenCenter = clamp((lineProgress - 0.12) / 0.88);
      const sheenEnergy = Math.sin(Math.PI * clamp(lineProgress)) ** 1.35;
      line.style.setProperty("--sheen-progress", sheenCenter.toFixed(4));
      line.style.setProperty(
        "--sheen-progress-active",
        (sheenEnergy * clamp(sheenIntensity)).toFixed(4)
      );
      line.style.setProperty("--line-lit", "1");

      const inMotionBand = lineProgress > 0.01 && lineProgress < 0.995 ? lineProgress : 0;
      if (inMotionBand > strongestValue) {
        strongestValue = inMotionBand;
        strongestIndex = i;
      }
    }

    this.lastActiveLine = strongestValue > 0 ? strongestIndex : this.lastActiveLine;
    this.paintBackgroundLift();
  }

  paint() {
    for (let i = 0; i < this.lines.length; i += 1) {
      const line = this.lines[i];
      line.style.setProperty("--reveal", "1");
      line.style.setProperty("--sheen-progress", "1");
      line.style.setProperty("--sheen-progress-active", "0");
      line.style.setProperty("--line-lit", "1");
    }
    this.paintBackgroundLift(0.03);
  }

  paintBackgroundLift(forcedGlow) {
    if (!this.shellEl) return;
    const line = this.lines[this.lastActiveLine] || this.lines[0];
    if (!line) return;

    const lineRect = line.getBoundingClientRect();
    const shellRect = this.shellEl.getBoundingClientRect();
    const centerY = ((lineRect.top + lineRect.height * 0.5 - shellRect.top) / Math.max(1, shellRect.height)) * 100;
    const activeProgress = clamp(this.lineReveals[this.lastActiveLine] ?? 0);
    const glow = typeof forcedGlow === "number" ? forcedGlow : activeProgress * (1 - activeProgress) * 4.2;

    this.shellEl.style.setProperty("--active-line-y", `${centerY.toFixed(2)}%`);
    this.shellEl.style.setProperty("--active-line-glow", clamp(glow, 0, 1).toFixed(4));
  }
}

class HoverRevealSection {
  constructor(sectionEl, lineContainer, hoverHintEl, controls, reducedMotionQuery, coarsePointerQuery) {
    this.sectionEl = sectionEl;
    this.lineContainer = lineContainer;
    this.hoverHintEl = hoverHintEl;
    this.controls = controls;
    this.reducedMotionQuery = reducedMotionQuery;
    this.coarsePointerQuery = coarsePointerQuery;

    this.lines = buildLines(lineContainer);
    this.hoverValues = this.lines.map(() => 0);
    this.hoverTargets = this.lines.map(() => 0);

    this.pointerInside = false;
    this.pointerTarget = { x: 0.5, y: 0.5 };
    this.pointerCurrent = { x: 0.5, y: 0.5 };
    this.pointerVelocity = { x: 0, y: 0 };
    this.lastPointerPosition = null;
    this.touchActiveIndex = -1;
    this.touchActiveUntil = 0;

    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerEnter = this.onPointerEnter.bind(this);
    this.onPointerLeave = this.onPointerLeave.bind(this);

    lineContainer.addEventListener("pointermove", this.onPointerMove);
    lineContainer.addEventListener("pointerenter", this.onPointerEnter);
    lineContainer.addEventListener("pointerleave", this.onPointerLeave);

    this.lineHandlers = this.lines.map((line, index) => {
      const onEnter = () => this.setLineTarget(index, 1);
      const onLeave = () => this.setLineTarget(index, 0);
      const onClick = () => this.handleTouchTap(index);
      line.addEventListener("mouseenter", onEnter);
      line.addEventListener("mouseleave", onLeave);
      line.addEventListener("focusin", onEnter);
      line.addEventListener("focusout", onLeave);
      line.addEventListener("click", onClick);
      return { line, onEnter, onLeave, onClick };
    });

    this.applyControls();
  }

  destroy() {
    this.lineContainer.removeEventListener("pointermove", this.onPointerMove);
    this.lineContainer.removeEventListener("pointerenter", this.onPointerEnter);
    this.lineContainer.removeEventListener("pointerleave", this.onPointerLeave);
    for (const item of this.lineHandlers) {
      item.line.removeEventListener("mouseenter", item.onEnter);
      item.line.removeEventListener("mouseleave", item.onLeave);
      item.line.removeEventListener("focusin", item.onEnter);
      item.line.removeEventListener("focusout", item.onLeave);
      item.line.removeEventListener("click", item.onClick);
    }
  }

  get effectiveMode() {
    if (this.reducedMotionQuery.matches) return "lineFull";
    if (this.coarsePointerQuery.matches) return "lineFull";
    return "spotlight";
  }

  applyControls() {
    const mode = this.effectiveMode;
    this.sectionEl.dataset.effectiveHoverMode = mode;
    this.lineContainer.style.setProperty("--spotlight-size", String(this.controls.state.spotlightSize));
    this.lineContainer.style.setProperty("--spotlight-softness", String(this.controls.state.spotlightSoftness));

    if (this.reducedMotionQuery.matches) {
      this.hoverValues.fill(1);
      this.hoverTargets.fill(1);
      this.pointerInside = false;
    } else if (mode === "spotlight") {
      this.hoverValues.fill(1);
      this.hoverTargets.fill(0);
    } else {
      this.hoverValues.fill(0);
      this.hoverTargets.fill(0);
    }

    this.refreshHint();
    this.paint(0);
  }

  refreshHint() {
    if (!this.hoverHintEl) return;
    if (this.reducedMotionQuery.matches) {
      this.hoverHintEl.textContent = "Reduced-motion preference detected. The lit layer stays readable without continuous pointer animation.";
      return;
    }

    if (this.coarsePointerQuery.matches) {
      this.hoverHintEl.textContent = "Touch fallback active: tap a line to illuminate it fully. Pointer spotlight is simplified on touch devices.";
      return;
    }

    this.hoverHintEl.textContent = "Move pointer across the text to reveal a soft spotlight mask. Motion is smoothed to avoid jitter.";
  }

  onPointerEnter(event) {
    this.pointerInside = true;
    this.onPointerMove(event);
  }

  onPointerLeave() {
    this.pointerInside = false;
    this.lastPointerPosition = null;
    if (this.effectiveMode !== "spotlight") {
      this.hoverTargets.fill(0);
    }
  }

  onPointerMove(event) {
    const rect = this.lineContainer.getBoundingClientRect();
    const x = clamp((event.clientX - rect.left) / Math.max(1, rect.width));
    const y = clamp((event.clientY - rect.top) / Math.max(1, rect.height));

    if (this.lastPointerPosition) {
      this.pointerVelocity.x = x - this.lastPointerPosition.x;
      this.pointerVelocity.y = y - this.lastPointerPosition.y;
    }
    this.lastPointerPosition = { x, y };

    this.pointerTarget.x = x;
    this.pointerTarget.y = y;
  }

  setLineTarget(index, value) {
    const mode = this.effectiveMode;
    if (mode === "spotlight" || this.reducedMotionQuery.matches) return;

    if (mode === "lineFull" || mode === "lineWipe") {
      this.hoverTargets = this.hoverTargets.map((_, i) => (i === index ? value : 0));
      if (!value && this.touchActiveIndex === index) {
        this.touchActiveIndex = -1;
      }
    }
  }

  handleTouchTap(index) {
    if (!this.coarsePointerQuery.matches || this.effectiveMode === "spotlight") return;
    const now = performance.now();
    this.touchActiveIndex = this.touchActiveIndex === index ? -1 : index;
    this.touchActiveUntil = now + 2200;
    this.hoverTargets = this.hoverTargets.map((_, i) => (i === this.touchActiveIndex ? 1 : 0));
  }

  update(dt, timeMs) {
    const mode = this.effectiveMode;
    const { smoothingFactor, lineFadeMs, sheenIntensity } = this.controls.state;

    if (this.touchActiveIndex >= 0 && timeMs > this.touchActiveUntil) {
      this.touchActiveIndex = -1;
      if (mode !== "spotlight") {
        this.hoverTargets.fill(0);
      }
    }

    // Hover spotlight smoothing: follow the pointer via rAF + damping to avoid jitter.
    const pointerResponse = 4 + (1 - smoothingFactor) * 18;
    const swirlBias = this.pointerInside ? clamp(Math.hypot(this.pointerVelocity.x, this.pointerVelocity.y) * 18, 0, 0.08) : 0;
    this.pointerCurrent.x = smoothToward(
      this.pointerCurrent.x,
      clamp(this.pointerTarget.x + swirlBias * this.pointerVelocity.y, 0, 1),
      pointerResponse,
      dt
    );
    this.pointerCurrent.y = smoothToward(
      this.pointerCurrent.y,
      clamp(this.pointerTarget.y - swirlBias * this.pointerVelocity.x, 0, 1),
      pointerResponse,
      dt
    );

    const fadeResponse = mode === "lineFull"
      ? 1000 / Math.max(60, lineFadeMs)
      : 8 + (1 - smoothingFactor) * 22;

    for (let i = 0; i < this.lines.length; i += 1) {
      const target = this.reducedMotionQuery.matches
        ? 1
        : mode === "spotlight"
          ? 1
          : this.hoverTargets[i];
      this.hoverValues[i] = smoothToward(this.hoverValues[i], target, fadeResponse, dt);

      const line = this.lines[i];
      const lineRect = line.getBoundingClientRect();
      const stackRect = this.lineContainer.getBoundingClientRect();
      const localX = (this.pointerCurrent.x * stackRect.width) - (lineRect.left - stackRect.left);
      const localY = (this.pointerCurrent.y * stackRect.height) - (lineRect.top - stackRect.top);

      line.style.setProperty("--spot-local-x", `${localX.toFixed(2)}px`);
      line.style.setProperty("--spot-local-y", `${localY.toFixed(2)}px`);
      line.style.setProperty("--hover-reveal", this.hoverValues[i].toFixed(4));
      line.style.setProperty("--line-lit", mode === "spotlight" ? "1" : this.hoverValues[i].toFixed(4));

      const sheenPos = clamp(this.hoverValues[i]);
      const sheenEnergy = mode === "lineWipe" ? (Math.sin(Math.PI * sheenPos) ** 1.4) * clamp(sheenIntensity) : 0;
      line.style.setProperty("--sheen-progress", sheenPos.toFixed(4));
      line.style.setProperty("--sheen-progress-active", sheenEnergy.toFixed(4));

      const touchActive = this.touchActiveIndex === i && this.coarsePointerQuery.matches;
      line.classList.toggle("is-touch-active", touchActive);
    }

    this.paint(dt);
  }

  paint() {
    const spotlightAllowed = this.effectiveMode === "spotlight" && !this.reducedMotionQuery.matches;
    const alphaTarget = spotlightAllowed && this.pointerInside ? 1 : 0;
    const currentAlpha = Number(this.lineContainer.style.getPropertyValue("--spot-alpha") || 0);
    const alpha = smoothToward(currentAlpha, alphaTarget, 10, 1 / 60);

    this.lineContainer.style.setProperty("--spot-x", `${(this.pointerCurrent.x * 100).toFixed(2)}%`);
    this.lineContainer.style.setProperty("--spot-y", `${(this.pointerCurrent.y * 100).toFixed(2)}%`);
    this.lineContainer.style.setProperty("--spot-alpha", alpha.toFixed(4));
  }
}

function initLab() {
  const root = document.getElementById("typographyLightupLab");
  const scrollContainer = document.querySelector("[data-scroll-lines]");
  const hoverContainer = document.querySelector("[data-hover-lines]");
  const scrollSection = document.getElementById("scrollDemo");
  const hoverSection = document.getElementById("hoverDemo");
  const hoverHint = document.getElementById("hoverHint");

  if (!root || !scrollContainer || !hoverContainer || !scrollSection || !hoverSection) return;

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointerQuery = window.matchMedia("(hover: none), (pointer: coarse)");

  const controls = new ControlsPanel(root);
  const scrollDemo = new ScrollRevealSection(scrollSection, scrollContainer, controls, reducedMotionQuery);
  const hoverDemo = new HoverRevealSection(
    hoverSection,
    hoverContainer,
    hoverHint,
    controls,
    reducedMotionQuery,
    coarsePointerQuery
  );

  function applyMotionPreferences() {
    root.dataset.reducedMotion = reducedMotionQuery.matches ? "true" : "false";
    scrollDemo.applyControls();
    hoverDemo.applyControls();
    if (reducedMotionQuery.matches) {
      controls.setNote("Reduced-motion is active: motion-heavy transitions are softened and text remains fully readable.");
    } else if (coarsePointerQuery.matches) {
      controls.setNote("Touch/coarse pointer detected. Pointer spotlight falls back to line-focused illumination on tap.");
    } else {
      controls.setNote("Pointer spotlight mode is active. Move across the lines to reveal the lit layer.");
    }
  }

  controls.onChange(() => {
    scrollDemo.applyControls();
    hoverDemo.applyControls();
    applyMotionPreferences();
  });

  reducedMotionQuery.addEventListener?.("change", applyMotionPreferences);
  coarsePointerQuery.addEventListener?.("change", applyMotionPreferences);
  applyMotionPreferences();

  let rafId = 0;
  let lastTime = performance.now();

  function frame(time) {
    const dt = Math.min(0.05, (time - lastTime) / 1000 || 1 / 60);
    lastTime = time;

    scrollDemo.update(dt);
    hoverDemo.update(dt, time);

    rafId = window.requestAnimationFrame(frame);
  }

  rafId = window.requestAnimationFrame(frame);

  window.addEventListener(
    "pagehide",
    () => {
      window.cancelAnimationFrame(rafId);
      hoverDemo.destroy();
      reducedMotionQuery.removeEventListener?.("change", applyMotionPreferences);
      coarsePointerQuery.removeEventListener?.("change", applyMotionPreferences);
    },
    { once: true }
  );
}

initLab();
