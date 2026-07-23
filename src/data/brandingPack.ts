export interface BrandingSwatch {
  name: string;
  value: string;
  usage: string;
}

export interface BrandingTypeRole {
  role: string;
  font: string;
  treatment: string;
  usage: string;
}

export interface BrandingRule {
  label: string;
  value: string;
}

export const BRANDING_PACK = {
  meta: {
    name: "Hayden Baxter Portfolio",
    version: "2026.05",
    direction:
      "Dark-only editorial portfolio with tactile DYMO labels, restrained glass surfaces, and high-contrast typography.",
    useCase:
      "Lift this into another app when you want the same black-on-black, design-forward product language without recreating the system from scratch.",
  },

  guardrails: [
    "Dark mode only.",
    "Use contrast, texture, and typography before color.",
    "Keep accent colors sparse and meaningful.",
    "Respect prefers-reduced-motion for anything that moves, rotates, or glides.",
    "Favor minimal diffs and preserve the editorial feel over generic SaaS polish.",
  ],

  colors: [
    {
      name: "Canvas Black",
      value: "#000000",
      usage: "Primary section background and deepest contrast surface.",
    },
    {
      name: "Soft Black",
      value: "#0A0A0A",
      usage: "Default page background and softer section break.",
    },
    {
      name: "Label Face",
      value: "#1C1C1C",
      usage: "DYMO tags, utility buttons, and low-profile controls.",
    },
    {
      name: "CTA Face",
      value: "#262626",
      usage: "Primary call-to-action button fill.",
    },
    {
      name: "Glass White 8",
      value: "rgba(255, 255, 255, 0.08)",
      usage: "Glass cards, subtle borders, and quiet surfaces.",
    },
    {
      name: "Body White 55",
      value: "rgba(255, 255, 255, 0.55)",
      usage: "Paragraph copy and long-form support text.",
    },
    {
      name: "Body White 92",
      value: "rgba(255, 255, 255, 0.92)",
      usage: "Display type and major headings.",
    },
    {
      name: "Muted White 32",
      value: "rgba(255, 255, 255, 0.32)",
      usage: "Labels, rules, secondary metadata, and dividers.",
    },
    {
      name: "Warm Brass",
      value: "#CBA86A",
      usage: "Rare highlight state for active list items and emphasis.",
    },
  ] satisfies BrandingSwatch[],

  typography: [
    {
      role: "Display",
      font: "DM Serif Display, Georgia, serif",
      treatment: "Large scale, normal weight, tight tracking, line-height near 1.05.",
      usage: "Hero headlines, section titles, work titles, editorial moments.",
    },
    {
      role: "Body",
      font: "DM Sans, system-ui, sans-serif",
      treatment: "Readable paragraphs with generous line-height and softened white.",
      usage: "Intro copy, descriptions, body paragraphs, supporting context.",
    },
    {
      role: "Utility",
      font: "DM Mono, monospace",
      treatment: "Uppercase, 0.14em-0.22em tracking, compact sizing.",
      usage: "Buttons, nav labels, metadata, dates, chips, and UI scaffolding.",
    },
    {
      role: "Marker Accent",
      font: "Permanent Marker, cursive",
      treatment: "Use sparingly as a human layer on top of the system.",
      usage: "CD active label, handwritten notes, or one-off emphasis.",
    },
  ] satisfies BrandingTypeRole[],

  spacing: {
    sectionY: "clamp(64px, 10vw, 140px)",
    sectionX: "24px base gutter with larger clamp-based gutters on wide screens",
    contentWidth: "640px for centered reading blocks, 900px-1200px for wide modules",
    cardRadius: "12px-18px for media cards, 32px for hero glass panels",
  },

  buttons: {
    primaryPattern: {
      name: "DYMO Tag",
      intent: "Tactile micro-label button with embossed depth instead of color-heavy emphasis.",
      anatomy: [
        "Monospace uppercase label",
        "3px hard bottom edge shadow",
        "Inset top and bottom highlights",
        "Very small corner radius",
        "Muted white text that brightens on hover",
      ],
      states: [
        "Default: dense and debossed, almost like a physical label maker strip.",
        "Hover: brighten text, keep movement minimal or none.",
        "Active: press inward by removing the edge shadow.",
        "Focus: subtle white ring or outline, never a loud brand color.",
      ],
    },
    secondaryPattern: {
      name: "Glass Card CTA",
      intent: "Quiet premium panel or card action without leaving the dark palette.",
      anatomy: [
        "Soft translucent fill",
        "Hairline white border",
        "Blur only when performance allows",
        "Lift by 2px-4px at most",
      ],
    },
  },

  surfaces: [
    {
      label: "Editorial Canvas",
      value: "#000 or #0A0A0A with white type and almost no chroma.",
    },
    {
      label: "Glass Feature Panel",
      value:
        "rgba(255,255,255,0.08) background, 1px-1.5px border, large radius, deep shadow stack, optional blur.",
    },
    {
      label: "Media Card",
      value:
        "rgba(255,255,255,0.03) background, 1px border, 12px radius, modest lift on hover.",
    },
  ] satisfies BrandingRule[],

  layout: [
    {
      label: "Hero",
      value:
        "Centered editorial stack: utility eyebrow first, oversized serif headline second, generous vertical breathing room.",
    },
    {
      label: "Section Rhythm",
      value:
        "Alternate between #0A0A0A and #000000 to create separation without introducing a new color.",
    },
    {
      label: "Content Density",
      value:
        "Let one dramatic object carry a section: a card deck, a CD player, a collage, or a glass panel. Avoid crowded dashboards.",
    },
    {
      label: "Navigation",
      value:
        "Compact wordmark paired with tactile utility tags instead of a traditional glossy navbar.",
    },
  ] satisfies BrandingRule[],

  motion: {
    principles: [
      "Motion should clarify hierarchy, reveal state, or reinforce tactility.",
      "Use slow ambient loops for background moments and faster responses for button press states.",
      "Avoid bounce, spring excess, or bright animated gradients.",
    ],
    timings: [
      "100ms-180ms for labels and button state changes.",
      "220ms-320ms for panel hover, focus, and content emphasis.",
      "Long linear loops only for ambient marquees or slow rotational objects.",
    ],
    reducedMotion: [
      "Disable continuous marquee and decorative rotation.",
      "Remove card lift and transform-based animation.",
      "Keep opacity changes short and functional.",
    ],
  },

  copy: {
    voice: [
      "Confident, grounded, and design-literate.",
      "Clear over clever; avoid startup cliches and hype-heavy language.",
      "Mix builder credibility with a human editorial tone.",
    ],
    eyebrowExamples: [
      "Explore the builds, the system, and where the work fits in.",
      "Thoughtful products where data, design, and the real world meet.",
    ],
    headingExamples: [
      "I build AI products and supply chain systems where data, design, and the real world meet.",
      "Products with operational depth, editorial taste, and clear user value.",
    ],
    ctaExamples: [
      "Book a Call",
      "View the Work",
      "Read the Journal",
      "Open the Case Study",
    ],
    bodyStyle:
      "Keep paragraphs compact and precise. One strong sentence is better than three padded ones.",
  },
} as const;

