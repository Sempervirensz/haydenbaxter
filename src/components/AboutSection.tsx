"use client";

import { useCallback, useState } from "react";
import { ABOUT_DATA } from "@/data/about";

function Photo({
  src,
  alt,
  index,
  w,
  h,
}: {
  src: string;
  alt: string;
  index: number;
  w: number;
  h: number;
}) {
  // `attempt` 0 is the plain URL; 1 is a single cache-busted retry. A dropped
  // connection used to leave a permanent placeholder, which is how a healthy
  // image could end up "missing" on desktop where all five load at once.
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);

  const imgRef = useCallback((img: HTMLImageElement | null) => {
    if (!img) return;
    // A load that already errored before React attached the ref (cached
    // failure). `currentSrc` is empty while a lazy image is still deferred,
    // so this can't misfire on an image that simply hasn't started yet.
    if (img.complete && img.naturalWidth === 0 && img.currentSrc) {
      setFailed(true);
    }
  }, []);

  const handleError = useCallback(() => {
    setAttempt((a) => {
      if (a === 0) return 1;
      setFailed(true);
      return a;
    });
  }, []);

  return (
    <div className={`about__photo about__photo--${index + 1}`}>
      {!failed ? (
        <img
          key={attempt}
          ref={imgRef}
          src={attempt === 0 ? src : `${src}?retry=1`}
          alt={alt}
          width={w}
          height={h}
          loading="lazy"
          decoding="async"
          onError={handleError}
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
          <Photo
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            index={i}
            w={photo.w}
            h={photo.h}
          />
        ))}
      </div>
    </section>
  );
}
