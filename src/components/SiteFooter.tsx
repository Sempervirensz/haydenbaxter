import Link from "next/link";
import { CONNECT_LINKS } from "@/data/connect";
import { SITE_NAME } from "@/data/site";
import "./site-footer.css";

// Minimal, dark, mono-labelled footer. Carries the legal link + primary
// external contacts so they're reachable from the bottom of every page.
export default function SiteFooter() {
  const year = new Date().getFullYear();
  const externalLinks = CONNECT_LINKS.filter((l) => l.href);

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <span className="site-footer__copy">
          © {year} {SITE_NAME}
        </span>
        <nav className="site-footer__nav" aria-label="Footer">
          {externalLinks.map((link) => (
            <a
              key={link.id}
              href={link.href as string}
              className="site-footer__link"
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {link.label}
            </a>
          ))}
          <Link href="/privacy" className="site-footer__link">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