export const BRANDING_PACK_CSS = `
:root {
  --hb-bg: #0a0a0a;
  --hb-bg-deep: #000000;
  --hb-surface: #1c1c1c;
  --hb-surface-cta: #262626;
  --hb-surface-glass: rgba(255, 255, 255, 0.08);
  --hb-border-soft: rgba(255, 255, 255, 0.08);
  --hb-border-strong: rgba(255, 255, 255, 0.14);
  --hb-text-strong: rgba(255, 255, 255, 0.92);
  --hb-text-body: rgba(255, 255, 255, 0.55);
  --hb-text-muted: rgba(255, 255, 255, 0.32);
  --hb-accent-warm: #cba86a;
  --hb-radius-sm: 3px;
  --hb-radius-md: 12px;
  --hb-radius-lg: 32px;
  --hb-shadow-tag:
    inset 0 2px 4px rgba(0, 0, 0, 0.75),
    inset 0 -1px 0 rgba(255, 255, 255, 0.05),
    0 3px 0 #0b0b0b,
    0 4px 7px rgba(0, 0, 0, 0.85);
  --hb-shadow-panel:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 12px 32px rgba(0, 0, 0, 0.45);
  --hb-font-display: "DM Serif Display", Georgia, serif;
  --hb-font-body: "DM Sans", system-ui, sans-serif;
  --hb-font-mono: "DM Mono", ui-monospace, monospace;
}

body {
  background: var(--hb-bg);
  color: var(--hb-text-strong);
  font-family: var(--hb-font-body);
}

.hb-shell {
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.06), transparent 34%),
    linear-gradient(180deg, #050505 0%, #0a0a0a 38%, #050505 100%);
}

.hb-eyebrow {
  font-family: var(--hb-font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--hb-text-muted);
}

.hb-display {
  font-family: var(--hb-font-display);
  font-size: clamp(40px, 7vw, 88px);
  line-height: 1.04;
  letter-spacing: -0.02em;
  color: var(--hb-text-strong);
}

.hb-body {
  font-family: var(--hb-font-body);
  font-size: clamp(14px, 1.4vw, 18px);
  line-height: 1.65;
  color: var(--hb-text-body);
}

.hb-tag {
  display: inline-block;
  padding: 12px 16px 11px;
  border-radius: var(--hb-radius-sm);
  border: 1px solid var(--hb-border-soft);
  background: var(--hb-surface);
  color: rgba(255, 255, 255, 0.72);
  font-family: var(--hb-font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.22em;
  line-height: 1;
  text-transform: uppercase;
  text-decoration: none;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.7);
  box-shadow: var(--hb-shadow-tag);
  transition: color 140ms ease, box-shadow 100ms ease;
}

.hb-tag:hover {
  color: rgba(255, 255, 255, 0.9);
}

.hb-tag:active {
  box-shadow:
    inset 0 3px 6px rgba(0, 0, 0, 0.85),
    0 0 0 #0b0b0b,
    0 1px 2px rgba(0, 0, 0, 0.5);
}

.hb-tag--cta {
  background: var(--hb-surface-cta);
  border-color: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.86);
}

.hb-panel {
  border-radius: var(--hb-radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: var(--hb-surface-glass);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 32px 64px rgba(0, 0, 0, 0.48);
  backdrop-filter: blur(20px) saturate(1.3);
  -webkit-backdrop-filter: blur(20px) saturate(1.3);
}

.hb-card {
  border-radius: var(--hb-radius-md);
  border: 1px solid var(--hb-border-soft);
  background: rgba(255, 255, 255, 0.03);
  box-shadow: var(--hb-shadow-panel);
  overflow: hidden;
}

@media (prefers-reduced-motion: reduce) {
  .hb-tag,
  .hb-panel,
  .hb-card {
    transition: none !important;
  }
}
`;

