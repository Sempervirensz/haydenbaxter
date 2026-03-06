/**
 * Card Deck — scroll-driven "unbunch" + click-to-flip
 *
 * Architecture:
 *   ONE passive scroll listener (RAF-throttled)
 *   ONE delegated click handler on [data-deck]
 *   prefers-reduced-motion respected
 */

/* ---------- tuning constants ---------- */
var DESKTOP_CARD_WIDTH = 280;

/* ---------- easing ---------- */
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/* ---------- transform math ---------- */
function computeTransform(progress, bunched, isFlipped, scale) {
  var t = easeOutCubic(clamp01(progress));
  var tx = bunched.x * scale * (1 - t);
  var ty = bunched.y * scale * (1 - t);
  var rot = bunched.rotate * (1 - t);
  var sc = bunched.scale + (1 - bunched.scale) * t;
  var flipY = isFlipped ? 180 : 0;
  return (
    "translateX(" + tx + "px) translateY(" + ty + "px) " +
    "rotate(" + rot + "deg) scale(" + sc + ") rotateY(" + flipY + "deg)"
  );
}

/* ---------- init ---------- */
export function initCardDeck(cardDeckConfig) {
  if (!cardDeckConfig || !cardDeckConfig.cards) return;

  var deck = document.querySelector("[data-deck]");
  var stack = document.querySelector("[data-deck-stack]");
  var captionEl = document.querySelector("[data-deck-caption]");
  if (!deck || !stack) return;

  var cardEls = stack.querySelectorAll(".deck-card");
  if (!cardEls.length) return;

  var cards = cardDeckConfig.cards;
  var flipped = {};          // id -> true
  var lastFlippedId = null;
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- responsive scale factor (mirrors PlayingCard.tsx) --- */
  var transformScales = [];
  function updateScales() {
    for (var i = 0; i < cardEls.length; i++) {
      transformScales[i] = cardEls[i].offsetWidth / DESKTOP_CARD_WIDTH;
    }
  }
  updateScales();
  window.addEventListener("resize", updateScales);

  /* --- mobile detection --- */
  var isMobile = window.innerWidth < 640;
  window.addEventListener("resize", function() {
    isMobile = window.innerWidth < 640;
  });

  /* =============================
     SCROLL → progress (0..1)
     ============================= */
  var progress = 0;
  var ticking = false;

  function calcProgress() {
    var windowH = window.innerHeight;
    var scrollY = window.scrollY || window.pageYOffset;
    var docH = document.documentElement.scrollHeight;
    var scrollSpace = docH - windowH;

    if (scrollSpace <= 0) {
      progress = 1;
      return;
    }

    var rect = stack.getBoundingClientRect();
    var rectBased = 1 - rect.top / (windowH * 0.6);
    var scrollBased = scrollY / (scrollSpace * 0.5);
    var isMobileHeight = windowH < 700;
    progress = clamp01(isMobileHeight ? scrollBased : rectBased);
  }

  function applyTransforms() {
    for (var i = 0; i < cardEls.length; i++) {
      var card = cards[i];
      var el = cardEls[i];
      var isFlipped = !!flipped[card.id];
      var tf = computeTransform(progress, card.bunchedTransform, isFlipped, transformScales[i] || 1);
      el.querySelector(".deck-card__inner").style.transform = tf;
    }
    ticking = false;
  }

  function onScroll() {
    if (prefersReduced) return;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(function() {
        calcProgress();
        applyTransforms();
      });
    }
  }

  /* If reduced motion, render unbunched immediately */
  if (prefersReduced) {
    progress = 1;
    applyTransforms();
  } else {
    /* initial calc */
    calcProgress();
    applyTransforms();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* =============================
     CLICK → flip (delegated)
     ============================= */
  function updateCaption() {
    if (!captionEl) return;

    var activeCard = null;
    if (lastFlippedId !== null && flipped[lastFlippedId]) {
      for (var i = 0; i < cards.length; i++) {
        if (cards[i].id === lastFlippedId) { activeCard = cards[i]; break; }
      }
    }

    /* Desktop: per-card captions toggled via .is-flipped on parent button */
    /* Mobile: shared caption below deck */
    if (isMobile && activeCard) {
      captionEl.innerHTML =
        '<h3 class="deck__caption-title" style="color:' +
        (activeCard.color === "red" ? "#b91c1c" : "#fff") + '">' +
        activeCard.title + '</h3>' +
        '<p class="deck__caption-desc">' + activeCard.description + '</p>';
      captionEl.classList.add("is-visible");
    } else {
      captionEl.classList.remove("is-visible");
      captionEl.innerHTML = "";
    }
  }

  deck.addEventListener("click", function(e) {
    var btn = e.target.closest(".deck-card");
    if (!btn) return;

    var id = parseInt(btn.getAttribute("data-card-id"), 10);
    if (isNaN(id)) return;

    if (flipped[id]) {
      delete flipped[id];
      btn.classList.remove("is-flipped");
      btn.setAttribute("aria-pressed", "false");
      lastFlippedId = null;
    } else {
      flipped[id] = true;
      btn.classList.add("is-flipped");
      btn.setAttribute("aria-pressed", "true");
      lastFlippedId = id;
    }

    /* re-apply transforms so flipY updates */
    applyTransforms();
    updateCaption();
  });
}
