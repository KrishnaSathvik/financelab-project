import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { calculatorIcons } from "@/components/brand/calculator-icons";
import { calculatorTints } from "@/components/brand/icon-tints";
import type { CalculatorDefinition } from "@/lib/calculators/catalog";

export type InsightItem = {
  icon: LucideIcon;
  title: string;
  body: string;
  tint: string;
};

export function InsightList({ items }: { items: InsightItem[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow)]">
      <h2 className="text-base font-semibold">Quick insights</h2>
      <div className="mt-4 space-y-4">
        {items.map((item) => (
          <div key={item.title} className="flex gap-3">
            <span className={`icon-chip ${item.tint}`}>
              <item.icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="mt-0.5 text-sm leading-6 text-muted">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RelatedMini({ items }: { items: CalculatorDefinition[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow)]">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Related calculators</h2>
        <Link href="/calculators" className="text-sm text-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="mt-4 space-y-3">
        {items.slice(0, 2).map((item) => {
          const Icon = calculatorIcons[item.slug];
          return (
            <Link key={item.slug} href={item.href} className="flex items-start gap-3 rounded-xl hover:bg-surface">
              <span className={`icon-chip ${calculatorTints[item.slug]}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-sm font-semibold">{item.shortName}</span>
                <span className="mt-0.5 block text-sm leading-5 text-muted">{item.description}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
