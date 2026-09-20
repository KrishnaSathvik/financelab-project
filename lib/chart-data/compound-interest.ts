import type { InvestmentResult } from "@/lib/calculators/investment";
import type { ChartModel } from "./types";
import { money } from "./helpers";

export function investmentChart(result: InvestmentResult): ChartModel {
  const losses = result.series.some((point) => point.growth < 0);
  const nominal = {
    id: result.inflationPercent > 0 ? "nominal" : "growth",
    label: result.inflationPercent > 0 ? "Nominal" : "Growth over time",
    kind: "area" as const,
    stacked: !losses,
    columns: [
      { label: "Contributed capital", tone: "primary" as const },
      { label: "Modeled growth", tone: "growth" as const },
      { label: "Future value", plot: losses },
    ],
    points: result.series.map((point) => ({
      x: point.year,
      label: `Year ${point.year}`,
      values: [point.contributed, point.growth, point.portfolio],
    })),
  };
  return {
    title: "Growth over time",
    summary: `${money(result.totalContributed)} contributed; ${money(result.interestEarned)} modeled growth; ${money(result.finalValue)} future value. ${losses ? "Losses are shown below zero; series are unstacked." : "The top of the stacked areas is total value."}`,
    views: result.inflationPercent > 0
      ? [
          nominal,
          {
            id: "real",
            label: "Today's dollars",
            kind: "area",
            columns: [{ label: "Value in today’s dollars", tone: "growth" }],
            points: result.series.map((point) => ({
              x: point.year,
              label: `Year ${point.year}`,
              values: [point.realPortfolio],
            })),
          },
        ]
      : [nominal],
  };
}
