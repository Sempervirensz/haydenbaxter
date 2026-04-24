"use client";

import type { WorkScreen } from "@/data/work";

type WorldPulseData = Extract<WorkScreen, { type: "full" }>["full"];

interface WorldPulseDetailProps {
  data: WorldPulseData;
}

export default function WorldPulseDetail({ data }: WorldPulseDetailProps) {
  return (
    <>
      {data.caption && (
        <div className="wp-description">
          <p>{data.caption}</p>
        </div>
      )}
      <div className="pd-full">
        <div className="pd-full__img">
          {data.background && (
            <img
              src={data.background}
              alt=""
              aria-hidden="true"
              className="pd-full__bg"
            />
          )}
          {data.image.src && (
            <img
              src={data.image.src}
              alt={data.image.alt}
              className={data.background ? "pd-full__hero" : undefined}
            />
          )}
          <div className="pd-full__tagline" aria-hidden="true">
            <span>ORIGIN</span>
            <span>MATTERS</span>
          </div>
        </div>
        <div className="pd-full__bar">
          <div className="pd-full__info">
            <span className="pd-full__role">{data.role}</span>
          </div>
          <a
            href={data.link.href}
            className="pd-full__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.link.label}
          </a>
        </div>
      </div>
    </>
  );
}
