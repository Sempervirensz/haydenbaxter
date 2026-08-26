import type { ETBDemoDetail } from "@/data/work";

const A = "/assets/cortex-demo";

/** "View full details" content for Cortex, a living second brain: an Obsidian
 *  knowledge architecture and an intelligence layer working as one connected
 *  system that absorbs, structures, connects, reasons over, and publishes
 *  research. Same extended detail shape as AtomicOS and CaseBrief.
 *
 *  Metric values reflect the current indexed system snapshot. */
export const CORTEX_DEMO: ETBDemoDetail = {
  heroCategory: "Editorial Brain",
  story: [
    "Most research systems are built to store information. Cortex was built to make knowledge usable.",
    "Cortex combines an Obsidian knowledge architecture, connected sources, structured notes, claims, topic maps, retrieval, drafting, and coverage analysis into one living brain for everything I learn.",
    "Raw research enters the system as evidence, becomes connected knowledge, and remains available to question, compare, develop, and publish. Cortex remembers where ideas came from, how they relate, where the evidence is strong, and where the knowledge base is still incomplete.",
    "Cortex is a second brain that becomes more useful as its knowledge becomes more structured and connected.",
  ],
  principle:
    "A second brain should not just remember what you know. It should help you build on it.",
  stats: [
    {
      value: "186",
      label: "Research notes",
      detail:
        "Sources, claims, concepts, drafts, and topic maps connected inside the current system.",
      icon: "checklist",
    },
    {
      value: "3,783",
      label: "Indexed knowledge",
      detail: "Searchable knowledge units available to the intelligence layer.",
      icon: "spark",
    },
    {
      value: "9",
      label: "Topic maps",
      detail:
        "Living maps that connect research, claims, questions, and publishing opportunities.",
      icon: "pulse",
    },
    {
      value: "3",
      label: "Core workflows",
      detail: "Research, drafting, and coverage analysis inside one connected brain.",
      icon: "bot",
    },
  ],
  // Screenshots tell one story across both halves of the brain:
  //   knowledge enters -> structure forms -> connections emerge ->
  //   Cortex reasons -> Cortex creates.
  // All entries below are real assets. The intelligence-experience captures
  // that show reasoning and creation are not shot yet.
  //
  // TODO(screenshots): capture and add these app-experience views (fictitious
  // or non-sensitive source material only), then insert with the captions below:
  //   - Research answer with expanded source panel
  //       "Ask questions across the full knowledge system and keep the answer connected to its supporting sources."
  //   - Draft with inline citations
  //       "Turn connected research into a draft while preserving the path back to the source material."
  //   - Export Pack / independent review artifact
  //       "Package an answer, its context, and its supporting sources for independent review."
  //   - Provenance-filter comparison (evidence-quality filtering side by side)
  //   - Retrieval architecture diagram (hybrid search, fusion, reranking)
  screenshots: [
    {
      src: `${A}/cortex-dashboard-overview.png`,
      alt: "Cortex system overview with a knowledge-graph hero, key metrics, recent activity, source mix, and top-topic coverage in one view.",
      caption:
        "Cortex brings the living state of the research system into one operational view.",
      width: 1920,
      height: 1200,
      mobileSrc: `${A}/cortex-dashboard-overview-mobile.png`,
      mobileWidth: 1080,
      mobileHeight: 2337,
    },
    {
      src: `${A}/cortex-source-note.png`,
      alt: "A typed Cortex source note in Obsidian with structured frontmatter for provenance, format, evidence rating, and linked topics and claims.",
      caption:
        "Every source enters as a typed note, so its origin, evidence, and connections travel with it.",
      width: 1920,
      height: 1205,
    },
    {
      src: `${A}/cortex-dashboard-pipeline.png`,
      alt: "Cortex editorial pipeline moving from raw source to source note, quote, claim, and draft, with the current bottleneck stage flagged.",
      caption:
        "Research moves through a structured path from raw source to note, claim, and publishable draft.",
      width: 1920,
      height: 1200,
      mobileSrc: `${A}/cortex-dashboard-pipeline-mobile.png`,
      mobileWidth: 1080,
      mobileHeight: 2337,
    },
    {
      src: `${A}/cortex-dashboard-graph.png`,
      alt: "Cortex knowledge graph showing topic maps at the center with sources, claims, and concepts connected around them.",
      caption:
        "Sources, concepts, claims, and topic maps become a connected network rather than isolated files.",
      width: 1920,
      height: 1200,
      mobileSrc: `${A}/cortex-dashboard-graph-mobile.png`,
      mobileWidth: 1080,
      mobileHeight: 2337,
    },
    {
      src: `${A}/cortex-moc.png`,
      alt: "A Cortex Map of Content weaving anchor sources, approved claims, and concepts into one living topic document.",
      caption:
        "Topic maps weave sources, claims, and concepts into one living document instead of scattered files.",
      width: 1920,
      height: 1205,
    },
    {
      src: `${A}/cortex-source-index.png`,
      alt: "A Cortex multi-axis source index, grouped by organization, with additional access axes available.",
      caption:
        "One canonical note, many access paths, so the same knowledge can be reached however the question is framed.",
      width: 1920,
      height: 1205,
    },
    {
      src: `${A}/cortex-dashboard-coverage.png`,
      alt: "Cortex coverage view ranking every topic map by source depth, with thin-coverage topics flagged.",
      caption:
        "Coverage analysis reveals where the knowledge base is strong, thin, or missing important evidence.",
      width: 1920,
      height: 1200,
      mobileSrc: `${A}/cortex-dashboard-coverage-mobile.png`,
      mobileWidth: 1080,
      mobileHeight: 2337,
    },
    {
      src: `${A}/cortex-dashboard-triage.png`,
      alt: "Cortex triage queue showing an auto-drafted classification for each unreviewed note with approve, reset, and ignore actions.",
      caption:
        "Organize new research as it enters, so the system becomes more intelligent instead of more cluttered.",
      width: 1920,
      height: 1200,
      mobileSrc: `${A}/cortex-dashboard-triage-mobile.png`,
      mobileWidth: 1080,
      mobileHeight: 2337,
    },
    {
      src: `${A}/cortex-dashboard-evidence.png`,
      alt: "Cortex evidence-strength view with an evidence-level distribution, the high-evidence spine, and claims that need stronger support.",
      caption:
        "Evidence signals stay visible across the corpus, supporting judgment without becoming the whole product.",
      width: 1920,
      height: 1200,
      mobileSrc: `${A}/cortex-dashboard-evidence-mobile.png`,
      mobileWidth: 1080,
      mobileHeight: 2337,
    },
  ],
  howItWorks: [
    {
      title: "It absorbs knowledge",
      body: "Cortex brings research, sources, notes, quotes, claims, and drafts into one connected system. New information is organized as it enters instead of disappearing into folders or scattered documents.",
    },
    {
      title: "It remembers with structure",
      body: "Every item keeps its context: where it came from, what topic it supports, how it relates to other ideas, and where it sits in the publishing workflow.",
    },
    {
      title: "It connects what you know",
      body: "Cortex links sources, concepts, claims, topics, and drafts across the knowledge system, revealing relationships that are difficult to see when information lives in isolation.",
    },
    {
      title: "It reasons across the whole system",
      body: "Ask a question, explore a topic, or begin a draft. Cortex searches across the knowledge base, combines the strongest relevant material, and returns answers that remain connected to their sources.",
    },
    {
      title: "It turns knowledge into work",
      body: "Research can move from raw source to organized note, connected claim, and publishable draft without leaving the system or losing the trail back to the evidence.",
    },
  ],
  differentiators: [
    {
      title: "One brain, not a collection of tools",
      body: "Cortex brings the vault, knowledge graph, research workflow, retrieval system, drafting tools, and coverage analysis into one connected environment.",
    },
    {
      title: "Structure before automation",
      body: "Sources, notes, claims, topics, and drafts have defined roles and relationships before AI enters the workflow. The intelligence layer reasons over organized knowledge instead of an undifferentiated pile of text.",
    },
    {
      title: "Knowledge that builds on itself",
      body: "New research does not disappear after one task. It becomes part of a durable system that can support future questions, comparisons, claims, and drafts.",
    },
    {
      title: "Gaps become visible",
      body: "Coverage analysis shows where the system has strong support, where the evidence is thin, and where more research is needed.",
    },
    {
      title: "From source to publishing",
      body: "Cortex preserves the connection from raw research through notes, claims, and final work, making it easier to understand how an idea developed and what supports it.",
    },
    {
      title: "Safe write-back",
      body: "Generated research and drafts can return to the knowledge system as new files, while create-only rules protect the existing source of truth from being overwritten.",
    },
  ],
  differentiatorsNote:
    "Evidence signals and provenance controls remain available throughout the system, but Cortex is designed to help people think, connect, and create, not simply score sources.",
  techSections: [
    {
      title: "Obsidian knowledge architecture",
      body: "Cortex uses local Markdown and Obsidian as the durable foundation for sources, notes, claims, drafts, and topic maps. Structured frontmatter, controlled vocabularies, folder roles, links, and Dataview indexes turn the vault into a queryable knowledge model rather than a loose collection of documents.",
    },
    {
      title: "Connected ingestion and knowledge model",
      body: "New material is classified as it enters the system, enriched with source and evidence metadata, and connected to topics, concepts, claims, and publishing workflows. Claims and quotes can inherit context from the sources they reference, preserving provenance across the system.",
    },
    {
      title: "Hybrid retrieval and reasoning",
      body: "The intelligence layer combines semantic search with keyword retrieval, fuses the results, reranks them, and blends relevance with evidence quality. Cortex can then answer questions or develop drafts from the most useful parts of the knowledge system while keeping supporting sources visible.",
    },
    {
      title: "Coverage, creation, and review",
      body: "Coverage analytics show where the research base is strong or incomplete. Drafting tools use the vault’s knowledge and brand context, Export Packs support independent review, and create-only write-back allows new work to return to Cortex without overwriting existing knowledge.",
    },
  ],
  // Short plain-text fallback (required by the type). techSections renders;
  // this stays terse to avoid duplicating the long copy.
  techBreakdown: [
    "Obsidian knowledge architecture: a local Markdown vault with structured frontmatter, controlled vocabularies, links, and Dataview indexes.",
    "Connected ingestion and knowledge model: new material classified, enriched with source and evidence metadata, and linked to topics, claims, and workflows.",
    "Hybrid retrieval and reasoning: semantic and keyword search fused and reranked, blended with evidence quality, keeping sources visible.",
    "Coverage, creation, and review: coverage analytics, vault-aware drafting, Export Packs, and create-only write-back into the vault.",
  ],
  outcomes: [
    "Built a unified second-brain system that moves research from source capture through connected notes, claims, drafting, and review.",
    "Engineered a hybrid retrieval and reasoning layer that turns a structured Obsidian knowledge base into a queryable intelligence system.",
    "Created a closed-loop publishing workflow with coverage analysis, auditable source context, independent review packs, and protected write-back.",
  ],
  lessonsLearned: [
    "Knowledge becomes more useful when structure survives every stage. Sources, notes, claims, and drafts need clear relationships before an intelligence layer can reason across them well.",
    "A second brain should compound learning, not just store files. The system becomes more valuable when each new source strengthens future research, connections, and drafts.",
    "Retrieval quality is a product decision, not a default setting. Search, filtering, reranking, and evidence signals all shape what the system treats as important.",
    "Automation earns trust when it proposes and connects without overwriting the source of truth. Create-only write-back keeps the human in control of what becomes permanent knowledge.",
  ],
};
