"use client";

// Picks which screen an offer is drawn by, so the lab and the real route never
// disagree about it.
//
// `baseline` is not a sixth skin — it is the page that ships today, so it
// renders the ORIGINAL OfferScreen and keeps the structural `layout` axis
// live underneath. Every other direction renders the art-directed screen,
// where structure comes from the offer's template instead.
//
// Keeping the baseline reachable from the same control is the only way to
// compare against the real thing rather than against a memory of it.

import type { OfferLayoutId, OfferSurfaceId, PathDef } from "@/data/offerLab";
import type { OfferDirectionId, OfferTemplateModeId } from "@/data/offerDirections";
import OfferScreen from "./OfferScreen";
import OfferDirectionScreen from "./directions/OfferDirectionScreen";

export interface OfferRenderProps {
  path: PathDef;
  direction: OfferDirectionId;
  layout: OfferLayoutId;
  surface: OfferSurfaceId;
  templateMode: OfferTemplateModeId;
  idPrefix?: string;
}

export default function OfferRender({
  path,
  direction,
  layout,
  surface,
  templateMode,
  idPrefix,
}: OfferRenderProps) {
  if (direction === "baseline") {
    return <OfferScreen path={path} layout={layout} surface={surface} />;
  }

  return (
    <OfferDirectionScreen
      path={path}
      direction={direction}
      surface={surface}
      templateMode={templateMode}
      idPrefix={idPrefix}
    />
  );
}
