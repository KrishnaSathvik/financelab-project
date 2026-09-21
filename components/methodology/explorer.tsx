"use client";
import { PageHero } from "@/components/layout/page-hero";
import { InformationIllustration } from "@/components/brand/information-illustration";
import { calculationScope, inputLabel } from "@/lib/calculators/explanation";
import { useState } from "react";
import Link from "next/link";
import { type CalculatorSlug, calculatorList } from "@/lib/calculators/catalog";
export function MethodologyExplorer({ initialSlug = "mortgage" }: { initialSlug?: CalculatorSlug }) {
  const [slug, setSlug] = useState(initialSlug);
  const c = calculatorList.find((x) => x.slug === slug)!;
  return (
    <div className="how-it-works site-container pb-16">
      <PageHero eyebrow="Formulas and assumptions" title="How MoneyBasis calculates results" description="Explore the formulas, assumptions and sources behind each estimate. Your inputs provide the starting point; the calculation runs in your browser." illustration={<InformationIllustration topic="how-it-works" />} />
      <div className="explanation-layout">
      <nav aria-label="Calculator explanations" className="explanation-nav">
        {calculatorList.map(item => <button key={item.slug} type="button"
          aria-pressed={slug === item.slug} aria-controls="methodology-panel"
          onClick={() => setSlug(item.slug)}>{item.shortName}</button>)}
      </nav>
      <div className="explanation-select">
        <label htmlFor="explanation-calculator" className="mb-2 block text-sm font-medium">Choose a calculator</label>
        <select id="explanation-calculator" value={slug} onChange={event => setSlug(event.target.value as CalculatorSlug)} aria-controls="methodology-panel" className="h-12 w-full rounded-xl border border-border bg-card px-4 text-base focus:outline-2 focus:outline-primary">
          {calculatorList.map(item => <option key={item.slug} value={item.slug}>{item.shortName}</option>)}
        </select>
      </div>
      <article id="methodology-panel" aria-labelledby="explanation-title" className="explanation-panel">
        <div className="detail-content">
        <h2 id="explanation-title" aria-live="polite" className="section-title">{c.name}</h2>
        <h3 className="mt-7 border-b border-border pb-3 font-semibold">What it estimates</h3>
        <p className="mt-4 max-w-3xl leading-7 text-muted">{c.intro}</p>
        <h3 className="mt-7 font-semibold">How it calculates</h3>
        {slug === "debt-snowball" && <h4 className="mt-4 font-medium">Payment allocation</h4>}
        {slug === "net-worth" && <h4 className="mt-4 font-medium">Current net worth</h4>}
        <pre className="my-4 whitespace-pre-wrap break-words rounded-xl bg-surface p-5 text-sm">
          {c.formula}
        </pre>
        {slug === "net-worth" && <h4 className="mb-2 font-medium">Optional projection</h4>}
        <p className="leading-7 text-muted">{c.formulaNote}</p>
        <h3 className="mt-7 border-b border-border pb-3 font-semibold">Inputs</h3>
        <p className="mt-3 leading-7 text-muted">{c.inputs.map(inputLabel).join(" · ")}</p>
        <h3 className="mt-7 border-b border-border pb-3 font-semibold">Included / not modeled</h3>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          {(["included", "notModeled"] as const).map(kind => <div key={kind}>
            <h4 className="font-medium">{kind === "included" ? "Included" : "Not modeled"}</h4>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">{calculationScope[slug][kind].map(item => <li key={item} className="flex gap-2"><span aria-hidden="true">{kind === "included" ? "✓" : "–"}</span>{item}</li>)}</ul>
          </div>)}
        </div>
        <details className="mt-5 text-sm leading-6 text-muted"><summary className="cursor-pointer font-medium">Assumptions & limitations</summary><ul className="mt-3 list-disc space-y-2 pl-5">{c.assumptions.map(item => <li key={item}>{item}</li>)}</ul></details>
        <h3 className="mt-7 font-semibold">Sources</h3>
        <ul className="mt-3 space-y-3">
          {c.sources.map((x) => (
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
        <Link href={c.href} className="mt-8 inline-block font-semibold text-foreground">
          Open {c.shortName} calculator →
        </Link>
      </div>
      </article>
      </div>
    </div>
  );
}
