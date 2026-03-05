function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getInitials(value) {
  var parts = String(value).match(/[A-Z][a-z]+|[A-Z]+(?![a-z])|[a-z]+|\d+/g) || [String(value)];
  return parts
    .slice(0, 2)
    .map(function(part) {
      return part.charAt(0).toUpperCase();
    })
    .join("");
}

function renderPills(values, className) {
  return (values || [])
    .map(function(value) {
      return '<span class="' + className + '">' + escapeHtml(value) + "</span>";
    })
    .join("");
}

function renderBadge(value, className) {
  if (!value) return "";
  return '<span class="' + className + " " + className + "--" + slugify(value) + '">' + escapeHtml(value) + "</span>";
}

function renderGlyphBlock(prefix, title, subtitle) {
  return (
    '<div class="' +
    prefix +
    '__glyph" aria-hidden="true">' +
    '<div class="' +
    prefix +
    '__glyph-grid"></div>' +
    '<div class="' +
    prefix +
    '__glyph-badge">' +
    escapeHtml(getInitials(title)) +
    "</div>" +
    '<div class="' +
    prefix +
    '__glyph-copy">' +
    '<div class="' +
    prefix +
    '__glyph-title">' +
    escapeHtml(title) +
    "</div>" +
    (subtitle
      ? '<div class="' + prefix + '__glyph-subtitle">' + escapeHtml(subtitle) + "</div>"
      : "") +
    "</div>" +
    "</div>"
  );
}

function createModalController(root, options) {
  var modal = root.querySelector(options.modalSelector);
  var dialog = root.querySelector(options.dialogSelector);
  var body = root.querySelector(options.bodySelector);
  var screenEl = root.closest(".work__screen--detail");

  if (!modal || !dialog || !body) {
    return { open: function() {}, close: function() {} };
  }

  var lastFocusedElement = null;
  var bodyOverflowBefore = "";
  var screenOverflowBefore = "";

  function isOpen() {
    return !modal.hidden;
  }

  function close() {
    if (!isOpen()) return;

    modal.classList.remove("is-open");
    modal.hidden = true;
    body.innerHTML = "";

    document.body.style.overflow = bodyOverflowBefore;
    if (screenEl) screenEl.style.overflow = screenOverflowBefore;

    if (lastFocusedElement && document.contains(lastFocusedElement) && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  function open(item, triggerEl) {
    if (!item) return;

    body.innerHTML = options.renderBody(item);
    lastFocusedElement = triggerEl || document.activeElement;
    bodyOverflowBefore = document.body.style.overflow || "";
    screenOverflowBefore = screenEl ? screenEl.style.overflow || "" : "";

    document.body.style.overflow = "hidden";
    if (screenEl) screenEl.style.overflow = "hidden";

    modal.hidden = false;
    requestAnimationFrame(function() {
      modal.classList.add("is-open");
      dialog.focus();
    });
  }

  root.addEventListener("click", function(event) {
    var closeTarget = event.target.closest(options.closeSelector);
    if (closeTarget && root.contains(closeTarget)) {
      close();
    }
  });

  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" && isOpen()) {
      event.preventDefault();
      close();
    }
  });

  return { open: open, close: close };
}

function findById(items, id) {
  for (var i = 0; i < items.length; i += 1) {
    if (items[i].id === id) return items[i];
  }
  return null;
}

