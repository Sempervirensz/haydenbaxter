"use client";

import { useCallback, useState } from "react";
import { ABOUT_DATA } from "@/data/about";

function Photo({ src, alt, index }: { src: string; alt: string; index: number }) {
  const [failed, setFailed] = useState(false);

  const imgRef = useCallback((img: HTMLImageElement | null) => {
    if (!img) return;
    // Check if already failed (complete but no actual image data)
    if (img.complete && img.naturalWidth === 0) {
      setFailed(true);
    }
  }, []);

  return (
    <div className={`about__photo about__photo--${index + 1}`}>
      {!failed ? (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="about__photo-empty">
          <span>{alt}</span>
        </div>
      )}
    </div>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="about">
      <h2 className="about__heading">{ABOUT_DATA.heading}</h2>
      <p className="about__intro">{ABOUT_DATA.intro}</p>

      <div className="about__gallery">
        {ABOUT_DATA.photos.map((photo, i) => (
          <Photo key={i} src={photo.src} alt={photo.alt} index={i} />
        ))}
      </div>
    </section>
  );
}
