import { ArrowUpRight } from "lucide-react";
import { financialSources, type SourceKey } from "@/lib/sources";
import { sourceWhen } from "@/lib/guides/source-labels";

export function GuideSources({ sourceIds }: { sourceIds: SourceKey[] }) {
  return (
    <section id="sources" className="guide-sources" data-guide-section="sources">
      <h2>Sources & further reading</h2>
      <p>
        Primary references supporting the factual claims in this guide. MoneyBasis independently calculates the illustrative
        examples.
      </p>
      <ul>
        {sourceIds.map((key) => {
          const source = financialSources[key];
          const when = sourceWhen(key);
          return (
            <li key={source.id} id={`source-${source.id}`}>
              <a href={source.url} rel="noreferrer">
                <span className="guide-source-org">{source.organization}</span>
                <span className="guide-source-title">{source.title}</span>
                {when ? <span className="guide-source-when">{when}</span> : null}
                {source.supports[0] ? <span className="guide-source-supports">Supports: {source.supports[0]}</span> : null}
                <ArrowUpRight className="guide-source-icon" aria-hidden="true" />
                <span className="sr-only"> (opens in a new context)</span>
              </a>
            </li>
          );
        })}
      </ul>
      <p className="guide-sources-note">
        Educational examples are not personalized financial advice. Displayed amounts are rounded; calculations retain
        precision.
      </p>
    </section>
  );
}
