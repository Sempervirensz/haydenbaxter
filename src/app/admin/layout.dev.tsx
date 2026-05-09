import { notFound } from "next/navigation";
import type { ReactNode } from "react";

// Dev-only surface. In production builds (incl. static export), this layout
// short-circuits to a 404 so the admin UI never ships.
export default function AdminLayout({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV !== "development") notFound();
  return <>{children}</>;
}
