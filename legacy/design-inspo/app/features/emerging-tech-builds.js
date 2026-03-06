/* ═══════════════════════════════════════════════════════════
   Emerging Tech Builds – Floating retro candy-bar accordion
   ALL original project data, graduate work content, and
   modal detail are preserved. Visual/layout redesign only.
   ═══════════════════════════════════════════════════════════ */

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

function getInitials(name) {
  var parts = String(name).match(/[A-Z][a-z]+|[A-Z]+(?![a-z])|[a-z]+|\d+/g) || [String(name)];
  return parts.slice(0, 2).map(function(p) { return p.charAt(0).toUpperCase(); }).join("");
}

function getBriefSummary(project) {
  var text = String((project && project.oneLiner) || "").trim().replace(/\s+/g, " ");
  if (!text) return "";

  var cleaned = text.replace(/[.!?]\s*$/, "");
  var parts = cleaned.split(/[:;,]/);
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i].trim();
    if (part && part.length >= 14 && part.length <= 52) return part;
  }

  if (parts[0] && parts[0].trim()) return parts[0].trim();

  var words = cleaned.split(" ").slice(0, 6).join(" ");
  return words;
}

function getInlineMeta(project) {
  var bulletsCount = Array.isArray(project && project.bullets) ? project.bullets.length : 0;
  var tagsCount = Array.isArray(project && project.tags) ? project.tags.length : 0;
  return bulletsCount + " bullets / " + tagsCount + " tags";
}

/* ── System snapshot per category (preserved) ── */
function getSystemSnapshot(project) {
  var common = [
    "UX loop tuned for fast iteration + readable outputs",
    "State and decisions shaped for repeatable handoff"
  ];
  if (project.category === "Agents") {
    return ["Planner loop: input -> plan -> action -> review","Routing layer selects task path by context + intent","Evaluation checks gate low-confidence outputs",common[0]];
  }
  if (project.category === "NLP/Privacy") {
    return ["Document pipeline optimized for long-context ingestion","Structured output templates keep chronology consistent","Privacy controls applied before downstream summarization",common[1]];
  }
  if (project.category === "Voice/Video") {
    return ["Speech input -> parse -> scripted sequence generation","Prompt-to-scene mapping favors predictable narration flow","Tooling layer supports fast revisions for demos",common[0]];
  }
  if (project.category === "Supply Chain Apps") {
    return ["Workflow states modeled around sourcing decision stages","Data model supports supplier scoring + documentation trails","UI favors operational clarity over feature sprawl",common[1]];
  }
  return ["Reusable workflow templates for research/build/test loops","Tool-calling guardrails reduce drift across repeated tasks","Fast iteration path with reliability checks in-line",common[0]];
}

function renderStatusChip(status, extraClass) {
  var slug = slugify(status);
  return '<span class="etb-status etb-status--' + slug + (extraClass ? " " + extraClass : "") + '">' + escapeHtml(status) + "</span>";
}

function renderTagRow(tags, className) {
  return tags.map(function(tag) { return '<span class="' + className + '">' + escapeHtml(tag) + "</span>"; }).join("");
}

function renderMedia(project, variant) {
  var initials = getInitials(project.name);
  var alt = project.name + " screenshot";
  return (
    '<div class="etb-media etb-media--' + variant + '" data-etb-media>' +
    '<img class="etb-media__img" src="' + escapeHtml(project.screenshot) + '" alt="' + escapeHtml(alt) + '" loading="lazy">' +
    '<div class="etb-media__fallback" aria-hidden="true"><span class="etb-media__fallback-badge">' + escapeHtml(initials) + '</span><div class="etb-media__fallback-title">' + escapeHtml(project.name) + "</div></div>" +
    '<div class="etb-media__fx" aria-hidden="true"></div></div>'
  );
}

