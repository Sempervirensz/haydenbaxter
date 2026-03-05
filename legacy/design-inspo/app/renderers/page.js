function renderNavButtons(navButtons) {
  return navButtons
    .map(function(button) {
      var className = button.variant === "cta" ? "tag tag--cta" : "tag tag--nav";
      return '<button class="' + className + '" type="button">' + button.label + "</button>";
    })
    .join("");
}

function renderHeader(header) {
  return (
    '<div class="wordmark">' +
    header.wordmark +
    '</div><nav class="nav" aria-label="Main navigation">' +
    renderNavButtons(header.navButtons) +
    "</nav>"
  );
}

function renderHero(hero) {
  return (
    '<p class="hero__sub">' +
    hero.sub +
    '</p><h1 class="hero__heading">' +
    hero.heading +
    "</h1>"
  );
}

function buildBrandList(brands) {
  var items = [];
  for (var i = 0; i < brands.repeats; i++) {
    for (var j = 0; j < brands.logos.length; j++) {
      items.push(brands.logos[j]);
    }
  }
  return items;
}

function renderBrands(brands) {
  var logos = buildBrandList(brands)
    .map(function(logo) {
      return '<span class="brands__logo">' + logo + "</span>";
    })
    .join("");

  return (
    '<div class="brands__track">' +
    logos +
    '</div><p class="brands__note">' +
    brands.note +
    "</p>"
  );
}

function renderCards(cards) {
  var cardMarkup = cards
    .map(function(card) {
      return (
        '<div class="card">' +
        '<span class="card__label">' +
        card.label +
        "</span>" +
        '<h3 class="card__title">' +
        card.title +
        "</h3>" +
        "</div>"
      );
    })
    .join("");

  return '<div class="cards__grid">' + cardMarkup + "</div>";
}

function renderSplash(words) {
  return words
    .map(function(word) {
      return '<span class="splash__word">' + word + "</span>";
    })
    .join("");
}

function renderWorkLanding(landing) {
  return (
    '<div class="work__screen work__screen--landing is-active" data-screen="0">' +
    '<h2 class="wl-title">' +
    landing.title +
    "</h2>" +
    '<p class="wl-quote">' +
    landing.quote +
    "</p>" +
    '<div class="scroll-hint" id="scroll-hint">' +
    '<div class="scroll-hint__mouse"></div>' +
    '<span class="scroll-hint__text">' +
    landing.scrollHint +
    "</span>" +
    "</div>" +
    '<div class="cd-slot"><div class="cd-disc" id="cd-disc"></div></div>' +
    '<div class="cd-active-label" id="cd-active-label">' +
    landing.activeLabel +
    "</div>" +
    "</div>"
  );
}

function renderDetailHeader(screen) {
  var titleMarkup;
  if (screen.logo) {
    titleMarkup =
      '<img src="' +
      screen.logo.src +
      '" alt="' +
      screen.logo.alt +
      '" class="detail-logo">';
  } else {
    titleMarkup = screen.name;
  }

  return (
    '<div class="work__detail-head">' +
    '<span class="work__detail-num">' +
    screen.number +
    "</span>" +
    '<h3 class="work__detail-name">' +
    titleMarkup +
    "</h3>" +
    '<span class="work__detail-line"></span>' +
    "</div>"
  );
}

function renderFeaturedStats(stats) {
  return stats
    .map(function(stat) {
      var label = stat.label ? " " + stat.label : "";
      return '<span class="pd-s"><strong>' + stat.value + "</strong>" + label + "</span>";
    })
    .join("");
}

function renderSideCards(sideCards) {
  return sideCards
    .map(function(card) {
      var tags = card.tags
        .map(function(tag) {
          return '<span class="pd-sc__t">' + tag + "</span>";
        })
        .join("");

      return (
        '<div class="pd-sc">' +
        '<div class="pd-sc__title">' +
        card.title +
        "</div>" +
        '<div class="pd-sc__desc">' +
        card.description +
        "</div>" +
        '<div class="pd-sc__tags">' +
        tags +
        "</div>" +
        "</div>"
      );
    })
    .join("");
}

