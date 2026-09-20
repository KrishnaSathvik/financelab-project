import type { LoanPayoffResult } from "@/lib/calculators/loan-payoff";
import type { ChartModel } from "./types";

export function loanChart(result: LoanPayoffResult): ChartModel {
  const payoff = (plan: LoanPayoffResult["standard"], label: string, chip: string) =>
    plan.status === "paid-off"
      ? [{ index: result.series.findIndex((row) => row.month === plan.months), label: `${label} · Month ${plan.months}`, chip, emphasis: true as const, style: "dashed" as const }]
      : [];
  return {
    title: "Balance over time",
    summary: `Current plan: ${result.standard.status === "paid-off" ? `${result.standard.months} months` : result.standard.status}. With extra payment: ${result.accelerated.status === "paid-off" ? `${result.accelerated.months} months` : result.accelerated.status}. Both paths use the same starting balance.`,
    views: [{
      id: "balances",
      label: "Balance comparison",
      kind: "line",
      columns: [
        { label: "Current plan", tone: "neutral" },
        { label: "With extra payment", tone: "primary" },
        { label: "Difference", plot: false },
      ],
      points: result.series.map((point) => ({
        x: point.month,
        label: `Month ${point.month}`,
        values: [point.standardBalance, point.extraBalance, point.standardBalance - point.extraBalance],
      })),
      markers: [
        { index: 0, label: "Start", chip: "Start", emphasis: true, style: "solid" },
        ...payoff(result.standard, "Current payoff", `Current payoff: Month ${result.standard.months}`),
        ...payoff(result.accelerated, "Extra-payment payoff", `Extra payoff: Month ${result.accelerated.months}`),
      ],
    }],
  };
}