function attachMediaFallbacks(scope) {
  if (!scope) return;
  scope.querySelectorAll("[data-etb-media]").forEach(function(m) {
    var img = m.querySelector(".etb-media__img");
    if (!img) return;
    function ok() { m.classList.add("is-loaded"); m.classList.remove("is-broken"); }
    function fail() { m.classList.add("is-broken"); m.classList.remove("is-loaded"); }
    img.addEventListener("load", ok, { once: true });
    img.addEventListener("error", fail, { once: true });
    if (img.complete) { img.naturalWidth > 0 ? ok() : fail(); }
  });
}

/* ── Reusable inline accordion pieces ── */
function ExpandedBarContent(project) {
  var visibleBullets = Array.isArray(project.bullets) ? project.bullets.slice(0, 4) : [];
  var hiddenCount = Math.max(0, (project.bullets || []).length - visibleBullets.length);
  var bullets = visibleBullets.map(function(b) { return "<li>" + escapeHtml(b) + "</li>"; }).join("");
  var panelId = "etb-panel-" + slugify(project.id || project.name || "project");

  if (hiddenCount > 0) {
    bullets += '<li class="etb-bar__bulletsMore">+' + hiddenCount + " more in full detail</li>";
  }

  return (
    '<div class="etb-bar__body" id="' + escapeHtml(panelId) + '" role="region" aria-hidden="true" aria-label="' + escapeHtml(project.name + " details") + '">' +
    '<div class="etb-bar__bodyInner">' +
    '<div class="etb-bar__copy">' +
    '<p class="etb-bar__desc">' + escapeHtml(project.oneLiner) + "</p>" +
    '<ul class="etb-bar__bullets">' + bullets + "</ul>" +
    "</div>" +
    '<div class="etb-bar__side">' +
    '<div class="etb-bar__tags">' + renderTagRow(project.tags, "etb-pill") + "</div>" +
    '<div class="etb-bar__dataMeta">' +
    '<span class="etb-bar__dataMetaItem">Bullets ' + String((project.bullets || []).length) + "</span>" +
    '<span class="etb-bar__dataMetaItem">Tags ' + String((project.tags || []).length) + "</span>" +
    '<span class="etb-bar__dataMetaItem">Complete ' + String(typeof project.completenessScore === "number" ? project.completenessScore : 0) + "%</span>" +
    "</div>" +
    '<button class="etb-bar__cta" type="button" data-etb-open="' + escapeHtml(project.id) + '">Open Detail &#x2192;</button>' +
    "</div>" +
    "</div></div>"
  );
}

function ProjectBar(project, index) {
  var projectId = escapeHtml(project.id);
  var panelId = "etb-panel-" + slugify(project.id || project.name || "project");
  var summary = getBriefSummary(project);

  return (
    '<div class="etb-bar" data-etb-bar="' + projectId + '" role="listitem" style="--bar-i:' + index + '">' +
    '<button class="etb-bar__head" type="button" aria-expanded="false" aria-label="' + escapeHtml(project.name) + '" aria-controls="' + escapeHtml(panelId) + '">' +
    '<span class="etb-bar__sheen" aria-hidden="true"></span>' +
    '<div class="etb-bar__content">' +
    '<span class="etb-bar__name">' + escapeHtml(project.name) + "</span>" +
    '<span class="etb-bar__summary">' + escapeHtml(summary || project.oneLiner || "") + "</span>" +
    "</div>" +
    '<span class="etb-bar__chevron" aria-hidden="true">›</span>' +
    "</button>" +
    ExpandedBarContent(project) +
    "</div>"
  );
}

/* ── Bar list ── */
function renderBars(projects) {
  return projects.map(function(project, index) {
    return ProjectBar(project, index);
  }).join("");
}

