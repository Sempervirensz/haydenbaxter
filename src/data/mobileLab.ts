// ---------------------------------------------------------------------------
// Mobile Lab content — /mobile-lab
//
// EXPERIMENTAL. Mobile-first assembly of the REAL site content: everything
// possible is derived from the canonical sources (WORK_SCREENS, CONNECT_LINKS,
// SITE_CONTENT) so the lab always reflects production copy. Only the
// mobile-specific glue (kickers, condensed one-liners, CTA labels) lives here.
//
// If a pattern is promoted, the glue copy moves into the canonical files —
// production must never import from this file.
// ---------------------------------------------------------------------------

import { WORK_SCREENS } from "@/data/work";
import { CARDS } from "@/data/cards";
import { ABOUT_DATA } from "@/data/about";

export type MobileTrackId = "worldpulse" | "etb" | "supply" | "consulting";

// ---- Canonical screen extracts (typed) ----

const WP_SCREEN = WORK_SCREENS.find(
  (s): s is Extract<(typeof WORK_SCREENS)[number], { type: "full" }> => s.type === "full",
);
const ETB_SCREEN = WORK_SCREENS.find(
  (s): s is Extract<(typeof WORK_SCREENS)[number], { type: "emerging-tech-builds" }> =>
    s.type === "emerging-tech-builds",
);
const SC_SCREEN = WORK_SCREENS.find(
  (s): s is Extract<(typeof WORK_SCREENS)[number], { type: "supply-chain" }> =>
    s.type === "supply-chain",
);
const CNS_SCREEN = WORK_SCREENS.find(
  (s): s is Extract<(typeof WORK_SCREENS)[number], { type: "consulting" }> =>
    s.type === "consulting",
);

if (!WP_SCREEN || !ETB_SCREEN || !SC_SCREEN || !CNS_SCREEN) {
  throw new Error("mobileLab: WORK_SCREENS is missing an expected screen type");
}

// ETB project id → production detail route (only shipped pages get links).
const ETB_ROUTES: Record<string, string> = {
  atomicos: "/emerging-tech-builds/atomic-os",
  casebrief: "/emerging-tech-builds/casebrief",
  cortex: "/emerging-tech-builds/cortex",
};

export const MOBILE_LAB = {
  header: {
    wordmark: "Hayden Baxter",
  },

  hero: {
    // Production hero copy, verbatim (siteContent.ts hero is the same line).
    eyebrow:
      "Explore the builds, the supply chain background, and where WorldPulse fits in.",
    heading:
      "I build AI products and supply chain systems where data, design, and the real world meet.",
    ctas: [
      // TODO(promote): point at the real resume asset once one ships in /public.
      { label: "Resume", href: "#" },
      { label: "Book a Call", href: "#mlab-connect", cta: true },
    ],
    proof: ["Nike", "Disney", "AI Systems", "Global Supply Chain"],
  },

  // The soft-lock deck (production CARDS: faces, backs, titles), repurposed
  // as section shortcuts. Tapping flips the card face-up and jumps; visiting
  // a section any other way also flips its card — the mobile version of the
  // flip-all-four entry ritual.
  cardStrip: {
    caption: "tap a card to skip ahead",
    captionDone: "you've seen it all — book a call ↓",
    cards: CARDS.map((card, i) => ({
      back:
        card.backVariant === "red"
          ? "/cards/back-red-custom.webp"
          : "/cards/back-blue-custom.webp",
      face: card.faceImage,
      title: card.title,
      track: (["worldpulse", "etb", "supply", "consulting"] as MobileTrackId[])[i],
      tilt: [-3, 2, -1.5, 3][i],
    })),
  },

  // CD landing — the Work intro, using the production player assets.
  landing: {
    background: "/usethisbackground.webp",
    shell: "/playershellpngtransparent.webp",
    disc: "/cd-disc-final.webp",
    kicker: "Selected Work — Four Tracks",
    idleLabel: "press play",
    tracks: [
      { id: "worldpulse" as MobileTrackId, no: "01", name: "WorldPulse" },
      { id: "etb" as MobileTrackId, no: "02", name: "Emerging Tech Builds" },
      { id: "supply" as MobileTrackId, no: "03", name: "Supply Chain" },
      { id: "consulting" as MobileTrackId, no: "04", name: "Consulting" },
    ],
  },

  sheet: {
    title: "Track list",
  },

  worldpulse: {
    number: WP_SCREEN.number,
    logo: WP_SCREEN.logo,
    kicker: "Founder · The origin story",
    caption: WP_SCREEN.full.caption,
    photo: WP_SCREEN.full.background ?? "",
    tagline: ["Origin", "Matters"],
    link: WP_SCREEN.full.link,
  },

  etb: {
    number: ETB_SCREEN.number,
    name: ETB_SCREEN.etb.title,
    credibilityLine: ETB_SCREEN.etb.credibilityLine,
    intro: ETB_SCREEN.etb.description ?? ETB_SCREEN.etb.intro,
    projects: ETB_SCREEN.etb.projects.map((p) => ({
      id: p.id,
      name: p.name,
      status: p.status,
      oneLiner: p.oneLiner,
      href: ETB_ROUTES[p.id] ?? null,
      comingSoon: !!p.comingSoon,
    })),
    allLink: { href: "/emerging-tech-builds", label: "View all builds" },
  },

  supply: {
    number: SC_SCREEN.number,
    name: SC_SCREEN.name,
    intro: SC_SCREEN.supplyChain.description,
    quoteLines: (SC_SCREEN.supplyChain.heroArt?.quoteLines ?? []).map((q) => q.text),
  },

  consulting: {
    number: CNS_SCREEN.number,
    name: CNS_SCREEN.name,
    heroTitle: CNS_SCREEN.consulting.heroTitle,
    heroSubtitle: CNS_SCREEN.consulting.heroSubtitle,
    identityLine: CNS_SCREEN.consulting.identityLine,
    photo: "/consulting/mobile-statue.webp",
    pill: ["Explore", "What's", "Possible"],
    offers: CNS_SCREEN.consulting.offers
      .filter((o) => o.status === "Offer")
      .map((o) => ({ title: o.title, oneLiner: o.oneLiner })),
  },

  // Compact About beat — one line + a photo strip from the production gallery.
  about: {
    heading: ABOUT_DATA.heading,
    line: "I'm Hayden — a product builder, supply chain operator, and emerging-tech generalist based between the U.S. and Asia. Fluent in Mandarin, grounded in operations.",
    photos: [ABOUT_DATA.photos[1], ABOUT_DATA.photos[4], ABOUT_DATA.photos[3]],
  },

  connect: {
    heading: "Connect",
  },
};
