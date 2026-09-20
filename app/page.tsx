import { PageHero } from "@/components/layout/page-hero";
import type { Metadata } from "next";
import Link from "next/link";
import { Eye, LineChart, Scale } from "lucide-react";
import { CalculatorCard } from "@/components/brand/calculator-card";
import { HeroIllustration } from "@/components/brand/hero-illustration";
import { JsonLd } from "@/components/seo/json-ld";
import { calculators } from "@/lib/calculators/catalog";
import { webApplicationJsonLd } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/site";
import { MortgageDemo } from "@/components/brand/mortgage-demo";
import { LearningCard } from "@/components/brand/learning-card";
import { guideList } from "@/lib/guides/catalog";

const whyCards = [
  {
    icon: Eye,
    title: "Clear result",
    body: "Start with the number you came for.",
  },
  {
    icon: LineChart,
    title: "Visual context",
    body: "See how the result changes over time.",
  },
  {
    icon: Scale,
    title: "Compare scenarios",
    body: "Change your inputs to see what makes a difference.",
  },
];

export const metadata: Metadata = {
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
  },
};

export default function HomePage() {
  const featured = [
    "mortgage",
    "compound-interest",
    "retirement",
    "budget",
    "debt-snowball",
    "rent-vs-buy",
  ] as const;
  return (
    <div className="site-container pb-16">
      <JsonLd data={webApplicationJsonLd()} />
      <PageHero
        eyebrow="Free financial calculators"
        title="Understand the numbers behind your money."
        description="Tools for mortgages, investing, retirement, budgeting, debt and savings—with clear calculations and visual explanations."
        illustration={<HeroIllustration />}
      >
        <Link href="#tools" className="text-[17px] font-semibold text-foreground">
          See the tools →
        </Link>
        <Link href="/how-it-works" className="text-[17px] font-medium text-muted">
          How it works →
        </Link>
      </PageHero>
      <ul className="trust-grid">
        <li>Free to use</li>
        <li>No account required</li>
        <li>Calculations stay in your browser</li>
        <li>Formulas you can inspect</li>
      </ul>
      <section id="tools" className="home-section">
        <h2 className="section-title">Tools for everyday money decisions</h2>
        <div className="tools-grid">
          {featured.map((slug) => (
            <CalculatorCard key={slug} calculator={calculators[slug]} />
          ))}
        </div>
        <Link
          href="/calculators"
          className="mt-7 inline-block font-semibold text-foreground"
        >
          View all 10 calculators →
        </Link>
      </section>
      <section className="home-section">
        <h2 className="section-title">Built into every calculation</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {whyCards.map((item) => (
            <div key={item.title}>
              <item.icon className="mb-4 h-6 w-6 text-foreground" />
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="home-section">
        <h2 className="section-title">
          See what changes your mortgage payment.
        </h2>
        <p className="mt-3 text-muted">
          Slide to explore, or type an exact value. Compare monthly payments
          and total interest as you go.
        </p>
        <MortgageDemo />
      </section>

      <section className="home-section">
        <h2 className="section-title">Learn the numbers</h2>
        <div className="learning-grid mt-7">
          {["mortgage-amortization", "gross-vs-net-pay", "compound-interest"].map(slug => guideList.find(g => g.slug === slug)!).map((g) => (
            <LearningCard key={g.slug} guide={g} />
          ))}
        </div>
      </section>
    </div>
  );
}
