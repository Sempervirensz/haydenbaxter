"use client";

// Live Parallax Sample — previews SiteParallaxEnhancer on the *real* homepage
// section markup (not the reimagined mocks in SiteParallaxLab). This is a
// faithful snapshot of the experiment that briefly shipped into page.tsx and the
// production section components; it was pulled back out to keep the homepage
// parallax-free, and preserved here so the tuning stays runnable.
//
// Route: /site-parallax-lab/live  (noindex)
//
// Motion contract (see SiteParallaxEnhancer):
//   data-site-plx-y / -x      drift, fractions of viewport height
//   data-site-plx-scale       recede as the scene leaves center
//   data-site-plx-fade        fade as the scene leaves center
//   data-site-plx-rot         settle rotation (deg) at the scene edges
//
// WorkSection is intentionally omitted — it carries no parallax and its sticky
// scroll interaction would dominate the reel.

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import CardDeck from "@/components/CardDeck";
import SiteParallaxEnhancer from "@/components/SiteParallaxEnhancer";
import { SITE_CONTENT, type BrandLogo } from "@/data/siteContent";
import { ABOUT_DATA } from "@/data/about";
import { CONNECT_LINKS, WECHAT_ID, CALENDLY_URL } from "@/data/connect";
import { JOURNAL_COPY, BLOG_POSTS } from "@/data/journal";
import "./live-parallax-sample.css";

function HeroPlx() {
  const { hero } = SITE_CONTENT;
  return (
    <section
      className="flex flex-col items-center relative bg-[#0a0a0a] overflow-hidden"
      data-site-plx-scene
    >
      <Navbar />
      <div
        className="flex flex-col items-center justify-center text-center px-5 sm:px-4 pt-20 sm:pt-32 pb-12 sm:pb-20"
        data-site-plx-y="0.08"
        data-site-plx-fade="0.16"
      >
        <p
          className="text-[10px] sm:text-sm tracking-[0.04em] text-white/60 mb-3 sm:mb-6"
          style={{ fontFamily: "var(--font-sans)" }}
          data-site-plx-y="0.08"
        >
          {hero.eyebrow}
        </p>
        <h1
          className="text-[22px] sm:text-5xl md:text-7xl lg:text-8xl font-normal leading-[1.1] sm:leading-[1.05] max-w-4xl"
          style={{ fontFamily: "var(--font-serif)" }}
          data-site-plx-y="0.14"
          data-site-plx-scale="0.03"
        >
          {hero.heading}
        </h1>
      </div>
    </section>
  );
}

function BrandsPlx() {
  const { logos, repeats, context, note } = SITE_CONTENT.brands;
  const items: BrandLogo[] = [];
  for (let i = 0; i < repeats; i++) {
    for (const logo of logos) items.push(logo);
  }
  return (
    <section className="brands" aria-label="Brands worked with" data-site-plx-scene>
      <div className="brands__rail" data-site-plx-x="-0.08">
        <div className="brands__track">
          {items.map((brand, idx) =>
            brand.imageSrc ? (
              <span key={idx} className="brands__logo brands__logo--img" data-brand={brand.label.toLowerCase()}>
                <img src={brand.imageSrc} alt={brand.label} loading="lazy" decoding="async" />
              </span>
            ) : (
              <span key={idx} className="brands__logo">
                {brand.label}
              </span>
            )
          )}
        </div>
      </div>
      <p className="brands__context" data-site-plx-y="0.08">{context}</p>
      <p className="brands__note" data-site-plx-y="0.12">{note}</p>
    </section>
  );
}

function ConnectPlx() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (document.querySelector('script[src*="calendly.com/assets/external/widget.js"]')) return;
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <section id="connect" className="connect" data-site-plx-scene>
      <h2 className="connect__heading" data-site-plx-y="0.08">Connect</h2>

      <div className="connect__grid" data-site-plx-y="0.16" data-site-plx-rot="1.5">
        {CONNECT_LINKS.map((link) => {
          if (link.href === null) {
            return (
              <span key={link.id} className="tag tag--connect tag--display">
                {link.label}
                <span className="connect__id">{WECHAT_ID}</span>
              </span>
            );
          }
          return (
            <a
              key={link.id}
              href={link.href}
              className="tag tag--connect"
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {link.label}
            </a>
          );
        })}
      </div>

      {mounted && (
        <div
          className="calendly-inline-widget connect__calendly"
          data-url={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=0a0a0a&text_color=f3f3f3&primary_color=ffffff`}
          data-site-plx-y="0.06"
        />
      )}
    </section>
  );
}

function AboutPlx() {
  return (
    <section id="about" className="about" data-site-plx-scene>
      <h2 className="about__heading" data-site-plx-y="0.08">{ABOUT_DATA.heading}</h2>
      <p className="about__intro" data-site-plx-y="0.12">{ABOUT_DATA.intro}</p>

      <div className="about__gallery">
        {ABOUT_DATA.photos.map((photo, i) => (
          <div
            key={i}
            className={`about__photo about__photo--${i + 1}`}
            data-site-plx-y={String(0.06 + (i % 3) * 0.045)}
            data-site-plx-rot={String((i - 2) * 0.8)}
          >
            <img src={photo.src} alt={photo.alt} loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
}

function JournalPlx() {
  const featured = BLOG_POSTS.slice(0, 3);
  return (
    <section id="journal" className="journal" data-site-plx-scene>
      <h2 className="journal__heading" data-site-plx-y="0.08">{JOURNAL_COPY.heading}</h2>
      <p className="journal__subline" data-site-plx-y="0.12">{JOURNAL_COPY.subline}</p>

      {featured.length > 0 && (
        <div className="journal__posts">
          {featured.map((post, index) => (
            <div
              key={post.slug}
              className="journal__plx-card"
              data-site-plx-y={String(0.1 + index * 0.045)}
              data-site-plx-rot={String((index - 1) * 1.2)}
            >
              <Link href={`/blog/${post.slug}`} className="journal__card">
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
            </div>
          ))}
        </div>
      )}

      <Link href={JOURNAL_COPY.ctaHref} className="tag tag--journal" data-site-plx-y="0.08">
        {JOURNAL_COPY.ctaLabel}
      </Link>
    </section>
  );
}

export default function LiveParallaxSample() {
  return (
    <main data-site-plx-root>
      <SiteParallaxEnhancer />
      <HeroPlx />
      <section className="bg-[#0a0a0a] relative pb-8" data-site-plx-scene>
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20 blur-[120px] pointer-events-none"
          data-site-plx-y="-0.1"
          data-site-plx-scale="-0.05"
          style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.15), transparent)" }}
        />
        <CardDeck />
      </section>
      <BrandsPlx />
      <ConnectPlx />
      <AboutPlx />
      <JournalPlx />
    </main>
  );
}
