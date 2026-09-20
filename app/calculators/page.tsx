import type { Metadata } from "next";
import { CalculatorDirectory } from "@/components/calculators/directory";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `Financial Calculators — Mortgage, Investing, Debt & More | ${SITE_NAME}` },
  description:
    "Explore free MoneyBasis calculators for mortgages, investing, retirement, budgeting, debt, savings, salary, net worth and rent vs buy decisions.",
  alternates: { canonical: "/calculators" },
};

export default async function CalculatorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return <CalculatorDirectory initialQuery={q ?? ""} />;
}
