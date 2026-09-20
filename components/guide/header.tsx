import Link from "next/link";
import { PageBreadcrumbs } from "@/components/layout/breadcrumbs";
import type { CalculatorDefinition } from "@/lib/calculators/catalog";
import type { GuideDefinition } from "@/lib/guides/catalog";

const categoryClass: Record<GuideDefinition["category"], string> = {
  "Home & Mortgage": "guide-accent-home",
  "Saving & Investing": "guide-accent-invest",
  Retirement: "guide-accent-retire",
  "Income & Budgeting": "guide-accent-income",
  Debt: "guide-accent-debt",
  "Financial Basics": "guide-accent-basics",
};

export function GuideHeader({
  guide,
  calculator,
}: {
  guide: GuideDefinition;
  calculator: CalculatorDefinition;
}) {
  return (
    <header className="guide-header">
      <PageBreadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Guides", href: "/guides" },
          { name: guide.title },
        ]}
      />
      <p className={`guide-meta ${categoryClass[guide.category]}`}>
        <span>{guide.category}</span>
        <span aria-hidden="true">·</span>
        <span>{guide.readingTime} min read</span>
      </p>
      <h1>{guide.title}</h1>
      <p className="guide-deck">{guide.intro}</p>
      <Link href={calculator.href} className="guide-header-chip">
        {calculator.name} →
      </Link>
    </header>
  );
}