function initSupplyHero(root, heroConfig) {
  var hero = root.querySelector("[data-scs-hero]");
  if (!hero) return;

  var stage = hero.querySelector(".scs-hero__stage");
  var heroQuote = root.querySelector("[data-scs-hero-quote]");
  var assetNote = root.querySelector("[data-scs-hero-asset-note]");
  var eastMapNode = root.querySelector(".scs-hero__panel--east .scs-hero__map");
  var westMapNode = root.querySelector(".scs-hero__panel--west .scs-hero__map");
  var cfg = heroConfig || {};
  var isMasterPacific = cfg.layout === "pacific-master";

  hero.classList.toggle("is-east-sweep", cfg.layout === "east-sweep");
  hero.classList.toggle("is-cutout-split", cfg.layout === "split-cutout");
  hero.classList.toggle("is-pacific-master", false);
  hero.classList.toggle("is-master-pacific", isMasterPacific);

  if (cfg.eastPos) hero.style.setProperty("--scs-east-pos", cfg.eastPos);
  if (cfg.westPos) hero.style.setProperty("--scs-west-pos", cfg.westPos);
  if (cfg.seamWidth) hero.style.setProperty("--scs-seam-width", cfg.seamWidth);
  if (cfg.seamSoftness) hero.style.setProperty("--scs-seam-softness", cfg.seamSoftness);
  if (cfg.overlap) hero.style.setProperty("--scs-overlap", cfg.overlap);
  if (cfg.mapScale) hero.style.setProperty("--scs-map-scale", cfg.mapScale);
  if (cfg.eastMapAsset) {
    hero.style.setProperty("--scs-east-map-url", 'url("' + cfg.eastMapAsset + '")');
  }
  if (cfg.westMapAsset) {
    hero.style.setProperty("--scs-west-map-url", 'url("' + cfg.westMapAsset + '")');
  }
  if (cfg.mapAsset) {
    hero.style.setProperty("--scs-map-url", 'url("' + cfg.mapAsset + '")');
  }
  if (cfg.masterPacificX) hero.style.setProperty("--scs-master-pacific-x", cfg.masterPacificX);
  if (cfg.masterPacificY) hero.style.setProperty("--scs-master-pacific-y", cfg.masterPacificY);
  if (cfg.masterPacificScale) hero.style.setProperty("--scs-master-pacific-scale", cfg.masterPacificScale);
  if (cfg.masterPacificOpacity) hero.style.setProperty("--scs-master-pacific-opacity", cfg.masterPacificOpacity);
  if (cfg.masterPacificEdgeVignette) hero.style.setProperty("--scs-master-pacific-edge-vignette", cfg.masterPacificEdgeVignette);
  if (cfg.masterPacificTopFade) hero.style.setProperty("--scs-master-pacific-top-fade", cfg.masterPacificTopFade);
  if (cfg.masterPacificBottomFade) hero.style.setProperty("--scs-master-pacific-bottom-fade", cfg.masterPacificBottomFade);

  function applyMasterPacificImage(targetNode) {
    if (!cfg.mapAsset || !targetNode) return;
    targetNode.style.backgroundImage = 'url("' + cfg.mapAsset + '")';
  }

  function ensureMasterPacificLayers() {
    if (!stage) return;

    // Paint the stage itself as a hard fallback in case the injected layer fails to render.
    applyMasterPacificImage(stage);

    var master = stage.querySelector(".scs-hero__map-master");
    if (!master) {
      master = document.createElement("div");
      master.className = "scs-hero__map-master";
      master.setAttribute("aria-hidden", "true");
      stage.insertBefore(master, stage.firstChild);
    }
    applyMasterPacificImage(master);

    var vignette = stage.querySelector(".scs-hero__map-overlay--vignette");
    if (!vignette) {
      vignette = document.createElement("div");
      vignette.className = "scs-hero__map-overlay scs-hero__map-overlay--vignette";
      vignette.setAttribute("aria-hidden", "true");
      stage.appendChild(vignette);
    }

    var topfade = stage.querySelector(".scs-hero__map-overlay--topfade");
    if (!topfade) {
      topfade = document.createElement("div");
      topfade.className = "scs-hero__map-overlay scs-hero__map-overlay--topfade";
      topfade.setAttribute("aria-hidden", "true");
      stage.appendChild(topfade);
    }
  }

  function cleanupMasterPacificLayers() {
    if (!stage) return;
    stage.style.backgroundImage = "";
    var nodes = stage.querySelectorAll(
      ".scs-hero__map-master, .scs-hero__map-overlay--vignette, .scs-hero__map-overlay--topfade"
    );
    nodes.forEach(function(node) {
      node.remove();
    });
  }

  if (isMasterPacific) {
    ensureMasterPacificLayers();
  } else {
    cleanupMasterPacificLayers();
  }

  if (cfg.layout === "split-cutout") {
    if (eastMapNode && cfg.eastMapAsset) {
      eastMapNode.style.backgroundImage = 'url("' + cfg.eastMapAsset + '")';
    }
    if (westMapNode && cfg.westMapAsset) {
      westMapNode.style.backgroundImage = 'url("' + cfg.westMapAsset + '")';
    }
  } else {
    if (eastMapNode) eastMapNode.style.backgroundImage = "";
    if (westMapNode) westMapNode.style.backgroundImage = "";
  }

  if (heroQuote && cfg.quote) {
    heroQuote.textContent = cfg.quote;
  }

  function reveal() {
    hero.classList.add("is-revealed");
  }

  var prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    reveal();
  } else if (typeof window !== "undefined" && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function(entries, obs) {
      for (var i = 0; i < entries.length; i += 1) {
        if (entries[i].isIntersecting) {
          reveal();
          obs.disconnect();
          break;
        }
      }
    }, {
      root: null,
      threshold: 0.35
    });

    observer.observe(hero);
  } else {
    reveal();
  }

  var heroAssets = [];
  if (cfg.layout === "split-cutout") {
    if (cfg.eastMapAsset) heroAssets.push(cfg.eastMapAsset);
    if (cfg.westMapAsset) heroAssets.push(cfg.westMapAsset);
  } else if (cfg.mapAsset) {
    heroAssets.push(cfg.mapAsset);
  }

  if (heroAssets.length && typeof Image !== "undefined") {
    var pending = heroAssets.length;
    var hasError = false;

    function finishAssetChecks() {
      if (pending > 0) return;

      if (hasError) {
        hero.classList.add("is-map-missing");
        hero.classList.remove("has-map");
        if (assetNote) assetNote.hidden = false;
      } else {
        hero.classList.add("has-map");
        hero.classList.remove("is-map-missing");
        if (assetNote) assetNote.hidden = true;
      }
    }

    heroAssets.forEach(function(src) {
      var img = new Image();
      img.onload = function() {
        pending -= 1;
        finishAssetChecks();
      };
      img.onerror = function() {
        hasError = true;
        pending -= 1;
        finishAssetChecks();
      };
      img.src = src;
    });
  }
}

