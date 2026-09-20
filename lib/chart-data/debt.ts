import type { DebtSnowballResult } from "@/lib/calculators/debt-snowball";
import type { ChartModel } from "./types";
import { money } from "./helpers";

export function debtChart(result: DebtSnowballResult): ChartModel {
  const grouped = result.ordered.length > 6;
  const names = grouped ? [...result.ordered.slice(0, 5).map((debt) => debt.name), "Other debts (combined)"] : result.ordered.map((debt) => debt.name);
  return {
    title: "Remaining debt over time",
    summary: `${money(result.totalDebt)} starting debt. ${result.status === "paid-off" ? `All balances reach zero in ${result.months} months.` : "Debt remains at the 600-month horizon."} Each layer is one debt; extras still cover every required minimum.`,
    views: [{
      id: "debts",
      label: "Remaining balances",
      kind: "area",
      stacked: true,
      columns: [...names.map((label) => ({ label })), { label: "Total remaining", plot: false }],
      points: result.series.map((point) => ({
        x: point.month,
        label: `Month ${point.month}`,
        values: [
          ...(grouped ? [...point.balances.slice(0, 5), point.balances.slice(5).reduce((sum, amount) => sum + amount, 0)] : point.balances),
          point.total,
        ],
      })),
      markers: [
        { index: 0, label: "Start", chip: "Start", emphasis: true, style: "solid" },
        ...result.payoffOrder.map((step) => ({
          index: result.series.findIndex((row) => row.month === step.months),
          label: `${step.name} paid off · Month ${step.months}`,
          style: "dashed" as const,
        })),
        ...(result.status === "paid-off" ? [{ index: result.series.length - 1, label: "Debt-free", chip: "Debt-free", emphasis: true, style: "solid" as const }] : []),
      ],
    }],
  };
}
