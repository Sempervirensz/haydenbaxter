import LabsHub from "@/components/admin/LabsHub";

// Dev-only route (page.dev.tsx) — excluded from the production static export, and
// the /admin layout also 404s outside development. Local admin tool only.
export default function LabsPage() {
  return <LabsHub />;
}
