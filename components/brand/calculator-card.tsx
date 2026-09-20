import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { calculatorOutputs } from "@/lib/calculators/presentation";
import { inputLabel } from "@/lib/calculators/explanation";
import { calculatorIcons } from "@/components/brand/calculator-icons";
import { calculatorTints } from "@/components/brand/icon-tints";
import type { CalculatorDefinition } from "@/lib/calculators/catalog";

export function CalculatorCard({
  calculator,
  tags,
  detailed = false,
}: {
  calculator: CalculatorDefinition;
  tags?: string[];
  detailed?: boolean;
}) {
  const Icon = calculatorIcons[calculator.slug];
  if (detailed) return <Link href={calculator.href} className="directory-tool-card group rounded-2xl border border-border bg-card p-6 transition hover:border-foreground/25 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground sm:p-8">
    <div>
      <span className={`icon-chip ${calculatorTints[calculator.slug]}`}><Icon className="h-5 w-5" aria-hidden="true" /></span>
      <h3 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">{calculator.name}</h3>
      <p className="mt-4 max-w-lg leading-7 text-muted">{calculator.description}</p>
      <span className="mt-6 inline-flex items-center gap-2 font-semibold text-foreground group-hover:underline">Open calculator <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></span>
    </div>
    <div className="min-w-0 rounded-xl border border-border bg-surface p-5 sm:p-7">
      <p className="text-xs font-medium text-muted">Start with your numbers</p>
      <p className="mt-3 text-sm leading-7">{calculator.inputs.map(inputLabel).join(" · ")}</p>
      <p className="mt-5 border-t border-border pt-5 text-xs font-medium text-muted">See the result</p>
      <ul className="mt-3 space-y-3">{calculatorOutputs[calculator.slug].map((label, index) => <li key={label} className="flex items-center gap-3 text-base font-medium"><span className={`h-2 w-2 shrink-0 rounded-full ${index === 0 ? "bg-primary" : "bg-primary/30"}`} aria-hidden="true" />{label}</li>)}</ul>
    </div>
  </Link>;
  return (
    <Link
      href={calculator.href}
      className="group flex h-full min-w-0 flex-col rounded-2xl border border-border bg-card p-5 transition hover:border-foreground/25"
    >
      <span className="flex items-start justify-between gap-3">
        <span className={`icon-chip ${calculatorTints[calculator.slug]}`}>
          <Icon className="h-5 w-5" />
        </span>
      </span>
      <span className="mt-5 block text-xl font-semibold text-foreground">{calculator.shortName}</span>
      <span className="mt-1 block text-sm leading-6 text-muted">{calculator.description}</span>
      <span className="mt-6 text-[15px] font-semibold text-foreground">Open calculator →</span>
      {tags?.length ? (
        <span className="mt-4 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full bg-surface px-2.5 py-1 text-[11px] text-muted">
              {tag}
            </span>
          ))}
        </span>
      ) : null}
    </Link>
  );
}
