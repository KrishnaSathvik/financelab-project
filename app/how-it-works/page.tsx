import type { Metadata } from "next";
import { MethodologyExplorer } from "@/components/methodology/explorer";
import { isCalculatorSlug } from "@/lib/calculators/catalog";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `How MoneyBasis calculates results | ${SITE_NAME}` },
  description:
    "Learn how MoneyBasis financial calculators work, including formulas, assumptions, calculation methods and limitations.",
  alternates: { canonical: "/how-it-works" },
};

export default async function MethodologyPage({ searchParams }: {
  searchParams: Promise<{ calculator?: string | string[] }>;
}) {
  const selected = (await searchParams).calculator;
  const slug = typeof selected === "string" && isCalculatorSlug(selected) ? selected : "mortgage";
  return <MethodologyExplorer key={slug} initialSlug={slug} />;
}
