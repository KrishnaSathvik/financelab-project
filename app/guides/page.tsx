import { PageHero } from "@/components/layout/page-hero";
import { InformationIllustration } from "@/components/brand/information-illustration";
import type { Metadata } from "next";
import { GuideCard, guideCategory } from "@/components/brand/guide-card";
import { guideList, guideCategories } from "@/lib/guides/catalog";
export const metadata: Metadata = {
  title: "Guides",
  description:
    "Understand the numbers behind mortgages, investing, income, and debt with worked examples and free calculators.",
  alternates: { canonical: "/guides" },
};
export default function GuidesPage() {
  return (
    <div className="site-container pb-16">
      <PageHero eyebrow="Guides" title="Learn the numbers behind the decision." description="Practical explanations, worked examples, and tools to try with your own numbers." illustration={<InformationIllustration topic="guides" />} />
      <div className="mt-6 space-y-14">
        {guideCategories.map((cat) => (
          <section key={cat}>
            <h2 className="section-title">{cat}</h2>
            <div className="mt-6 grid gap-6">
              {guideList
                .filter((g) => guideCategory(g) === cat)
                .map((g) => (
                  <GuideCard key={g.slug} guide={g} wide />
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
