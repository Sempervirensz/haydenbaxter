import Link from "next/link";
import { JOURNAL_COPY, BLOG_POSTS } from "@/data/journal";

export default function JournalSection() {
  // Featured cards: most recent three.
  const featured = BLOG_POSTS.slice(0, 3);

  return (
    <section id="journal" className="journal">
      <h2 className="journal__heading">{JOURNAL_COPY.heading}</h2>
      <p className="journal__subline">{JOURNAL_COPY.subline}</p>

      {featured.length > 0 && (
        <div className="journal__posts">
          {featured.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="journal__card"
            >
              <div className="journal__card-img">
                <img src={post.thumbnail} alt="" loading="lazy" />
              </div>
              <div className="journal__card-body">
                <span className="journal__card-date">{post.date}</span>
                <h3 className="journal__card-title">{post.title}</h3>
                <p className="journal__card-excerpt">{post.excerpt}</p>
                <span className="journal__card-cta">Read article &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link href={JOURNAL_COPY.ctaHref} className="tag tag--journal">
        {JOURNAL_COPY.ctaLabel}
      </Link>
    </section>
  );
}
