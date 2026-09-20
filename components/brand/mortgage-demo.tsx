"use client";

import { useState } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { calculateMortgage } from "@/lib/calculators/mortgage";
import { formatMoney } from "@/lib/format";

type DemoControlProps = {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  hint?: string;
};

function DemoControl({ id, label, value, onChange, min, max, step, unit, hint }: DemoControlProps) {
  const valid = Number.isFinite(value) && value >= min && value <= max;
  const display = (number: number) => unit === "$" ? formatMoney(number) : `${number}%`;
  return <div>
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <div className={`flex h-11 w-[min(9rem,42%)] shrink-0 items-center rounded-lg border bg-card px-3 focus-within:ring-2 focus-within:ring-primary/25 ${valid ? "border-border" : "border-negative"}`}>
        {unit === "$" && <span className="mr-1 text-sm text-muted">$</span>}
        <input id={id} type="number" inputMode="decimal" min={min} max={max} step="any"
          value={Number.isFinite(value) ? value : ""} onChange={event => onChange(event.currentTarget.valueAsNumber)}
          aria-invalid={!valid} aria-describedby={`${id}-hint`}
          className="min-w-0 w-full bg-transparent text-right text-base font-semibold tabular-nums outline-none" />
        {unit === "%" && <span className="ml-1 text-sm text-muted">%</span>}
      </div>
    </div>
    <input type="range" aria-label={`${label} slider`} min={min} max={max} step={step}
      value={valid ? value : min} aria-valuetext={display(valid ? value : min)}
      onChange={event => onChange(event.currentTarget.valueAsNumber)}
      className="mortgage-demo-slider mt-3 h-8 w-full cursor-pointer accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
    <div className="flex justify-between gap-2 text-xs text-muted"><span>{display(min)}</span><span>{display(max)}</span></div>
    <p id={`${id}-hint`} className={`mt-2 text-xs leading-5 ${valid ? "text-muted" : "text-negative"}`}>
      {valid ? hint : `Enter a value from ${display(min)} to ${display(max)}.`}
    </p>
  </div>;
}

export function MortgageDemo() {
  const [homePrice, setPrice] = useState(400000);
  const [downPercent, setDownPercent] = useState(20);
  const [annualRatePercent, setRate] = useState(6.5);
  const [termYears, setTerm] = useState(30);
  const valid = Number.isFinite(homePrice) && homePrice >= 100000 && homePrice <= 1500000
    && Number.isFinite(downPercent) && downPercent >= 0 && downPercent <= 100
    && Number.isFinite(annualRatePercent) && annualRatePercent >= 0 && annualRatePercent <= 12;
  const downPayment = homePrice * downPercent / 100;
  const result = valid ? calculateMortgage({ homePrice, downPayment, annualRatePercent, termYears }) : null;

  return (
    <div id="mortgage-demo" className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
      <div className="mortgage-demo-grid">
        <div className="p-5 sm:p-8 lg:p-10">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-xl font-semibold">Try your numbers</h3>
            <button type="button" onClick={() => { setPrice(400000); setDownPercent(20); setRate(6.5); setTerm(30); }}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm text-muted hover:text-primary focus-visible:outline-2 focus-visible:outline-primary">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />Reset example
            </button>
          </div>
          <div className="space-y-6">
            <DemoControl id="demo-price" label="Home price" unit="$" value={homePrice} onChange={setPrice} min={100000} max={1500000} step={5000} />
            <DemoControl id="demo-down" label="Down payment" unit="%" value={downPercent} onChange={setDownPercent} min={0} max={100} step={1}
              hint={valid ? `${formatMoney(downPayment)} upfront. Stays at this percentage when the price changes.` : undefined} />
            <DemoControl id="demo-rate" label="Interest rate" unit="%" value={annualRatePercent} onChange={setRate} min={0} max={12} step={0.125} />
            <fieldset>
              <legend className="mb-3 text-sm font-medium">Fixed loan term</legend>
              <div className="grid grid-cols-2 gap-2">{[15, 30].map(years => <button key={years} type="button" aria-pressed={termYears === years} onClick={() => setTerm(years)}
                className={`min-h-11 rounded-lg border px-4 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${termYears === years ? "border-primary bg-primary text-inverse" : "border-border hover:bg-surface"}`}>{years} years</button>)}</div>
            </fieldset>
          </div>
        </div>
        <div className="flex flex-col justify-center border-t border-border bg-surface p-5 sm:p-8 min-[960px]:border-t-0 min-[960px]:border-l lg:p-10">
          <div aria-live="polite" aria-atomic="true">
            {result ? <>
              <p className="text-sm text-muted">Monthly principal & interest</p>
              <p className="mt-3 flex flex-wrap items-baseline gap-x-2 text-primary"><strong className="text-[clamp(2rem,10vw,3.75rem)] tracking-tight tabular-nums">{formatMoney(result.monthlyPayment)}</strong><span className="text-base text-muted">/ month</span></p>
              <p className="mt-3 text-sm leading-6 text-muted">{result.loanAmount === 0 ? "Your down payment covers the home price. No mortgage is needed." : `${formatMoney(result.loanAmount)} borrowed at ${annualRatePercent}% for ${termYears} years.`}</p>
              <div className="mt-8 border-t border-border pt-6">
                <h4 className="text-sm font-semibold">Over the full {termYears}-year loan</h4>
                <div className="mt-4 flex h-4 overflow-hidden rounded-full bg-border" aria-hidden="true">
                  <span className="bg-primary" style={{ width: `${result.totalCost > 0 ? result.loanAmount / result.totalCost * 100 : 0}%` }} />
                  <span className="bg-chart-cost" style={{ width: `${result.totalCost > 0 ? result.totalInterest / result.totalCost * 100 : 0}%` }} />
                </div>
                <dl className="mt-5 space-y-4 text-sm">
                  <div className="flex flex-wrap justify-between gap-2"><dt className="flex items-center gap-2 text-muted"><span className="h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true"/>Principal repaid</dt><dd className="font-semibold tabular-nums">{formatMoney(result.loanAmount)}</dd></div>
                  <div className="flex flex-wrap justify-between gap-2"><dt className="flex items-center gap-2 text-muted"><span className="h-2.5 w-2.5 rounded-full bg-chart-cost" aria-hidden="true"/>Interest paid</dt><dd className="font-semibold tabular-nums">{formatMoney(result.totalInterest)}</dd></div>
                  <div className="flex flex-wrap justify-between gap-2 border-t border-border pt-4"><dt className="font-medium">Total repaid</dt><dd className="font-semibold tabular-nums">{formatMoney(result.totalCost)}</dd></div>
                </dl>
              </div>
            </> : <p className="py-12 text-sm leading-6 text-muted">Check the highlighted inputs to see your estimate.</p>}
          </div>
          <p className="mt-7 text-xs leading-5 text-muted">Principal and interest only. Excludes property tax, homeowners insurance, PMI, HOA dues and fees.</p>
          <Link href="/calculators/mortgage" className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4">Add taxes, insurance and more</Link>
        </div>
      </div>
    </div>
  );
}
