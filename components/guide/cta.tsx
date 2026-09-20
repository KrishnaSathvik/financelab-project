import Link from "next/link";
import type { CalculatorDefinition, CalculatorSlug } from "@/lib/calculators/catalog";
import { calculators } from "@/lib/calculators/catalog";
import { GuideChecklist } from "@/components/guide/blocks";

export function GuideCalculatorCTA({
  calculator,
  steps,
  notice,
  extraCalculators,
}: {
  calculator: CalculatorDefinition;
  steps: string[];
  notice?: string;
  extraCalculators: CalculatorSlug[];
}) {
  return (
    <section id="try-it" className="guide-cta" data-guide-section="try-it">
      <h2>Try it with your numbers</h2>
      <GuideChecklist title="Try this:" steps={steps} />
      {notice ? (
        <div className="guide-cta-notice">
          <p className="guide-kicker">What to notice</p>
          <p>{notice}</p>
        </div>
      ) : null}
      <Link href={calculator.href} className="guide-cta-button">
        Open {calculator.name}
      </Link>
      <p className="guide-cta-note">
        The calculator opens its current defaults or saved inputs. Enter the exercise assumptions to reproduce this example.
      </p>
      {extraCalculators.length ? (
        <p className="guide-cta-related">
          Also useful:{" "}
          {extraCalculators.map((slug, index) => (
            <span key={slug}>
              {index > 0 ? " · " : ""}
              <Link href={calculators[slug].href}>{calculators[slug].name}</Link>
            </span>
          ))}
        </p>
      ) : null}
      <Link href={`/how-it-works?calculator=${calculator.slug}`} className="guide-cta-method">
        How MoneyBasis calculates {calculator.shortName.toLowerCase()} estimates →
      </Link>
    </section>
  );
}
