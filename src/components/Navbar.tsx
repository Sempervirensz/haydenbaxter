import { SITE_CONTENT } from "@/data/siteContent";

export default function Navbar() {
  const { wordmark, navLinks } = SITE_CONTENT.header;

  return (
    <nav
      className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 sm:px-8 lg:px-12 py-4 sm:py-6"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <span className="text-white text-xs sm:text-sm font-medium tracking-wide">{wordmark}</span>
      <div className="flex items-center gap-2 sm:gap-3">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={`tag ${link.cta ? "tag--cta" : "tag--nav"}`}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
