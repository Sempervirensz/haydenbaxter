"use client";

import { CONNECT_LINKS, WECHAT_ID } from "@/data/connect";
import CalendlyEmbed from "@/components/CalendlyEmbed";

export default function ConnectSection() {
  return (
    <section id="connect" className="connect">
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

      <CalendlyEmbed className="connect__calendly" />
    </section>
  );
}
