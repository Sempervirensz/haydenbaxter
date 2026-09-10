import type { Metadata } from "next";
import WorldPulsePanelLab from "@/components/worldpulse-panel-lab/WorldPulsePanelLab";

// The WorldPulse destination panel at four container widths, framed in
// production's own card chrome. See the component for what this is for.
//
// `page.dev.tsx` and not `page.tsx`: lab routes named `page.tsx` ship to
// production and are indexable. The `robots` block below is a second belt on
// top of that, not the primary guard.

export const metadata: Metadata = {
  title: "WorldPulse panel lab",
  description:
    "The WorldPulse destination panel at four container widths, straddling the 700px turn.",
  robots: { index: false, follow: false },
};

export default function WorldPulsePanelLabPage() {
  return <WorldPulsePanelLab />;
}