export const STYLE_PACK = {
  meta: {
    name: "Hayden Baxter Homepage Style Pack",
    version: "2026.05",
    source: "Derived from the live homepage section stack and its current interaction patterns.",
    purpose:
      "Use this when you want to recreate the entire page language in another app, including layout rhythm, section types, content density, and interaction behavior.",
  },

  included: [
    "Design tokens: dark surfaces, text hierarchy, shadows, radii, and warm accent usage.",
    "Typography system: serif display, sans body, mono utility, marker accent.",
    "DYMO button recipe: nav tags, CTA tags, utility labels, and flat-link states.",
    "Page architecture: ordered section stack and the narrative role of each section.",
    "Section recipes: hero, card deck, brand strip, sticky work chapter, connect, about, journal.",
    "Component patterns: glass panel, media card, logo marquee, tactile tag, editorial heading block.",
    "Motion rules: hover restraint, ambient motion, sticky storytelling, reduced-motion fallbacks.",
    "Copy direction: eyebrow tone, headline style, CTA phrasing, and paragraph density.",
    "Starter CSS: portable class names and variables for another project.",
    "Starter page scaffold: copy-paste structure for building the page in another app.",
  ],

  pageArchitecture: {
    order: [
      "Hero + Navigation",
      "Interactive Card Deck",
      "Brand Credibility Marquee",
      "Sticky Work Narrative",
      "Connect / Conversion",
      "About Collage",
      "Journal / Writing",
    ],
    narrativeArc: [
      "Open with identity and point of view.",
      "Follow with a tactile interaction that signals taste and range.",
      "Add light credibility without making logos the main event.",
      "Spend the most visual energy on the work story.",
      "Offer a clean way to contact or book.",
      "Humanize the operator behind the work.",
      "Close with deeper thinking and written perspective.",
    ],
    sectionRhythm: [
      "#0A0A0A for intro and editorial sections.",
      "#000000 for heavier proof, work, and journal sections.",
      "Use alternation to create pacing instead of introducing bright backgrounds.",
    ],
  },

  sections: [
    {
      id: "hero",
      label: "Hero + Navigation",
      purpose: "Set the tone quickly with a compact wordmark, tactile nav, and a large serif statement.",
      layout:
        "Absolute top nav over a centered hero stack with generous top and bottom padding.",
      includes: [
        "Wordmark in small sans type",
        "Row of DYMO-style nav tags",
        "Short editorial eyebrow",
        "Large centered serif headline",
        "Mobile menu variant that stays inside the same dark language",
      ],
      reuseFor: [
        "Portfolio homepage",
        "Founder product landing page",
        "Editorial product intro",
      ],
    },
    {
      id: "card-deck",
      label: "Interactive Card Deck",
      purpose: "Introduce range and personality through a tactile object instead of a generic feature grid.",
      layout:
        "Centered horizontal card row with scroll-based unveil and click-to-flip behavior.",
      includes: [
        "Four-card reveal composition",
        "3D flip interaction",
        "Desktop per-card captions",
        "Mobile shared caption area",
        "Soft radial light behind the deck",
      ],
      reuseFor: [
        "Capabilities overview",
        "Service pillars",
        "Team archetypes",
      ],
    },
    {
      id: "brands",
      label: "Brand Credibility Marquee",
      purpose: "Add quiet proof without breaking the visual mood.",
      layout:
        "Single horizontal marquee with faded edges, muted logos, and a short context line below.",
      includes: [
        "Looping logo strip",
        "Left/right fade masks",
        "Context sentence under the marquee",
        "Fine-print legal note",
      ],
      reuseFor: [
        "Past employers",
        "Selected clients",
        "Partners or press mentions",
      ],
    },
    {
      id: "work",
      label: "Sticky Work Narrative",
      purpose: "Make the main body of the page feel immersive and authored rather than list-based.",
      layout:
        "Multi-chapter sticky section with a landing panel, a rotating CD motif, and sequential detail cards.",
      includes: [
        "Landing chapter with numbered track list",
        "Rotating CD / player motif",
        "Sticky full-height detail cards",
        "Glass-panel detail treatment",
        "Section-specific storytelling panels for work categories",
      ],
      reuseFor: [
        "Case study gallery",
        "Product showcase",
        "Portfolio narrative spine",
      ],
    },
    {
      id: "connect",
      label: "Connect / Conversion",
      purpose: "Convert interest into contact without switching into sales-page aesthetics.",
      layout:
        "Centered heading, compact tag grid, and optional dark embedded scheduler.",
      includes: [
        "Section heading in serif display type",
        "DYMO contact tags",
        "Display-only identity tag for non-link contact info",
        "Dark inline scheduling embed",
      ],
      reuseFor: [
        "Contact page",
        "Consulting conversion block",
        "Founder intro site CTA section",
      ],
    },
    {
      id: "about",
      label: "About Collage",
      purpose: "Add personal context through image composition, not just biography text.",
      layout:
        "Centered intro paragraph above a 12-column responsive image collage with mixed aspect ratios.",
      includes: [
        "Large serif heading",
        "Readable centered body paragraph",
        "Asymmetric photo grid",
        "Dark framed phone-style image treatment",
      ],
      reuseFor: [
        "Founder bio section",
        "Studio story section",
        "Personal portfolio context block",
      ],
    },
    {
      id: "journal",
      label: "Journal / Writing",
      purpose: "End with depth and signal long-form thinking.",
      layout:
        "Centered intro followed by a compact card grid and a single DYMO-style CTA.",
      includes: [
        "Section heading and subline",
        "Featured article cards",
        "Editorial image ratio",
        "Mono metadata and CTA treatment",
      ],
      reuseFor: [
        "Blog preview section",
        "Insights block",
        "Research and writing archive teaser",
      ],
    },
  ],

  componentRecipes: [
    {
      name: "DYMO Tag",
      role: "Navigation, CTAs, utility controls, contact links.",
      notes:
        "Use mono uppercase text, low radius, inset highlights, and a hard bottom edge shadow.",
    },
    {
      name: "Glass Story Panel",
      role: "Primary immersive work container.",
      notes:
        "Use this only for high-value storytelling sections. It should feel premium, not everywhere.",
    },
    {
      name: "Editorial Heading Block",
      role: "Hero, section intro, and major content break.",
      notes:
        "Pair one short mono/sans eyebrow with one large serif line. Avoid stacking too many supporting lines.",
    },
    {
      name: "Muted Media Card",
      role: "Journal previews, content cards, supporting modules.",
      notes:
        "Keep backgrounds translucent and let typography do the differentiation work.",
    },
    {
      name: "Credibility Marquee",
      role: "Quiet social proof.",
      notes:
        "Logos should feel recessed and ambient. They are supporting cast, not the lead.",
    },
  ],

  contentRules: [
    "Headlines should be declarative, not slogan-heavy.",
    "Eyebrows should orient the viewer, not repeat the headline.",
    "Paragraphs should stay compact and useful.",
    "CTA labels should be direct and human: 'Book a Call', 'Read the Journal', 'View the Work'.",
    "Most sections should have one dominant visual move, not three competing ones.",
  ],

  assetChecklist: [
    "1 wordmark",
    "1-2 hero copy variants",
    "4 card-deck concepts with title + one-line caption",
    "3-8 muted logos for credibility strip",
    "1 signature scroll object or motif for the work section",
    "3-5 work narratives or case-study modules",
    "4-6 contact destinations",
    "5 curated about images with mixed aspect ratios",
    "3 featured writing thumbnails or preview cards",
  ],
} as const;