/* ── Modal body (preserved) ── */
function renderModalBody(project) {
  if (!project) return "";
  var bullets = project.bullets.map(function(b) { return "<li>" + escapeHtml(b) + "</li>"; }).join("");
  var snapshot = getSystemSnapshot(project).map(function(l) { return "<li>" + escapeHtml(l) + "</li>"; }).join("");

  return (
    '<div class="etb-modal__hero">' + renderMedia(project, "modal") + "</div>" +
    '<div class="etb-modal__layout">' +
    '<section class="etb-modal__main">' +
    '<div class="etb-modal__titleRow"><h3 class="etb-modal__title" id="etb-modal-title">' + escapeHtml(project.name) + "</h3>" + renderStatusChip(project.status) + "</div>" +
    '<p class="etb-modal__category">' + escapeHtml(project.category) + "</p>" +
    '<p class="etb-modal__oneLiner" id="etb-modal-desc">' + escapeHtml(project.oneLiner) + "</p>" +
    '<ul class="etb-modal__bullets">' + bullets + "</ul>" +
    '<div class="etb-modal__tags">' + renderTagRow(project.tags, "etb-pill etb-pill--preview") + "</div>" +
    "</section>" +
    '<aside class="etb-modal__aside"><div class="etb-modal__snapshot">' +
    '<h4 class="etb-modal__snapshotTitle">System Snapshot</h4>' +
    '<ul class="etb-modal__snapshotList">' + snapshot + "</ul>" +
    "</div></aside></div>"
  );
}

function sortProjects(projects, field) {
  return projects.slice().sort(function(a, b) {
    var aV = typeof a[field] === "number" ? a[field] : 0;
    var bV = typeof b[field] === "number" ? b[field] : 0;
    if (bV !== aV) return bV - aV;
    return a.name.localeCompare(b.name);
  });
}

function findProjectById(projects, id) {
  for (var i = 0; i < projects.length; i++) { if (projects[i].id === id) return projects[i]; }
  return null;
}

/* ═══════════════════════════════════════
   Mount
   ═══════════════════════════════════════ */

export function initEmergingTechBuilds(config) {
  if (!config || !Array.isArray(config.projects) || !config.projects.length) return;
  document.querySelectorAll("[data-etb-section]").forEach(function(root) {
    mountETB(root, config);
  });
}