function renderGridDetail(screen) {
  var feat = screen.featured;
  return (
    '<div class="pd-grid">' +
    '<div class="pd-feat">' +
    '<div class="pd-img">' +
    feat.imageLabel +
    "</div>" +
    '<div class="pd-tag">' +
    feat.tag +
    "</div>" +
    '<div class="pd-title">' +
    feat.title +
    "</div>" +
    '<div class="pd-desc">' +
    feat.description +
    "</div>" +
    '<div class="pd-stats">' +
    renderFeaturedStats(feat.stats) +
    "</div>" +
    "</div>" +
    '<div class="pd-side">' +
    renderSideCards(screen.sideCards) +
    "</div>" +
    "</div>"
  );
}

function renderFullDetail(screen) {
  var full = screen.full;
  return (
    '<div class="pd-full">' +
    '<div class="pd-full__img"><img src="' +
    full.image.src +
    '" alt="' +
    full.image.alt +
    '"></div>' +
    '<div class="pd-full__bar">' +
    '<div class="pd-full__info">' +
    '<span class="pd-full__role">' +
    full.role +
    "</span>" +
    '<span class="pd-full__caption">' +
    full.caption +
    "</span>" +
    "</div>" +
    '<a href="' +
    full.link.href +
    '" class="pd-full__link" target="_blank" rel="noopener noreferrer">' +
    full.link.label +
    "</a>" +
    "</div>" +
    "</div>"
  );
}

function renderEmergingTechBuilds(screen) {
  var etb = screen.etb;

  return (
    '<section class="etb" data-etb-section>' +
    '<div class="etb-topStrip">' +
    '<h4 class="etb-topStrip__title">' + etb.title + "</h4>" +
    '<span class="etb-topStrip__cred">' + etb.credibilityLine + "</span>" +
    "</div>" +
    '<div class="etb-barStack" data-etb-bars role="list" aria-label="Projects"></div>' +
    '<div class="etb-modal" data-etb-modal hidden>' +
    '<button class="etb-modal__backdrop" type="button" data-etb-close tabindex="-1" aria-label="Close project details"></button>' +
    '<div class="etb-modal__dialog" data-etb-dialog role="dialog" aria-modal="true" aria-labelledby="etb-modal-title" aria-describedby="etb-modal-desc" tabindex="-1">' +
    '<div class="etb-modal__frame">' +
    '<div class="etb-modal__topbar">' +
    '<div class="etb-modal__eyebrow">Project detail</div>' +
    '<button class="etb-modal__close" type="button" data-etb-close aria-label="Close dialog">Close</button>' +
    "</div>" +
    '<div class="etb-modal__body" data-etb-modal-body></div>' +
    "</div>" +
    "</div>" +
    "</div>" +
    "</section>"
  );
}

