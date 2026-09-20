import type { CalculatorSlug } from "./catalog";

/** Consumer labels; calculator input identifiers remain unchanged for API users. */
export function inputLabel(input: string) {
  const labels: Record<string, string> = {
    annualReturn: "Expected return",
    monthlyBudget: "Monthly debt budget",
    payoffMethod: "Payoff method",
    years: "Time horizon",
  };
  return labels[input] ?? input.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase().replace(/^./, c => c.toUpperCase());
}

export const calculationScope: Record<CalculatorSlug, { included: string[]; notModeled: string[] }> = {
  mortgage: {
    included: ["Fixed mortgage rate", "Entered taxes and insurance", "Entered PMI, HOA fees and extra payments"],
    notModeled: ["Variable rates", "Late payments", "Selling costs"],
  },
  "compound-interest": {
    included: ["Starting balance and end-of-month contributions", "Selected compounding frequency", "Optional inflation adjustment"],
    notModeled: ["Taxes and investment fees", "Market volatility"],
  },
  "salary-hourly": {
    included: ["Salary and hourly conversions", "Selected-year federal income tax", "Employee Social Security and Medicare", "Entered qualifying pretax deductions"],
    notModeled: ["State and local taxes", "Tax credits and itemized deductions", "Spouse income", "Paycheck withholding"],
  },
  "loan-payoff": {
    included: ["Monthly interest on the remaining balance", "Regular and extra payments"],
    notModeled: ["Fees", "Deferments", "Variable rates"],
  },
  "net-worth": {
    included: ["Entered assets minus liabilities", "Optional monthly growth, savings and debt-payment projection"],
    notModeled: ["Inflation", "Taxes", "Market volatility"],
  },
  budget: {
    included: ["Entered monthly income and expenses", "Remaining cash flow", "Remaining-income rate"],
    notModeled: ["Automatic allocation of remaining cash to savings", "Timing of individual bills within the month"],
  },
  retirement: {
    included: ["Contributions until retirement", "Assumed investment return", "Inflation-adjusted spending target", "Illustrative withdrawals and drawdown"],
    notModeled: ["Social Security and pensions", "Taxes", "Market volatility"],
  },
  "savings-goal": {
    included: ["Growth of current savings", "End-of-month contributions toward the future gap", "Constant assumed return"],
    notModeled: ["Taxes and fees", "Inflation", "Changing returns"],
  },
  "debt-snowball": {
    included: ["Entered minimum payments", "Monthly interest", "Snowball and avalanche payoff orders", "Unused payments rolled forward within the same month"],
    notModeled: ["New borrowing", "Changing APRs", "Fees or lender minimum-payment recalculations"],
  },
  "rent-vs-buy": {
    included: ["Equal starting resources", "Housing cost and appreciation assumptions", "Investing monthly cost differences"],
    notModeled: ["Selling costs", "Tax deductions", "Moving costs"],
  },
};
