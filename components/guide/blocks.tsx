import type { ReactNode } from "react";
import type { CalloutTone, GuideComparisonColumn, GuideDefinitionData, GuideExampleData, GuideFormulaData } from "@/lib/guides/presentation";

function assertNever(value: never): never {
  throw new Error(`Unhandled guide variant: ${String(value)}`);
}

export function GuideKicker({ children }: { children: ReactNode }) {
  return <p className="guide-kicker">{children}</p>;
}

export function GuideAside({ label, children }: { label: string; children: ReactNode }) {
  return (
    <aside className="guide-aside">
      <p className="guide-kicker">{label}</p>
      {children}
    </aside>
  );
}

export function GuideCallout({ tone, children }: { tone: CalloutTone; children: ReactNode }) {
  let label = "Note";
  switch (tone) {
    case "info":
      label = "Useful distinction";
      break;
    case "example":
      label = "Illustrative numbers";
      break;
    case "caution":
      label = "Important limitation";
      break;
    default:
      assertNever(tone);
  }
  return (
    <aside className={`guide-callout guide-callout-${tone}`}>
      <p className="guide-kicker">{label}</p>
      <p>{children}</p>
    </aside>
  );
}

export function GuideDefinition({ term, expansion, body }: GuideDefinitionData) {
  return (
    <aside className="guide-definition">
      <p className="guide-definition-term">{term}</p>
      {expansion ? <p className="guide-definition-expansion">{expansion}</p> : null}
      <p>{body}</p>
    </aside>
  );
}

export function GuideFormula({ title, expression, symbols }: GuideFormulaData) {
  return (
    <figure className="guide-formula">
      <figcaption>{title}</figcaption>
      <div className="guide-formula-expr" tabIndex={0}>
        {expression}
      </div>
      <dl>
        {symbols.map((item) => (
          <div key={item.symbol}>
            <dt>{item.symbol}</dt>
            <dd>{item.meaning}</dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}

export function GuideComparison({ columns }: { columns: GuideComparisonColumn[] }) {
  return (
    <div className="guide-comparison" data-count={columns.length}>
      {columns.map((column) => (
        <article key={column.title}>
          {column.kicker ? <p className="guide-kicker">{column.kicker}</p> : null}
          <h3>{column.title}</h3>
          <ul>
            {column.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

export function GuideMetricRow({ metrics }: { metrics: { label: string; value: string }[] }) {
  return (
    <dl className="guide-metrics" data-count={metrics.length}>
      {metrics.map((metric) => (
        <div key={metric.label}>
          <dt>{metric.label}</dt>
          <dd>{metric.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function GuideExample({ kicker = "Worked example", title, setup, metrics }: GuideExampleData) {
  return (
    <section className="guide-example">
      <p className="guide-kicker">{kicker}</p>
      <h3>{title}</h3>
      {setup?.length ? (
        <ul className="guide-example-setup">
          {setup.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      <GuideMetricRow metrics={metrics} />
    </section>
  );
}

export function GuideChecklist({ title, steps }: { title?: string; steps: string[] }) {
  return (
    <section className="guide-checklist">
      {title ? <h3>{title}</h3> : null}
      <ol>
        {steps.map((step, index) => (
          <li key={step}>
            <span aria-hidden="true">{index + 1}</span>
            <p>{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function GuideTimeline({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="guide-timeline">
      {title ? <p className="guide-kicker">{title}</p> : null}
      {children}
    </div>
  );
}

export function GuideFigure({ children }: { children: ReactNode }) {
  return <div className="guide-figure-wrap">{children}</div>;
}

export function GuideTable({ children }: { children: ReactNode }) {
  return <div className="guide-table-wrap">{children}</div>;
}