function mountETB(root, config) {
  var barsEl = root.querySelector("[data-etb-bars]");
  var modalEl = root.querySelector("[data-etb-modal]");
  var modalDialog = root.querySelector("[data-etb-dialog]");
  var modalBody = root.querySelector("[data-etb-modal-body]");
  var screenEl = root.closest(".work__screen--detail");

  if (!barsEl || !modalEl || !modalDialog || !modalBody) return;

  /* ── Detail Panel Setup ── */
  var detailPanel = createDetailPanel();
  root.appendChild(detailPanel);
  var detailPanelEl = root.querySelector("[data-etb-detail-panel]");
  var detailPanelBody = root.querySelector("[data-etb-detail-panel-body]");
  var detailPanelClose = root.querySelector("[data-etb-detail-close]");

  var expandedId = null;
  var openDetailId = null;
  var lastFocusedElement = null;
  var bodyOverflowBefore = "";
  var screenOverflowBefore = "";

  /* ── Render bars ── */
  var sorted = sortProjects(config.projects, "completenessScore");
  barsEl.innerHTML = renderBars(sorted);

  /* ── Accordion toggle ── */
  function collapseAll() {
    var allBars = barsEl.querySelectorAll("[data-etb-bar]");
    for (var i = 0; i < allBars.length; i++) {
      allBars[i].classList.remove("is-expanded");
      var head = allBars[i].querySelector(".etb-bar__head");
      var body = allBars[i].querySelector(".etb-bar__body");
      if (head) head.setAttribute("aria-expanded", "false");
      if (body) body.setAttribute("aria-hidden", "true");
    }
    barsEl.classList.remove("has-expanded");
    expandedId = null;
  }

  function expandBar(projectId) {
    collapseAll();
    var bar = barsEl.querySelector('[data-etb-bar="' + projectId + '"]');
    if (!bar) return;
    bar.classList.add("is-expanded");
    var head = bar.querySelector(".etb-bar__head");
    var body = bar.querySelector(".etb-bar__body");
    if (head) head.setAttribute("aria-expanded", "true");
    if (body) body.setAttribute("aria-hidden", "false");
    barsEl.classList.add("has-expanded");
    expandedId = projectId;
  }

  function toggleBar(projectId) {
    if (expandedId === projectId) {
      collapseAll();
    } else {
      expandBar(projectId);
    }
  }

  /* ── Hover: highlight bar (no expand) ── */
  barsEl.addEventListener("mouseover", function(e) {
    var bar = e.target.closest("[data-etb-bar]");
    if (!bar) return;
    // Add hover class for glow effect
    var all = barsEl.querySelectorAll("[data-etb-bar]");
    for (var i = 0; i < all.length; i++) { all[i].classList.remove("is-hovered"); }
    bar.classList.add("is-hovered");
    barsEl.classList.add("has-hover");
  });

  barsEl.addEventListener("mouseleave", function() {
    var all = barsEl.querySelectorAll("[data-etb-bar]");
    for (var i = 0; i < all.length; i++) { all[i].classList.remove("is-hovered"); }
    barsEl.classList.remove("has-hover");
  });

  /* ── Click: entire bar opens detail panel (no accordion) ── */
  barsEl.addEventListener("click", function(e) {
    // CTA button inside expanded body → open modal
    var cta = e.target.closest("[data-etb-open]");
    if (cta) {
      e.stopPropagation();
      openModal(cta.getAttribute("data-etb-open"), cta);
      return;
    }
    // Bar head → open detail panel
    var head = e.target.closest(".etb-bar__head");
    if (head) {
      var bar = head.closest("[data-etb-bar]");
      if (bar) {
        var projectId = bar.getAttribute("data-etb-bar");
        if (openDetailId === projectId) {
          closeDetailPanel();
        } else {
          openDetailPanel(projectId);
        }
      }
    }
  });

  /* ── Keyboard: focus mirrors hover, enter/space toggles ── */
  barsEl.addEventListener("focusin", function(e) {
    var bar = e.target.closest("[data-etb-bar]");
    if (!bar) return;
    var all = barsEl.querySelectorAll("[data-etb-bar]");
    for (var i = 0; i < all.length; i++) { all[i].classList.remove("is-hovered"); }
    bar.classList.add("is-hovered");
    barsEl.classList.add("has-hover");
  });

  barsEl.addEventListener("focusout", function(e) {
    if (!barsEl.contains(e.relatedTarget)) {
      var all = barsEl.querySelectorAll("[data-etb-bar]");
      for (var i = 0; i < all.length; i++) { all[i].classList.remove("is-hovered"); }
      barsEl.classList.remove("has-hover");
    }
  });

  /* ── Detail Panel ── */
  function openDetailPanel(projectId) {
    var project = findProjectById(config.projects, projectId);
    if (!project) return;
    detailPanelBody.innerHTML = renderDetailPanelContent(project);
    attachMediaFallbacks(detailPanelBody);
    detailPanelEl.classList.add("is-open");
    openDetailId = projectId;

    /* Highlight active bar */
    var allBars = barsEl.querySelectorAll("[data-etb-bar]");
    for (var i = 0; i < allBars.length; i++) {
      allBars[i].classList.toggle("is-active", allBars[i].getAttribute("data-etb-bar") === projectId);
    }
  }

  function closeDetailPanel() {
    if (!detailPanelEl.classList.contains("is-open")) return;
    detailPanelEl.classList.remove("is-open");
    openDetailId = null;

    /* Remove active highlight */
    var allBars = barsEl.querySelectorAll("[data-etb-bar]");
    for (var i = 0; i < allBars.length; i++) {
      allBars[i].classList.remove("is-active");
    }
  }

  /* ── Modal ── */
  function isModalOpen() { return !modalEl.hidden; }

  function openModal(projectId, trigger) {
    var project = findProjectById(config.projects, projectId);
    if (!project) return;
    modalBody.innerHTML = renderModalBody(project);
    attachMediaFallbacks(modalBody);
    lastFocusedElement = trigger || document.activeElement;
    bodyOverflowBefore = document.body.style.overflow || "";
    document.body.style.overflow = "hidden";
    if (screenEl) { screenOverflowBefore = screenEl.style.overflow || ""; screenEl.style.overflow = "hidden"; }
    modalEl.hidden = false;
    requestAnimationFrame(function() { modalEl.classList.add("is-open"); modalDialog.focus(); });
  }

  function closeModal() {
    if (!isModalOpen()) return;
    modalEl.classList.remove("is-open");
    modalEl.hidden = true;
    document.body.style.overflow = bodyOverflowBefore;
    if (screenEl) screenEl.style.overflow = screenOverflowBefore;
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function" && document.contains(lastFocusedElement)) lastFocusedElement.focus();
  }

  root.addEventListener("click", function(e) {
    var cl = e.target.closest("[data-etb-close]");
    if (cl && root.contains(cl)) closeModal();
  });

  modalDialog.addEventListener("click", function(e) { e.stopPropagation(); });

  /* ── Detail panel close button ── */
  if (detailPanelClose) {
    detailPanelClose.addEventListener("click", function() {
      closeDetailPanel();
    });
  }

  /* ── Keyboard: Escape closes detail panel or modal ── */
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      if (detailPanelEl.classList.contains("is-open")) {
        e.preventDefault();
        closeDetailPanel();
      } else if (isModalOpen()) {
        e.preventDefault();
        closeModal();
      }
    }
  });

  /* ── Iteration Switcher ── */
  mountIterationSwitcher(root);
}

