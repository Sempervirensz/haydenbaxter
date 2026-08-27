"use client";

import { useEffect, useRef, useState } from "react";
import { CONNECT_LINKS, WECHAT_ID } from "@/data/connect";
import CalendlyEmbed from "@/components/CalendlyEmbed";

export default function ConnectSection() {
  /* Calendly is expensive and it is NOT just Calendly: mounting it eagerly
     pulled 50 third-party requests and 1.26 MB onto the homepage — Facebook
     Pixel, three copies of reCAPTCHA, Stripe, Braze, Sprig, Airbrake — before
     the visitor had flipped a single card. On a phone the handshakes cost more
     than the bytes.

     Connect sits far below the entry gate, so nobody needs the scheduler at
     load. Arm it when the section approaches the viewport. CalendlyEmbed
     already accepts `active` for exactly this. */
  const ref = useRef<HTMLElement | null>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || armed) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setArmed(true);
          io.disconnect();
        }
      },
      // A screen of lead time so the scheduler is ready before it is reached.
      { rootMargin: "800px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed]);

  return (
    <section id="connect" className="connect" ref={ref}>
      <h2 className="connect__heading">Connect</h2>

      <div className="connect__grid">
        {CONNECT_LINKS.map((link) => {
          if (link.href === null) {
            return (
              <span
                key={link.id}
                className="tag tag--connect tag--display"
              >
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
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {link.label}
            </a>
          );
        })}
      </div>

      <CalendlyEmbed className="connect__calendly" active={armed} />
    </section>
  );
}
