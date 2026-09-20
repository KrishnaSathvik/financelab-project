import { yearsToMonths } from "@/lib/calendar";
import { assertValid } from "@/lib/validation/index";
export type LedgerItem = {
  id: string;
  name: string;
  amount: number;
  group: string;
};

export type NetWorthInput = {
  assets: number;
  debts: number;
  monthlySavings: number;
  monthlyDebtPaydown: number;
  assetReturnPercent: number;
  debtInterestPercent: number;
  years?: number;
};

export type NetWorthResult = {
  current: number;
  series: { year: number; assets: number; liabilities: number; netWorth: number }[];
  at10: number | null;
  at20: number | null;
  at30: number | null;
};

export const assetGroups = ["Cash", "Investments", "Retirement", "Home", "Vehicles", "Other Assets"] as const;
export const liabilityGroups = [
  "Mortgage",
  "Credit Cards",
  "Student Loans",
  "Auto Loans",
  "Personal Loans",
  "Other Debt",
] as const;

export const defaultAssets: LedgerItem[] = [
  { id: "cash", name: "Checking & savings", amount: 12000, group: "Cash" },
  { id: "invest", name: "Brokerage", amount: 45000, group: "Investments" },
  { id: "retire", name: "401(k)", amount: 38000, group: "Retirement" },
  { id: "home", name: "Full home market value", amount: 42000, group: "Home" },
  { id: "car", name: "Vehicle", amount: 13000, group: "Vehicles" },
];

export const defaultLiabilities: LedgerItem[] = [
  { id: "mortgage", name: "Mortgage", amount: 52000, group: "Mortgage" },
  { id: "card", name: "Credit cards", amount: 4500, group: "Credit Cards" },
  { id: "auto", name: "Auto loan", amount: 23500, group: "Auto Loans" },
];

export function sumLedger(items: LedgerItem[]) {
  return items.reduce((sum, item) => sum + (item.amount || 0), 0);
}

export function groupLedger(items: LedgerItem[]) {
  const groups = new Map<string, number>();
  for (const item of items) {
    groups.set(item.group, (groups.get(item.group) ?? 0) + (item.amount || 0));
  }
  return [...groups.entries()]
    .filter(([, amount]) => amount > 0)
    .map(([name, amount]) => ({ name, amount }));
}

export function calculateNetWorth(input: NetWorthInput): NetWorthResult {
  assertValid("net-worth", input);
  const years = input.years ?? 30;
  const assetRate = input.assetReturnPercent / 100 / 12;
  const debtRate = input.debtInterestPercent / 100 / 12;
  const series = [{ year: 0, assets: input.assets, liabilities: input.debts, netWorth: input.assets - input.debts }];
  let assetBalance = input.assets;
  let debtBalance = input.debts;

  const periods = yearsToMonths(years);
  for (let month = 1; month <= periods; month++) {
      assetBalance = assetBalance * (1 + assetRate) + input.monthlySavings;
      if (debtBalance > 0) {
        debtBalance = debtBalance * (1 + debtRate) - input.monthlyDebtPaydown;
        if (debtBalance < 0) {
          assetBalance += Math.abs(debtBalance);
          debtBalance = 0;
        }
      } else {
        assetBalance += input.monthlyDebtPaydown;
      }
    if (month % 12 === 0 || month === periods) series.push({ year: month / 12, assets: assetBalance, liabilities: debtBalance, netWorth: assetBalance - debtBalance });
  }

  return {
    current: input.assets - input.debts,
    series,
    at10: series.find(point => point.year === 10)?.netWorth ?? null,
    at20: series.find(point => point.year === 20)?.netWorth ?? null,
    at30: series.find(point => point.year === 30)?.netWorth ?? null,
  };
}
