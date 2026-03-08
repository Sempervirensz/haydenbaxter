"use client";

import type { WorkScreen } from "@/data/work";

type WorldPulseData = Extract<WorkScreen, { type: "full" }>["full"];

interface WorldPulseDetailProps {
  data: WorldPulseData;
}

export default function WorldPulseDetail({ data }: WorldPulseDetailProps) {
  return (
    <div className="pd-full">
      <div className="pd-full__img">
        <img src={data.image.src} alt={data.image.alt} />
      </div>
      <div className="pd-full__bar">
        <div className="pd-full__info">
          <span className="pd-full__role">{data.role}</span>
          <span className="pd-full__caption">{data.caption}</span>
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
  );
}
