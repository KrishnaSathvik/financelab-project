import { expect, it } from "vitest";
import { annualChartRows, isDenseMonthlyView, monthlyChartRowsForYear, monthlyChartYears } from "@/lib/chart-data/table";
import { loanChart } from "@/lib/chart-data/adapters";
import { calculateLoanPayoff } from "@/lib/calculators/loan-payoff";
import { salaryChart } from "@/lib/chart-data/adapters";
import { calculateSalary } from "@/lib/calculators/salary";

it("annualizes dense loan chart data without dropping start or payoff", () => {
  const result = calculateLoanPayoff({ balance: 25000, annualRatePercent: 8, monthlyPayment: 500, extraPayment: 0 });
  const view = loanChart(result).views[0];
  expect(isDenseMonthlyView(view)).toBe(true);
  expect(view.points[0].label).toBe("Month 0");
  const rows = annualChartRows(view);
  expect(rows[0].label).toBe("Month 0");
  expect(rows.some((row) => row.label === "Year 1")).toBe(true);
  expect(rows.length).toBeLessThan(view.points.length);
  expect(monthlyChartYears(view).length).toBeGreaterThan(1);
  expect(monthlyChartRowsForYear(view, 1).length).toBeGreaterThan(0);
  expect(monthlyChartRowsForYear(view, 1)[0].label).toBe("Month 1");
});

it("does not paginate compact salary charts", () => {
  const view = salaryChart(calculateSalary({ mode: "salary", annualSalary: 75000, hoursPerWeek: 40, weeksPerYear: 52, filingStatus: "single", taxYear: 2026 })).views[0];
  expect(isDenseMonthlyView(view)).toBe(false);
  expect(annualChartRows(view)).toHaveLength(view.points.length);
});
