import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { TrustPage } from "@/components/layout/trust-page";
import { SourcesLibrary } from "@/components/sources/library";
import { SITE_NAME } from "@/lib/site";

const sourceNotes = [
  "Primary sources preferred",
  "Year-specific tax data",
  "Reviewed references",
] as const;

export const metadata: Metadata = {
  title: { absolute: `Financial Data & Calculation Sources | ${SITE_NAME}` },
  description: "Review the government, regulatory and financial sources used to support MoneyBasis calculations and educational explanations.",
  alternates: { canonical: "/sources" },
};

export default function SourcesPage() {
  return (
    <TrustPage
      title="Sources"
      description={`${SITE_NAME} uses public, citable references for factual financial information. User-adjustable assumptions are kept separate from source-derived facts.`}
      actions={
        <ul className="trust-chips">
          {sourceNotes.map((note) => (
            <li key={note} className="trust-chip">
              <Check className="h-4 w-4" aria-hidden="true" />
              {note}
            </li>
          ))}
        </ul>
      }
    >
      <SourcesLibrary />
      <p className="mt-6">
        <Link href="/how-it-works" className="text-[17px] font-semibold text-foreground">How MoneyBasis calculates results →</Link>
      </p>
    </TrustPage>
  );
}
