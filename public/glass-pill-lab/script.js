/* =========================================================================
   Glass Pill Lab — Controller
   Wires up iteration switching, controls panel, sliders, play/pause.
   ========================================================================= */

(function () {
  "use strict";

  /* ---- DOM refs ---- */

  const body = document.body;
  const pill = document.getElementById("pill");
  const pillText = document.getElementById("pillText");
  const pillStage = document.getElementById("pillStage");

  const iterName = document.getElementById("iterName");
  const iterDesc = document.getElementById("iterDesc");

  const controls = document.getElementById("controls");
  const controlsToggle = document.getElementById("controlsToggle");
  const controlsPanel = document.getElementById("controlsPanel");

  const playPauseBtn = document.getElementById("playPauseBtn");

  const speedSlider = document.getElementById("speedSlider");
  const speedVal = document.getElementById("speedVal");

  const widthSlider = document.getElementById("widthSlider");
  const widthVal = document.getElementById("widthVal");

  const sizeSlider = document.getElementById("sizeSlider");
  const sizeVal = document.getElementById("sizeVal");

  const iterBtns = controlsPanel.querySelectorAll("[data-iter]");

  /* ---- Iteration metadata ---- */

  const ITERATIONS = {
    1: { name: "01 — Hover Together", desc: "Pill and text float as one unit" },
    2: { name: "02 — Text Hovers Independently", desc: "Text moves inside a still pill" },
    3: { name: "03 — Breathing Mode", desc: "Organic scale, glow, and letter-spacing shift" },
  };

  /* ---- State ---- */

  let currentIter = 1;
  let isPlaying = true;
  let isPanelOpen = false;

  /* ---- Helpers ---- */

  function setIteration(n) {
    currentIter = n;

    // Swap iteration class on pill stage
    pillStage.className = "pill-stage iter-" + n;

    // Update label
    iterName.textContent = ITERATIONS[n].name;
    iterDesc.textContent = ITERATIONS[n].desc;

    // Update button active states
    iterBtns.forEach(function (btn) {
      var isActive = parseInt(btn.dataset.iter, 10) === n;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-checked", isActive ? "true" : "false");
    });

    // Respect current play/pause state
    if (!isPlaying) {
      pillStage.classList.add("is-paused");
    }
  }

  function setSpeed(val) {
    // Convert slider value to animation duration (inverse relationship)
    // slider 1.0 = normal speed. Higher = faster = shorter duration.
    var baseDurations = { 1: 5, 2: 4, 3: 5 };
    var base = baseDurations[currentIter] || 5;
    var dur = (base / val).toFixed(1) + "s";

    pill.style.setProperty("--anim-dur", dur);
    pillText.style.setProperty("--anim-dur", dur);
    speedVal.textContent = parseFloat(val).toFixed(1) + "x";
  }

  function setPillWidth(vw) {
    pill.style.setProperty("--pill-w", vw + "vw");
    widthVal.textContent = vw + "%";
  }

  function setTextSize(px) {
    pillText.style.setProperty("--pill-fs", px + "px");
    sizeVal.textContent = parseFloat(px).toFixed(1);
  }

  function togglePlayPause() {
    isPlaying = !isPlaying;
    pillStage.classList.toggle("is-paused", !isPlaying);
    playPauseBtn.textContent = isPlaying ? "Pause" : "Play";
  }

  function togglePanel() {
    isPanelOpen = !isPanelOpen;
    controls.classList.toggle("is-open", isPanelOpen);
  }

  /* ---- Event listeners ---- */

  // Controls toggle
  controlsToggle.addEventListener("click", togglePanel);

  // Iteration buttons
  iterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var n = parseInt(btn.dataset.iter, 10);
      if (n === currentIter) return;
      setIteration(n);
      // Re-apply speed since base duration changes per iteration
      setSpeed(speedSlider.value);
    });
  });

  // Play / Pause
  playPauseBtn.addEventListener("click", togglePlayPause);

  // Speed slider
  speedSlider.addEventListener("input", function () {
    setSpeed(this.value);
  });

  // Width slider
  widthSlider.addEventListener("input", function () {
    setPillWidth(this.value);
  });

  // Text size slider
  sizeSlider.addEventListener("input", function () {
    setTextSize(this.value);
  });

  // Close panel on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isPanelOpen) {
      togglePanel();
      controlsToggle.focus();
    }
  });

  // Close panel when clicking outside
  document.addEventListener("click", function (e) {
    if (isPanelOpen && !controls.contains(e.target)) {
      togglePanel();
    }
  });

  /* ---- Init ---- */

  setIteration(1);
})();