export const STYLE_PACK_PAGE_SCAFFOLD = `
<main class="hb-shell">
  <section class="hb-hero">
    <header class="hb-nav">
      <span class="hb-wordmark">Your Name</span>
      <nav class="hb-navTags">
        <a class="hb-tag" href="#work">Work</a>
        <a class="hb-tag" href="#about">About</a>
        <a class="hb-tag" href="#connect">Connect</a>
        <a class="hb-tag hb-tag--cta" href="#book">Book a Call</a>
      </nav>
    </header>

    <div class="hb-heroCopy">
      <p class="hb-eyebrow">Short orientation line</p>
      <h1 class="hb-display">Large editorial statement that carries the page.</h1>
      <p class="hb-body">Optional one-paragraph support copy if the product needs it.</p>
    </div>
  </section>

  <section class="hb-cardDeck">
    <!-- 4-card interactive capability / identity system -->
  </section>

  <section class="hb-brands">
    <!-- muted marquee for selected logos -->
  </section>

  <section class="hb-work">
    <!-- sticky chapter narrative with one signature interaction -->
  </section>

  <section class="hb-connect">
    <!-- contact tags + optional scheduler -->
  </section>

  <section class="hb-about">
    <!-- editorial intro + asymmetric collage -->
  </section>

  <section class="hb-journal">
    <!-- featured writing cards + CTA -->
  </section>
</main>
`;

