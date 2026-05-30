"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ETBScreenshot } from "@/data/work";

interface Props {
  screenshots: ETBScreenshot[];
}

/** Screenshot gallery with an accessible click-to-zoom lightbox.
 *  ESC / arrow keys, focus management, scroll lock, reduced-motion safe. */
export default function DemoScreenshots({ screenshots }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const isOpen = openIndex !== null;

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (dir: number) =>
      setOpenIndex((i) =>
        i === null ? i : (i + dir + screenshots.length) % screenshots.length,
      ),
    [screenshots.length],
  );

  // Inline carousel position (independent of the lightbox).
  const [slide, setSlide] = useState(0);
  const goSlide = useCallback(
    (dir: number) =>
      setSlide((i) => (i + dir + screenshots.length) % screenshots.length),
    [screenshots.length],
  );

  // Scroll lock + keyboard handling while the lightbox is open.
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close, step]);

  // Restore focus to the trigger that opened the lightbox.
  const lastIndex = useRef<number | null>(null);
  useEffect(() => {
    if (openIndex !== null) lastIndex.current = openIndex;
    else if (lastIndex.current !== null) {
      triggerRefs.current[lastIndex.current]?.focus();
    }
  }, [openIndex]);

  const active = openIndex !== null ? screenshots[openIndex] : null;

  return (
    <>
      <div className="etb-carousel">
        <div className="etb-carousel__viewport">
          <div
            className="etb-carousel__track"
            style={{ transform: `translateX(-${slide * 100}%)` }}
          >
            {screenshots.map((shot, i) => (
              <div
                className="etb-carousel__slide"
                key={shot.src}
                aria-hidden={i !== slide}
              >
                <figure className={`etb-shot etb-shot--${shot.variant ?? "wide"}`}>
                  <button
                    type="button"
                    className="etb-shot__trigger"
                    onClick={() => setOpenIndex(i)}
                    aria-label={`Expand screenshot: ${shot.caption ?? shot.alt}`}
                    tabIndex={i === slide ? 0 : -1}
                    ref={(el) => {
                      triggerRefs.current[i] = el;
                    }}
                  >
                    <span className="etb-shot__frame">
                      <picture>
                        {shot.mobileSrc ? (
                          <source
                            media="(max-width: 640px)"
                            srcSet={shot.mobileSrc}
                            width={shot.mobileWidth}
                            height={shot.mobileHeight}
                          />
                        ) : null}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="etb-shot__img"
                          src={shot.src}
                          alt={shot.alt}
                          width={shot.width}
                          height={shot.height}
                          loading="lazy"
                        />
                      </picture>
                    </span>
                    <span className="etb-shot__zoom" aria-hidden="true">
                      Click to zoom
                    </span>
                  </button>
                  {shot.caption ? (
                    <figcaption className="etb-shot__caption">
                      {shot.caption}
                    </figcaption>
                  ) : null}
                </figure>
              </div>
            ))}
          </div>
        </div>

        {screenshots.length > 1 ? (
          <div className="etb-carousel__controls">
            <button
              type="button"
              className="etb-carousel__btn"
              onClick={() => goSlide(-1)}
              aria-label="Previous screenshot"
            >
              <span aria-hidden="true">&larr;</span>
            </button>
            <div className="etb-carousel__dots">
              {screenshots.map((shot, i) => (
                <button
                  key={shot.src}
                  type="button"
                  className={
                    i === slide
                      ? "etb-carousel__dot is-active"
                      : "etb-carousel__dot"
                  }
                  onClick={() => setSlide(i)}
                  aria-label={`Go to screenshot ${i + 1}`}
                  aria-current={i === slide}
                />
              ))}
            </div>
            <button
              type="button"
              className="etb-carousel__btn"
              onClick={() => goSlide(1)}
              aria-label="Next screenshot"
            >
              <span aria-hidden="true">&rarr;</span>
            </button>
            <span className="etb-carousel__count">
              {slide + 1} / {screenshots.length}
            </span>
          </div>
        ) : null}
      </div>

      {active ? (
        <div
          className="etb-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={active.caption ?? active.alt}
          onClick={close}
        >
          <button
            type="button"
            className="etb-lightbox__close"
            onClick={close}
            ref={closeRef}
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>

          {screenshots.length > 1 ? (
            <button
              type="button"
              className="etb-lightbox__nav etb-lightbox__nav--prev"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              aria-label="Previous screenshot"
            >
              <span aria-hidden="true">&larr;</span>
            </button>
          ) : null}

          <figure
            className={`etb-lightbox__figure etb-lightbox__figure--${active.variant ?? "wide"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <picture>
              {active.mobileSrc ? (
                <source
                  media="(max-width: 640px)"
                  srcSet={active.mobileSrc}
                  width={active.mobileWidth}
                  height={active.mobileHeight}
                />
              ) : null}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="etb-lightbox__img"
                src={active.src}
                alt={active.alt}
                width={active.width}
                height={active.height}
              />
            </picture>
            {active.caption ? (
              <figcaption className="etb-lightbox__caption">
                {active.caption}
              </figcaption>
            ) : null}
          </figure>

          {screenshots.length > 1 ? (
            <button
              type="button"
              className="etb-lightbox__nav etb-lightbox__nav--next"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              aria-label="Next screenshot"
            >
              <span aria-hidden="true">&rarr;</span>
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
