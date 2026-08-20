import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectDetailPage from "@/components/etb-page/ProjectDetailPage";
import { findEtbProject } from "@/data/etbProjects";
import styles from "./cortex-hero-lab.module.css";

const PROJECT = findEtbProject("cortex");
const VARIANTS = ["seal", "split", "giant"] as const;
type Variant = (typeof VARIANTS)[number];

function isVariant(value: string): value is Variant {
  return VARIANTS.includes(value as Variant);
}

export default async function CortexHeroLabPage({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  const { variant } = await params;
  if (!PROJECT || !isVariant(variant)) notFound();

  const variantClass =
    variant === "seal"
      ? styles.seal
      : variant === "split"
        ? styles.split
        : styles.giant;

  return (
    <div className={`${styles.lab} ${variantClass}`}>
      <nav className={styles.switcher} aria-label="Cortex hero variants">
        <span className={styles.switcherLabel}>CORTEX HERO LAB</span>
        <Link href="/cortex-hero-lab/seal" data-active={variant === "seal"}>
          01 Seal
        </Link>
        <Link href="/cortex-hero-lab/split" data-active={variant === "split"}>
          02 Split
        </Link>
        <Link href="/cortex-hero-lab/giant" data-active={variant === "giant"}>
          03 Giant
        </Link>
      </nav>
      <ProjectDetailPage project={PROJECT} />
    </div>
  );
}
