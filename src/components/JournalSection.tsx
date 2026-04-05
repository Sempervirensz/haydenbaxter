import { JOURNAL_DATA } from "@/data/journal";

export default function JournalSection() {
  return (
    <section id="journal" className="journal">
      <h2 className="journal__heading">{JOURNAL_DATA.heading}</h2>
      <p className="journal__subline">{JOURNAL_DATA.subline}</p>

      <div className="journal__posts">
        {JOURNAL_DATA.posts.map((post) => (
          <a
            key={post.href}
            href={post.href}
            className="journal__card"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="journal__card-img">
              <img src={post.image} alt="" loading="lazy" />
            </div>
            <div className="journal__card-body">
              <span className="journal__card-date">{post.date}</span>
              <h3 className="journal__card-title">{post.title}</h3>
              <p className="journal__card-excerpt">{post.excerpt}</p>
              <span className="journal__card-cta">Read article &rarr;</span>
            </div>
          </a>
        ))}
      </div>

      <a
        href={JOURNAL_DATA.blogUrl}
        className="tag tag--journal"
        target="_blank"
        rel="noopener noreferrer"
      >
        {JOURNAL_DATA.blogLabel}
      </a>
    </section>
  );
}