function initSupplyMinimalLanding(root, heroConfig) {
  var landing = root.querySelector("[data-scs-minimal-landing]");
  var mapLayer = root.querySelector("[data-scs-minimal-map]");
  var cfg = heroConfig || {};

  if (!landing || !mapLayer) return;

  function toZoom(value, fallback) {
    if (value == null) return fallback;
    var raw = String(value).trim();
    if (!raw) return fallback;
    if (raw.endsWith("%")) {
      var percent = parseFloat(raw.slice(0, -1));
      if (!isFinite(percent)) return fallback;
      return String(percent / 100);
    }
    var numeric = parseFloat(raw);
    if (!isFinite(numeric)) return fallback;
    if (numeric > 4) return String(numeric / 100);
    return String(numeric);
  }

  if (cfg.mapAsset) {
    landing.style.setProperty("--scs-minimal-map-url", 'url("' + cfg.mapAsset + '")');
    mapLayer.style.backgroundImage = 'url("' + cfg.mapAsset + '")';
  } else {
    mapLayer.style.backgroundImage = "";
  }

  // Reuse the pacific/master crop controls so the old hero config remains the source of truth.
  if (cfg.masterPacificX) landing.style.setProperty("--scs-minimal-map-x", cfg.masterPacificX);
  if (cfg.masterPacificY) landing.style.setProperty("--scs-minimal-map-y", cfg.masterPacificY);
  landing.style.setProperty("--scs-minimal-map-zoom", toZoom(cfg.masterPacificScale, "1.12"));

  // Subtle left shift + scale bump for a more intentional Pacific composition in the new layout.
  if (!cfg.masterPacificX) landing.style.setProperty("--scs-minimal-map-x", "47%");
  if (!cfg.masterPacificY) landing.style.setProperty("--scs-minimal-map-y", "46%");
  if (cfg.masterPacificOpacity) landing.style.setProperty("--scs-minimal-map-opacity", cfg.masterPacificOpacity);
  if (cfg.masterPacificEdgeVignette) landing.style.setProperty("--scs-minimal-edge-vignette", cfg.masterPacificEdgeVignette);
  if (cfg.masterPacificTopFade) landing.style.setProperty("--scs-minimal-top-fade", cfg.masterPacificTopFade);
  if (cfg.masterPacificBottomFade) landing.style.setProperty("--scs-minimal-bottom-fade", cfg.masterPacificBottomFade);

  // Pointer-light quote (dual-layer typography)
  var quoteEl = root.querySelector("[data-scs-minimal-quote]");
  var quoteLines = Array.isArray(cfg.quoteLines) ? cfg.quoteLines : [];
  var validStyles = {
    "serif-heavy": true,
    "mono-caps": true,
    "sans-light": true,
    "serif-italic": true
  };

  function normalizeStyle(style) {
    return validStyles[style] ? style : "serif-heavy";
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function buildQuoteLines() {
    if (!quoteEl || !quoteLines.length) return [];

    var html = quoteLines
      .map(function(line) {
        var text = line && line.text ? line.text : "";
        var style = normalizeStyle(line && line.style);

        return (
          '<div class="scs-minimalLanding__line scs-minimalLanding__line--' +
          style +
          '" tabindex="0">' +
          '<span class="scs-minimalLanding__lineBase">' +
          escapeHtml(text) +
          "</span>" +
          '<span class="scs-minimalLanding__lineLit">' +
          escapeHtml(text) +
          "</span>" +
          '<span class="scs-minimalLanding__lineSheen">' +
          escapeHtml(text) +
          "</span>" +
          "</div>"
        );
      })
      .join("");

    quoteEl.innerHTML = html;
    return Array.prototype.slice.call(
      quoteEl.querySelectorAll(".scs-minimalLanding__line")
    );
  }

  function initPointerReveal(lines) {
    if (!quoteEl || !lines.length) return;

    var state = {
      targetX: 0.5,
      targetY: 0.5,
      currentX: 0.5,
      currentY: 0.5,
      targetAlpha: 0,
      alpha: 0,
      lastTime: 0,
      rafId: 0
    };

    function setLocalMasks() {
      var quoteRect = quoteEl.getBoundingClientRect();
      if (!quoteRect.width || !quoteRect.height) return;

      quoteEl.style.setProperty("--scs-spot-x", (state.currentX * 100).toFixed(2) + "%");
      quoteEl.style.setProperty("--scs-spot-y", (state.currentY * 100).toFixed(2) + "%");
      quoteEl.style.setProperty("--scs-spot-alpha", state.alpha.toFixed(4));

      lines.forEach(function(line) {
        var rect = line.getBoundingClientRect();
        var localX = state.currentX * quoteRect.width - (rect.left - quoteRect.left);
        var localY = state.currentY * quoteRect.height - (rect.top - quoteRect.top);
        line.style.setProperty("--scs-line-spot-x", localX.toFixed(2) + "px");
        line.style.setProperty("--scs-line-spot-y", localY.toFixed(2) + "px");
      });
    }

    function tick(ts) {
      if (!state.lastTime) state.lastTime = ts;
      var dt = Math.min(0.05, (ts - state.lastTime) / 1000 || 1 / 60);
      state.lastTime = ts;

      var follow = 1 - Math.exp(-13 * dt);
      var alphaFollow = 1 - Math.exp(-10 * dt);

      state.currentX += (state.targetX - state.currentX) * follow;
      state.currentY += (state.targetY - state.currentY) * follow;
      state.alpha += (state.targetAlpha - state.alpha) * alphaFollow;

      setLocalMasks();
      state.rafId = requestAnimationFrame(tick);
    }

    function onPointerMove(event) {
      var rect = quoteEl.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      state.targetX = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      state.targetY = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    }

    quoteEl.addEventListener("pointerenter", function(event) {
      state.targetAlpha = 1;
      onPointerMove(event);
    });

    quoteEl.addEventListener("pointermove", onPointerMove);

    quoteEl.addEventListener("pointerleave", function() {
      state.targetAlpha = 0;
    });

    if (state.rafId) cancelAnimationFrame(state.rafId);
    state.rafId = requestAnimationFrame(tick);
  }

  function initTouchFallback(lines) {
    if (!quoteEl || !lines.length) return;
    quoteEl.classList.add("is-touch-fallback");

    var clearTimer = 0;

    function setActive(line) {
      lines.forEach(function(item) {
        item.classList.toggle("is-active", item === line);
      });
      if (clearTimer) clearTimeout(clearTimer);
      clearTimer = setTimeout(function() {
        lines.forEach(function(item) {
          item.classList.remove("is-active");
        });
      }, 1800);
    }

    lines.forEach(function(line) {
      line.addEventListener("click", function() {
        setActive(line);
      });

      line.addEventListener("keydown", function(event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setActive(line);
        }
      });
    });
  }

  function reveal() {
    landing.classList.add("is-revealed");
    if (!quoteEl || !quoteLines.length) return;

    var lines = buildQuoteLines();
    if (!lines.length) return;

    var isReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var isCoarsePointer =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(hover: none), (pointer: coarse)").matches;

    if (isReducedMotion) {
      quoteEl.classList.add("is-static-lit");
      quoteEl.style.setProperty("--scs-spot-alpha", "0");
      return;
    }

    if (isCoarsePointer) {
      initTouchFallback(lines);
      return;
    }

    quoteEl.classList.add("is-pointer-reveal");
    initPointerReveal(lines);
  }

  var prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    reveal();
  } else {
    // The minimal landing lives inside a .work__screen that is position:absolute
    // and enters via transform:translateY. IntersectionObserver with root:null
    // (viewport) misses this because the element's rect can be stale during
    // CSS transform transitions. Instead, watch for the .is-active class on the
    // parent work screen, which is what actually makes it visible.
    var workScreen = landing.closest(".work__screen");
    if (workScreen && workScreen.classList.contains("is-active")) {
      setTimeout(reveal, 120);
    } else if (workScreen && typeof MutationObserver !== "undefined") {
      var mo = new MutationObserver(function(mutations) {
        for (var i = 0; i < mutations.length; i++) {
          if (workScreen.classList.contains("is-active")) {
            setTimeout(reveal, 120);
            mo.disconnect();
            return;
          }
        }
      });
      mo.observe(workScreen, { attributes: true, attributeFilter: ["class"] });
    } else {
      reveal();
    }
  }
}

