import type { Metadata } from "next";
import AtomicOSPreview from "@/components/atomicos-preview/AtomicOSPreview";

export const metadata: Metadata = {
  title: "AtomicOS — Preview",
  description:
    "Front-end preview of AtomicOS: a personal AI command center for tasks, goals, agents, and decision support.",
};

export default function AtomicOSPreviewPage() {
  return <AtomicOSPreview />;
}