export const PRODUCT_STYLE_PACK = {
  meta: {
    name: "HB Product UI Style Pack",
    version: "2026.05",
    intent:
      "A copy-pasteable dark product UI system for adapting this app's taste into another app without bringing over the portfolio structure.",
    bestFor: [
      "Habit tracker",
      "Personal productivity app",
      "Calm premium dashboard",
      "Wellness or routine app",
    ],
    vibe:
      "Clean premium minimalism with tactile controls, restrained depth, soft contrast, and an Apple-adjacent sense of polish without copying the portfolio layout.",
  },

  includeThis: [
    "Fonts",
    "Color tokens",
    "Buttons",
    "Inputs",
    "Cards",
    "Tabs",
    "Chips / pills",
    "Modal / sheet surfaces",
    "Spacing rhythm",
    "Motion rules",
  ],

  skipThis: [
    "Hero-first portfolio storytelling",
    "Brand logo marquees",
    "About collage layouts",
    "Sticky work chapters",
    "Editorial case-study composition",
  ],

  stylePillars: [
    "Dark matte backgrounds instead of bright app chrome.",
    "Soft white hierarchy instead of hard white everywhere.",
    "Tactile controls with physical depth rather than loud color.",
    "Premium restraint: fewer accents, fewer borders, fewer UI gimmicks.",
    "One strong texture or visual idea per screen, not many.",
  ],

  fonts: {
    primary: "DM Sans, system-ui, sans-serif",
    utility: "DM Mono, ui-monospace, monospace",
    optionalAccent: "DM Serif Display, Georgia, serif",
    usage: [
      "Use sans for almost everything in the app shell.",
      "Use mono for tabs, chips, streak labels, dates, counters, and button text when you want the DYMO feel.",
      "Use serif sparingly for milestone screens, empty states, or one feature headline per view.",
    ],
  },

  colors: {
    appBg: "#0A0A0A",
    appBgDeep: "#000000",
    surface: "#171717",
    surfaceRaised: "#1C1C1C",
    surfaceGlass: "rgba(255, 255, 255, 0.06)",
    borderSoft: "rgba(255, 255, 255, 0.08)",
    borderStrong: "rgba(255, 255, 255, 0.14)",
    textStrong: "rgba(255, 255, 255, 0.92)",
    textBody: "rgba(255, 255, 255, 0.62)",
    textMuted: "rgba(255, 255, 255, 0.36)",
    accentWarm: "#CBA86A",
    successSoft: "rgba(110, 200, 150, 0.16)",
    dangerSoft: "rgba(255, 90, 80, 0.16)",
  },

  buttons: {
    primary: {
      label: "Tactile dark button",
      rules: [
        "Dark face, subtle border, hard bottom shadow.",
        "Mono uppercase text if you want the label-maker feel.",
        "Hover should brighten text more than the background.",
        "Active state should feel pressed in, not animated outward.",
      ],
    },
    secondary: {
      label: "Quiet glass button",
      rules: [
        "Transparent or near-transparent fill.",
        "Hairline border.",
        "Use for filters, secondary actions, and toolbar controls.",
      ],
    },
    ghost: {
      label: "Text + subtle hover state",
      rules: [
        "No heavy fill.",
        "Use soft background only on hover/focus.",
        "Best for list actions and overflow tools.",
      ],
    },
  },

  components: {
    topBar: [
      "Low-profile dark top bar.",
      "Small wordmark or screen title.",
      "Keep actions right-aligned and compact.",
    ],
    habitCard: [
      "Rounded dark card with 12px-18px radius.",
      "Primary habit name in sans.",
      "Meta row in mono for streak, completion, or schedule.",
      "Optional subtle progress fill or ring, never candy-colored by default.",
    ],
    statPill: [
      "Mono uppercase label.",
      "Soft border or translucent fill.",
      "Use for streaks, focus mode, weekly targets, and tags.",
    ],
    segmentedTabs: [
      "Dark segmented control.",
      "Selected state should brighten border and text, not switch to a saturated color.",
      "Keep transitions fast and minimal.",
    ],
    inputs: [
      "Dark filled input with soft border.",
      "No pure black input wells; use slightly raised surfaces.",
      "Focus should use border emphasis and soft ring, not neon accent.",
    ],
    sheetOrModal: [
      "Large radius.",
      "Soft glass or raised matte surface.",
      "Use blur carefully and only when performance supports it.",
    ],
  },

  spacing: {
    screenPadding: "20px-24px on mobile, 28px-40px on desktop panels",
    cardGap: "10px-16px",
    sectionGap: "24px-40px",
    controlHeight: "40px-48px",
  },

  motion: {
    default:
      "120ms-180ms for buttons, 180ms-240ms for cards and panels, minimal distance on transforms.",
    rules: [
      "Use opacity, border-color, and 1px-4px translate shifts before anything more dramatic.",
      "Avoid bouncy springs for core productivity actions.",
      "Reserve continuous motion for one background or progress element at most.",
      "Respect prefers-reduced-motion by removing decorative motion first.",
    ],
  },

  copyTone: {
    voice: [
      "Direct",
      "Calm",
      "Slightly premium",
      "Not overly playful",
      "Not overly clinical",
    ],
    examples: [
      "Today",
      "Evening Reset",
      "3-day streak",
      "Mark complete",
      "Pause reminder",
      "Weekly rhythm",
    ],
  },

  buildOrder: [
    "1. Apply the color tokens and fonts.",
    "2. Swap existing buttons to the tactile dark button style.",
    "3. Update cards, pills, and tabs to use softer borders and restrained depth.",
    "4. Reduce bright accents and let typography carry the hierarchy.",
    "5. Add only one accent color, and use it sparingly.",
  ],
} as const;