function renderSupplyProofTabs(tabs, activeTabId) {
  return (tabs || [])
    .map(function(tab, index) {
      var isActive = tab.id === activeTabId;
      var tabId = "scs-proof-tab-" + tab.id;
      var panelId = "scs-proof-panel-" + tab.id;
      return (
        '<button type="button" class="scs-proof__tab" role="tab" id="' +
        tabId +
        '" aria-selected="' +
        (isActive ? "true" : "false") +
        '" aria-controls="' +
        panelId +
        '" tabindex="' +
        (isActive ? "0" : "-1") +
        '" data-scs-proof-tab="' +
        escapeHtml(tab.id) +
        '" data-scs-proof-index="' +
        index +
        '">' +
        escapeHtml(tab.label) +
        "</button>"
      );
    })
    .join("");
}

function renderSupplyProofPanels(tabs, activeTabId) {
  return (tabs || [])
    .map(function(tab) {
      var isActive = tab.id === activeTabId;
      var panelId = "scs-proof-panel-" + tab.id;
      var tabId = "scs-proof-tab-" + tab.id;
      var bullets = (tab.bullets || [])
        .slice(0, 3)
        .map(function(line) {
          return "<li>" + escapeHtml(line) + "</li>";
        })
        .join("");
      var tags = renderPills((tab.tags || []).slice(0, 3), "scs-proof__tag");

      return (
        '<section class="scs-proof__panel" role="tabpanel" id="' +
        panelId +
        '" aria-labelledby="' +
        tabId +
        '" tabindex="' +
        (isActive ? "0" : "-1") +
        '"' +
        (isActive ? "" : " hidden") +
        ">" +
        '<h4 class="scs-proof__panelTitle">' +
        escapeHtml(tab.title || tab.label) +
        "</h4>" +
        '<ul class="scs-proof__panelBullets">' +
        bullets +
        "</ul>" +
        '<div class="scs-proof__panelTags">' +
        tags +
        "</div>" +
        "</section>"
      );
    })
    .join("");
}

