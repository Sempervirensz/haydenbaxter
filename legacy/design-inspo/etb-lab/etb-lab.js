import { SITE_CONTENT } from "../app/data/site-content.js";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getETBConfig() {
  const screen = (SITE_CONTENT.work?.detailScreens || []).find(
    (item) => item.type === "emerging-tech-builds" && item.etb
  );
  return screen?.etb || null;
}

function sortProjects(projects, field = "completenessScore") {
  return [...projects].sort((a, b) => {
    const aVal = typeof a[field] === "number" ? a[field] : 0;
    const bVal = typeof b[field] === "number" ? b[field] : 0;
    if (bVal !== aVal) return bVal - aVal;
    return String(a.name).localeCompare(String(b.name));
  });
}

function renderStatus(status) {
  return `<span class="etbl-status etbl-status--${escapeHtml(slugify(status))}">${escapeHtml(status)}</span>`;
}

function renderTags(tags) {
  return tags.map((tag) => `<span class="etbl-pill">${escapeHtml(tag)}</span>`).join("");
}

function renderBullets(bullets) {
  return bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("");
}

function renderMetaChips(project) {
  return [
    `Bullets ${project.bullets.length}`,
    `Tags ${project.tags.length}`,
    `Complete ${project.completenessScore}%`,
    `Technical ${project.technicalScore}`,
    `Recent ${project.recencyScore}`
  ]
    .map((text) => `<span class="etbl-metaChip">${escapeHtml(text)}</span>`)
    .join("");
}

