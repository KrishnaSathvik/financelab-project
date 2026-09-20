import { formatMoney } from "@/lib/format";
import type { ChartView } from "./types";

export const money = formatMoney;
export const columns = (...labels: string[]) => labels.map((label) => ({ label }));
export const percent = (value: number, total: number) => (total > 0 ? (value / total) * 100 : null);

export function composition(items: { name: string; amount: number }[], total: number, denominator: string): ChartView {
  const grouped = items.length > 6
    ? [...items.slice(0, 5), { name: "Other categories (combined)", amount: items.slice(5).reduce((sum, item) => sum + item.amount, 0) }]
    : items;
  return {
    id: "composition",
    label: "Composition",
    kind: "donut",
    columns: [{ label: "Amount" }, { label: `% of ${denominator}`, format: "percent", plot: false }],
    points: grouped.map((item) => ({ label: item.name, values: [item.amount, percent(item.amount, total)] })),
  };
}
