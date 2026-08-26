import Link from "next/link";
import { notFound } from "next/navigation";
import LabWorkSection from "@/components/scroll-lab/safari/LabWorkSection";
import { VARIANTS, VARIANT_MAP } from "@/components/scroll-lab/safari/config";
import "@/components/scroll-lab/safari/safari-lab.css";

export function generateStaticParams() {
  return VARIANTS.map((v) => ({ variant: v.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ variant: string }> }) {
  const { variant } = await params;
  const v = VARIANT_MAP[variant];
  return { title: v ? `Lab · ${v.title}` : "Lab · Unknown variant" };
}

export default async function VariantPage({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  const { variant } = await params;
  const v = VARIANT_MAP[variant];
  if (!v) notFound();

  return (
    <>
      <LabHeader variant={v.id} title={v.title} hypothesis={v.hypothesis} />
      <LabWorkSection config={v.config} />
    </>
  );
}

function LabHeader({
  variant,
  title,
  hypothesis,
}: {
  variant: string;
  title: string;
  hypothesis: string;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 12,
        left: 12,
        zIndex: 9999,
        maxWidth: 360,
        padding: "10px 12px",
        borderRadius: 10,
        background: "rgba(10,10,10,0.78)",
        border: "1px solid rgba(255,255,255,0.10)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        color: "#f3f3f3",
        fontFamily: "var(--font-sans)",
        fontSize: 12,
        lineHeight: 1.45,
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          marginBottom: 4,
        }}
      >
        <Link
          href="/lab/scroll"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.18em",
            color: "rgba(243,243,243,0.55)",
            textDecoration: "none",
          }}
        >
          ← LAB
        </Link>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.18em",
            color: "#cba86a",
          }}
        >
          {variant}
        </span>
      </div>
      <div style={{ fontFamily: "var(--font-serif)", fontSize: 15, marginBottom: 2 }}>
        {title}
      </div>
      <div style={{ color: "rgba(243,243,243,0.62)", fontSize: 11 }}>{hypothesis}</div>
    </div>
  );
}
