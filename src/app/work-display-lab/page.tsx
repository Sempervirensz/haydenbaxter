import type { Metadata } from "next";
import WorkDisplayLab from "./WorkDisplayLab";

export const metadata: Metadata = {
  title: "Work Display Lab — Text Treatment Experiments",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <WorkDisplayLab />;
}
