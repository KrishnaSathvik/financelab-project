import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorSeoArticle } from "@/components/calculator/seo-article";
import { CalculatorApp } from "@/components/calculators/calculator-app";
import { PageBreadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import {
  calculatorSlugs,
  getCalculator,
  relatedCalculators,
  type CalculatorSlug,
} from "@/lib/calculators/catalog";
import { calculatorJsonLd } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return calculatorSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  if (!calculator) return {};
  return {
    title: { absolute: calculator.title },
    description: calculator.metaDescription,
    alternates: { canonical: calculator.href },
    openGraph: {
      type: "website",
      title: calculator.title,
      description: calculator.metaDescription,
      url: calculator.href,
    },
    twitter: {
      card: "summary_large_image",
      title: calculator.title,
      description: calculator.metaDescription,
    },
  };
}

export default async function CalculatorPage({ params }: PageProps) {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  if (!calculator) notFound();
  const related = relatedCalculators(calculator.slug);

  return (
    <div className="site-container-product py-10">
      <JsonLd data={calculatorJsonLd(calculator)} />
      <PageBreadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Calculators", href: "/calculators" },
          { name: calculator.name },
        ]}
      />
      <CalculatorApp slug={calculator.slug as CalculatorSlug} />
      <CalculatorSeoArticle calculator={calculator} related={related} />
    </div>
  );
}
