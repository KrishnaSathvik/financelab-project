import { Calculator, ChartNoAxesCombined, BookOpen } from "lucide-react";

export function BrandOverview() {
  return <div className="rounded-2xl border border-border bg-card p-7 sm:p-9"><p className="text-xl font-semibold">MoneyBasis</p><div className="mt-7 divide-y divide-border">{[
    {Icon:Calculator,title:"Calculate",body:"Mortgage · Budget · Savings",note:"Start with a question and your own numbers."},
    {Icon:ChartNoAxesCombined,title:"Visualize",body:"Charts · Comparisons · Timelines",note:"See what changes as you explore a scenario."},
    {Icon:BookOpen,title:"Understand",body:"Formulas · Assumptions · Sources",note:"Follow the reasoning behind every result."},
  ].map(({Icon,title,body,note})=><div key={title} className="flex gap-4 py-6"><Icon className="mt-1 h-6 w-6 shrink-0 text-primary"/><div><h2 className="text-lg font-semibold">{title}</h2><p className="mt-2 text-sm">{body}</p><p className="mt-2 text-sm leading-6 text-muted">{note}</p></div></div>)}</div></div>;
}
