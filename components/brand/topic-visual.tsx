import type { CalculatorSlug } from "@/lib/calculators/catalog";

/** Schematic explanations deliberately use no invented result values. */
export function TopicVisual({slug, ghost=false}: {slug: CalculatorSlug; ghost?: boolean}) {
  const declining = ["mortgage","loan-payoff","debt-snowball"].includes(slug);
  const title = {mortgage:"Loan balance falls as principal is repaid", "compound-interest":"Contributions build a base; growth compounds", retirement:"Build a portfolio, then draw income", budget:"See how spending divides your income", "salary-hourly":"Gross pay becomes take-home after deductions", "net-worth":"Assets minus liabilities equals net worth", "savings-goal":"Build savings toward a defined target", "debt-snowball":"Pay off debts in your selected order", "loan-payoff":"Extra payments shorten the payoff path", "rent-vs-buy":"Compare two net positions over the same period"}[slug];
  return <figure className={ghost ? "my-7 opacity-20" : "my-6 rounded-xl border border-border bg-card p-5"} aria-hidden={ghost || undefined}>
    {!ghost && <figcaption className="mb-4 text-sm font-medium">{title}<span className="mt-1 block text-xs font-normal text-muted">Illustrative pattern · not to scale</span></figcaption>}
    {slug === "budget" ? <div className="flex items-center justify-center gap-6"><svg viewBox="0 0 120 120" className="h-32 w-32" aria-hidden="true"><circle cx="60" cy="60" r="42" fill="none" stroke="var(--surface-subtle)" strokeWidth="20"/><circle cx="60" cy="60" r="42" fill="none" stroke="var(--budget)" strokeWidth="20" strokeDasharray="110 264"/><circle cx="60" cy="60" r="42" fill="none" stroke="var(--chart-primary)" strokeWidth="20" strokeDasharray="65 264" strokeDashoffset="-110"/></svg><p className="text-xs leading-7 text-muted">Housing<br/>Other expenses<br/>Remaining</p></div>
    : slug === "net-worth" ? <div className="space-y-4 text-xs"><p>Assets</p><div className="h-6 w-full rounded bg-chart-net-worth"/><p>Liabilities</p><div className="h-6 w-1/3 rounded bg-chart-cost"/></div>
    : slug === "salary-hourly" ? <div><div className="flex h-10 overflow-hidden rounded-lg"><span className="w-[70%] bg-primary"/><span className="w-[18%] bg-chart-cost"/><span className="w-[9%] bg-chart-growth"/><span className="w-[3%] bg-chart-net-worth"/></div><p className="mt-4 text-xs leading-6 text-muted">Take-home · Federal tax · Social Security · Medicare</p></div>
    : <><svg viewBox="0 0 440 150" className="w-full" aria-hidden="true"><path d="M0 140H440 M0 75H440 M0 10H440" stroke="var(--border)" fill="none"/>
      {slug === "retirement" ? <><path d="M0 138Q150 125 240 12Q320 30 440 120" fill="none" stroke="var(--retirement)" strokeWidth="3"/><path d="M240 0V150" stroke="var(--muted)" strokeDasharray="4 5"/></> : <path d={declining ? "M0 10Q270 35 440 140" : "M0 140Q260 130 440 10"} fill="none" stroke={slug === "compound-interest" ? "var(--chart-growth)" : "var(--chart-primary)"} strokeWidth="3"/>}
      {slug === "savings-goal" && <path d="M0 10H440" stroke="var(--chart-neutral)" strokeDasharray="5 5" strokeWidth="2"/>}
      {slug === "compound-interest" && <path d="M0 140L440 90" stroke="var(--chart-primary)" fill="none" strokeWidth="2"/>}
      {slug === "rent-vs-buy" && <path d="M0 115Q280 75 440 30" stroke="var(--chart-growth)" fill="none" strokeWidth="3"/>}
      {slug === "loan-payoff" && <path d="M0 10Q150 45 285 140H440" stroke="var(--chart-neutral)" fill="none" strokeWidth="3"/>}
      {slug === "debt-snowball" && <path d="M0 60L100 90L100 105L250 120L250 135H440" stroke="var(--debt)" fill="none" strokeWidth="3"/>}
    </svg><div className="mt-2 flex justify-between text-xs text-muted"><span>{declining ? "First payment" : "Today"}</span><span>{slug === "retirement" ? "Retirement → withdrawals" : declining ? "Paid off" : "Time"}</span></div></>}
  </figure>;
}