function initSupplyProofDrawer(root, proofConfig) {
  if (!proofConfig || !Array.isArray(proofConfig.tabs) || !proofConfig.tabs.length) return;

  var toggle = root.querySelector("[data-scs-proof-toggle]");
  var drawer = root.querySelector("[data-scs-proof-drawer]");
  var tabsWrap = root.querySelector("[data-scs-proof-tabs]");
  var panelsWrap = root.querySelector("[data-scs-proof-panels]");

  if (!toggle || !drawer || !tabsWrap || !panelsWrap) return;

  var state = {
    isOpen: false,
    activeTabId: proofConfig.tabs[0].id
  };

  function renderTabsAndPanels() {
    tabsWrap.innerHTML = renderSupplyProofTabs(proofConfig.tabs, state.activeTabId);
    panelsWrap.innerHTML = renderSupplyProofPanels(proofConfig.tabs, state.activeTabId);
  }

  function setDrawerOpen(open, restoreFocus) {
    state.isOpen = !!open;
    toggle.setAttribute("aria-expanded", String(state.isOpen));
    drawer.setAttribute("aria-hidden", String(!state.isOpen));
    drawer.classList.toggle("is-open", state.isOpen);
    drawer.dataset.open = String(state.isOpen);

    if (!state.isOpen && restoreFocus) {
      toggle.focus();
    }
  }

  function activateTab(tabId, shouldFocus) {
    if (!tabId || tabId === state.activeTabId) {
      if (shouldFocus) {
        var current = tabsWrap.querySelector('[data-scs-proof-tab="' + state.activeTabId + '"]');
        if (current) current.focus();
      }
      return;
    }

    state.activeTabId = tabId;
    renderTabsAndPanels();

    if (shouldFocus) {
      var next = tabsWrap.querySelector('[data-scs-proof-tab="' + state.activeTabId + '"]');
      if (next) next.focus();
    }
  }

  renderTabsAndPanels();
  setDrawerOpen(false, false);

  toggle.addEventListener("click", function() {
    setDrawerOpen(!state.isOpen, false);
  });

  tabsWrap.addEventListener("click", function(event) {
    var tabButton = event.target.closest("[data-scs-proof-tab]");
    if (!tabButton || !tabsWrap.contains(tabButton)) return;
    activateTab(tabButton.getAttribute("data-scs-proof-tab"), false);
  });

  tabsWrap.addEventListener("keydown", function(event) {
    var currentTab = event.target.closest("[data-scs-proof-tab]");
    if (!currentTab) return;

    var tabButtons = Array.prototype.slice.call(tabsWrap.querySelectorAll("[data-scs-proof-tab]"));
    var currentIndex = tabButtons.indexOf(currentTab);
    if (currentIndex === -1) return;

    var nextIndex = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % tabButtons.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabButtons.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      activateTab(tabButtons[nextIndex].getAttribute("data-scs-proof-tab"), true);
    }
  });

  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" && state.isOpen) {
      setDrawerOpen(false, true);
    }
  });
}

function renderSupplyFeature(feature, activeSupport) {
  var bullets = (feature.bullets || [])
    .map(function(line) {
      return "<li>" + escapeHtml(line) + "</li>";
    })
    .join("");

  var scopeSignals = (feature.scopeSignals || [])
    .map(function(line) {
      return '<span class="scs-token">' + escapeHtml(line) + "</span>";
    })
    .join("");

  var supportPreview = activeSupport
    ? (
      '<div class="scs-feature__supportFocus">' +
      '<div class="scs-feature__supportLabel">Hover Preview</div>' +
      '<div class="scs-feature__supportTitle">' + escapeHtml(activeSupport.title) + "</div>" +
      '<p class="scs-feature__supportDesc">' + escapeHtml(activeSupport.oneLiner) + "</p>" +
      "</div>"
    )
    : "";

  return (
    '<button class="scs-feature" type="button" data-scs-item="' + escapeHtml(feature.id) + '" aria-label="Open ' + escapeHtml(feature.title) + ' details">' +
    '<span class="scs-feature__sheen" aria-hidden="true"></span>' +
    '<div class="scs-feature__top">' +
    '<div class="scs-feature__meta">' +
    '<span class="scs-feature__badge">' + escapeHtml(feature.badge) + "</span>" +
    '<h4 class="scs-feature__title">' + escapeHtml(feature.title) + "</h4>" +
    '<p class="scs-feature__role">' + escapeHtml(feature.roleLine) + "</p>" +
    "</div>" +
    renderGlyphBlock("scs-feature", feature.title, "Operator systems") +
    "</div>" +
    '<p class="scs-feature__oneLiner">' + escapeHtml(feature.oneLiner) + "</p>" +
    '<ul class="scs-feature__bullets">' + bullets + "</ul>" +
    '<div class="scs-feature__tags">' + renderPills(feature.tags, "scs-pill") + "</div>" +
    '<div class="scs-feature__tools">' +
    '<span class="scs-feature__toolsLabel">Tools / platforms</span>' +
    '<div class="scs-feature__toolRow">' + renderPills(feature.tools, "scs-pill scs-pill--dim") + "</div>" +
    "</div>" +
    '<div class="scs-feature__footer">' +
    '<div class="scs-feature__signals">' + scopeSignals + "</div>" +
    supportPreview +
    "</div>" +
    "</button>"
  );
}

