import { PageHero } from "@/components/layout/page-hero";
import { CalculatorIllustration } from "@/components/brand/calculator-illustration";
import { CalculatorCard } from "@/components/brand/calculator-card";
import { calculatorCategories, calculators } from "@/lib/calculators/catalog";
export function CalculatorDirectory({
  initialQuery: _initialQuery = "",
}: {
  initialQuery?: string;
}) {
  void _initialQuery;
  return (
    <div className="site-container pb-16">
      <PageHero eyebrow="Ten free calculators" title="Tools for everyday money decisions." description="Clear inputs, visual answers, and the numbers behind every estimate." illustration={<CalculatorIllustration />} />
      <div className="mt-6 space-y-16">
        {calculatorCategories.map((c) => (
          <section key={c.id} id={c.id} className="scroll-mt-24">
            <h2 className="section-title">{c.title}</h2>
            <p className="mt-2 text-muted">{c.description}</p>
            <div className="mt-6 grid gap-6">
              {c.slugs.map((slug) => (
                <div key={slug} id={slug === "budget" ? "income-budgeting" : slug === "loan-payoff" ? "debt" : undefined} className="grid scroll-mt-24">
                  <CalculatorCard calculator={calculators[slug]} detailed />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
