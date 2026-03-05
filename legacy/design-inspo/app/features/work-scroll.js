var DEFAULT_CONFIG = {
  screenBreaks: [0, 0.6, 0.7, 0.8, 0.9, 1],
  zones: [
    { hold: [0, 0.22], deg: 0, label: "WorldPulse" },
    { hold: [0.25, 0.47], deg: -90, label: "Emerging Tech" },
    { hold: [0.5, 0.72], deg: -180, label: "Supply Chain" },
    { hold: [0.75, 0.94], deg: -270, label: "Consulting" },
    { hold: [0.97, 0.985], deg: -360, label: "WorldPulse" }
  ]
};

function ease(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function getCdState(progress, zones) {
  var p = Math.max(0, Math.min(1, progress));

  for (var i = 0; i < zones.length; i += 1) {
    if (p >= zones[i].hold[0] && p <= zones[i].hold[1]) {
      return { deg: zones[i].deg, label: zones[i].label };
    }
  }

  var last = zones[zones.length - 1];
  if (p > last.hold[1]) {
    var extra = (p - last.hold[1]) / (1 - last.hold[1]);
    return {
      deg: last.deg - extra * extra * 720,
      label: last.label
    };
  }

  for (var j = 0; j < zones.length - 1; j += 1) {
    var tStart = zones[j].hold[1];
    var tEnd = zones[j + 1].hold[0];

    if (p > tStart && p < tEnd) {
      var t = ease((p - tStart) / (tEnd - tStart));
      return {
        deg: zones[j].deg + (zones[j + 1].deg - zones[j].deg) * t,
        label: t < 0.5 ? zones[j].label : zones[j + 1].label
      };
    }
  }

  return { deg: 0, label: "WorldPulse" };
}

export function initWorkScroll(config) {
  var work = document.getElementById("work");
  if (!work) return;

  var screens = work.querySelectorAll(".work__screen");
  if (!screens.length) return;

  var cdDisc = document.getElementById("cd-disc");
  var cdLabel = document.getElementById("cd-active-label");
  var scrollHint = document.getElementById("scroll-hint");
  var hintHidden = false;
  var currentScreen = -1;
  var prevLabel = "";

  var screenBreaks =
    config && Array.isArray(config.screenBreaks) && config.screenBreaks.length
      ? config.screenBreaks
      : DEFAULT_CONFIG.screenBreaks;
  var zones =
    config && Array.isArray(config.zones) && config.zones.length
      ? config.zones
      : DEFAULT_CONFIG.zones;

  function setScreen(index) {
    if (index === currentScreen) return;
    currentScreen = index;

    screens.forEach(function(screen, i) {
      screen.classList.toggle("is-active", i === index);
      screen.classList.toggle("is-past", i < index);
    });
  }

  function onScroll() {
    var rect = work.getBoundingClientRect();
    var scrollHeight = work.offsetHeight - window.innerHeight;
    var scrolled = -rect.top;

    if (scrolled < 0) scrolled = 0;
    if (scrollHeight < 0) scrollHeight = 0;
    if (scrolled > scrollHeight) scrolled = scrollHeight;

    var progress = scrollHeight > 0 ? scrolled / scrollHeight : 0;

    if (scrollHint) {
      if (!hintHidden && progress > 0.08) {
        scrollHint.classList.add("is-hidden");
        hintHidden = true;
      } else if (hintHidden && progress <= 0.02) {
        scrollHint.classList.remove("is-hidden");
        hintHidden = false;
      }
    }

    var index = 0;
    for (var i = 1; i < screenBreaks.length; i += 1) {
      if (progress >= screenBreaks[i]) index = i;
    }
    index = Math.min(screens.length - 1, index);
    setScreen(index);

    if (index === 0 && cdDisc) {
      var firstBreak = screenBreaks[1] || 1;
      var screenProgress = firstBreak > 0 ? progress / firstBreak : 0;
      var state = getCdState(screenProgress, zones);
      cdDisc.style.transform = "rotate(" + state.deg + "deg)";

      if (cdLabel && state.label !== prevLabel) {
        prevLabel = state.label;
        cdLabel.textContent = state.label;
      }
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}
