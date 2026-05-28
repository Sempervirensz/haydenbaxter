import type { ETBDemoDetail } from "@/data/work";

const A = "/assets/cortex-demo";

/** "View full details" content for Cortex — the WorldPulse editorial brain.
 *  An evidence-first knowledge system covering sustainable apparel and textiles,
 *  built on Obsidian and extended with a purpose-built triage plugin. */
export const CORTEX_DEMO: ETBDemoDetail = {
  badge: "Editorial system",
  summary:
    "Cortex is an opinionated, evidence-first knowledge system for covering the sustainable apparel and textiles beat — built on Obsidian, extended with a custom triage plugin, and structured as a repeatable pipeline from raw source to published claim. The biggest problem it solves is claim-to-source provenance: every sentence that reaches a draft has already passed through a typed source note, an extracted quote, a promoted claim, and an audit trail. The output is defensible publishing — any line in a finished piece walks back to a primary source in under thirty seconds.",
  stats: [
    {
      value: "93",
      label: "Source corpus",
      detail: "Structured source notes in the populated vault",
      icon: "checklist",
    },
    {
      value: "39",
      label: "Concept notes",
      detail: "Recurring ideas surfaced across multiple sources",
      icon: "spark",
    },
    {
      value: "9",
      label: "Topic MOCs",
      detail: "Living maps across the WorldPulse beat",
      icon: "pulse",
    },
    {
      value: "<30s",
      label: "Citation traceback",
      detail: "Any claim in a draft to its primary source",
      icon: "trend-up",
    },
  ],
  screenshots: [
    {
      src: `${A}/cortex-dashboard-overview.png`,
      alt: "Cortex dashboard overview — knowledge graph hero, four KPI cards, recent activity feed, source-mix donut, and top-topic coverage.",
      caption:
        "The cockpit — knowledge graph hero, four KPI cards for the running state of the corpus, recent activity, source-mix donut, and top-topic coverage in one view.",
      width: 1920,
      height: 1200,
      mobileSrc: `${A}/cortex-dashboard-overview-mobile.png`,
      mobileWidth: 1080,
      mobileHeight: 2337,
    },
    {
      src: `${A}/cortex-dashboard-graph.png`,
      alt: "Cortex dashboard full-screen knowledge graph with coral glow halos on topic maps and a lit-up neighborhood on hover.",
      caption:
        "Knowledge graph, full screen — topic maps anchor the structure with coral glow halos; sources, claims, and entities radiate from the topics they support, and hovering any node lights up its neighborhood.",
      width: 1920,
      height: 1200,
      mobileSrc: `${A}/cortex-dashboard-graph-mobile.png`,
      mobileWidth: 1080,
      mobileHeight: 2337,
    },
    {
      src: `${A}/cortex-dashboard-pipeline.png`,
      alt: "Cortex dashboard editorial pipeline — Raw Source, Source Note, Approved, Quote, Claim, Draft — with the bottleneck stage flagged.",
      caption:
        "Editorial pipeline — Raw Source → Source Note → Approved → Quote → Claim → Draft. The dashboard auto-detects the bottleneck stage and flags it in real time.",
      width: 1920,
      height: 1200,
      mobileSrc: `${A}/cortex-dashboard-pipeline-mobile.png`,
      mobileWidth: 1080,
      mobileHeight: 2337,
    },
    {
      src: `${A}/cortex-dashboard-coverage.png`,
      alt: "Cortex dashboard coverage view — every topic map ranked by source depth, with thin-coverage topics flagged.",
      caption:
        "Coverage by topic — every topic map ranked by source depth, with thin-coverage topics flagged so commissioning happens before a draft starts, not after.",
      width: 1920,
      height: 1200,
      mobileSrc: `${A}/cortex-dashboard-coverage-mobile.png`,
      mobileWidth: 1080,
      mobileHeight: 2337,
    },
    {
      src: `${A}/cortex-dashboard-triage.png`,
      alt: "Cortex dashboard triage queue — auto-drafted classification per unreviewed note with Approve, Reset, and Ignore actions.",
      caption:
        "Triage queue — what the WorldPulse Triage plugin sees, rendered as a dashboard: an auto-drafted classification per unreviewed note, with Approve / Reset / Ignore actions.",
      width: 1920,
      height: 1200,
      mobileSrc: `${A}/cortex-dashboard-triage-mobile.png`,
      mobileWidth: 1080,
      mobileHeight: 2337,
    },
    {
      src: `${A}/cortex-dashboard-evidence.png`,
      alt: "Cortex dashboard evidence-strength view — radial bar chart of the rated corpus, evidence-level distribution, high-evidence spine, and claims at risk.",
      caption:
        "Evidence strength — a radial bar chart of the rated corpus, evidence-level distribution, the high-evidence spine, and claims-at-risk in one view.",
      width: 1920,
      height: 1200,
      mobileSrc: `${A}/cortex-dashboard-evidence-mobile.png`,
      mobileWidth: 1080,
      mobileHeight: 2337,
    },
    {
      src: `${A}/cortex-source-note.png`,
      alt: "A typed Cortex source note in Obsidian showing nineteen frontmatter properties — provenance, format, evidence rating, credibility score, linked MOCs and claims, review state.",
      caption:
        "Underneath the dashboard: a typed source note — nineteen properties covering provenance, format, evidence rating, credibility, linked MOCs and claims, and review state. This is what makes the corpus queryable, not just searchable.",
      width: 1920,
      height: 1205,
    },
    {
      src: `${A}/cortex-source-index.png`,
      alt: "Cortex multi-axis source index, grouped by organization, with other access axes one click away.",
      caption:
        "Multi-axis indexing — the same corpus grouped by organization. Date, type, podcast, and best-use axes are one click away: one canonical note, eight access paths.",
      width: 1920,
      height: 1205,
    },
    {
      src: `${A}/cortex-moc.png`,
      alt: "A Cortex Map of Content weaving anchor sources, approved claims, and concepts into one living document, with a high backlink count in the status bar.",
      caption:
        "Topic-level synthesis — a Map of Content weaving anchor sources, approved claims, and concepts into one living document. The backlink count is the punchline: connective tissue, not a category.",
      width: 1920,
      height: 1205,
    },
  ],
  techBreakdown: [
    "Obsidian as the substrate — local-first, plain Markdown, portable, diff-able, and outlives any single tool.",
    "WorldPulse Triage: a purpose-built community plugin that reads source notes, drafts a suggested classification (origin, topic, angle, evidence strength), and routes files when the approved group maps to a different folder — wiki-link backreferences stay intact.",
    "Progressively-enriched YAML frontmatter schema with controlled vocabularies for provenance, format, editorial state, evidence quality, and relationships; required vs optional fields are explicit so light and heavy notes are both valid.",
    "Dataview-backed multi-axis indexing — one canonical source note exposed through eight access paths (A–Z, date, group, organization, type, podcast, best use, recent + watchlist). Adding an index is a query, not a migration.",
    "Bounded AI integration via a curated Copilot prompt library — controlled vocabularies constrain the option space, descriptive fields are protected from overwrite, and the system writes review metadata alongside human curation rather than over it.",
    "Deep-linkable triage entry points: a single `obsidian://worldpulse-triage?vault=...&file=...` URL opens the review queue at a specific note, making the surface scriptable from outside Obsidian.",
  ],
  outcomes: [
    "A four-stage editorial pipeline encoded directly in the folder topology — Raw Source File → Source Note → Quote / Claim → Draft. You cannot skip a stage without it being visible in the file tree.",
    "Defensible publishing as the default path: typed source notes, extracted quotes, promoted claims, and audit trail (`review_status`, `triage_status`, `reviewed_at`) make misattributed claims structurally hard.",
    "Nine living topic maps aligned to the WorldPulse beat — DPPs & Traceability, Regulation & Compliance, Decarbonisation, Circularity, Materials, Worker Rights, Business Case, and Apparel Event Intelligence — link sources, claims, drafts, and open research questions.",
    "Auditable failure handling: sources the pipeline can't process (corrupted PDFs, paywalled extracts, malformed transcripts) live in `09_Failed_Sources/` rather than being discarded, so coverage gaps are measured honestly.",
  ],
  lessonsLearned: [
    "Domain-specific beats deserve domain-specific systems. Generic 'second brain' templates collapse on a regulated, fast-moving topic — the categories that work are the categories a textile-policy reporter would actually pitch around.",
    "Provenance has to be cheap or it doesn't happen. The frontmatter schema, controlled vocabularies, and folder topology exist so the path of least resistance is the auditable one.",
    "Custom tooling beats configuration when the workflow is the product. The triage plugin is the difference between 'I have a notes app' and 'I have an editorial system.'",
    "AI accelerates without compromising provenance only when it suggests inside guardrails — drafts not decisions, controlled vocabularies not free text, additive metadata not overwrites.",
  ],
};
