import { SITE_CONTENT } from "../app/data/site-content.js";

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clampWords(text, maxWords) {
  var words = String(text || "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  if (words.length <= maxWords) return words.join(" ");
  return words.slice(0, maxWords).join(" ") + "…";
}

function getConsultingContent() {
  var detailScreens = (((SITE_CONTENT || {}).work || {}).detailScreens) || [];
  var consultingScreen = detailScreens.find(function(screen) {
    return screen && screen.type === "consulting" && screen.consulting;
  });

  var consulting = consultingScreen && consultingScreen.consulting;

  if (!consulting) {
    return {
      eyebrow: "AI strategy + implementation roadmap",
      heroTitle: "Strategy that ships.",
      heroSubtitle: "Consulting for teams that need clarity, a working prototype, or both.",
      identityLine: "Design x Domain knowledge x AI x Systems thinking.",
      founderLine: "Founder-style execution bias: define the problem, build the right thing, and make the handoff usable.",
      offers: [],
      proofTiles: []
    };
  }

  return consulting;
}

var VARIANTS = [
  {
    id: "13",
    title: "Signal Landing / Extreme Restraint (Globe)",
    note: "Premium landing-moment study: headline + tactile dot field + single CTA + one mono micro-label. No panels, no telemetry, no service-grid energy.",
    classes: "is-layout-signal-minimal is-typo-editorial is-chrome-low",
    globeMode: "canvas-earth-bend",
    globeShell: "css-core",
    globeCount: 5200,
    globeYaw: 1.06,
    accentWeight: "soft"
  },
  {
    id: "01",
    title: "Center Stage / Editorial Rail (Tactile Earth)",
    note: "Baseline favorite: central interactive particle Earth with editorial hierarchy and a calm command rail.",
    classes: "is-layout-center-rail is-typo-editorial is-chrome-low",
    globeMode: "canvas-earth-repel",
    globeShell: "css-core",
    globeCount: 4300,
    globeYaw: 0.98,
    accentWeight: "soft"
  },
  {
    id: "11",
    title: "Hybrid A / Editorial Core + Bottom Command Strip",
    note: "Keeps the emotional center-globe moment, but moves proof and CTA into a low premium command strip.",
    classes: "is-layout-bottom-strip is-typo-editorial is-chrome-low",
    globeMode: "canvas-earth-bend",
    globeShell: "css-wide",
    globeCount: 4600,
    globeYaw: 1.12,
    accentWeight: "mid"
  },
  {
    id: "07",
    title: "Mission Control Calm (Tactile Swirl Earth)",
    note: "Execution-forward framing with restrained chrome and a more responsive swirl interaction for the Earth particle field.",
    classes: "is-layout-mission-control is-typo-interface is-chrome-high",
    globeMode: "canvas-earth-swirl",
    globeShell: "css-core",
    globeCount: 5000,
    globeYaw: 1.1,
    accentWeight: "strong"
  },
  {
    id: "12",
    title: "Hybrid B / Dual Panels + Tactile Core",
    note: "01’s central emotional object plus 07-style operational docking. Designed to test story/action split without losing the globe.",
    classes: "is-layout-dual-panels is-typo-balanced is-chrome-mid",
    globeMode: "canvas-earth-elastic",
    globeShell: "css-core",
    globeCount: 4500,
    globeYaw: 1.02,
    accentWeight: "soft"
  }
];

function renderOfferRows(content) {
  var offers = (content.offers || []).slice(0, 3);
  return offers.map(function(offer, index) {
    return (
      '<li class="clab-offerRow">' +
      '<span class="clab-offerRow__index">' + String(index + 1).padStart(2, "0") + "</span>" +
      '<span class="clab-offerRow__main">' +
      '<span class="clab-offerRow__title">' + escapeHtml(offer.title) + "</span>" +
      '<span class="clab-offerRow__desc">' + escapeHtml(clampWords(offer.oneLiner, 12)) + "</span>" +
      "</span>" +
      '<span class="clab-offerRow__status clab-offerRow__status--' + escapeHtml(String(offer.status || "").toLowerCase().replace(/[^a-z0-9]+/g, "-")) + '">' + escapeHtml(offer.status || "Offer") + "</span>" +
      "</li>"
    );
  }).join("");
}

function renderProofCards(content, className) {
  var tiles = (content.proofTiles || []).slice(0, 2);
  return tiles.map(function(tile, index) {
    return (
      '<article class="' + className + '">' +
      '<div class="' + className + '__kicker">Case ' + String(index + 1).padStart(2, "0") + "</div>" +
      '<h4 class="' + className + '__title">' + escapeHtml(tile.title) + "</h4>" +
      '<p class="' + className + '__line">' + escapeHtml(clampWords(tile.problem, 10)) + "</p>" +
      '<p class="' + className + '__line">' + escapeHtml(clampWords(tile.deliverable, 11)) + "</p>" +
      "</article>"
    );
  }).join("");
}

function renderGlobe(variant) {
  var mode = variant.globeMode || "css-core";
  var interactive = mode.indexOf("canvas-") === 0;
  var cssType = interactive ? (variant.globeShell || "css-core") : mode;
  var canvasMode = interactive ? mode.replace("canvas-", "") : "";
  var particleCount = Number(variant.globeCount) || "";
  var particleYaw = typeof variant.globeYaw === "number" ? String(variant.globeYaw) : "";

  return (
    '<div class="clab-globeField clab-globeField--' + escapeHtml(cssType) + (interactive ? " is-interactive" : "") + '"' +
    (interactive ? ' data-particle-globe="' + escapeHtml(canvasMode) + '"' : "") +
    (interactive && particleCount ? ' data-particle-count="' + escapeHtml(String(particleCount)) + '"' : "") +
    (interactive && particleYaw ? ' data-particle-yaw="' + escapeHtml(particleYaw) + '"' : "") +
    ' aria-hidden="true">' +
    (interactive
      ? '<canvas class="clab-globeCanvas"></canvas><div class="clab-globeField__hint">Move cursor to disturb the Earth dots</div>'
      : "") +
    '<div class="clab-globeField__halo"></div>' +
    '<div class="clab-globeField__shell"></div>' +
    '<div class="clab-globeField__lat"></div>' +
    '<div class="clab-globeField__scan"></div>' +
    '<div class="clab-globeField__veil"></div>' +
    "</div>"
  );
}

function renderMockScreen(variant, content) {
  var offers = (content.offers || []);
  var firstOffer = offers[0] || {};
  var secondOffer = offers[1] || {};
  var availabilityLabel = "Limited availability";
  var availabilityDetail = "Q2 openings / select fits";
  var commandFocus = firstOffer.deliverables && firstOffer.deliverables[0]
    ? firstOffer.deliverables[0]
    : "Pilot recommendation with success criteria";

  return (
    '<div class="clab-screen ' + variant.classes + '" data-variant-id="' + escapeHtml(variant.id) + '">' +
    '<div class="clab-screen__fx clab-screen__fx--noise"></div>' +
    '<div class="clab-screen__fx clab-screen__fx--vignette"></div>' +
    '<div class="clab-screen__fx clab-screen__fx--grid"></div>' +
    '<div class="clab-screen__fx clab-screen__fx--scan"></div>' +
    '<div class="clab-screen__fx clab-screen__fx--network"></div>' +

    '<header class="clab-topbar">' +
    '<div class="clab-topbar__brand">' +
    '<span class="clab-topbar__dot"></span>' +
    '<span class="clab-topbar__name">Hayden Baxter / Consulting</span>' +
    "</div>" +
    '<div class="clab-topbar__route">strategy • prototype • implementation</div>' +
    '<div class="clab-topbar__status">' +
    '<span class="clab-statusChip">' + escapeHtml(availabilityLabel) + "</span>" +
    '<span class="clab-statusChip__meta">' + escapeHtml(availabilityDetail) + "</span>" +
    "</div>" +
    "</header>" +

    '<section class="clab-heroBlock" aria-label="Consulting hero preview">' +
    '<p class="clab-heroBlock__eyebrow">' + escapeHtml(content.eyebrow) + "</p>" +
    '<h3 class="clab-heroBlock__title">' + escapeHtml(content.heroTitle) + "</h3>" +
    '<p class="clab-heroBlock__subtitle">' + escapeHtml(content.heroSubtitle) + "</p>" +
    '<p class="clab-heroBlock__founder">' + escapeHtml(clampWords(content.founderLine, 17)) + "</p>" +
    '<div class="clab-heroBlock__actions">' +
    '<button class="clab-action clab-action--primary" type="button">Book a strategy call</button>' +
    '<button class="clab-action clab-action--secondary" type="button">See sprint formats</button>' +
    "</div>" +
    "</section>" +

    '<section class="clab-globeBlock">' +
    renderGlobe(variant) +
    '<div class="clab-globeBlock__micro" aria-hidden="true">' +
    '<span class="clab-microLabel clab-microLabel--left">earth field / interactive</span>' +
    '<span class="clab-microLabel clab-microLabel--right">cursor bends local flow</span>' +
    "</div>" +
    '<div class="clab-globeBlock__caption">' +
    '<span class="clab-chip clab-chip--signal">Organic systems</span>' +
    '<span class="clab-chip">Workflow clarity first</span>' +
    '<span class="clab-chip">Automation where it compounds</span>' +
    "</div>" +
    "</section>" +

    '<aside class="clab-commandPanel" aria-label="Engagement command panel">' +
    '<div class="clab-commandPanel__head">' +
    '<p class="clab-commandPanel__kicker">Engagement formats</p>' +
    '<p class="clab-commandPanel__meta">3 pathways / scoped for decision velocity</p>' +
    "</div>" +
    '<ol class="clab-offerList">' + renderOfferRows(content) + "</ol>" +
    '<div class="clab-commandPanel__focus">' +
    '<p class="clab-commandPanel__focusLabel">Default first move</p>' +
    '<p class="clab-commandPanel__focusLine">' + escapeHtml(firstOffer.title || "AI Roadmap Sprint") + "</p>" +
    '<p class="clab-commandPanel__focusCopy">' + escapeHtml(clampWords(commandFocus, 11)) + "</p>" +
    "</div>" +
    '<div class="clab-commandPanel__actions">' +
    '<button class="clab-miniAction" type="button">Open brief</button>' +
    '<button class="clab-miniAction" type="button">Compare offers</button>' +
    "</div>" +
    "</aside>" +

    '<section class="clab-proofStrip" aria-label="Proof and CTA strip">' +
    '<div class="clab-proofStrip__cards">' + renderProofCards(content, "clab-proofCard") + "</div>" +
    '<div class="clab-proofStrip__ctaPanel">' +
    '<p class="clab-proofStrip__ctaKicker">Clear consulting path</p>' +
    '<p class="clab-proofStrip__ctaTitle">' + escapeHtml(secondOffer.title || "MVP Prototype Sprint") + "</p>" +
    '<p class="clab-proofStrip__ctaCopy">' + escapeHtml(clampWords((secondOffer && secondOffer.bestFor) || "", 15)) + "</p>" +
    '<button class="clab-action clab-action--primary" type="button">Start a scoped conversation</button>' +
    "</div>" +
    "</section>" +

    '<section class="clab-floatingDeck" aria-label="Floating proof cards">' +
    '<article class="clab-floatCard clab-floatCard--offer">' +
    '<div class="clab-floatCard__kicker">Offer</div>' +
    '<div class="clab-floatCard__title">' + escapeHtml(firstOffer.title || "AI Roadmap Sprint") + "</div>" +
    '<div class="clab-floatCard__copy">' + escapeHtml(clampWords((firstOffer && firstOffer.oneLiner) || "", 11)) + "</div>" +
    "</article>" +
    '<article class="clab-floatCard clab-floatCard--proof">' +
    '<div class="clab-floatCard__kicker">Proof</div>' +
    '<div class="clab-floatCard__title">' + escapeHtml((content.proofTiles && content.proofTiles[0] && content.proofTiles[0].title) || "Case-study-lite") + "</div>" +
    '<div class="clab-floatCard__copy">' + escapeHtml(clampWords((content.proofTiles && content.proofTiles[0] && content.proofTiles[0].deliverable) || "", 10)) + "</div>" +
    "</article>" +
    '<article class="clab-floatCard clab-floatCard--signal">' +
    '<div class="clab-floatCard__kicker">Approach</div>' +
    '<div class="clab-floatCard__title">Workflow first, automation second</div>' +
    '<div class="clab-floatCard__copy">' + escapeHtml(clampWords(content.bridgeLine || "Define the workflow and data shape first, then layer automation.", 13)) + "</div>" +
    "</article>" +
    "</section>" +

    '<aside class="clab-sideDock" aria-label="Executive dock">' +
    '<div class="clab-sideDock__block">' +
    '<p class="clab-sideDock__label">Identity</p>' +
    '<p class="clab-sideDock__value">' + escapeHtml(clampWords(content.identityLine, 10)) + "</p>" +
    "</div>" +
    '<div class="clab-sideDock__block">' +
    '<p class="clab-sideDock__label">Availability</p>' +
    '<p class="clab-sideDock__value">Select client fits / founder-led collaboration</p>' +
    "</div>" +
    '<div class="clab-sideDock__block">' +
    '<p class="clab-sideDock__label">Ideal outcomes</p>' +
    '<ul class="clab-sideDock__list">' +
    '<li>Decision-ready roadmap</li>' +
    '<li>Working prototype slice</li>' +
    '<li>Usable handoff plan</li>' +
    "</ul>" +
    "</div>" +
    '</aside>' +

    '<footer class="clab-footerLine">' +
    '<div class="clab-footerLine__identity">' + escapeHtml(content.identityLine) + "</div>" +
    '<div class="clab-footerLine__micro">' +
    '<span>Editorial + futuristic + strategic + organic</span>' +
    '<span>Single-page consulting command area concept</span>' +
    "</div>" +
    "</footer>" +

    "</div>"
  );
}

function renderVariantCard(variant, content) {
  return (
    '<article class="lab-variant" id="variant-' + escapeHtml(variant.id) + '" data-variant-card>' +
    '<div class="lab-variant__meta">' +
    '<div class="lab-variant__labelRow">' +
    '<span class="lab-variant__label">Variant ' + escapeHtml(variant.id) + "</span>" +
    '<h2 class="lab-variant__title">' + escapeHtml(variant.title) + "</h2>" +
    "</div>" +
    '<p class="lab-variant__note">' + escapeHtml(variant.note) + "</p>" +
    "</div>" +
    '<div class="lab-frame">' +
    '<div class="lab-frame__chrome">' +
    '<div class="lab-frame__dots"><span></span><span></span><span></span></div>' +
    '<div class="lab-frame__path">/consulting-lab / concept ' + escapeHtml(variant.id) + " / 100vh mockup</div>" +
    '<div class="lab-frame__meta">Preview only</div>' +
    "</div>" +
    '<div class="lab-frame__viewport">' +
    renderMockScreen(variant, content) +
    "</div>" +
    "</div>" +
    "</article>"
  );
}

function renderGallery() {
  var gallery = document.getElementById("labGallery");
  if (!gallery) return;

  var consulting = getConsultingContent();
  gallery.innerHTML = VARIANTS.map(function(variant) {
    return renderVariantCard(variant, consulting);
  }).join("");
}

function syncToggleUI() {
  var state = {
    labels: document.body.classList.contains("is-labels-visible") ? "on" : "off",
    size: document.body.classList.contains("is-preview-compact") ? "compact" : "large",
    accent: "cyan"
  };

  if (document.body.classList.contains("theme-emerald")) state.accent = "emerald";
  if (document.body.classList.contains("theme-amber")) state.accent = "amber";

  document.querySelectorAll("[data-lab-toggle]").forEach(function(button) {
    var kind = button.getAttribute("data-lab-toggle");
    var value = button.getAttribute("data-value");
    var active = state[kind] === value;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function initToolbarControls() {
  document.addEventListener("click", function(event) {
    var button = event.target.closest("[data-lab-toggle]");
    if (!button) return;

    var kind = button.getAttribute("data-lab-toggle");
    var value = button.getAttribute("data-value");
    if (!kind || !value) return;

    if (kind === "labels") {
      document.body.classList.toggle("is-labels-visible", value === "on");
      document.body.classList.toggle("is-labels-hidden", value === "off");
    }

    if (kind === "size") {
      document.body.classList.toggle("is-preview-compact", value === "compact");
      document.body.classList.toggle("is-preview-large", value === "large");
    }

    if (kind === "accent") {
      document.body.classList.remove("theme-cyan", "theme-emerald", "theme-amber");
      document.body.classList.add("theme-" + value);
      window.dispatchEvent(new CustomEvent("lab:accentchange", { detail: { accent: value } }));
    }

    syncToggleUI();
  });

  syncToggleUI();
}

function initPointerParallax() {
  document.querySelectorAll(".clab-screen").forEach(function(screen) {
    screen.addEventListener("pointermove", function(event) {
      var rect = screen.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var px = (event.clientX - rect.left) / rect.width;
      var py = (event.clientY - rect.top) / rect.height;
      screen.style.setProperty("--mx", (px * 2 - 1).toFixed(3));
      screen.style.setProperty("--my", (py * 2 - 1).toFixed(3));
    });

    screen.addEventListener("pointerleave", function() {
      screen.style.setProperty("--mx", "0");
      screen.style.setProperty("--my", "0");
    });
  });
}

function parseAccentRGB() {
  var raw = getComputedStyle(document.body).getPropertyValue("--lab-accent-rgb").trim();
  var nums = raw.match(/\d+/g) || ["111", "231", "255"];
  return {
    r: Number(nums[0]) || 111,
    g: Number(nums[1]) || 231,
    b: Number(nums[2]) || 255
  };
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function fract(value) {
  return value - Math.floor(value);
}

function wrapDegrees(value) {
  var out = value;
  while (out > 180) out -= 360;
  while (out < -180) out += 360;
  return out;
}

function geoBlob(lon, lat, cLon, cLat, rx, ry, weight) {
  var dx = wrapDegrees(lon - cLon) / rx;
  var dy = (lat - cLat) / ry;
  var d2 = (dx * dx) + (dy * dy);
  return Math.exp(-d2 * 1.9) * weight;
}

function earthLandData(lon, lat) {
  var score = 0;
  var deg = Math.PI / 180;
  var continents = {
    "north-america": 0,
    "south-america": 0,
    "europe": 0,
    "asia": 0,
    "africa": 0,
    "australia": 0
  };

  /* North America (+ Greenland) */
  continents["north-america"] += geoBlob(lon, lat, -112, 53, 34, 21, 1.02);
  continents["north-america"] += geoBlob(lon, lat, -100, 36, 28, 18, 0.84);
  continents["north-america"] += geoBlob(lon, lat, -86, 18, 18, 10, 0.58); /* Central America */
  continents["north-america"] += geoBlob(lon, lat, -43, 73, 14, 8, 0.44);  /* Greenland */

  /* South America */
  continents["south-america"] += geoBlob(lon, lat, -62, -12, 20, 29, 0.98);
  continents["south-america"] += geoBlob(lon, lat, -70, -39, 14, 17, 0.54);
  continents["south-america"] += geoBlob(lon, lat, -76, 4, 11, 10, 0.36);

  /* Europe */
  continents["europe"] += geoBlob(lon, lat, 5, 50, 19, 12, 0.86);
  continents["europe"] += geoBlob(lon, lat, 19, 55, 18, 10, 0.42);
  continents["europe"] += geoBlob(lon, lat, -3, 42, 10, 8, 0.3);
  continents["europe"] += geoBlob(lon, lat, 27, 40, 10, 7, 0.26);

  /* Africa */
  continents["africa"] += geoBlob(lon, lat, 17, 7, 22, 30, 1.08);
  continents["africa"] += geoBlob(lon, lat, 28, -18, 18, 18, 0.52);
  continents["africa"] += geoBlob(lon, lat, 0, 14, 12, 10, 0.36);
  continents["africa"] += geoBlob(lon, lat, 47, -19, 6, 8, 0.18); /* Madagascar */

  /* Asia */
  continents["asia"] += geoBlob(lon, lat, 44, 30, 18, 12, 0.58);   /* Middle East */
  continents["asia"] += geoBlob(lon, lat, 67, 46, 38, 17, 0.92);   /* Central Asia */
  continents["asia"] += geoBlob(lon, lat, 96, 55, 56, 18, 1.04);   /* Russia */
  continents["asia"] += geoBlob(lon, lat, 103, 28, 25, 16, 0.82);  /* China */
  continents["asia"] += geoBlob(lon, lat, 78, 20, 13, 11, 0.66);   /* India */
  continents["asia"] += geoBlob(lon, lat, 113, 8, 27, 12, 0.7);    /* SE Asia */
  continents["asia"] += geoBlob(lon, lat, 140, 36, 9, 7, 0.22);    /* Japan */

  /* Australia (+ NZ hint) */
  continents["australia"] += geoBlob(lon, lat, 135, -25, 18, 11, 0.72);
  continents["australia"] += geoBlob(lon, lat, 146, -20, 11, 9, 0.22);
  continents["australia"] += geoBlob(lon, lat, 174, -41, 7, 5, 0.12);

  score += continents["north-america"];
  score += continents["south-america"];
  score += continents["europe"];
  score += continents["asia"];
  score += continents["africa"];
  score += continents["australia"];

  /* Carve ocean gaps so shapes read less like blobs */
  score -= geoBlob(lon, lat, -38, 26, 22, 20, 0.62); /* Atlantic gap */
  score -= geoBlob(lon, lat, 35, 42, 12, 8, 0.26);   /* Med / Black Sea cut */
  score -= geoBlob(lon, lat, 84, 43, 18, 10, 0.25);  /* Central Asia separation */
  score -= geoBlob(lon, lat, 124, 35, 16, 12, 0.2);  /* East China Sea cut */
  score -= geoBlob(lon, lat, -88, 10, 8, 10, 0.15);  /* Gulf / Caribbean split */
  score -= geoBlob(lon, lat, 35, 22, 8, 8, 0.16);    /* Arabia / Africa notch */
  score -= geoBlob(lon, lat, 12, 36, 7, 6, 0.1);     /* Mediterranean trim */
  score -= geoBlob(lon, lat, 150, -8, 12, 9, 0.12);  /* AU / PNG ocean gap */

  /* Coastline variation so continents look less uniform */
  score += 0.08 * Math.sin((lon * 2.8 + lat * 0.6) * deg);
  score += 0.05 * Math.cos((lon * 4.2 - lat * 1.4) * deg);
  score += 0.04 * Math.sin((lon * 7.2 + lat * 3.1 + 22) * deg);

  /* Slight polar presence for ice caps */
  if (lat > 70) score += 0.1 + (lat - 70) * 0.004;
  if (lat < -66) score += 0.06 + (-66 - lat) * 0.003;

  var continentId = null;
  var continentStrength = 0;
  var names = Object.keys(continents);
  for (var n = 0; n < names.length; n++) {
    var id = names[n];
    var value = continents[id];
    if (value > continentStrength) {
      continentStrength = value;
      continentId = id;
    }
  }

  if (continentStrength < 0.16) continentId = null;

  return {
    score: score,
    continentId: continentId,
    continentStrength: continentStrength,
    continents: continents
  };
}

function earthLandScore(lon, lat) {
  return earthLandData(lon, lat).score;
}

function buildEarthPoints(count) {
  var pts = [];
  var offset = 2 / count;
  var increment = Math.PI * (3 - Math.sqrt(5));
  var threshold = 0.9;

  for (var i = 0; i < count; i++) {
    var y = ((i * offset) - 1) + (offset / 2);
    var r = Math.sqrt(Math.max(0, 1 - y * y));
    var phi = i * increment;
    var x = Math.cos(phi) * r;
    var z = Math.sin(phi) * r;

    var lon = Math.atan2(z, x) * (180 / Math.PI);
    var lat = Math.asin(y) * (180 / Math.PI);
    var landData = earthLandData(lon, lat);
    var landScore = landData.score;
    var coastBand = Math.abs(landScore - threshold);
    var coast = clamp01(1 - (coastBand / 0.16));
    var land = landScore > threshold;
    var seed = fract(Math.sin((i + 1) * 12.9898 + (lon * 0.73) + (lat * 1.91)) * 43758.5453);
    var shore = landScore > (threshold - 0.09);
    var continentId = (shore || land) ? landData.continentId : null;
    var visible = land || shore || seed > 0.12;
    var oceanBias = clamp01((landScore - 0.35) / 0.5);

    pts.push({
      x: x,
      y: y,
      z: z,
      lon: lon,
      lat: lat,
      ox: 0,
      oy: 0,
      vx: 0,
      vy: 0,
      land: land,
      shore: shore,
      coast: coast,
      landScore: landScore,
      continentId: continentId,
      continentStrength: landData.continentStrength,
      seed: seed,
      visible: visible,
      oceanBias: oceanBias
    });
  }

  return pts;
}

function buildCoastEdges(points) {
  var coastIndices = [];
  var edges = [];
  var edgeMap = Object.create(null);
  var i;

  for (i = 0; i < points.length; i++) {
    if (points[i].shore && points[i].coast > 0.08 && points[i].continentId) coastIndices.push(i);
  }

  for (i = 0; i < coastIndices.length; i++) {
    var idxA = coastIndices[i];
    var a = points[idxA];
    var candidates = [];

    for (var j = 0; j < coastIndices.length; j++) {
      if (i === j) continue;

      var idxB = coastIndices[j];
      var b = points[idxB];
      if (a.continentId !== b.continentId) continue;
      var latDiff = Math.abs(a.lat - b.lat);
      var lonDiff = Math.abs(wrapDegrees(a.lon - b.lon));
      if (latDiff > 14 || lonDiff > 16) continue;

      var dx = a.x - b.x;
      var dy = a.y - b.y;
      var dz = a.z - b.z;
      var dist3 = Math.sqrt((dx * dx) + (dy * dy) + (dz * dz));
      if (dist3 > 0.21) continue;

      var coastStrength = Math.min(a.coast, b.coast);
      var scoreDelta = Math.abs(a.landScore - b.landScore);
      var cost = dist3 + (scoreDelta * 0.05) - (coastStrength * 0.02);
      var strengthMix = Math.min(a.continentStrength || 0, b.continentStrength || 0);

      candidates.push({
        idx: idxB,
        cost: cost,
        dist3: dist3,
        weight: clamp01(((0.24 - dist3) / 0.24) * 0.8 + coastStrength * 0.45 + strengthMix * 0.08)
      });
    }

    candidates.sort(function(c1, c2) { return c1.cost - c2.cost; });

    for (var k = 0; k < Math.min(2, candidates.length); k++) {
      var cand = candidates[k];
      var lo = Math.min(idxA, cand.idx);
      var hi = Math.max(idxA, cand.idx);
      var key = lo + ":" + hi;
      if (edgeMap[key]) continue;
      edgeMap[key] = true;
      edges.push({
        a: lo,
        b: hi,
        dist3: cand.dist3,
        weight: cand.weight,
        continentId: a.continentId
      });
    }
  }

  return edges;
}

function readNumberAttr(node, attrName, fallback) {
  var raw = node && node.getAttribute ? node.getAttribute(attrName) : null;
  var value = raw == null ? NaN : Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

function ParticleGlobe(field) {
  this.field = field;
  this.canvas = field.querySelector("canvas");
  this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
  this.mode = field.getAttribute("data-particle-globe") || "earth-repel";
  this.forceMode = this.mode.indexOf("earth-") === 0 ? this.mode.slice(6) : this.mode;
  this.pointCount = Math.max(700, Math.floor(readNumberAttr(field, "data-particle-count", this.forceMode === "swirl" ? 2400 : 2100)));
  this.points = buildEarthPoints(this.pointCount);
  this.coastEdges = buildCoastEdges(this.points);
  this.pointer = { active: false, x: 0, y: 0, fx: 0, fy: 0, vx: 0, vy: 0, strength: 1 };
  this.dpr = Math.min(2, window.devicePixelRatio || 1);
  this.rotation = readNumberAttr(field, "data-particle-yaw", -0.98);
  this.pitch = -0.18;
  this.spinRate = this.forceMode === "swirl" ? 0.000055 : 0.000042;
  this.running = false;
  this.inView = true;
  this.reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  this.accent = parseAccentRGB();
  this.rafId = 0;

  if (!this.canvas || !this.ctx) return;

  this.handlePointerMove = this.handlePointerMove.bind(this);
  this.handlePointerLeave = this.handlePointerLeave.bind(this);
  this.resize = this.resize.bind(this);
  this.tick = this.tick.bind(this);
  this.handleAccentChange = this.handleAccentChange.bind(this);

  field.addEventListener("pointermove", this.handlePointerMove);
  field.addEventListener("pointerleave", this.handlePointerLeave);
  window.addEventListener("resize", this.resize);
  window.addEventListener("lab:accentchange", this.handleAccentChange);

  if ("IntersectionObserver" in window) {
    var self = this;
    this.observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.target !== self.field) return;
        self.inView = entry.isIntersecting;
        if (self.inView && !self.running) self.start();
      });
    }, { threshold: 0.02 });
    this.observer.observe(field);
  }

  this.resize();
  this.start();
}

ParticleGlobe.prototype.handleAccentChange = function() {
  this.accent = parseAccentRGB();
};

ParticleGlobe.prototype.handlePointerMove = function(event) {
  var rect = this.canvas.getBoundingClientRect();
  this.pointer.active = true;
  this.pointer.x = event.clientX - rect.left;
  this.pointer.y = event.clientY - rect.top;
  this.pointer.strength = event.pointerType === "touch" ? 1.35 : 1;
};

ParticleGlobe.prototype.handlePointerLeave = function() {
  this.pointer.active = false;
};

ParticleGlobe.prototype.resize = function() {
  if (!this.canvas || !this.ctx) return;
  var rect = this.field.getBoundingClientRect();
  var width = Math.max(2, Math.round(rect.width));
  var height = Math.max(2, Math.round(rect.height));
  this.width = width;
  this.height = height;
  this.canvas.width = Math.round(width * this.dpr);
  this.canvas.height = Math.round(height * this.dpr);
  this.canvas.style.width = width + "px";
  this.canvas.style.height = height + "px";
  this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  this.cx = width * 0.5;
  this.cy = height * 0.5;
  this.rx = Math.min(width, height) * 0.36;
  this.ry = this.rx * 1.14;
  if (!this.pointer.fx && !this.pointer.fy) {
    this.pointer.fx = this.cx;
    this.pointer.fy = this.cy;
  }
  this.draw(0);
};

ParticleGlobe.prototype.start = function() {
  if (this.reduced) {
    this.draw(0);
    return;
  }
  if (this.running) return;
  this.running = true;
  this.rafId = requestAnimationFrame(this.tick);
};

ParticleGlobe.prototype.stop = function() {
  this.running = false;
  if (this.rafId) cancelAnimationFrame(this.rafId);
  this.rafId = 0;
};

ParticleGlobe.prototype.project = function(point, t) {
  var yaw = this.rotation + t * this.spinRate;
  var pitch = this.pitch;
  var cy = Math.cos(yaw);
  var sy = Math.sin(yaw);
  var cp = Math.cos(pitch);
  var sp = Math.sin(pitch);

  var x1 = (point.x * cy) - (point.z * sy);
  var z1 = (point.x * sy) + (point.z * cy);
  var y1 = point.y;

  var y2 = (y1 * cp) - (z1 * sp);
  var z2 = (y1 * sp) + (z1 * cp);

  var perspective = 0.78 + ((z2 + 1) * 0.22);
  var sx = this.cx + (x1 * this.rx * perspective) + point.ox;
  var sy2 = this.cy + (y2 * this.ry * perspective) + point.oy;
  return { x: sx, y: sy2, z: z2, p: perspective, rx: x1, ry: y2 };
};

ParticleGlobe.prototype.updatePointer = function() {
  var targetX = this.pointer.active ? this.pointer.x : this.pointer.fx;
  var targetY = this.pointer.active ? this.pointer.y : this.pointer.fy;
  var lerp = this.pointer.active ? 0.105 : 0.038;
  var nextFx = this.pointer.fx + ((targetX - this.pointer.fx) * lerp);
  var nextFy = this.pointer.fy + ((targetY - this.pointer.fy) * lerp);
  this.pointer.vx = (this.pointer.vx * 0.7) + ((nextFx - this.pointer.fx) * 0.3);
  this.pointer.vy = (this.pointer.vy * 0.7) + ((nextFy - this.pointer.fy) * 0.3);
  this.pointer.fx = nextFx;
  this.pointer.fy = nextFy;
};

ParticleGlobe.prototype.applyForces = function(point, projected, t) {
  var mode = this.forceMode || "repel";
  var spring =
    mode === "swirl" ? 0.028 :
    mode === "elastic" ? 0.04 :
    mode === "bend" ? 0.034 :
    0.032;
  var damping =
    mode === "swirl" ? 0.94 :
    mode === "elastic" ? 0.93 :
    mode === "bend" ? 0.934 :
    0.932;
  var pointerRadius = Math.min(this.width, this.height) * (mode === "swirl" ? 0.34 : 0.3);
  var front = clamp01((projected.z + 1) * 0.5);
  var px = this.pointer.fx;
  var py = this.pointer.fy;

  if (this.pointer.active && front > 0.08) {
    var dx = projected.x - px;
    var dy = projected.y - py;
    var dist = Math.sqrt((dx * dx) + (dy * dy)) || 0.0001;

    if (dist < pointerRadius) {
      var falloff = 1 - (dist / pointerRadius);
      var frontGain = 0.45 + (front * 1.15);
      var strength = falloff * falloff * frontGain * this.pointer.strength;
      var nx = dx / dist;
      var ny = dy / dist;
      var tx = -ny;
      var ty = nx;
      var centerDx = (projected.x - this.cx);
      var centerDy = (projected.y - this.cy);
      var centerDist = Math.sqrt((centerDx * centerDx) + (centerDy * centerDy)) || 0.0001;
      var cxn = centerDx / centerDist;
      var cyn = centerDy / centerDist;
      var pointerSpeed = Math.sqrt((this.pointer.vx * this.pointer.vx) + (this.pointer.vy * this.pointer.vy));
      var trail = clamp01(pointerSpeed / 12);
      var pvx = pointerSpeed > 0.0001 ? (this.pointer.vx / pointerSpeed) : 0;
      var pvy = pointerSpeed > 0.0001 ? (this.pointer.vy / pointerSpeed) : 0;

      if (mode === "swirl") {
        point.vx += ((nx * 0.18) + (tx * 1.22) + (cxn * 0.16) + (pvx * 0.52 * trail)) * strength * 1.24;
        point.vy += ((ny * 0.18) + (ty * 1.22) + (cyn * 0.16) + (pvy * 0.52 * trail)) * strength * 1.24;
      } else if (mode === "bend") {
        point.vx += ((nx * 0.52) + (tx * 0.62) + (pvx * 0.38 * trail)) * strength * 0.94;
        point.vy += ((ny * 0.52) + (ty * 0.62) + (pvy * 0.38 * trail)) * strength * 0.94;
      } else if (mode === "elastic") {
        point.vx += (nx * 0.86 + tx * 0.42 + pvx * 0.44 * trail) * strength * 1.02;
        point.vy += (ny * 0.86 + ty * 0.42 + pvy * 0.44 * trail) * strength * 1.02;
        point.vx -= dx * 0.00072 * falloff;
        point.vy -= dy * 0.00072 * falloff;
      } else {
        point.vx += ((nx * 0.62) + (tx * 0.48) + (pvx * 0.34 * trail)) * strength * 0.94;
        point.vy += ((ny * 0.62) + (ty * 0.48) + (pvy * 0.34 * trail)) * strength * 0.94;
      }
    }
  }

  /* Coherent curl-like drift keeps the globe feeling loose and alive */
  if (!this.reduced) {
    var flowPhase =
      (t * 0.00045) +
      (point.lon * 0.063) +
      (point.lat * 0.089) +
      (point.seed * 8.3);
    var flowAmp = (point.shore ? 0.0014 : point.land ? 0.0011 : 0.00085) * (0.72 + (point.seed * 0.65));
    var flowVx = Math.cos(flowPhase + (projected.ry * 1.9)) * flowAmp;
    var flowVy = Math.sin((flowPhase * 0.93) - (projected.rx * 2.1)) * flowAmp * 0.92;
    point.vx += flowVx * 0.82;
    point.vy += flowVy * 0.82;

    /* Tiny rotational drift around the globe center so the response feels less radial */
    var rotDx = projected.x - this.cx;
    var rotDy = projected.y - this.cy;
    var rotDist = Math.sqrt((rotDx * rotDx) + (rotDy * rotDy)) || 1;
    var ring = clamp01(1 - (rotDist / (this.rx * 1.1)));
    if (ring > 0) {
      point.vx += (-rotDy / rotDist) * ring * 0.00056;
      point.vy += (rotDx / rotDist) * ring * 0.00056;
    }
  }

  point.vx += (-point.ox) * spring;
  point.vy += (-point.oy) * spring;
  point.vx *= damping;
  point.vy *= damping;
  if (point.vx > 2.6) point.vx = 2.6;
  if (point.vx < -2.6) point.vx = -2.6;
  if (point.vy > 2.6) point.vy = 2.6;
  if (point.vy < -2.6) point.vy = -2.6;
  point.ox += point.vx;
  point.oy += point.vy;
  if (point.ox > 32) point.ox = 32;
  if (point.ox < -32) point.ox = -32;
  if (point.oy > 32) point.oy = 32;
  if (point.oy < -32) point.oy = -32;
};

ParticleGlobe.prototype.draw = function(t) {
  if (!this.ctx || !this.width || !this.height) return;

  var ctx = this.ctx;
  var accent = this.accent;
  var phosphorR = 255;
  var phosphorG = 255;
  var phosphorB = 245;

  ctx.clearRect(0, 0, this.width, this.height);
  this.updatePointer();

  var glow = ctx.createRadialGradient(this.cx, this.cy, this.rx * 0.1, this.cx, this.cy, this.rx * 1.5);
  glow.addColorStop(0, "rgba(255,255,255,0.16)");
  glow.addColorStop(0.55, "rgba(255,255,255,0.045)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, this.width, this.height);

  var projectedPoints = [];
  var projectedByIndex = new Array(this.points.length);
  for (var i = 0; i < this.points.length; i++) {
    var point = this.points[i];
    var projected = this.project(point, t);
    this.applyForces(point, projected, t || 0);
    projectedByIndex[i] = projected;
    projectedPoints.push({ point: point, projected: projected });
  }

  projectedPoints.sort(function(a, b) {
    return a.projected.z - b.projected.z;
  });

  ctx.globalCompositeOperation = "screen";
  for (var j = 0; j < projectedPoints.length; j++) {
    var item = projectedPoints[j];
    if (!item.point.visible && item.projected.z < 0.2) continue;

    var z = item.projected.z;
    var depth = (z + 1) * 0.5;
    var radius = 0.2 + (depth * 0.6);
    var alpha = 0.05 + (depth * 0.38);
    var x = item.projected.x;
    var y = item.projected.y;
    var landness = clamp01((item.point.landScore - 0.72) / 0.34);
    var coast = item.point.coast;
    var modeBoost = this.forceMode === "swirl" ? 0.06 : 0;
    var lightDot = (item.projected.rx * 0.52) + (item.projected.ry * -0.24) + (item.projected.z * 0.82);
    var lighting = clamp01((lightDot + 1) * 0.5);
    var frontFade = clamp01((item.projected.z + 0.12) / 1.12);

    radius += landness * 0.12 + coast * 0.08 + (modeBoost * 0.35);
    if (!item.point.land && !item.point.shore) {
      radius *= 0.9;
      alpha *= 0.84;
    }
    var oceanLum = 58 + (lighting * 84) + (depth * 26);
    var landLum = 150 + (lighting * 95) + (depth * 28) + (coast * 18);
    var lum = (oceanLum * (1 - landness)) + (landLum * landness);
    if (item.point.land) lum += 8;
    var lumClamped = Math.max(24, Math.min(255, Math.round(lum)));
    var pointAlpha = alpha * frontFade * (0.62 + landness * 0.65 + coast * 0.12);

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(" + lumClamped + "," + lumClamped + "," + lumClamped + "," + pointAlpha + ")";
    ctx.fill();

    if (
      depth > 0.26 &&
      (item.point.land || coast > 0.45) &&
      item.point.seed > 0.9965
    ) {
      var glowAlpha = (0.012 + depth * 0.028 + coast * 0.02) * (item.point.land ? 1.08 : 0.86);
      ctx.beginPath();
      ctx.arc(x, y, radius * (3.1 + (item.point.seed * 0.9)), 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + phosphorR + "," + phosphorG + "," + phosphorB + "," + glowAlpha + ")";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, Math.max(0.2, radius * 0.34), 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255," + (0.06 + depth * 0.08) + ")";
      ctx.fill();
    }

    if (depth > 0.36 && (item.point.land || coast > 0.1 || item.point.seed > 0.93)) {
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0.16, radius * (item.point.land ? 0.42 : 0.34)), 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255," + (0.025 + depth * 0.12 + coast * 0.05) + ")";
      ctx.fill();
    }

    if (coast > 0.35 && depth > 0.2) {
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0.14, radius * 0.28), 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255," + (0.018 + coast * 0.05) + ")";
      ctx.fill();
    }
  }
  ctx.globalCompositeOperation = "source-over";

  /* Coastline edge pass: lightweight continent outlining from shore adjacency */
  if (this.coastEdges && this.coastEdges.length) {
    ctx.globalCompositeOperation = "screen";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (var e = 0; e < this.coastEdges.length; e++) {
      var edge = this.coastEdges[e];
      var pa = projectedByIndex[edge.a];
      var pb = projectedByIndex[edge.b];
      if (!pa || !pb) continue;
      if (pa.z < -0.06 || pb.z < -0.06) continue;

      var screenDx = pa.x - pb.x;
      var screenDy = pa.y - pb.y;
      var screenDist = Math.sqrt((screenDx * screenDx) + (screenDy * screenDy));
      if (screenDist > this.rx * 0.18) continue;

      var front = Math.min(clamp01((pa.z + 1) * 0.5), clamp01((pb.z + 1) * 0.5));
      var alpha = edge.weight * front * 0.22;
      if (alpha < 0.018) continue;

      ctx.strokeStyle = "rgba(255,255,255," + (alpha * 0.44) + ")";
      ctx.lineWidth = 0.55 + (front * 0.22);
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.stroke();
    }

    ctx.globalCompositeOperation = "source-over";
  }

  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(this.cx, this.cy, this.rx * 1.03, this.ry * 1.03, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,0.045)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(this.cx, this.cy, this.rx * 0.82, this.ry * 0.82, 0, 0, Math.PI * 2);
  ctx.stroke();
};

ParticleGlobe.prototype.tick = function(t) {
  if (!this.running) return;
  if (!this.inView) {
    this.running = false;
    return;
  }
  this.draw(t || 0);
  this.rafId = requestAnimationFrame(this.tick);
};

function initParticleGlobes() {
  var fields = Array.prototype.slice.call(document.querySelectorAll("[data-particle-globe]"));
  var instances = fields.map(function(field) {
    return new ParticleGlobe(field);
  });

  document.addEventListener("visibilitychange", function() {
    instances.forEach(function(instance) {
      if (!instance || !instance.canvas) return;
      if (document.hidden) instance.stop();
      else instance.start();
    });
  });
}

function bootstrapLab() {
  renderGallery();
  initToolbarControls();
  initPointerParallax();
  initParticleGlobes();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrapLab, { once: true });
} else {
  bootstrapLab();
}