function renderSupplySupportCards(items, activeId) {
  return items
    .map(function(item) {
      var bullets = (item.bullets || [])
        .slice(0, 2)
        .map(function(line) {
          return "<li>" + escapeHtml(line) + "</li>";
        })
        .join("");

      return (
        '<li class="scs-cardItem" role="listitem">' +
        '<button class="scs-card' + (item.id === activeId ? " is-active" : "") + '" type="button" data-scs-item="' + escapeHtml(item.id) + '" aria-label="Open ' + escapeHtml(item.title) + ' details">' +
        '<span class="scs-card__sheen" aria-hidden="true"></span>' +
        '<div class="scs-card__head">' +
        '<span class="scs-card__badge">' + escapeHtml(item.badge || "Support") + "</span>" +
        renderGlyphBlock("scs-card", item.title, item.kind === "support" ? "Support story" : "") +
        "</div>" +
        '<h5 class="scs-card__title">' + escapeHtml(item.title) + "</h5>" +
        '<p class="scs-card__oneLiner">' + escapeHtml(item.oneLiner) + "</p>" +
        '<div class="scs-card__expand">' +
        '<ul class="scs-card__bullets">' + bullets + "</ul>" +
        '<div class="scs-card__tags">' + renderPills(item.tags, "scs-pill scs-pill--soft") + "</div>" +
        "</div>" +
        "</button>" +
        "</li>"
      );
    })
    .join("");
}

function renderSupplyModalBody(item) {
  var bullets = (item.bullets || [])
    .map(function(line) {
      return "<li>" + escapeHtml(line) + "</li>";
    })
    .join("");

  var tools = renderPills(item.tools || [], "scs-pill scs-pill--dim");
  var tags = renderPills(item.tags || [], "scs-pill");
  var signals = (item.scopeSignals || [])
    .map(function(line) {
      return "<li>" + escapeHtml(line) + "</li>";
    })
    .join("");
  var snapshot = (item.systemSnapshot || [])
    .map(function(line) {
      return "<li>" + escapeHtml(line) + "</li>";
    })
    .join("");

  return (
    '<div class="scs-modalBody">' +
    '<div class="scs-modalBody__hero">' +
    renderGlyphBlock("scs-modalBody", item.title, item.badge || "Supply chain") +
    '<div class="scs-modalBody__heroCopy">' +
    '<div class="scs-modalBody__eyebrow">' + escapeHtml(item.badge || "Detail") + "</div>" +
    '<h3 class="scs-modalBody__title" id="scs-modal-title">' + escapeHtml(item.title) + "</h3>" +
    (item.roleLine ? '<p class="scs-modalBody__role">' + escapeHtml(item.roleLine) + "</p>" : "") +
    '<p class="scs-modalBody__oneLiner" id="scs-modal-desc">' + escapeHtml(item.oneLiner) + "</p>" +
    "</div>" +
    "</div>" +
    '<div class="scs-modalBody__grid">' +
    '<section class="scs-modalBody__main">' +
    '<h4 class="scs-modalBody__sectionTitle">What I built / drove</h4>' +
    '<ul class="scs-modalBody__bullets">' + bullets + "</ul>" +
    '<div class="scs-modalBody__tags">' + tags + "</div>" +
    '<div class="scs-modalBody__toolsWrap">' +
    '<div class="scs-modalBody__miniLabel">Tools / platforms</div>' +
    '<div class="scs-modalBody__tools">' + tools + "</div>" +
    "</div>" +
    "</section>" +
    '<aside class="scs-modalBody__aside">' +
    '<div class="scs-modalBody__panel">' +
    '<div class="scs-modalBody__miniLabel">Scope signals</div>' +
    '<ul class="scs-modalBody__list">' + signals + "</ul>" +
    "</div>" +
    '<div class="scs-modalBody__panel">' +
    '<div class="scs-modalBody__miniLabel">System snapshot</div>' +
    '<ul class="scs-modalBody__list">' + snapshot + "</ul>" +
    "</div>" +
    "</aside>" +
    "</div>" +
    "</div>"
  );
}