/* ═══════════════════════════════════════
   Iteration Switcher – floating pill bar
   ═══════════════════════════════════════ */
var ITERATIONS = [
  { id: "01", label: "Cobalt" },
  { id: "02", label: "Icy Rim" },
  { id: "03", label: "M-Glass" },
  { id: "04", label: "Chrome" },
  { id: "05", label: "Halo" },
  { id: "06", label: "Indigo" }
];

function mountIterationSwitcher(root) {
  /* Lock to Cobalt Select (01) */
  root.setAttribute("data-etb-iter", "01");
}

/* ═══════════════════════════════════════
   Detail Panel – split-screen right panel
   ═══════════════════════════════════════ */
function renderDetailPanelContent(project) {
  if (!project) return "";
  var allBullets = (project.bullets || []).map(function(b) { return "<li>" + escapeHtml(b) + "</li>"; }).join("");
  var snapshot = getSystemSnapshot(project).map(function(l) { return "<li>" + escapeHtml(l) + "</li>"; }).join("");

  return (
    '<div class="etb-detail__project">' +
    '<h3 class="etb-detail__name">' + escapeHtml(project.name) + '</h3>' +
    '<p class="etb-detail__category">' + escapeHtml(project.category) + '</p>' +
    renderStatusChip(project.status) +
    '<p class="etb-detail__desc">' + escapeHtml(project.oneLiner) + '</p>' +
    '<ul class="etb-detail__bullets">' + allBullets + '</ul>' +
    '<div class="etb-detail__tags">' + renderTagRow(project.tags, "etb-pill etb-pill--detail") + '</div>' +
    '<div class="etb-detail__snapshot">' +
    '<h4 class="etb-detail__snapshotTitle">System Snapshot</h4>' +
    '<ul class="etb-detail__snapshotList">' + snapshot + '</ul>' +
    '</div>' +
    '</div>'
  );
}

function createDetailPanel() {
  var panel = document.createElement("div");
  panel.className = "etb-detail-panel";
  panel.setAttribute("data-etb-detail-panel", "");
  panel.innerHTML = (
    '<div class="etb-detail-panel__header">' +
    '<button class="etb-detail-panel__close" type="button" data-etb-detail-close aria-label="Close">×</button>' +
    '</div>' +
    '<div class="etb-detail-panel__body" data-etb-detail-panel-body></div>'
  );
  return panel;
}
