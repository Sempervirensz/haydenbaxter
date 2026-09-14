import { statSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import { SITE_NAME, socialCard } from "@/data/site";
import { RESUME_FILE_HREF } from "@/data/workTogether";
import { RESUME_PREVIEW } from "@/data/resumePreview";
import { RESUME_COPY } from "@/data/resume";
import "./resume.css";

const DESCRIPTION =
  "Eight years sourcing product for Nike, Disney, and Aosom across China, Vietnam, " +
  "and Indonesia, now building WorldPulse. Preview and download the resume.";

export const metadata: Metadata = {
  title: "Resume",
  description: DESCRIPTION,
  alternates: { canonical: "/resume" },
  ...socialCard({ title: `Resume | ${SITE_NAME}`, description: DESCRIPTION, path: "/resume" }),
};

/* The file's size is a fact about the file and nothing else, so it is read at
   build time and can never disagree with what the visitor downloads. A missing
   file degrades to no size rather than failing the build; check:assets is what
   actually guards the asset's existence. The date and page count are editorial
   and live in RESUME_COPY — see the note there. */
function fileSizeLabel(): string | null {
  try {
    const bytes = statSync(path.join(process.cwd(), "public", RESUME_FILE_HREF)).size;
    return `${Math.round(bytes / 1024)} KB`;
  } catch {
    return null;
  }
}

export default function ResumePage() {
  const meta = [RESUME_COPY.updated, RESUME_COPY.pageCount, fileSizeLabel(), "PDF"]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <main className="resume">
        <Link href="/" className="resume__back">
          <span aria-hidden="true">←</span>
          <span>Back to home</span>
        </Link>

        <header className="resume__head">
          <span className="resume__eyebrow">{RESUME_COPY.eyebrow}</span>
          <h1>{SITE_NAME}</h1>
          <p className="resume__role">{RESUME_COPY.role}</p>
          <p className="resume__lede">{RESUME_COPY.lede}</p>

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

          <p className="resume__meta">{meta}</p>
        </header>

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

        <div className="resume__sections">
          {RESUME_COPY.sections.map((section) => (
            <section className="resume__block" key={section.label}>
              {/* A real heading, styled as the mono label: the page keeps its
                  outline for anyone navigating by headings. */}
              <h2 className="resume__block-label">{section.label}</h2>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
