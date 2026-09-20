import type { RentVsBuyResult } from "@/lib/calculators/rent-vs-buy";
import type { ChartModel } from "./types";
import { money } from "./helpers";

export function rentBuyChart(result: RentVsBuyResult): ChartModel {
  const lead = result.difference === 0
    ? `At year ${result.yearsToStay}, the two positions are the same.`
    : `Under these assumptions, the ${result.difference > 0 ? "buyer" : "renter"} position is approximately ${money(Math.abs(result.difference))} higher at year ${result.yearsToStay}.`;
  return {
    title: "Net position over time",
    summary: `Compare estimated buyer and renter positions under the same resources. ${lead} Any first crossover can reverse later.`,
    views: [
      {
        id: "position",
        label: "Net position",
        kind: "line",
        columns: [
          { label: "Buyer net position", tone: "primary" },
          { label: "Renter net position", tone: "growth" },
          { label: "Difference", plot: false },
        ],
        points: result.series.map((point) => ({
          x: point.year,
          label: `Year ${point.year}`,
          values: [point.buyNetWorth, point.rentNetWorth, point.buyNetWorth - point.rentNetWorth],
        })),
        markers: [
          { index: result.series.findIndex((point) => point.year === result.yearsToStay), label: "Selected horizon", chip: `Selected horizon: ${result.yearsToStay} years`, style: "solid" },
          ...(result.breakevenYear === null
            ? []
            : [{ index: result.series.findIndex((point) => point.year === result.breakevenYear), label: `Estimated crossover · Year ${result.breakevenYear}`, chip: `First crossover: Year ${result.breakevenYear}`, style: "dashed" as const }]),
        ],
      },
      {
        id: "costs",
        label: "Cash costs",
        kind: "horizontal",
        columns: [
          { label: "Buying", tone: "primary" },
          { label: "Renting", tone: "growth" },
        ],
        points: result.costRows
          .filter((row) => !/down payment|invested/i.test(row.label))
          .map((row) => ({ label: row.label, values: [row.buy, row.rent] })),
      },
    ],
  };
}
