import type { Metadata } from "next";
import Link from "next/link";
import { TrustPage } from "@/components/layout/trust-page";
import { SourcesLibrary } from "@/components/sources/library";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `Financial Data & Calculation Sources | ${SITE_NAME}` },
  description: "Review the government, regulatory and financial sources used to support MoneyBasis calculations and educational explanations.",
  alternates: { canonical: "/sources" },
};

export default function SourcesPage() {
  return (
    <TrustPage
      eyebrow="Trust & transparency"
      title="Sources"
      description={`${SITE_NAME} uses public, citable references for factual financial information. User-adjustable assumptions are kept separate from source-derived facts.`}
      aside={
        <div className="trust-chips">
          <span className="trust-chip">Primary sources preferred</span>
          <span className="trust-chip">Year-specific tax data</span>
          <span className="trust-chip">Reviewed references</span>
        </div>
      }
    >
      <SourcesLibrary />
      <p className="mt-6">
        <Link href="/how-it-works" className="trust-text-link">How MoneyBasis calculates results →</Link>
      </p>
    </TrustPage>
  );
}
