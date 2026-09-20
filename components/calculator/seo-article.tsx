import { GuideCard } from "@/components/brand/guide-card";
import { guideList } from "@/lib/guides/catalog";
import { CalculatorCard } from "@/components/brand/calculator-card";
import type { CalculatorDefinition } from "@/lib/calculators/catalog";
import { calculatorPageCopy } from "@/lib/calculators/page-copy";
import { DISCLAIMER_LINE } from "@/lib/site";

export function CalculatorSeoArticle({
  calculator,
  related,
}: {
  calculator: CalculatorDefinition;
  related: CalculatorDefinition[];
}) {
  const copy = calculatorPageCopy[calculator.slug];
  return (
    <article className="calculator-education">
      <section>
        <h2>Understand your result</h2>
        <div className={`mt-6 grid gap-5 sm:grid-cols-2 ${copy.resultTerms.length >= 4 ? "lg:grid-cols-4" : copy.resultTerms.length === 3 ? "lg:grid-cols-3" : ""}`}>
          {copy.resultTerms.map((item) => (
            <div
              key={item.heading}
              className="border-t-2 border-primary/30 pt-4"
            >
              <h3 className="font-semibold">{item.heading}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="accordion-stack">
        <details id="formula">
          <summary>How this calculation works</summary>
          <div>
            <ol className="list-decimal space-y-2 pl-5">
              {copy.howToUse.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ol>
            <pre className="my-5 rounded-xl bg-surface p-4">
              {calculator.formula}
            </pre>
            <p>{calculator.formulaNote}</p>
            <dl className="mt-5 space-y-3">
              {copy.definitions.map((x) => (
                <div key={x.term}>
                  <dt className="font-semibold text-foreground">{x.term}</dt>
                  <dd>{x.definition}</dd>
                </div>
              ))}
            </dl>
          </div>
        </details>
        <details id="assumptions">
          <summary>
            {calculator.slug === "salary-hourly"
              ? "2026 tax assumptions & limitations"
              : "Assumptions & limitations"}
          </summary>
          <div>
            <ul className="list-disc space-y-2 pl-5">
              {calculator.assumptions.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <p className="mt-4">{DISCLAIMER_LINE}</p>
          </div>
        </details>
        <details id="sources">
          <summary>Sources</summary>
          <div>
            <ul className="space-y-3">
              {calculator.sources.map((x) => (
                <li key={x.href}>
                  <a
                    className="text-primary underline"
                    href={x.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {x.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </details>
      </div>
      <section>
        <h2>Frequently asked questions</h2>
        <div className="accordion-stack mt-6">
          {calculator.faqs.map((x) => (
            <details key={x.question}>
              <summary>{x.question}</summary>
              <div>{x.answer}</div>
            </details>
          ))}
        </div>
      </section>
      <section>
        <h2>See a worked example</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {guideList.filter(g => g.relatedCalculator === calculator.slug).map(g => <GuideCard key={g.slug} guide={g} />)}
        </div>
      </section>
      <section>
        <h2>Related tools</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {related.slice(0, 3).map((x) => (
            <CalculatorCard key={x.slug} calculator={x} />
          ))}
        </div>
      </section>
    </article>
  );
}
