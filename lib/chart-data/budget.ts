import type { BudgetResult } from "@/lib/calculators/budget";
import type { ChartModel, ChartView } from "./types";
import { composition, money, percent } from "./helpers";

export function budgetChart(result: BudgetResult): ChartModel {
  const income = result.expenses + result.surplus;
  const view = composition(result.chartItems, result.expenses, "expenses");
  view.centerLabel = "Expenses";
  view.columns.push({ label: "% of income", format: "percent", plot: false });
  view.points.forEach((point) => point.values.push(percent(point.values[0]!, income)));
  const categories: ChartView = {
    ...view,
    id: "categories",
    label: "All categories",
    kind: "horizontal",
    centerLabel: undefined,
    points: result.chartItems.map((item) => ({
      label: item.name,
      values: [item.amount, percent(item.amount, result.expenses), percent(item.amount, income)],
    })),
  };
  return {
    title: "Spending breakdown",
    summary: `${money(result.expenses)} total expenses. ${result.surplus < 0 ? `Expenses exceed income by ${money(-result.surplus)}.` : `${money(result.surplus)} remaining cash flow.`}`,
    views: [view, categories],
  };
}

export function budgetAllocation(result: BudgetResult): ChartModel {
  const income = result.expenses + result.surplus;
  return {
    title: "Income allocation",
    summary: result.surplus < 0
      ? `Expenses exceed income by ${money(-result.surplus)}. The negative remainder is a shortfall.`
      : `${money(income)} income covers ${money(result.expenses)} expenses and leaves ${money(result.surplus)}.`,
    views: [{
      id: "allocation",
      label: "Allocation",
      kind: "horizontal",
      stacked: result.surplus >= 0,
      columns: result.surplus >= 0
        ? [{ label: "Expenses", tone: "cost" }, { label: "Remaining", tone: "growth" }]
        : [{ label: "Amount" }],
      points: result.surplus >= 0
        ? [{ label: "Monthly income", values: [result.expenses, result.surplus] }]
        : [
            { label: "Income", values: [income] },
            { label: "Expenses", values: [result.expenses] },
            { label: "Shortfall", values: [result.surplus] },
          ],
    }],
  };
}
