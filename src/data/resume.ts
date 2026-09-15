/* Copy for the /resume page.
 *
 * Written by hand and deliberately NOT derived from the Work Together
 * "experience" destination, which this page used to read from. That earlier
 * version inherited every edit to work.ts / about.ts for free; this one does
 * not. It is a real trade and it was made on purpose: the voice here is first
 * person and the framing is different from the third-person copy the rest of
 * the site uses, and no amount of reuse would have produced it.
 *
 * The consequence to remember: editing work.ts or about.ts no longer updates
 * this page. This file is the only place /resume's words live.
 */

export const RESUME_COPY = {
  /** Mono eyebrow above the name, matching the "Legal" eyebrow on /privacy. */
  eyebrow: "Resume",
  role: "Founder, WorldPulse",
  lede:
    "I spent eight years sourcing product across China, Vietnam, and Indonesia " +
    "for Nike, Converse, Disney, and Aosom before I started building software. " +
    "Now I run WorldPulse, a platform for digital product passports and supply " +
    "chain traceability, and build a few other tools on the side.",

  /* Stated by hand, unlike the file size, which is read off disk at build
     time. The PDF's mtime is its checkout or upload time rather than the date
     the document was written, so deriving these would relabel the resume on
     every deploy. */
  updated: "September 2026",
  pageCount: "2 pages",

  sections: [
    {
      label: "Background",
      items: [
        "8+ years in sourcing and supply chain operations at Nike, Converse, Disney, Aosom, and Three Tree",
        "Supplier networks in China, Vietnam, and Indonesia",
        "M.S., Artificial Intelligence in Business, Arizona State University",
        "Fluent in Mandarin",
      ],
    },
    {
      label: "Selected work",
      items: [
        "WorldPulse: digital product passports for supply chain traceability",
        "ProcureBridge: supplier scoring and procurement intelligence",
        "Cortex: source-backed AI for editorial research",
        "CaseBrief: turns medical records into case narratives for legal teams",
        "AtomicOS: a personal operating system for habits",
        "OpenClaw: turns rough concepts into working internal tools",
        "Supplier ops and data governance work at Nike, Converse, Disney, and Aosom",
        "AI roadmap and MVP prototype sprints",
      ],
    },
  ],
} as const;
