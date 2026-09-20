import type { MortgageResult } from "@/lib/calculators/mortgage";
import type { ChartModel } from "./types";
import { money } from "./helpers";

export function mortgageChart(result: MortgageResult): ChartModel {
  const paidOff = result.months.at(-1)?.balance ?? result.loanAmount;
  return {
    title: "Loan balance over time",
    summary: result.status === "no-loan"
      ? "No mortgage balance: this is an all-cash purchase."
      : `Balance declines from ${money(result.loanAmount)} to ${money(paidOff)} over ${result.years.length} years.`,
    views: [
      {
        id: "balance",
        label: "Balance",
        kind: "area",
        columns: [
          { label: "Remaining balance", tone: "primary" },
          { label: "Principal repaid to date", plot: false },
          { label: "Interest paid this year", plot: false },
        ],
        points: [
          { x: 0, label: "Start", values: [result.loanAmount, 0, 0] },
          ...result.years.map((row) => ({
            x: row.year,
            label: `Year ${row.year}`,
            values: [row.balance, result.loanAmount - row.balance, row.interest],
          })),
        ],
        markers: [
          { index: 0, label: "Start", chip: "Start", emphasis: true, style: "solid" },
          { index: result.years.length, label: "Paid off", chip: "Paid off", emphasis: true, style: "solid" },
        ],
      },
      {
        id: "split",
        label: "Principal vs interest",
        kind: "bar",
        stacked: true,
        columns: [
          { label: "Principal", tone: "primary" },
          { label: "Interest", tone: "cost" },
          { label: "Total P&I", plot: false },
        ],
        points: result.years.map((row) => ({
          x: row.year,
          label: `Year ${row.year}`,
          values: [row.principal, row.interest, row.payment],
        })),
      },
    ],
  };
}
