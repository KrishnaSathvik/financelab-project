"use client";

import { calculatorIcons } from "@/components/brand/calculator-icons";
import { calculatorTints } from "@/components/brand/icon-tints";
import { calculatorOutputs } from "@/lib/calculators/presentation";
import { ArrowRight } from "lucide-react";
import type { CalculatorSlug } from "@/lib/calculators/catalog";
import { formatMoney } from "@/lib/format";

export type ResultStat = {
  label: string;
  value: string;
  note?: string;
  tone?: "default" | "positive" | "negative" | "primary";
};

function toneClass(tone?: ResultStat["tone"]) {
  switch (tone) {
    case "positive":
      return "text-positive";
    case "negative":
      return "text-negative";
    case "primary":
      return "text-primary";
    case "default":
    case undefined:
      return "text-foreground";
    default: {
      const exhaustive: never = tone;
      return exhaustive;
    }
  }
}

export function HeroResult({
  label,
  value,
  unit,
  note,
  tone = "primary",
  stats,
}: {
  label: string;
  value: string;
  unit?: string;
  note?: string;
  tone?: ResultStat["tone"];
  stats?: ResultStat[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow)] sm:p-8">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p
        className={`mt-2 break-words tabular-nums text-[clamp(1.75rem,7vw,3rem)] font-semibold tracking-[-0.04em] ${toneClass(tone)}`}
      >
        {value}
        {unit ? (
          <span className="ml-1.5 text-lg font-medium text-muted">{unit}</span>
        ) : null}
      </p>
      {note ? <p className="mt-2 text-sm text-muted">{note}</p> : null}
      {stats?.length ? (
        <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-3 border-t border-border pt-5">
          {stats.map((item) => (
            <div key={item.label}>
              <p className="text-xs text-muted">{item.label}</p>
              <p
                className={`mt-1 text-sm font-semibold sm:text-base ${toneClass(item.tone)}`}
              >
                {item.value}
              </p>
              {item.note ? (
                <p className="mt-1 text-xs leading-5 text-muted">{item.note}</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function StatGrid({ items }: { items: ResultStat[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-border bg-card p-4"
        >
          <p className="text-xs text-muted">{item.label}</p>
          <p className={`mt-2 text-xl font-semibold ${toneClass(item.tone)}`}>
            {item.value}
          </p>
          {item.note ? (
            <p className="mt-1 text-xs text-muted">{item.note}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function EmptyResults({
  slug = "compound-interest",
  labels = ["Estimated result", "Contributions", "Total growth"],
}: {
  labels?: string[];
  slug?: CalculatorSlug;
}) {
  const Icon = calculatorIcons[slug];
  return (
    <div className="empty-results rounded-2xl border border-border bg-card p-6 sm:p-8">
      <span className={`icon-chip ${calculatorTints[slug]}`}><Icon className="h-5 w-5" aria-hidden="true" /></span>
      <p className="mt-5 text-xl font-semibold">Your estimate will appear here</p>
      <p className="mt-3 max-w-md text-sm leading-7 text-muted">{({
        mortgage: "Enter your home price and loan terms to inspect the balance and payment split.",
        "compound-interest": "Enter a starting amount, deposits and assumed return to separate contributions from growth.",
        retirement: "Enter your ages, savings and spending assumptions to explore accumulation and drawdown.",
        "savings-goal": "Set your target and timeline to see the monthly deposit and goal milestones.",
        budget: "Enter monthly income and expenses to see spending categories and remaining cash flow.",
        "salary-hourly": "Enter your pay and tax details to follow gross pay through deductions to estimated net.",
        "loan-payoff": "Enter your balance and payments to compare payoff with and without extra payments.",
        "debt-snowball": "List your debts and monthly budget to inspect payoff order and remaining balances.",
        "net-worth": "List what you own and owe to see your current snapshot and asset composition.",
        "rent-vs-buy": "Enter housing costs and your horizon to compare buying with renting and investing.",
      })[slug]} Select Calculate to see your estimate.</p>
      <p className="mt-7 border-t border-border pt-5 text-xs font-medium text-muted">What you’ll see</p>
      <ul className="mt-4 space-y-4">{calculatorOutputs[slug].map(label => <li key={label} className="flex items-center gap-3 text-sm font-medium"><ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{label}</li>)}</ul>
      <p className="sr-only">{labels.join(", ")}</p>
    </div>
  );
}

export function money(value: number) {
  return formatMoney(value);
}
