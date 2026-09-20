import type { SalaryResult } from "@/lib/calculators/salary";
import type { ChartColumn, ChartModel } from "./types";
import { money, percent } from "./helpers";

export function salaryChart(result: SalaryResult): ChartModel {
  const medicareBase = result.medicare - result.additionalMedicare;
  const parts: { label: string; tone: ChartColumn["tone"]; amount: number }[] = [
    { label: "Estimated take-home", tone: "primary", amount: result.netAnnual },
    { label: "Federal income tax", tone: "cost", amount: result.federalTax },
    { label: "Social Security", tone: "cost", amount: result.socialSecurity },
    { label: "Medicare", tone: "cost", amount: medicareBase },
  ];
  if (result.additionalMedicare > 0) parts.push({ label: "Additional Medicare", tone: "cost", amount: result.additionalMedicare });
  if (result.pretax > 0) parts.push({ label: "Qualifying pretax", tone: "neutral", amount: result.pretax });
  return {
    title: "Pay breakdown",
    summary: `${result.taxYear} federal estimate. ${money(result.annualSalary)} gross becomes ${money(result.netAnnual)} estimated take-home after federal tax, employee FICA${result.pretax > 0 ? ", and qualifying pretax deductions" : ""}. State and local taxes are excluded.`,
    views: [
      {
        id: "pay",
        label: "Pay breakdown",
        kind: "horizontal",
        stacked: true,
        columns: [
          ...parts.map((part) => ({ label: part.label, tone: part.tone })),
          { label: "Gross pay", plot: false },
          ...parts.map((part) => ({ label: `${part.label} share`, format: "percent" as const, plot: false })),
        ],
        points: [{
          label: "Annual pay",
          values: [...parts.map((part) => part.amount), result.annualSalary, ...parts.map((part) => percent(part.amount, result.annualSalary))],
        }],
      },
    ],
  };
}
