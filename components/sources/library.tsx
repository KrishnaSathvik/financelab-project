"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { TrustSection } from "@/components/layout/trust-page";
import { financialSources, sourceCategories, type FinancialSource } from "@/lib/sources";

const labelSectionId = "how-numbers-are-labeled";
const sourceNavItems = [
  ...sourceCategories.map((category) => ({
    id: category.id,
    title: category.title,
    count: category.keys.length as number | null,
  })),
  { id: labelSectionId, title: "How numbers are labeled", count: null },
];

function SourceRow({ item }: { item: FinancialSource }) {
  return (
    <li className="source-row" data-source-id={item.id}>
      <p className="source-org">{item.organization}</p>
      <a href={item.url} target="_blank" rel="noreferrer">
        {item.title}
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      <p className="source-purpose">{item.supports.join(" · ")}</p>
      {item.effectiveYear ? <div className="source-meta"><span className="year-badge">{item.effectiveYear}</span></div> : null}
    </li>
  );
}

export function SourcesLibrary() {
  const [active, setActive] = useState(sourceCategories[0].id);

  useEffect(() => {
    const nodes = sourceNavItems.map((item) => document.getElementById(item.id)).filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActive(visible.target.id);
    }, { rootMargin: "-20% 0px -65% 0px", threshold: [0.1, 0.25, 0.5] });
    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function scrollToCategory(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    setActive(id);
  }

  return (
    <>
      <div className="source-library">
        <nav className="source-nav" aria-label="Source categories">
          <p>Sources</p>
          {sourceNavItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
              onClick={() => setActive(item.id)}
            >
              <span>{item.title}</span>
              {item.count !== null ? <span className="source-count">{item.count}</span> : null}
            </a>
          ))}
        </nav>
        <div>
          <div className="source-select">
            <label htmlFor="source-category">Source category</label>
            <select
              id="source-category"
              value={active}
              onChange={(event) => scrollToCategory(event.target.value)}
            >
              {sourceNavItems.map((item) => (
                <option key={item.id} value={item.id}>{item.count !== null ? `${item.title} · ${item.count} references` : item.title}</option>
              ))}
            </select>
          </div>
          {sourceCategories.map((category) => (
            <TrustSection key={category.id} id={category.id} title={category.title} description={category.description}>
              <ul className="source-list">
                {category.keys.map((key) => <SourceRow key={key} item={financialSources[key]} />)}
              </ul>
            </TrustSection>
          ))}
        </div>
      </div>
      <TrustSection id={labelSectionId} title="How MoneyBasis labels numbers" description="MoneyBasis separates source-derived facts, user-adjustable assumptions and calculated estimates.">
        <div className="label-grid">
          <article className="label-card">
            <p className="label-kicker">Source-derived facts</p>
            <h3>Reference data</h3>
            <ul>
              <li><span aria-hidden="true">•</span>2026 tax brackets</li>
              <li><span aria-hidden="true">•</span>Social Security wage base</li>
            </ul>
          </article>
          <article className="label-card">
            <p className="label-kicker">User assumptions</p>
            <h3>Editable inputs</h3>
            <ul>
              <li><span aria-hidden="true">•</span>expected investment return</li>
              <li><span aria-hidden="true">•</span>home appreciation</li>
              <li><span aria-hidden="true">•</span>inflation assumption</li>
            </ul>
          </article>
          <article className="label-card">
            <p className="label-kicker">Calculated estimates</p>
            <h3>Model output</h3>
            <ul>
              <li><span aria-hidden="true">•</span>mortgage payment</li>
              <li><span aria-hidden="true">•</span>future portfolio value</li>
              <li><span aria-hidden="true">•</span>rent-vs-buy position</li>
            </ul>
          </article>
        </div>
        <p className="label-note">Defaults such as an investment return, home-appreciation rate or a 4% retirement withdrawal are <strong className="font-medium text-foreground">user-adjustable assumptions</strong> or historical heuristics. They are not presented as typical returns, guaranteed outcomes or live market data.</p>
      </TrustSection>
    </>
  );
}