export const PRODUCT_STYLE_PACK_CSS = `
:root {
  --hb-app-bg: #0a0a0a;
  --hb-app-bg-deep: #000000;
  --hb-surface: #171717;
  --hb-surface-raised: #1c1c1c;
  --hb-surface-glass: rgba(255, 255, 255, 0.06);
  --hb-border-soft: rgba(255, 255, 255, 0.08);
  --hb-border-strong: rgba(255, 255, 255, 0.14);
  --hb-text-strong: rgba(255, 255, 255, 0.92);
  --hb-text-body: rgba(255, 255, 255, 0.62);
  --hb-text-muted: rgba(255, 255, 255, 0.36);
  --hb-accent-warm: #cba86a;
  --hb-success-soft: rgba(110, 200, 150, 0.16);
  --hb-danger-soft: rgba(255, 90, 80, 0.16);
  --hb-radius-sm: 10px;
  --hb-radius-md: 16px;
  --hb-radius-lg: 22px;
  --hb-font-sans: "DM Sans", system-ui, sans-serif;
  --hb-font-mono: "DM Mono", ui-monospace, monospace;
  --hb-font-serif: "DM Serif Display", Georgia, serif;
  --hb-shadow-press:
    inset 0 2px 4px rgba(0, 0, 0, 0.65),
    inset 0 -1px 0 rgba(255, 255, 255, 0.04),
    0 3px 0 #0b0b0b,
    0 6px 16px rgba(0, 0, 0, 0.35);
  --hb-shadow-card:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 12px 28px rgba(0, 0, 0, 0.28);
}

body {
  background: var(--hb-app-bg);
  color: var(--hb-text-strong);
  font-family: var(--hb-font-sans);
}

.hb-app-shell {
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.05), transparent 32%),
    linear-gradient(180deg, #050505 0%, #0a0a0a 42%, #050505 100%);
}

.hb-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
}

.hb-screen-title {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--hb-text-strong);
}

.hb-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid var(--hb-border-soft);
  background: var(--hb-surface-raised);
  color: rgba(255, 255, 255, 0.82);
  box-shadow: var(--hb-shadow-press);
  font-family: var(--hb-font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.18em;
  line-height: 1;
  text-transform: uppercase;
  transition: color 140ms ease, border-color 140ms ease, transform 140ms ease, box-shadow 140ms ease;
}

.hb-button:hover {
  color: var(--hb-text-strong);
  border-color: var(--hb-border-strong);
}

.hb-button:active {
  transform: translateY(1px);
  box-shadow:
    inset 0 3px 6px rgba(0, 0, 0, 0.8),
    0 1px 3px rgba(0, 0, 0, 0.28);
}

.hb-button--secondary {
  background: rgba(255, 255, 255, 0.04);
  box-shadow: none;
}

.hb-button--ghost {
  background: transparent;
  box-shadow: none;
  border-color: transparent;
}

.hb-panel {
  border-radius: var(--hb-radius-lg);
  border: 1px solid var(--hb-border-soft);
  background: var(--hb-surface-glass);
  box-shadow: var(--hb-shadow-card);
  backdrop-filter: blur(18px) saturate(1.2);
  -webkit-backdrop-filter: blur(18px) saturate(1.2);
}

.hb-card {
  border-radius: var(--hb-radius-md);
  border: 1px solid var(--hb-border-soft);
  background: rgba(255, 255, 255, 0.03);
  box-shadow: var(--hb-shadow-card);
  padding: 16px;
}

.hb-card-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--hb-text-strong);
}

.hb-card-meta {
  margin-top: 8px;
  font-family: var(--hb-font-mono);
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--hb-text-muted);
}

.hb-chip {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid var(--hb-border-soft);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.72);
  font-family: var(--hb-font-mono);
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.hb-tabbar {
  display: flex;
  gap: 8px;
  padding: 6px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--hb-border-soft);
}

.hb-tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 0 12px;
  border-radius: 10px;
  color: var(--hb-text-muted);
  font-family: var(--hb-font-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hb-tab.is-active {
  background: rgba(255, 255, 255, 0.08);
  color: var(--hb-text-strong);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.hb-input {
  width: 100%;
  min-height: 46px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid var(--hb-border-soft);
  background: rgba(255, 255, 255, 0.04);
  color: var(--hb-text-strong);
  font-family: var(--hb-font-sans);
  font-size: 14px;
}

.hb-input::placeholder {
  color: var(--hb-text-muted);
}

.hb-input:focus {
  outline: none;
  border-color: var(--hb-border-strong);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.05);
}

@media (prefers-reduced-motion: reduce) {
  .hb-button,
  .hb-panel,
  .hb-card,
  .hb-tab {
    transition: none !important;
    transform: none !important;
  }
}
`;
