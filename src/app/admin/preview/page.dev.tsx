import AdminPreview from "@/components/admin/AdminPreview";

// Dev-only route — excluded from the production static export; the /admin layout
// also 404s outside development. Local responsive-preview tool.
export default function PreviewPage() {
  return <AdminPreview />;
}