function renderSupplyChainSection(screen) {
  var sc = screen.supplyChain;
  var heroArt = sc.heroArt || {};
  var proofDrawer = sc.proofDrawer || {};

  return (
    '<section class="scs" data-scs-section>' +
    '<div class="scs-minimalLanding" data-scs-minimal-landing aria-label="Supply Chain Pacific map composition">' +
    '<div class="scs-minimalLanding__map" data-scs-minimal-map aria-hidden="true"></div>' +
    '<div class="scs-minimalLanding__overlay scs-minimalLanding__overlay--vignette" aria-hidden="true"></div>' +
    '<div class="scs-minimalLanding__overlay scs-minimalLanding__overlay--edgeFade" aria-hidden="true"></div>' +
    '<div class="scs-minimalLanding__quote" data-scs-minimal-quote></div>' +
    "</div>" +
    '<div class="scs-hero" data-scs-hero>' +
    '<div class="scs-hero__stage" aria-hidden="true">' +
    '<div class="scs-hero__panel scs-hero__panel--east"><div class="scs-hero__map"></div></div>' +
    '<div class="scs-hero__panel scs-hero__panel--west"><div class="scs-hero__map"></div></div>' +
    '<div class="scs-hero__seam"></div>' +
    '<div class="scs-hero__quote-lane"></div>' +
    "</div>" +
    '<div class="scs-hero__quote-wrap">' +
    '<blockquote class="scs-hero__quote" data-scs-hero-quote>' +
    (heroArt.quote || "") +
    "</blockquote>" +
    "</div>" +
    '<div class="scs-hero__assetNote" data-scs-hero-asset-note hidden>Map asset missing. Expected hero assets in /assets.</div>' +
    "</div>" +
    '<section class="scs-proof" data-scs-proof aria-label="Supply chain operating proof details">' +
    '<div class="scs-proof__row">' +
    '<p class="scs-proof__label" id="scs-proof-row-label">' +
    (proofDrawer.promptLabel || "Want the operating proof?") +
    "</p>" +
    '<button type="button" class="scs-proof__btn" data-scs-proof-toggle aria-expanded="false" aria-controls="scs-proof-drawer" aria-describedby="scs-proof-row-label">' +
    (proofDrawer.buttonLabel || "View details") +
    "</button>" +
    "</div>" +
    '<div class="scs-proof__drawer" id="scs-proof-drawer" data-scs-proof-drawer aria-hidden="true">' +
    '<div class="scs-proof__drawerClip">' +
    '<div class="scs-proof__drawerSurface">' +
    '<div class="scs-proof__tabs" data-scs-proof-tabs role="tablist" aria-label="Supply chain proof tabs"></div>' +
    '<div class="scs-proof__panels" data-scs-proof-panels></div>' +
    "</div>" +
    "</div>" +
    "</div>" +
    "</section>" +
    '<div class="scs-head">' +
    '<p class="scs-head__eyebrow">' +
    sc.eyebrow +
    "</p>" +
    '<p class="scs-head__intro">' +
    sc.intro +
    "</p>" +
    '<p class="scs-head__bridge">' +
    sc.bridgeLine +
    "</p>" +
    "</div>" +
    '<div class="scs-layout">' +
    '<div class="scs-featureWrap" data-scs-feature></div>' +
    '<div class="scs-side">' +
    '<ul class="scs-cards" data-scs-cards role="list"></ul>' +
    '<div class="scs-side__note">Design × Domain knowledge × AI × Systems thinking.</div>' +
    "</div>" +
    "</div>" +
    '<div class="scs-modal" data-scs-modal hidden>' +
    '<button class="scs-modal__backdrop" type="button" data-scs-close tabindex="-1" aria-label="Close supply chain detail"></button>' +
    '<div class="scs-modal__dialog" data-scs-dialog role="dialog" aria-modal="true" aria-labelledby="scs-modal-title" aria-describedby="scs-modal-desc" tabindex="-1">' +
    '<div class="scs-modal__frame">' +
    '<div class="scs-modal__topbar">' +
    '<div class="scs-modal__eyebrow">Supply chain detail</div>' +
    '<button class="scs-modal__close" type="button" data-scs-close aria-label="Close dialog">Close</button>' +
    "</div>" +
    '<div class="scs-modal__body" data-scs-modal-body></div>' +
    "</div>" +
    "</div>" +
    "</div>" +
    "</section>"
  );
}

