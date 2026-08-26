import type { ETBDemoDetail } from "@/data/work";

/** "View full details" content for CaseBrief, a legal document intelligence
 *  platform that turns scattered medical records into a source-backed case
 *  narrative for law-firm review workflows. Same detail shape as AtomicOS. */
export const CASEBRIEF_DEMO: ETBDemoDetail = {
  heroCategory: "Case Intelligence",
  story: [
    "An injury does not arrive as a clean story. It is scattered across emergency-room notes, imaging reports, treatment records, bills, and follow-up documents. Important details may be buried, repeated, or missing entirely.",
    "CaseBrief brings those fragments together into a clear, source-backed narrative of what happened, how treatment unfolded, and what still needs attention. Legal teams can move from raw records to a structured case picture faster while keeping every important point connected to the underlying evidence.",
    "CaseBrief delivers a fuller understanding of the client’s health journey, so the case can be built with greater care, clarity, and confidence.",
  ],
  principle:
    "Every client deserves a case built from the full story, not fragments of the record.",
  // No detail screenshots have been captured yet. Empty array = the Screenshots
  // section does not render (no broken images, no "Coming soon" placeholder).
  // TODO(screenshots): capture these five, in this order, with fictitious case
  // data only, then add them here as ETBScreenshot entries with the captions
  // below. Store under /public/assets/casebrief-demo/.
  //   1. Case intake and upload
  //      "Bring the client’s medical records and supporting documents into one reviewable case workspace."
  //   2. Structured case summary + cited treatment timeline
  //      "Turn a scattered record into a clear chronology of injury, treatment, and recovery."
  //   3. Missing-information checklist
  //      "Surface referenced but missing records before they slow down the case."
  //   4. Expanded source citation
  //      "Verify every important point against the exact source text and page."
  //   5. (Optional) processing / document-indexing view
  //      "Preserve page-level provenance from document ingestion through final review."
  screenshots: [],
  howItWorks: [
    {
      title: "Bring the full record together",
      body: "Upload the medical records, treatment notes, bills, imaging reports, and supporting documents connected to the case. CaseBrief organizes the material into one reviewable case workspace.",
    },
    {
      title: "Build the client’s health narrative",
      body: "CaseBrief identifies the major events across the record and turns them into a structured story of injury, treatment, recovery, and ongoing needs.",
    },
    {
      title: "Surface the missing pieces",
      body: "The system looks for records, reports, or follow-up care that are referenced but not present, helping legal teams identify gaps before they slow the case down.",
    },
    {
      title: "Verify every important point",
      body: "Each material statement connects back to the underlying source and page, so reviewers can confirm the evidence without searching through the entire file again.",
    },
  ],
  differentiators: [
    {
      title: "The client’s full narrative",
      body: "CaseBrief connects injury, treatment, recovery, and ongoing needs across records that were never designed to tell one coherent story.",
    },
    {
      title: "Missing-piece detection",
      body: "The system identifies records, reports, and follow-up care that are referenced in the file but may not be included, helping teams address gaps earlier.",
    },
    {
      title: "Source-backed by design",
      body: "Every material statement remains connected to the document and page that supports it. If the analysis cannot cite the record, it should not present the claim as fact.",
    },
    {
      title: "Structured case review",
      body: "CaseBrief returns a consistent case summary, treatment timeline, missing-information review, and source references instead of an unstructured chat response.",
    },
    {
      title: "Human verification built in",
      body: "Reviewers can open the supporting passage behind a conclusion, confirm the evidence, and keep professional judgment at the center of the workflow.",
    },
  ],
  differentiatorsNote:
    "CaseBrief accelerates professional review while keeping evidence verification and legal judgment in human hands.",
  techSections: [
    {
      title: "Document intelligence pipeline",
      body: "CaseBrief extracts case documents page by page, preserves source location throughout processing, and converts the record into indexed evidence that can be retrieved during analysis.",
    },
    {
      title: "Structured retrieval and reasoning",
      body: "The retrieval layer identifies the most relevant evidence for each review question. The reasoning layer then returns a predictable structure for summaries, treatment events, missing information, warnings, and source references.",
    },
    {
      title: "Source grounding and validation",
      body: "Page references are preserved from ingestion through final output. Citation requirements are enforced through both prompt design and backend validation, and unsupported responses are rejected before they reach the reviewer.",
    },
    {
      title: "Modular product architecture",
      body: "A typed web interface, API layer, document-processing service, retrieval system, and model layer are separated into distinct components. This creates a clear path toward persistent matter storage, firm workspaces, role-based access, audit histories, and larger document volumes without redesigning the core review experience.",
    },
  ],
  // Short plain-text fallback (required by the type). techSections above is what
  // actually renders; this stays terse to avoid duplicating the long copy.
  techBreakdown: [
    "Document intelligence pipeline: page-by-page extraction with preserved source locations, indexed for retrieval.",
    "Structured retrieval and reasoning: relevant-evidence retrieval feeding a predictable, structured output.",
    "Source grounding and validation: page references preserved end to end, with citation requirements enforced before output.",
    "Modular architecture: separate web, API, document-processing, retrieval, and model layers, with a path to firm scale.",
  ],
  outcomes: [
    "Built an end-to-end case-review workflow that converts raw documents into a structured, source-verifiable case narrative.",
    "Engineered citation grounding into both the analysis process and backend validation so unsupported claims are blocked before reaching the reviewer.",
    "Created a modular legal document intelligence architecture that can expand across matter storage, firm workspaces, access controls, and higher document volumes.",
  ],
  lessonsLearned: [
    "Provenance has to begin when a document is ingested. Preserving page references from the start makes every later conclusion easier to trust and verify.",
    "AI reliability comes from the system surrounding the model. Structured outputs, citation requirements, and backend validation matter as much as the generation itself.",
    "The strongest legal AI does not replace professional judgment. It removes repetitive searching and organization so legal teams can spend more time understanding the client and building the case.",
  ],
};