function renderBar(project, index, expandedId, variantId) {
  const isExpanded = expandedId === project.id;
  const panelId = `etbl-${slugify(variantId)}-${slugify(project.id)}-panel`;
  return `
    <div class="etbl-bar${isExpanded ? " is-expanded" : ""}" data-project-id="${escapeHtml(project.id)}" role="listitem">
      <button
        class="etbl-bar__head"
        type="button"
        aria-expanded="${isExpanded ? "true" : "false"}"
        aria-controls="${escapeHtml(panelId)}"
        data-toggle-project="${escapeHtml(project.id)}"
      >
        <span class="etbl-bar__gloss" aria-hidden="true"></span>
        <span class="etbl-bar__index">${String(index + 1).padStart(2, "0")}</span>
        <span class="etbl-bar__main">
          <span class="etbl-bar__name">${escapeHtml(project.name)}</span>
          <span class="etbl-bar__support">
            <span class="etbl-bar__category">${escapeHtml(project.category)}</span>
            <span class="etbl-bar__dot" aria-hidden="true">•</span>
            <span class="etbl-bar__summary">${escapeHtml(project.oneLiner)}</span>
          </span>
        </span>
        <span class="etbl-bar__rail">
          ${renderStatus(project.status)}
          <span class="etbl-bar__counts">${escapeHtml(`${project.bullets.length} bullets / ${project.tags.length} tags`)}</span>
          <span class="etbl-bar__chevron" aria-hidden="true">›</span>
        </span>
      </button>
      <div
        class="etbl-bar__body"
        id="${escapeHtml(panelId)}"
        role="region"
        aria-hidden="${isExpanded ? "false" : "true"}"
        aria-label="${escapeHtml(project.name + " details")}" 
      >
        <div class="etbl-bar__bodyGrid">
          <div class="etbl-bar__copy">
            <p class="etbl-bar__desc">${escapeHtml(project.oneLiner)}</p>
            <ul class="etbl-bar__bullets">${renderBullets(project.bullets)}</ul>
          </div>
          <div class="etbl-bar__metaCol">
            <div class="etbl-bar__tags">${renderTags(project.tags)}</div>
            <div class="etbl-bar__metaChips">${renderMetaChips(project)}</div>
            <button class="etbl-bar__cta" type="button" data-open-detail="${escapeHtml(project.id)}">Open Detail →</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderVariantFrame(etb, projects, variant) {
  const expandedId = variant.defaultExpandedId || etb.defaultSelectedId || projects[0]?.id;
  const bars = projects.map((project, index) => renderBar(project, index, expandedId, variant.id)).join("");

  return `
    <article class="etbl-iter">
      <div class="etbl-iter__header">
        <div class="etbl-iter__label">${escapeHtml(variant.label)}</div>
        <h2 class="etbl-iter__title">${escapeHtml(variant.title)}</h2>
      </div>
      <div class="etbl-iter__frameWrap">
        <div class="etbl-frame">
          <div class="etbl-frame__topbar" aria-hidden="true">
            <span class="etbl-frame__dot"></span><span class="etbl-frame__dot"></span><span class="etbl-frame__dot"></span>
            <span class="etbl-frame__meta">ETB Section Preview · 100vh mock</span>
          </div>
          <section class="etbl-preview ${escapeHtml(variant.className)}" data-variant-id="${escapeHtml(variant.id)}" data-expanded-id="${escapeHtml(expandedId)}">
            <div class="etbl-preview__noise" aria-hidden="true"></div>
            <div class="etbl-preview__header">
              <div class="etbl-preview__strip">
                <h3 class="etbl-preview__sectionTitle">${escapeHtml(etb.title)}</h3>
                <span class="etbl-preview__cred">${escapeHtml(etb.credibilityLine)}</span>
              </div>
              <p class="etbl-preview__intro">${escapeHtml(etb.intro)}</p>
            </div>
            <div class="etbl-bars" role="list" aria-label="Projects">
              ${bars}
            </div>
          </section>
        </div>
      </div>
      <p class="etbl-iter__note">${escapeHtml(variant.note)}</p>
    </article>
  `;
}

function renderModal() {
  return `
    <div class="etbl-modal" data-etbl-modal hidden>
      <button class="etbl-modal__backdrop" type="button" data-etbl-close aria-label="Close detail"></button>
      <div class="etbl-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="etbl-modal-title" aria-describedby="etbl-modal-desc" tabindex="-1">
        <div class="etbl-modal__frame">
          <div class="etbl-modal__top">
            <div class="etbl-modal__eyebrow">Project detail</div>
            <button class="etbl-modal__close" type="button" data-etbl-close>Close</button>
          </div>
          <div class="etbl-modal__body" data-etbl-modal-body></div>
        </div>
      </div>
    </div>
  `;
}

function renderModalBody(project) {
  return `
    <div class="etbl-modalBody">
      <div class="etbl-modalBody__hero">
        <div>
          <p class="etbl-modalBody__category">${escapeHtml(project.category)}</p>
          <h3 class="etbl-modalBody__title" id="etbl-modal-title">${escapeHtml(project.name)}</h3>
        </div>
        ${renderStatus(project.status)}
      </div>
      <p class="etbl-modalBody__desc" id="etbl-modal-desc">${escapeHtml(project.oneLiner)}</p>
      <div class="etbl-modalBody__grid">
        <div class="etbl-modalBody__panel">
          <div class="etbl-modalBody__label">Bullets</div>
          <ul class="etbl-modalBody__list">${renderBullets(project.bullets)}</ul>
        </div>
        <div class="etbl-modalBody__panel">
          <div class="etbl-modalBody__label">Tags</div>
          <div class="etbl-modalBody__tags">${renderTags(project.tags)}</div>
          <div class="etbl-modalBody__label etbl-modalBody__label--spaced">Metadata / Counts</div>
          <div class="etbl-modalBody__metaChips">${renderMetaChips(project)}</div>
        </div>
      </div>
      <div class="etbl-modalBody__actions">
        <button class="etbl-bar__cta etbl-bar__cta--modal" type="button" data-etbl-close>Open Detail →</button>
      </div>
    </div>
  `;
}

const ITERATIONS = [
  {
    id: "01",
    label: "Iteration 01",
    title: "Classic iPod Select Row",
    className: "etbl-v01",
    note: "Balanced hybrid: bright white candy bars, full cobalt selection row, crisp mono micro-accents, restrained gloss."
  },
  {
    id: "02",
    label: "Iteration 02",
    title: "Icy Chrome Bevel",
    className: "etbl-v02",
    note: "Cooler blue + stronger edge bevel. Feels more hardware-polished, with a faint chrome lip and icy active highlight."
  },
  {
    id: "03",
    label: "Iteration 03",
    title: "Deep Cobalt Plate",
    className: "etbl-v03",
    note: "Darker, richer active blue with heavier inner shadow and a denser tactile plate feel. More premium than playful."
  },
  {
    id: "04",
    label: "Iteration 04",
    title: "Partial Blue Sweep",
    className: "etbl-v04",
    note: "Active state fills most (not all) of the row with a left-to-right blue sweep, preserving a retro chrome tail."
  },
  {
    id: "05",
    label: "Iteration 05",
    title: "iTunes List Energy",
    className: "etbl-v05",
    note: "Cleaner list-row behavior with strong type scale and flatter blue selection. Keeps the retro shell via soft white depth."
  },
  {
    id: "06",
    label: "Iteration 06",
    title: "Neo Console Blueplate",
    className: "etbl-v06",
    note: "More retro-forward accents: hairlines, blue glow seams, and a segmented active fill while maintaining iPod row readability."
  }
];

function renderSummary() {
  return `
    <section class="etbl-summary" aria-labelledby="etbl-summary-title">
      <h2 class="etbl-summary__title" id="etbl-summary-title">Comparison Summary</h2>
      <div class="etbl-summary__grid">
        <div class="etbl-summary__card">
          <h3>Strongest 3</h3>
          <ul>
            <li><strong>Iteration 01</strong> · strongest overall balance of iPod-row clarity + retro-futuristic polish.</li>
            <li><strong>Iteration 03</strong> · best premium depth / hardware tactility for a darker, more serious direction.</li>
            <li><strong>Iteration 05</strong> · best typography-first readability and scan speed for the project list.</li>
          </ul>
        </div>
        <div class="etbl-summary__card">
          <h3>What Each Does Best</h3>
          <ul>
            <li><strong>01</strong> keeps the clearest hybrid vibe (retro-forward + iPod selection behavior).</li>
            <li><strong>03</strong> emphasizes dimensionality and cobalt richness without clutter.</li>
            <li><strong>05</strong> makes project names feel dominant and editorial while staying clean.</li>
          </ul>
        </div>
        <div class="etbl-summary__card">
          <h3>Recommended Final Direction</h3>
          <p>Start from <strong>Iteration 01</strong>, borrow the deeper plate depth from <strong>Iteration 03</strong>, and keep the type scale/readability discipline from <strong>Iteration 05</strong>.</p>
        </div>
      </div>
      <p class="etbl-summary__confirm">Content preservation check: all project names, categories, statuses, descriptions, bullets, tags, metadata/counts, and the <strong>Open Detail →</strong> action text are rendered from the existing ETB data source.</p>
    </section>
  `;
}

function renderPage(etb, projects) {
  const gallery = ITERATIONS.map((variant) => renderVariantFrame(etb, projects, variant)).join("");
  return `
    <main class="etblab-page">
      <header class="etblab-page__hero">
        <p class="etblab-page__eyebrow">Exploration Mode</p>
        <h1 class="etblab-page__title">Emerging Tech Builds · 6 Visual Iterations</h1>
        <p class="etblab-page__copy">Same ETB project content. Six visual/interaction directions exploring a retro-forward + iPod-era blue selection-row hybrid.</p>
      </header>
      <section class="etblab-gallery" aria-label="ETB design iterations">
        ${gallery}
      </section>
      ${renderSummary()}
      ${renderModal()}
    </main>
  `;
}

function setExpandedInVariant(variantEl, projectId) {
  if (!variantEl || !projectId) return;
  variantEl.dataset.expandedId = projectId;
  const bars = variantEl.querySelectorAll(".etbl-bar");
  bars.forEach((bar) => {
    const isExpanded = bar.getAttribute("data-project-id") === projectId;
    bar.classList.toggle("is-expanded", isExpanded);
    const head = bar.querySelector(".etbl-bar__head");
    const body = bar.querySelector(".etbl-bar__body");
    if (head) head.setAttribute("aria-expanded", isExpanded ? "true" : "false");
    if (body) body.setAttribute("aria-hidden", isExpanded ? "false" : "true");
  });
}

function createModalController(projectsById) {
  const modal = document.querySelector("[data-etbl-modal]");
  const body = modal?.querySelector("[data-etbl-modal-body]");
  const dialog = modal?.querySelector(".etbl-modal__dialog");
  let lastFocus = null;

  function open(projectId, trigger) {
    const project = projectsById.get(projectId);
    if (!project || !modal || !body || !dialog) return;
    lastFocus = trigger || document.activeElement;
    body.innerHTML = renderModalBody(project);
    modal.hidden = false;
    requestAnimationFrame(() => {
      modal.classList.add("is-open");
      dialog.focus();
    });
    document.body.classList.add("etbl-modal-open");
  }

  function close() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.hidden = true;
    document.body.classList.remove("etbl-modal-open");
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  document.addEventListener("click", (event) => {
    const closeBtn = event.target.closest("[data-etbl-close]");
    if (closeBtn) {
      close();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal && !modal.hidden) {
      close();
    }
  });

  return { open, close };
}

function init() {
  const etb = getETBConfig();
  if (!etb || !Array.isArray(etb.projects) || !etb.projects.length) {
    document.getElementById("app").innerHTML = `<main class="etblab-page"><p>ETB data not found.</p></main>`;
    return;
  }

  const projects = sortProjects(etb.projects, "completenessScore");
  const projectsById = new Map(projects.map((project) => [project.id, project]));
  const app = document.getElementById("app");
  app.innerHTML = renderPage(etb, projects);

  const modal = createModalController(projectsById);

  app.addEventListener("click", (event) => {
    const toggleBtn = event.target.closest("[data-toggle-project]");
    if (toggleBtn) {
      const variantEl = toggleBtn.closest("[data-variant-id]");
      const projectId = toggleBtn.getAttribute("data-toggle-project");
      const currentId = variantEl?.dataset.expandedId;
      if (!variantEl || !projectId) return;
      const nextId = currentId === projectId ? projectId : projectId;
      setExpandedInVariant(variantEl, nextId);
      return;
    }

    const cta = event.target.closest("[data-open-detail]");
    if (cta) {
      const projectId = cta.getAttribute("data-open-detail");
      modal.open(projectId, cta);
    }
  });
}

init();
