"use client";

import { useEffect, useState } from "react";
import { CONNECT_LINKS, WECHAT_ID, CALENDLY_URL } from "@/data/connect";

const ROTATIONS = [-1.2, 0.8, -0.6, 1.4, -1.0];

export default function ConnectSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Load Calendly embed script once
    if (document.querySelector('script[src*="calendly.com/assets/external/widget.js"]')) return;
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <section id="connect" className="connect">
      <h2 className="connect__heading">Connect</h2>

      <div className="connect__grid">
        {CONNECT_LINKS.map((link, i) => {
          const rotation = ROTATIONS[i % ROTATIONS.length];

          if (link.href === null) {
            return (
              <span
                key={link.id}
                className="tag tag--connect tag--display"
                style={{ transform: `rotate(${rotation}deg)` }}
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
              style={{ transform: `rotate(${rotation}deg)` }}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
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
        />
      )}
    </section>
  );
}