function renderConsultingSection(screen) {
  var consulting = screen.consulting;
  var consultingGlobeSrc = "/experiments/particle-globe-lab/dist/?embed=1&v=20260224-pointer-flow";

  return (
    '<section class="cns" data-cns-section>' +
    '<div class="cns-hero">' +
    '<div class="cns-hero__copy">' +
    '<p class="cns-hero__eyebrow">' +
    consulting.eyebrow +
    "</p>" +
    '<h4 class="cns-hero__title">' +
    consulting.heroTitle +
    "</h4>" +
    '<p class="cns-hero__subtitle">' +
    consulting.heroSubtitle +
    "</p>" +
    '<p class="cns-hero__identity">' +
    consulting.identityLine +
    "</p>" +
    '<p class="cns-hero__founder">' +
    consulting.founderLine +
    "</p>" +
    "</div>" +
    '<div class="cns-hero__orbWrap" aria-label="Interactive particle globe preview">' +
    '<div class="cns-hero__orbShell">' +
    '<div class="cns-hero__orbHalo" aria-hidden="true"></div>' +
    '<iframe class="cns-hero__orbEmbed" src="' +
    consultingGlobeSrc +
    '" title="Interactive monochrome particle globe" loading="eager" scrolling="no" frameborder="0"></iframe>' +
    "</div>" +
    '<p class="cns-hero__orbLabel">Interactive signal field · pointer reactive</p>' +
    "</div>" +
    "</div>" +
    '<div class="cns-layout">' +
    '<div class="cns-offers" data-cns-offers role="list"></div>' +
    '<aside class="cns-proof" aria-labelledby="cns-proof-title">' +
    '<div class="cns-proof__head">' +
    '<h5 class="cns-proof__title" id="cns-proof-title">Proof framing</h5>' +
    '<p class="cns-proof__subtitle">Problem → approach → deliverable (generic client types, no logos).</p>' +
    "</div>" +
    '<div class="cns-proof__list" data-cns-proof-list></div>' +
    "</aside>" +
    "</div>" +
    '<div class="cns-modal" data-cns-modal hidden>' +
    '<button class="cns-modal__backdrop" type="button" data-cns-close tabindex="-1" aria-label="Close consulting detail"></button>' +
    '<div class="cns-modal__dialog" data-cns-dialog role="dialog" aria-modal="true" aria-labelledby="cns-modal-title" aria-describedby="cns-modal-desc" tabindex="-1">' +
    '<div class="cns-modal__frame">' +
    '<div class="cns-modal__topbar">' +
    '<div class="cns-modal__eyebrow">Consulting offer</div>' +
    '<button class="cns-modal__close" type="button" data-cns-close aria-label="Close dialog">Close</button>' +
    "</div>" +
    '<div class="cns-modal__body" data-cns-modal-body></div>' +
    "</div>" +
    "</div>" +
    "</div>" +
    "</section>"
  );
}

function renderWorkDetailScreens(detailScreens) {
  return detailScreens
    .map(function(screen, index) {
      var body;

      if (screen.type === "full") {
        body = renderFullDetail(screen);
      } else if (screen.type === "emerging-tech-builds") {
        body = renderEmergingTechBuilds(screen);
      } else if (screen.type === "supply-chain") {
        body = renderSupplyChainSection(screen);
      } else if (screen.type === "consulting") {
        body = renderConsultingSection(screen);
      } else {
        body = renderGridDetail(screen);
      }

      return (
        '<div class="work__screen work__screen--detail" data-screen="' +
        (index + 1) +
        '">' +
        renderDetailHeader(screen) +
        body +
        "</div>"
      );
    })
    .join("");
}

function renderWork(work) {
  return renderWorkLanding(work.landing) + renderWorkDetailScreens(work.detailScreens);
}

export function renderPage(content) {
  var splash = document.getElementById("splash");
  var header = document.getElementById("header-inner");
  var hero = document.getElementById("hero");
  var brands = document.getElementById("brands");
  var cards = document.getElementById("cards");
  var work = document.getElementById("work-inner");

  if (splash) splash.innerHTML = renderSplash(content.splashWords);
  if (header) header.innerHTML = renderHeader(content.header);
  if (hero) hero.innerHTML = renderHero(content.hero);
  if (brands) brands.innerHTML = renderBrands(content.brands);
  if (cards) cards.innerHTML = renderCards(content.cards);
  if (work) work.innerHTML = renderWork(content.work);
}
