import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getBlogPostBySlug } from "@/data/journal";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: `${post.title} — Journal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.hero ? [{ url: post.hero }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="blog-post">
      <Link href="/blog" className="etb-gallery__back">
        <span aria-hidden="true">&larr;</span>
        <span>Back to journal</span>
      </Link>

      <article className="blog-post__article">
        <div className="blog-post__hero">
          <img src={post.hero} alt="" loading="eager" />
        </div>

        <header className="blog-post__head">
          <div className="blog-post__meta">
            <span>{post.date}</span>
            <span className="blog-post__metaSep" aria-hidden="true" />
            <span>{post.author}</span>
          </div>

          <h1 className="blog-post__title">{post.title}</h1>
          <p className="blog-post__excerpt">{post.excerpt}</p>

          {post.tags.length > 0 && (
            <ul className="blog-post__tags">
              {post.tags.map((tag) => (
                <li key={tag} className="blog-post__tag">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </header>

        {/* Exhaustive over BlogBlock. The previous version tested for
            `heading` and rendered EVERYTHING else as <p>{block.text}</p>, but
            the union also carries `list` (items, no text) and `quote`. Lists
            therefore rendered as empty paragraphs — the published Innovation
            Forum post lost six of them silently — and the same mismatch failed
            the build. The `never` default makes a future block type a compile
            error instead of another invisible gap. */}
        <div className="blog-post__body">
          {post.body.map((block, i) => {
            switch (block.type) {
              case "heading":
                return (
                  <h2 key={i} className="blog-post__h2">
                    {block.text}
                  </h2>
                );
              case "list":
                return (
                  <ul key={i} className="blog-post__list">
                    {block.items.map((item, j) => (
                      <li key={j} className="blog-post__li">
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              case "quote":
                return (
                  <blockquote key={i} className="blog-post__quote">
                    {block.text}
                  </blockquote>
                );
              case "paragraph":
                return (
                  <p key={i} className="blog-post__p">
                    {block.text}
                  </p>
                );
              default: {
                const unhandled: never = block;
                return unhandled;
              }
            }
          })}
        </div>
      </article>

      <Link href="/blog" className="etb-page__backFooter">
        <span aria-hidden="true">&larr;</span>
        <span>Back to journal</span>
      </Link>
    </main>
  );
}