export function initSupplyChainSection(config) {
  if (!config || !config.featured || !Array.isArray(config.supports)) return;

  var roots = document.querySelectorAll("[data-scs-section]");
  if (!roots.length) return;

  roots.forEach(function(root) {
    if (root.dataset.scsInited === "true") return;
    root.dataset.scsInited = "true";

    // URL-parameter iteration switcher: ?sc=1 through ?sc=10
    var scIter = new URLSearchParams(window.location.search).get("sc");
    if (scIter && /^([1-9]|10)$/.test(scIter)) {
      root.setAttribute("data-sc-iter", scIter.padStart(2, "0"));
    }

    var featureEl = root.querySelector("[data-scs-feature]");
    var cardsEl = root.querySelector("[data-scs-cards]");
    if (!featureEl || !cardsEl) return;
    var isMinimalLandingMode = config.viewMode === "minimal-supply-chain-landing";
    root.classList.toggle("scs--minimalLanding", isMinimalLandingMode);

    var items = [config.featured].concat(config.supports);
    var state = {
      activeSupportId: config.supports[0] ? config.supports[0].id : null
    };

    var modal = createModalController(root, {
      modalSelector: "[data-scs-modal]",
      dialogSelector: "[data-scs-dialog]",
      bodySelector: "[data-scs-modal-body]",
      closeSelector: "[data-scs-close]",
      renderBody: renderSupplyModalBody
    });

    if (isMinimalLandingMode) {
      initSupplyMinimalLanding(root, config.heroArt);
    } else {
      initSupplyHero(root, config.heroArt);
      initSupplyProofDrawer(root, config.proofDrawer);
    }

    function getActiveSupport() {
      return findById(config.supports, state.activeSupportId) || config.supports[0] || null;
    }

    function render() {
      featureEl.innerHTML = renderSupplyFeature(config.featured, getActiveSupport());
      cardsEl.innerHTML = renderSupplySupportCards(config.supports, state.activeSupportId);
    }

    function setActiveSupport(id) {
      if (!id || id === state.activeSupportId) return;
      state.activeSupportId = id;
      render();
    }

    root.addEventListener("mouseover", function(event) {
      var target = event.target.closest("[data-scs-item]");
      if (!target || !root.contains(target)) return;

      var id = target.getAttribute("data-scs-item");
      if (id && id !== config.featured.id) {
        setActiveSupport(id);
      }
    });

    root.addEventListener("focusin", function(event) {
      var target = event.target.closest("[data-scs-item]");
      if (!target || !root.contains(target)) return;

      var id = target.getAttribute("data-scs-item");
      if (id && id !== config.featured.id) {
        setActiveSupport(id);
      }
    });

    root.addEventListener("click", function(event) {
      var trigger = event.target.closest("[data-scs-item]");
      if (!trigger || !root.contains(trigger)) return;

      var id = trigger.getAttribute("data-scs-item");
      var item = findById(items, id);
      if (!item) return;

      if (id && id !== config.featured.id) {
        setActiveSupport(id);
        var rerendered = root.querySelector('[data-scs-item="' + id + '"]');
        modal.open(item, rerendered || trigger);
        return;
      }

      modal.open(item, trigger);
    });

    render();
  });
}

function renderConsultingOffers(offers, activeId) {
  return offers
    .map(function(offer) {
      var deliverables = (offer.deliverables || [])
        .map(function(line) {
          return "<li>" + escapeHtml(line) + "</li>";
        })
        .join("");

      return (
        '<article class="cns-offerCard' + (offer.id === activeId ? " is-active" : "") + '" role="listitem">' +
        '<button class="cns-offerCard__button" type="button" data-cns-offer="' + escapeHtml(offer.id) + '" aria-label="Open ' + escapeHtml(offer.title) + ' details">' +
        '<span class="cns-offerCard__sheen" aria-hidden="true"></span>' +
        '<div class="cns-offerCard__head">' +
        '<div class="cns-offerCard__meta">' +
        '<h5 class="cns-offerCard__title">' + escapeHtml(offer.title) + "</h5>" +
        "</div>" +
        renderBadge(offer.status, "cns-badge") +
        "</div>" +
        '<p class="cns-offerCard__oneLiner">' + escapeHtml(offer.oneLiner) + "</p>" +
        '<div class="cns-offerCard__expand">' +
        '<ul class="cns-offerCard__deliverables">' + deliverables + "</ul>" +
        '<div class="cns-offerCard__tags">' + renderPills(offer.tags, "cns-pill") + "</div>" +
        "</div>" +
        "</button>" +
        "</article>"
      );
    })
    .join("");
}

function renderConsultingProofTiles(proofTiles) {
  return (proofTiles || [])
    .map(function(tile) {
      return (
        '<article class="cns-proofCard">' +
        '<div class="cns-proofCard__title">' + escapeHtml(tile.title) + "</div>" +
        '<div class="cns-proofCard__clientType">' + escapeHtml(tile.clientType) + "</div>" +
        '<div class="cns-proofCard__row"><span>Problem</span><p>' + escapeHtml(tile.problem) + "</p></div>" +
        '<div class="cns-proofCard__row"><span>Approach</span><p>' + escapeHtml(tile.approach) + "</p></div>" +
        '<div class="cns-proofCard__row"><span>Deliverable</span><p>' + escapeHtml(tile.deliverable) + "</p></div>" +
        "</article>"
      );
    })
    .join("");
}

