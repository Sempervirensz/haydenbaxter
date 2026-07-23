// Timeline label presets for the Globe Card Lab.
// Each preset is a swap-in set of labels for the 4 journey stops (NYC, Taiwan, China, Network).
// Lab-only — does NOT affect the main Supply Chain section.

export type LabelFormat = "primary-only" | "inline" | "stacked";

export interface LabelStop {
  /** Accomplishment headline (the part that tells the story) */
  primary: string;
  /** Location or supporting tag (optional) */
  secondary?: string;
}

export interface LabelPreset {
  id: string;
  name: string;
  format: LabelFormat;
  stops: [LabelStop, LabelStop, LabelStop, LabelStop];
}

export const LABEL_PRESETS: LabelPreset[] = [
  {
    id: "location-only",
    name: "Location only (original)",
    format: "primary-only",
    stops: [
      { primary: "NYC" },
      { primary: "TAIWAN" },
      { primary: "CHINA" },
      { primary: "NETWORK" },
    ],
  },
  {
    id: "accomplishment-word",
    name: "Accomplishment — single word",
    format: "primary-only",
    stops: [
      { primary: "PROCUREMENT" },
      { primary: "SOURCING" },
      { primary: "MANDARIN" },
      { primary: "NETWORKS" },
    ],
  },
  {
    id: "accomplishment-inline",
    name: "Accomplishment · Location (inline)",
    format: "inline",
    stops: [
      { primary: "Fortune 100 procurement", secondary: "NYC" },
      { primary: "Asia-Pacific sourcing", secondary: "Taiwan" },
      { primary: "Fluent in Mandarin", secondary: "China" },
      { primary: "Supplier networks", secondary: "SE Asia" },
    ],
  },
  {
    id: "accomplishment-stacked",
    name: "Accomplishment over Location (stacked)",
    format: "stacked",
    stops: [
      { primary: "Broke into Fortune 100", secondary: "NYC · 2015" },
      { primary: "Moved ops into Asia", secondary: "Taiwan · 2017" },
      { primary: "Became fluent in Mandarin", secondary: "China · 2018" },
      { primary: "Built supplier networks", secondary: "SE Asia · 2020–" },
    ],
  },
  {
    id: "sentence",
    name: "Full sentence (storytelling)",
    format: "stacked",
    stops: [
      {
        primary: "Started in Fortune 100 procurement strategy",
        secondary: "New York · 2015",
      },
      {
        primary: "First move into Asia-Pacific sourcing",
        secondary: "Taiwan · 2017",
      },
      {
        primary: "Deep operations across mainland China",
        secondary: "China · 2018",
      },
      {
        primary: "Built cross-border supplier networks",
        secondary: "SE Asia · 2020–Present",
      },
    ],
  },
];
