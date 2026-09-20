import { GuideExhibit } from "@/components/brand/guide-exhibit";
import { GuideCalculatorCTA } from "@/components/guide/cta";
import { GuideHeader } from "@/components/guide/header";
import { GuideProgress } from "@/components/guide/progress";
import { GuideRelated } from "@/components/guide/related";
import { GuideSection } from "@/components/guide/section";
import { GuideSources } from "@/components/guide/sources";
import { GuideTakeaway } from "@/components/guide/takeaway";
import { GuideCallout, GuideChecklist, GuideComparison, GuideDefinition, GuideExample, GuideFormula } from "@/components/guide/blocks";
import { GuideCite } from "@/components/guide/cite";
import { calculators } from "@/lib/calculators/catalog";
import type { GuideDefinition as GuideDefinitionData } from "@/lib/guides/catalog";
import { presentationFor, sectionPresentation } from "@/lib/guides/presentation";

export function GuideArticle({ guide }: { guide: GuideDefinitionData }) {
  const calculator = calculators[guide.relatedCalculator];
  const presentation = presentationFor(guide.slug);

  return (
    <div className="guide-page">
      <GuideProgress />
      <GuideHeader guide={guide} calculator={calculator} />
      <div className="guide-layout">
        <article className="guide-article">
          <GuideTakeaway>{guide.takeaway}</GuideTakeaway>
          {presentation.opening ? (
            <GuideSection id={presentation.opening.id} heading={presentation.opening.heading} kicker={presentation.opening.kicker}>
              {presentation.opening.comparison ? <GuideComparison columns={presentation.opening.comparison.columns} /> : null}
            </GuideSection>
          ) : null}
          <div className="guide-body">
            {guide.sections.map((section) => {
              const visual = sectionPresentation(guide.slug, section);
              const paragraphs = section.body.split("\n\n");
              return (
                <GuideSection
                  key={section.id}
                  id={section.id}
                  heading={section.heading}
                  kicker={visual.kicker}
                  yearSpecific={section.tone === "year-specific"}
                >
                  {visual.definitions?.map((definition) => (
                    <GuideDefinition key={definition.term} {...definition} />
                  ))}
                  {visual.comparison ? <GuideComparison columns={visual.comparison.columns} /> : null}
                  {paragraphs.map((paragraph, index) => (
                    <p key={index} className="guide-prose">
                      {paragraph}
                      {index === paragraphs.length - 1 && section.sources?.length ? <GuideCite sources={section.sources} /> : null}
                    </p>
                  ))}
                  {visual.formula ? <GuideFormula {...visual.formula} /> : null}
                  {visual.example ? <GuideExample {...visual.example} /> : null}
                  {visual.callouts?.map((callout) => (
                    <GuideCallout key={callout.body} tone={callout.tone}>
                      {callout.body}
                    </GuideCallout>
                  ))}
                  {visual.checklist ? <GuideChecklist {...visual.checklist} /> : null}
                  {section.exhibits?.map((id) => (
                    <GuideExhibit key={id} id={id} />
                  ))}
                </GuideSection>
              );
            })}
          </div>
          <GuideCalculatorCTA
            calculator={calculator}
            steps={presentation.exercise.steps}
            notice={presentation.exercise.notice}
            extraCalculators={guide.calculatorAssociations.filter((slug) => slug !== guide.relatedCalculator)}
          />
          <GuideSources sourceIds={guide.sourceIds} />
        </article>
        <GuideRelated slugs={guide.relatedGuides} />
      </div>
    </div>
  );
}
