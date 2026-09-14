import { statSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import { SITE_NAME, socialCard } from "@/data/site";
import { RESUME_FILE_HREF, getPath } from "@/data/workTogether";
import { RESUME_PREVIEW } from "@/data/resumePreview";
import "./resume.css";

const DESCRIPTION = `Preview and download ${SITE_NAME}'s resume: global sourcing, supplier operations, traceability, data governance, and AI product strategy.`;

export const metadata: Metadata = {
  title: "Resume",
  description: DESCRIPTION,
  alternates: { canonical: "/resume" },
  ...socialCard({ title: `Resume | ${SITE_NAME}`, description: DESCRIPTION, path: "/resume" }),
};

/* The document's own facts.

   `updated` and `pages` are editorial and stated by hand: the file's mtime is
   the checkout or upload time, not the date the resume was written, so reading
   it from disk would relabel the document on every deploy. The byte size is
   the opposite case — it is a fact about the file and nothing else, so it is
   read at build time and can never drift from what the visitor downloads.
   A missing file degrades to no size chip rather than failing the build;
   `check:assets` is what actually guards the asset's existence. */
const UPDATED = "September 2026";
const PAGE_COUNT = "1 page";

function fileSizeLabel(): string | null {
  try {
    const bytes = statSync(path.join(process.cwd(), "public", RESUME_FILE_HREF)).size;
    return `${Math.round(bytes / 1024)} KB`;
  } catch {
    return null;
  }
}

export default function ResumePage() {
  const size = fileSizeLabel();
  // Reuses the Work Together "Review My Experience" destination rather than
  // restating the resume in a second place. That block is already the
  // compressed mirror of work.ts / about.ts, so this page inherits every
  // future edit to it instead of drifting from one.
  const experiencePath = getPath("experience");
  const experience = experiencePath.destination;

  return (
    <>
      <main className="resume">
        <Link href="/" className="resume__back">
          <span aria-hidden="true">←</span>
          <span>Back to home</span>
        </Link>

        <header className="resume__head">
          <span className="resume__eyebrow">Resume</span>
          <h1>{SITE_NAME}</h1>
          <p className="resume__role">{experiencePath.meta}</p>
          <p className="resume__lede">{experience.lede}</p>

          <div className="resume__actions">
            <a
              className="tag tag--cta resume__action"
              href={RESUME_FILE_HREF}
              download="Hayden-Baxter-Resume.pdf"
            >
              Download PDF
            </a>
            <a
              className="tag resume__action"
              href={RESUME_FILE_HREF}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in new tab
            </a>
          </div>

          <p className="resume__meta">
            {[UPDATED, PAGE_COUNT, size, "PDF"].filter(Boolean).join(" · ")}
          </p>
        </header>

        {/* Two presentations of the same file, switched by CSS at a width where
            inline PDF rendering stops being reliable. Both are always in the
            markup so the swap costs no JavaScript and shifts no layout. */}
        {/* A rendered image of page 1, not the PDF itself.
            The site sends `X-Frame-Options: DENY` and `frame-ancestors 'none'`
            on every response, so an <iframe>/<object> of the PDF is refused
            unless that hardening is relaxed. An image keeps the headers
            untouched, and for a one-page resume it is the better preview
            anyway: iOS will not render an inline PDF at all, so this is the
            only version of the preview a phone can actually show.
            width/height are the file's real pixels, so the box is reserved
            before the image arrives and nothing shifts. */}
        <section className="resume__viewer">
          <a
            className="resume__doc-link"
            href={RESUME_FILE_HREF}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="resume__doc"
              src={RESUME_PREVIEW.src}
              width={RESUME_PREVIEW.width}
              height={RESUME_PREVIEW.height}
              alt={`Page one of ${SITE_NAME}'s resume. Opens the full PDF.`}
              loading="lazy"
              decoding="async"
            />
          </a>
        </section>

        <section className="resume__glance">
          <h2>At a glance</h2>
          {experience.blocks.map((block) => (
            <div className="resume__block" key={block.label}>
              <span className="resume__block-label">{block.label}</span>
              <p className="resume__block-descriptor">{block.descriptor}</p>
              <ul>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}

          <ul className="resume__signals">
            {experience.signals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
