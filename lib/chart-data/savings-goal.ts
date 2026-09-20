import type { SavingsGoalResult } from "@/lib/calculators/savings-goal";
import type { ChartModel } from "./types";
import { money, percent } from "./helpers";

function yearlySeries(result: SavingsGoalResult) {
  return result.series.filter((point, index, series) => index === 0 || index === series.length - 1 || Number.isInteger(point.year));
}

export function savingsChart(result: SavingsGoalResult): ChartModel {
  const initial = result.series[0].value;
  const points = yearlySeries(result);
  const last = points.at(-1)!;
  const deposited = result.monthlyRequired * Math.round(last.year * 12);
  const growth = last.value - initial - deposited;
  const mixPositive = last.value > 0 && deposited >= 0 && growth >= 0;
  return {
    title: "Progress toward your goal",
    summary: `From ${money(initial)} today to ${money(last.value)} at the selected target. The dashed line is your ${money(result.series[0].goal)} goal.`,
    views: [
      {
        id: "savings",
        label: "Balance vs goal",
        kind: "line",
        columns: [
          { label: "Savings balance", tone: "primary" },
          { label: "Goal", tone: "neutral", dashed: true },
          { label: "Existing savings", plot: false },
          { label: "New deposits", plot: false },
          { label: "Modeled growth", plot: false },
        ],
        points: points.map((point) => {
          const deposits = result.monthlyRequired * Math.round(point.year * 12);
          return {
            x: point.year,
            label: point.year === 0 ? "Today" : `Year ${point.year}`,
            values: [point.value, point.goal, initial, deposits, point.value - initial - deposits],
          };
        }),
        markers: [
          { index: 0, label: "Today", chip: "Today", emphasis: true, style: "solid" },
          ...result.milestones.flatMap((milestone) => {
            if (milestone.year === null) return [];
            const index = points.findIndex((point) => point.year === milestone.year);
            return index > 0 && index < points.length - 1 ? [{ index, label: `${milestone.percent}% reached`, style: "dashed" as const }] : [];
          }),
          { index: points.length - 1, label: "Goal date", chip: "Goal date", emphasis: true, style: "solid" },
        ],
      },
      ...(mixPositive
        ? [{
            id: "mix",
            label: "Contribution mix",
            kind: "donut" as const,
            centerLabel: "Balance",
            columns: [{ label: "Amount" }, { label: "% of ending balance", format: "percent" as const, plot: false }],
            points: [
              { label: "Existing savings", values: [initial, percent(initial, last.value)] },
              { label: "New deposits", values: [deposited, percent(deposited, last.value)] },
              { label: "Modeled growth", values: [growth, percent(growth, last.value)] },
            ].filter((point) => (point.values[0] ?? 0) > 0),
          }]
        : []),
    ],
  };
}
