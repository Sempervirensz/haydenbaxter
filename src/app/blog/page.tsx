import { socialCard } from "@/data/site";
import type { Metadata } from "next";
import Link from "next/link";
import { JOURNAL_COPY, BLOG_POSTS } from "@/data/journal";
import JsonLd from "@/components/JsonLd";
import { blogIndexGraph, toIsoDate } from "@/data/schema";

export const metadata: Metadata = {
  title: "Journal",
  description: JOURNAL_COPY.subline,
  alternates: { canonical: "/blog" },
  ...socialCard({ title: "Journal | Hayden Baxter", description: JOURNAL_COPY.subline, path: "/blog" }),

};

export default function BlogIndexPage() {
  return (
    <main className="blog-index">
      <JsonLd
        data={blogIndexGraph({
          path: "/blog",
          name: JOURNAL_COPY.heading,
          description: JOURNAL_COPY.subline,
          posts: BLOG_POSTS.map((post) => ({
            path: `/blog/${post.slug}`,
            title: post.title,
            datePublished: toIsoDate(post.date),
          })),
        })}
      />
      <Link href="/" className="etb-gallery__back">
        <span aria-hidden="true">&larr;</span>
        <span>Back to home</span>
      </Link>

      <header className="blog-index__head">
        <span className="blog-index__eyebrow">Writing</span>
        <h1 className="blog-index__title">{JOURNAL_COPY.heading}</h1>
        <p className="blog-index__subline">{JOURNAL_COPY.subline}</p>
      </header>

      {BLOG_POSTS.length === 0 ? (
        <p className="blog-index__empty">No posts yet — check back soon.</p>
      ) : (
        <ul className="blog-index__grid">
          {BLOG_POSTS.map((post) => (
            <li key={post.slug} className="blog-index__item">
              <Link href={`/blog/${post.slug}`} className="blog-index__card">
                <div className="blog-index__cardImg">
                  <img src={post.thumbnail} alt="" loading="lazy" />
                </div>
                <div className="blog-index__cardBody">
                  <span className="blog-index__cardDate">{post.date}</span>
                  <h2 className="blog-index__cardTitle">{post.title}</h2>
                  <p className="blog-index__cardExcerpt">{post.excerpt}</p>
                  {post.tags.length > 0 && (
                    <ul className="blog-index__cardTags">
                      {post.tags.slice(0, 3).map((tag) => (
                        <li key={tag} className="blog-index__cardTag">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                  <span className="blog-index__cardCta">
                    Read article <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
