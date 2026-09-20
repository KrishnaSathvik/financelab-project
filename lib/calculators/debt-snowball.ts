import { assertValid } from "@/lib/validation/index";
export type DebtItem = {
  id: string;
  name: string;
  balance: number;
  rate: number;
  minimumPayment: number;
};

export type DebtMethod = "snowball" | "avalanche";

export type DebtSnowballInput = {
  monthlyBudget: number;
  debts: DebtItem[];
  method?: DebtMethod;
};

export type DebtPayoffStep = {
  id: string;
  name: string;
  months: number;
};

export type DebtSnowballResult = {
  status: "paid-off" | "horizon-exceeded";
  ledger: { month: number; interest: number; payment: number; unusedBudget: number; allocations: { id: string; interest: number; payment: number; balance: number }[] }[];
  totalDebt: number;
  months: number;
  totalInterest: number;
  budgetTooLow: boolean;
  ordered: DebtItem[];
  payoffOrder: DebtPayoffStep[];
  series: { month: number; total: number; balances: number[] }[];
};

export const defaultDebts: DebtItem[] = [
  { id: "1", name: "Credit Card", balance: 4200, rate: 19.9, minimumPayment: 120 },
  { id: "2", name: "Personal Loan", balance: 3500, rate: 12, minimumPayment: 110 },
  { id: "3", name: "Car Loan", balance: 11000, rate: 6.5, minimumPayment: 265 },
];

export function calculateDebtSnowball(input: DebtSnowballInput): DebtSnowballResult {
  assertValid("debt", input);
  const method = input.method ?? "snowball";
  const ordered = [...input.debts].sort((a, b) =>
    method === "avalanche" ? b.rate - a.rate || a.balance - b.balance : a.balance - b.balance,
  );
  const totalDebt = input.debts.reduce((sum, debt) => sum + debt.balance, 0);

  const balances = ordered.map(d => d.balance);
  const series: DebtSnowballResult["series"] = [{ month: 0, total: totalDebt, balances: [...balances] }];
  const ledger: DebtSnowballResult["ledger"] = [];
  const payoffOrder: DebtPayoffStep[] = [];
  let totalInterest = 0;
  let months = 0;
  while (balances.some(b => b > 0) && months < 600) {
    months++;
    const interest = balances.map((b, i) => b * ordered[i].rate / 1200);
    interest.forEach((amount, i) => { balances[i] += amount; totalInterest += amount; });
    const payments = balances.map((b, i) => Math.min(b, ordered[i].minimumPayment));
    let available = input.monthlyBudget - payments.reduce((s, p) => s + p, 0);
    payments.forEach((p, i) => { balances[i] -= p; });
    // Reserve every minimum first, then roll all remaining dollars through priority order.
    for (let i = 0; i < balances.length; i++) {
      const extra = Math.min(Math.max(0, available), balances[i]);
      payments[i] += extra;
      balances[i] -= extra;
      available -= extra;
      if (balances[i] <= ordered[i].balance * Number.EPSILON * months * 8) {
        balances[i] = 0;
        if (ordered[i].balance > 0 && !payoffOrder.some(p => p.id === ordered[i].id)) payoffOrder.push({ id: ordered[i].id, name: ordered[i].name, months });
      }
    }
    ledger.push({ month: months, interest: interest.reduce((s, n) => s + n, 0), payment: payments.reduce((s, n) => s + n, 0), unusedBudget: Math.max(0, available), allocations: ordered.map((d, i) => ({ id: d.id, interest: interest[i], payment: payments[i], balance: balances[i] })) });
    series.push({ month: months, total: balances.reduce((s, b) => s + b, 0), balances: [...balances] });
  }
  const paid = balances.every(b => b === 0);
  return { status: paid ? "paid-off" : "horizon-exceeded", ledger, totalDebt, months: paid ? months : Infinity, totalInterest, budgetTooLow: !paid, ordered, payoffOrder, series };
}
