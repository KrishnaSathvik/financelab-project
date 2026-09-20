import type { CalculatorCategoryId, CalculatorSlug } from "@/lib/calculators/catalog";

export const categoryTints: Record<CalculatorCategoryId, string> = {
  home: "tint-home",
  grow: "tint-growth",
  manage: "tint-budget",
};

export const calculatorTints: Record<CalculatorSlug, string> = {
  mortgage: "tint-home",
  "rent-vs-buy": "tint-comparison",
  "compound-interest": "tint-growth",
  retirement: "tint-retirement",
  "savings-goal": "tint-savings",
  "net-worth": "tint-net-worth",
  budget: "tint-budget",
  "salary-hourly": "tint-salary",
  "loan-payoff": "tint-loan",
  "debt-snowball": "tint-debt",
};
