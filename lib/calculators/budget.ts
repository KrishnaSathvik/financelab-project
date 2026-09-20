import { assertValid } from "@/lib/validation/index";
export type BudgetCategory = {
  name: string;
  amount: number;
};

export type BudgetInput = {
  monthlyIncome: number;
  categories: BudgetCategory[];
};

export type BudgetResult = {
  expenses: number;
  surplus: number;
  savingsRate: number | null;
  remainingIncomeRate: number | null;
  spentPercent: number | null;
  largestCategory: BudgetCategory | null;
  chartItems: BudgetCategory[];
  insights: string[];
};

export const defaultBudgetCategories: BudgetCategory[] = [
  { name: "Housing", amount: 1500 },
  { name: "Food", amount: 600 },
  { name: "Transportation", amount: 400 },
  { name: "Utilities", amount: 200 },
  { name: "Insurance", amount: 180 },
  { name: "Healthcare", amount: 150 },
  { name: "Subscriptions", amount: 80 },
  { name: "Entertainment", amount: 200 },
  { name: "Debt Payments", amount: 250 },
  { name: "Other", amount: 140 },
];

export function calculateBudget(input: BudgetInput): BudgetResult {
  assertValid("budget", input);
  const expenses = input.categories.reduce((sum, item) => sum + (item.amount || 0), 0);
  const surplus = input.monthlyIncome - expenses;
  const savingsRate = input.monthlyIncome > 0 ? (surplus / input.monthlyIncome) * 100 : null;
  const spentPercent = input.monthlyIncome > 0 ? (expenses / input.monthlyIncome) * 100 : null;
  const chartItems = input.categories.filter((item) => (item.amount || 0) > 0);
  const largestCategory = [...chartItems].sort((a, b) => b.amount - a.amount)[0] ?? null;
  const insights: string[] = [];
  if (largestCategory && expenses > 0) {
    insights.push(
      `${largestCategory.name} is your largest category (${((largestCategory.amount / expenses) * 100).toFixed(0)}% of spending).`,
    );
  }
  const subscriptions = input.categories.find((item) => item.name.toLowerCase().includes("subscription"));
  if (subscriptions && expenses > 0 && subscriptions.amount > 0) {
    insights.push(`Subscriptions represent ${((subscriptions.amount / expenses) * 100).toFixed(0)}% of spending.`);
  }
  if (surplus >= 0) {
    insights.push(`You currently have ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(surplus)} remaining.`);
  } else {
    insights.push(`Expenses exceed income by ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(-surplus)}.`);
  }

  return { expenses, surplus, remainingIncomeRate: savingsRate, savingsRate, spentPercent, largestCategory, chartItems, insights };
}
