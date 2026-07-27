"use client";

// The deliverable: the four Work chapters as one mobile sequence.
//
// This component is the thing that would eventually be promoted — it holds no
// lab chrome, takes no lab props beyond the scroll root and a motion switch, and
// renders exactly what a phone visitor would get. The lab wraps it; it does not
// depend on the lab.
//
// Each chapter is one card at 100cqh, stacked vertically. There is no horizontal
// paging and no nested scroller anywhere except inside an open sheet, so the
// page's own vertical scroll is never competing with anything.

import { useRef } from "react";
import { useSequenceMotion } from "./useSequenceMotion";
import CardWorldPulse from "./cards/CardWorldPulse";
import CardEmergingTech from "./cards/CardEmergingTech";
import CardSupplyChain from "./cards/CardSupplyChain";
import CardConsulting from "./cards/CardConsulting";
import "./work-mobile.css";

const CHAPTERS = [
  { id: 1, node: <CardWorldPulse /> },
  { id: 2, node: <CardEmergingTech /> },
  { id: 3, node: <CardSupplyChain /> },
  { id: 4, node: <CardConsulting /> },
];

export default function MobileWorkSequence({
  scrollRootRef,
  motion = true,
}: {
  scrollRootRef: React.RefObject<HTMLElement | null>;
  motion?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const motionRef = useRef(motion);
  motionRef.current = motion;

  useSequenceMotion(rootRef, scrollRootRef, () => motionRef.current);

  return (
    <div className="mws" ref={rootRef}>
      {CHAPTERS.map((c) => (
        <section key={c.id} className="mws-chapter" data-mws-chapter data-mws-id={c.id}>
          {c.node}
        </section>
      ))}
    </div>
  );
}
