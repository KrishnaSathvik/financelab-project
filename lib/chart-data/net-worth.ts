import type { NetWorthResult } from "@/lib/calculators/net-worth";
import type { ChartModel } from "./types";
import { columns, composition, money } from "./helpers";

export function netWorthChart(assets: number, debts: number, items: { name: string; amount: number }[]): ChartModel {
  return {
    title: "Assets vs liabilities",
    summary: `${money(assets)} assets and ${money(debts)} liabilities. Net worth is the difference, not a third independent total.`,
    views: [
      {
        id: "snapshot",
        label: "Assets vs liabilities",
        kind: "horizontal",
        columns: columns("Amount"),
        points: [
          { label: "Assets", values: [assets] },
          { label: "Liabilities", values: [debts] },
        ],
      },
      composition(items, assets, "assets"),
    ],
  };
}

export function netWorthProjection(result: NetWorthResult): ChartModel {
  return {
    title: "Projected net worth",
    summary: "Illustrative projection under selected assumptions. This future path is separate from your current snapshot.",
    views: [{
      id: "projection",
      label: "Projection",
      kind: "area",
      columns: [
        { label: "Net worth", tone: "net-worth" },
        { label: "Assets", plot: false },
        { label: "Liabilities", plot: false },
      ],
      points: result.series.map((point) => ({
        x: point.year,
        label: `Year ${point.year}`,
        values: [point.netWorth, point.assets, point.liabilities],
      })),
    }],
  };
}
