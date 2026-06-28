// Registry for the local-only Labs hub (/admin/labs). Add new experiments here
// and they show up in the hub. Keep paths in sync with src/app routes.

export interface LabLink {
  label: string;
  path: string;
  note?: string;
}

export interface LabGroup {
  title: string;
  items: LabLink[];
}

export const LAB_GROUPS: LabGroup[] = [
  {
    title: "Production pages",
    items: [
      { label: "Home", path: "/" },
      { label: "Journal", path: "/blog" },
      { label: "Emerging Tech Builds", path: "/emerging-tech-builds" },
      { label: "↳ AtomicOS", path: "/emerging-tech-builds/atomic-os" },
      { label: "↳ CaseBrief", path: "/emerging-tech-builds/casebrief" },
      { label: "↳ Cortex", path: "/emerging-tech-builds/cortex" },
      { label: "Composer (admin)", path: "/admin/compose" },
    ],
  },
  {
    title: "Design Lab",
    items: [
      { label: "Design Lab", path: "/design-lab", note: "Four-Card Threshold + experiments" },
      { label: "Soft-Lock Entry (homepage mirror)", path: "/design-lab/soft-lock" },
    ],
  },
  {
    title: "Work — cinematic",
    items: [
      { label: "Cinematic Work Stack", path: "/site-parallax-lab/work-cinema" },
      { label: "↳ Responsive Viewer", path: "/site-parallax-lab/work-cinema/viewer" },
      { label: "Work merged (CD scroll + cinematic)", path: "/site-parallax-lab/work-merged" },
      { label: "Sticky Depth Handoff", path: "/site-parallax-lab/work-handoff" },
      { label: "Work display lab", path: "/work-display-lab" },
      { label: "Work preview", path: "/work-preview" },
    ],
  },
  {
    title: "Scroll & parallax",
    items: [
      { label: "Site parallax lab", path: "/site-parallax-lab" },
      { label: "Site parallax — live sections", path: "/site-parallax-lab/live" },
      { label: "Scroll lab", path: "/lab/scroll" },
      { label: "Scroll systems", path: "/lab/scroll-systems" },
      { label: "Responsive lab", path: "/responsive-lab" },
    ],
  },
  {
    title: "Cards & CD player",
    items: [
      { label: "CD lab", path: "/cd-lab" },
      { label: "CD lab (desktop)", path: "/cd-lab-desktop" },
      { label: "Card lighting", path: "/lab/card-lighting" },
      { label: "Card motion", path: "/lab/card-motion" },
      { label: "Card sizing", path: "/lab/card-sizing" },
      { label: "Button effects", path: "/lab/button-effects" },
    ],
  },
  {
    title: "Consulting",
    items: [
      { label: "Consulting hero lab", path: "/consulting-hero-lab" },
      { label: "Consulting lab", path: "/consulting-lab" },
      { label: "Consulting parallax lab", path: "/consulting-parallax-lab" },
    ],
  },
  {
    title: "Supply chain & globe",
    items: [
      { label: "Supply chain lab", path: "/sc-lab" },
      { label: "Supply chain lab (alt)", path: "/supply-chain-lab" },
      { label: "Supply chain — mobile", path: "/supply-chain-mobile-lab" },
      { label: "Globe card lab", path: "/globe-card-lab" },
      { label: "Globe sandbox", path: "/globe-sandbox" },
    ],
  },
  {
    title: "Emerging tech",
    items: [
      { label: "ETB lab", path: "/etb-lab" },
      { label: "ETB overlay sandbox", path: "/etb-overlay-sandbox" },
    ],
  },
  {
    title: "Content & narrative",
    items: [
      { label: "Detail lab", path: "/detail-lab" },
      { label: "Description lab", path: "/description-lab" },
      { label: "Narrative lab", path: "/narrative-lab" },
      { label: "Handwriting lab", path: "/handwriting-lab" },
    ],
  },
  {
    title: "Previews",
    items: [
      { label: "AtomicOS preview", path: "/atomicos-preview" },
      { label: "ProcureBridge preview", path: "/procurebridge-preview" },
    ],
  },
];