function renderConsultingModalBody(offer) {
  var deliverables = (offer.deliverables || [])
    .map(function(line) {
      return "<li>" + escapeHtml(line) + "</li>";
    })
    .join("");

  var sections = (offer.modalSections || [])
    .map(function(section) {
      return (
        '<div class="cns-modalBody__section">' +
        '<div class="cns-modalBody__sectionLabel">' + escapeHtml(section.label) + "</div>" +
        '<p class="cns-modalBody__sectionText">' + escapeHtml(section.text) + "</p>" +
        "</div>"
      );
    })
    .join("");

  var snapshot = (offer.systemSnapshot || [])
    .map(function(line) {
      return "<li>" + escapeHtml(line) + "</li>";
    })
    .join("");

  return (
    '<div class="cns-modalBody">' +
    '<div class="cns-modalBody__hero">' +
    renderGlyphBlock("cns-modalBody", offer.title, offer.status || "Offer") +
    '<div class="cns-modalBody__heroCopy">' +
    '<div class="cns-modalBody__eyebrow">Consulting offer</div>' +
    '<div class="cns-modalBody__titleRow">' +
    '<h3 class="cns-modalBody__title" id="cns-modal-title">' + escapeHtml(offer.title) + "</h3>" +
    renderBadge(offer.status, "cns-badge") +
    "</div>" +
    '<p class="cns-modalBody__oneLiner" id="cns-modal-desc">' + escapeHtml(offer.oneLiner) + "</p>" +
    '<p class="cns-modalBody__bestFor"><strong>Best for:</strong> ' + escapeHtml(offer.bestFor) + "</p>" +
    "</div>" +
    "</div>" +
    '<div class="cns-modalBody__grid">' +
    '<section class="cns-modalBody__main">' +
    '<h4 class="cns-modalBody__sectionTitle">Deliverables</h4>' +
    '<ul class="cns-modalBody__deliverables">' + deliverables + "</ul>" +
    '<div class="cns-modalBody__tags">' + renderPills(offer.tags, "cns-pill") + "</div>" +
    '<div class="cns-modalBody__pavd">' + sections + "</div>" +
    "</section>" +
    '<aside class="cns-modalBody__aside">' +
    '<div class="cns-modalBody__panel">' +
    '<div class="cns-modalBody__miniLabel">System snapshot</div>' +
    '<ul class="cns-modalBody__list">' + snapshot + "</ul>" +
    "</div>" +
    '<div class="cns-modalBody__panel">' +
    '<div class="cns-modalBody__miniLabel">Engagement shape</div>' +
    '<ul class="cns-modalBody__list">' +
    "<li>No pricing table. Scope first.</li>" +
    "<li>Capability-first framing for recruiters + clients.</li>" +
    "<li>Built to hand off clearly to internal teams.</li>" +
    "</ul>" +
    "</div>" +
    "</aside>" +
    "</div>" +
    "</div>"
  );
}

export function initConsultingSection(config) {
  if (!config || !Array.isArray(config.offers) || !config.offers.length) return;

  var roots = document.querySelectorAll("[data-cns-section]");
  if (!roots.length) return;

  roots.forEach(function(root) {
    if (root.dataset.cnsInited === "true") return;
    root.dataset.cnsInited = "true";

    var offersEl = root.querySelector("[data-cns-offers]");
    var proofListEl = root.querySelector("[data-cns-proof-list]");
    if (!offersEl || !proofListEl) return;

    var state = {
      activeOfferId: config.offers[0].id
    };

    var modal = createModalController(root, {
      modalSelector: "[data-cns-modal]",
      dialogSelector: "[data-cns-dialog]",
      bodySelector: "[data-cns-modal-body]",
      closeSelector: "[data-cns-close]",
      renderBody: renderConsultingModalBody
    });

    function render() {
      offersEl.innerHTML = renderConsultingOffers(config.offers, state.activeOfferId);
      proofListEl.innerHTML = renderConsultingProofTiles(config.proofTiles);
    }

    function setActiveOffer(id) {
      if (!id || id === state.activeOfferId) return;
      state.activeOfferId = id;
      offersEl.innerHTML = renderConsultingOffers(config.offers, state.activeOfferId);
    }

    root.addEventListener("mouseover", function(event) {
      var button = event.target.closest("[data-cns-offer]");
      if (!button || !root.contains(button)) return;
      setActiveOffer(button.getAttribute("data-cns-offer"));
    });

    root.addEventListener("focusin", function(event) {
      var button = event.target.closest("[data-cns-offer]");
      if (!button || !root.contains(button)) return;
      setActiveOffer(button.getAttribute("data-cns-offer"));
    });

    root.addEventListener("click", function(event) {
      var button = event.target.closest("[data-cns-offer]");
      if (!button || !root.contains(button)) return;

      var id = button.getAttribute("data-cns-offer");
      var offer = findById(config.offers, id);
      if (!offer) return;

      if (id !== state.activeOfferId) {
        setActiveOffer(id);
        var rerendered = root.querySelector('[data-cns-offer="' + id + '"]');
        modal.open(offer, rerendered || button);
        return;
      }

      modal.open(offer, button);
    });

    render();
  });
}
