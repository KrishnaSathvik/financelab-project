import type { ChartPoint, ChartView } from "./types";

export type ChartTableRow = {
  index: number;
  label: string;
  values: ChartPoint["values"];
};

const monthNumber = (label: string) => {
  const match = label.match(/^Month (\d+)$/);
  return match ? Number(match[1]) : null;
};

export function isDenseMonthlyView(view: ChartView) {
  return view.points.filter((point) => monthNumber(point.label) !== null).length >= 12 && view.points.length > 24;
}

export function annualChartRows(view: ChartView): ChartTableRow[] {
  if (!isDenseMonthlyView(view)) {
    return view.points.map((point, index) => ({ index, label: point.label, values: point.values }));
  }
  return view.points.flatMap((point, index) => {
    const month = monthNumber(point.label);
    if (index === 0 || index === view.points.length - 1) {
      return [{ index, label: month && month % 12 === 0 ? `Year ${month / 12}` : point.label, values: point.values }];
    }
    if (month && month % 12 === 0) return [{ index, label: `Year ${month / 12}`, values: point.values }];
    return [];
  });
}

export function monthlyChartYears(view: ChartView) {
  const months = view.points.map((point) => monthNumber(point.label)).filter((value): value is number => value !== null && value > 0);
  const max = Math.max(0, ...months);
  return Array.from({ length: Math.ceil(max / 12) }, (_, index) => index + 1);
}

export function monthlyChartRowsForYear(view: ChartView, year: number): ChartTableRow[] {
  const start = (year - 1) * 12 + 1;
  const end = year * 12;
  return view.points.flatMap((point, index) => {
    const month = monthNumber(point.label);
    return month !== null && month >= start && month <= end ? [{ index, label: point.label, values: point.values }] : [];
  });
}
