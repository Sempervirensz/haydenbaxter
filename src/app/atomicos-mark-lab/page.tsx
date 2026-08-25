import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AtomicOSMarkLab from "@/components/etb-page/atomicos/AtomicOSMarkLab";
import { findEtbProject } from "@/data/etbProjects";

// Four ways the AtomicOS embroidered atom could lead its detail page, each
// rendered over the real page content, plus today's hero as the baseline.
//
// AtomicOS only. Its mark is cream on near-black and its subject is
// repetition, so it gets its own treatments rather than Cortex's. Production
// imports nothing from here.

export const metadata: Metadata = {
  title: "AtomicOS mark lab",
  description:
    "Four hero treatments for the AtomicOS embroidered atom — free float, orbit field, ledger plate, cadence row — against the live detail page.",
  robots: { index: false, follow: false },
};

const PROJECT = findEtbProject("atomicos");

export default function AtomicOSMarkLabPage() {
  if (!PROJECT) notFound();
  return <AtomicOSMarkLab project={PROJECT} />;
}
