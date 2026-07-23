// ---------------------------------------------------------------------------
// ETB Overlay Sandbox — route: /etb-overlay-sandbox
// Isolated test environment for comparing overlay detail-panel iterations.
// Does NOT touch production ETBDetail or work-details.css.
// If an iteration is approved, its overlay markup + CSS can replace the
// current .etb-overlay block in ETBDetail.tsx and the matching CSS section.
// ---------------------------------------------------------------------------
import ETBOverlaySandbox from "@/components/etb-overlay-sandbox/ETBOverlaySandbox";

export const metadata = {
  title: "ETB Overlay Sandbox",
};

export default function Page() {
  return <ETBOverlaySandbox />;
}
