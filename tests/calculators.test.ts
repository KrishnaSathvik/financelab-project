import { describe, expect, it } from "vitest";
import { calculateMortgage } from "@/lib/calculators/mortgage";
import { calculateInvestment } from "@/lib/calculators/investment";
import { calculateSalary, federalIncomeTax } from "@/lib/calculators/salary";
import { calculateLoanPayoff, simulateLoan } from "@/lib/calculators/loan-payoff";
import { calculateNetWorth } from "@/lib/calculators/net-worth";
import { calculateBudget, defaultBudgetCategories } from "@/lib/calculators/budget";
import { calculateRetirement } from "@/lib/calculators/retirement";
import { calculateSavingsGoal } from "@/lib/calculators/savings-goal";
import { calculateDebtSnowball, defaultDebts } from "@/lib/calculators/debt-snowball";
import { calculateRentVsBuy } from "@/lib/calculators/rent-vs-buy";
import { getTaxYearData } from "@/data/tax";
import { formatDurationLong, formatDurationMonths } from "@/lib/format";

describe("mortgage", () => {
  it("matches the standard 30-year fixed amortization formula", () => {
    const result = calculateMortgage({
      homePrice: 400_000,
      downPayment: 80_000,
      annualRatePercent: 6.5,
      termYears: 30,
    });

    expect(result).not.toBeNull();
    expect(result!.loanAmount).toBe(320_000);
    expect(result!.downPaymentPercent).toBeCloseTo(20, 5);
    expect(result!.monthlyPayment).toBeCloseTo(2022.62, 1);
    expect(result!.years).toHaveLength(30);
    expect(result!.months).toHaveLength(360);
    expect(result!.months.reduce((sum, row) => sum + row.principal, 0)).toBeCloseTo(result!.loanAmount, 4);
    expect(result!.months.reduce((sum, row) => sum + row.interest, 0)).toBeCloseTo(result!.totalInterest, 4);
    for (const year of result!.years) {
      const months = result!.months.slice((year.year - 1) * 12, year.year * 12);
      expect(months.reduce((sum, row) => sum + row.payment, 0)).toBeCloseTo(year.payment, 4);
      expect(months[11].balance).toBeCloseTo(year.balance, 4);
    }
    expect(result!.years[29]?.balance).toBeCloseTo(0, 0);
    expect(result!.totalCost).toBeCloseTo(result!.monthlyPayment * 360, 4);
  });

  it("allows a 0% interest rate", () => {
    const result = calculateMortgage({
      homePrice: 400_000,
      downPayment: 80_000,
      annualRatePercent: 0,
      termYears: 30,
    });
    expect(result).not.toBeNull();
    expect(result!.monthlyPayment).toBeCloseTo(320_000 / 360, 4);
    expect(result!.totalInterest).toBeCloseTo(0, 4);
  });

  it("returns an explicit no-loan state for an all-cash purchase", () => {
    expect(
      calculateMortgage({
        homePrice: 400_000,
        downPayment: 400_000,
        annualRatePercent: 6.5,
        termYears: 30,
      }),
    ).toMatchObject({ status: "no-loan", loanAmount: 0, monthlyPayment: 0 });
  });
});

describe("investment", () => {
  it("compounds monthly contributions with the FV formula", () => {
    const result = calculateInvestment({
      startingAmount: 10_000,
      monthlyContribution: 500,
      annualReturnPercent: 7,
      years: 20,
    });

    expect(result.totalContributed).toBe(10_000 + 500 * 12 * 20);
    expect(result.finalValue).toBeGreaterThan(result.totalContributed);
    expect(result.interestEarned).toBeCloseTo(result.finalValue - result.totalContributed, 6);
    expect(result.series).toHaveLength(21);
  });
});

describe("salary 2026 tax data", () => {
  it("uses 2026 IRS standard deductions and SSA wage base", () => {
    const tax = getTaxYearData(2026);
    expect(tax.standardDeduction.single).toBe(16_100);
    expect(tax.standardDeduction.mfj).toBe(32_200);
    expect(tax.standardDeduction.hoh).toBe(24_150);
    expect(tax.socialSecurityWageBase).toBe(184_500);
  });

  it("computes progressive federal tax for a $75k single filer", () => {
    const tax = getTaxYearData(2026);
    const taxable = 75_000 - tax.standardDeduction.single;
    const federal = federalIncomeTax(taxable, "single", tax);
    expect(federal).toBeCloseTo(7_670, 0);

    const result = calculateSalary({
      mode: "salary",
      annualSalary: 75_000,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      filingStatus: "single",
      taxYear: 2026,
    });

    expect(result.hourlyRate).toBeCloseTo(36.06, 2);
    expect(result.federalTax).toBeCloseTo(7_670, 0);
    expect(result.socialSecurity).toBeCloseTo(75_000 * 0.062, 6);
    expect(result.medicare).toBeCloseTo(75_000 * 0.0145, 6);
    expect(result.taxYear).toBe(2026);
  });
});

describe("loan payoff", () => {
  it("shows extra payments shorten the schedule", () => {
    const result = calculateLoanPayoff({
      balance: 25_000,
      annualRatePercent: 8,
      monthlyPayment: 500,
      extraPayment: 100,
    });

    expect(result.accelerated.months).toBeLessThan(result.standard.months);
    expect(result.interestSaved).toBeGreaterThan(0);
    expect(simulateLoan(25_000, 8, 100).months).toBe(Number.POSITIVE_INFINITY);
  });
});

describe("net worth", () => {
  it("projects assets growing and debts shrinking", () => {
    const result = calculateNetWorth({
      assets: 150_000,
      debts: 80_000,
      monthlySavings: 1_500,
      monthlyDebtPaydown: 800,
      assetReturnPercent: 6,
      debtInterestPercent: 5,
    });

    expect(result.current).toBe(70_000);
    expect(result.at10).toBeGreaterThan(result.current);
    expect(result.at30).toBeGreaterThan(result.at10!);
    expect(result.series).toHaveLength(31);
  });
});

describe("budget", () => {
  it("computes surplus and savings rate", () => {
    const result = calculateBudget({
      monthlyIncome: 5_000,
      categories: defaultBudgetCategories,
    });
    const expenses = defaultBudgetCategories.reduce((sum, item) => sum + item.amount, 0);
    expect(result.expenses).toBe(expenses);
    expect(result.surplus).toBe(5_000 - expenses);
    expect(result.savingsRate).toBeCloseTo(((5_000 - expenses) / 5_000) * 100, 5);
    expect(result.insights.length).toBeGreaterThan(0);
  });
});

describe("retirement", () => {
  it("builds a nest egg and applies the 4% rule", () => {
    const result = calculateRetirement({
      currentAge: 30,
      retirementAge: 65,
      currentSavings: 25_000,
      monthlyContribution: 800,
      annualReturnPercent: 7,
      monthlyNeed: 4_000,
    });

    expect(result.yearsToSave).toBe(35);
    expect(result.safeMonthlyWithdrawal).toBeCloseTo((result.nestEgg * 0.04) / 12, 6);
    expect(result.series[0]?.phase).toBe("accumulation");
    expect(result.series.some((point) => point.phase === "drawdown")).toBe(true);
  });
});

describe("savings goal", () => {
  it("solves the monthly PMT needed to reach a target", () => {
    const result = calculateSavingsGoal({
      goalAmount: 50_000,
      alreadySaved: 5_000,
      years: 5,
      annualReturnPercent: 4,
    });

    expect(result.alreadyThere).toBe(false);
    expect(result.monthlyRequired).toBeGreaterThan(0);
    expect(result.stillNeed).toBe(45_000);
    expect(result.series.at(-1)?.value).toBeGreaterThanOrEqual(49_000);
  });
});

describe("debt snowball", () => {
  it("pays smallest balances first", () => {
    const result = calculateDebtSnowball({
      monthlyBudget: 800,
      debts: defaultDebts,
    });

    expect(result.ordered[0]?.name).toBe("Personal Loan");
    expect(result.months).toBeGreaterThan(0);
    expect(result.months).toBeLessThan(600);
    expect(result.totalDebt).toBe(18_700);
  });
});

describe("rent vs buy", () => {
  it("compares buyer equity against a renter portfolio", () => {
    const result = calculateRentVsBuy({
      homePrice: 400_000,
      downPaymentPercent: 20,
      mortgageRatePercent: 6.5,
      monthlyRent: 2_200,
      appreciationPercent: 3,
      investmentReturnPercent: 7,
      rentIncreasePercent: 3.5,
    });

    expect(result.monthlyMortgage).toBeCloseTo(2022.62, 1);
    expect(result.downPayment).toBe(80_000);
    expect(result.series).toHaveLength(31);
    expect(result.buyAt10).not.toBe(0);
  });
});

describe("formatDurationMonths", () => {
  it("formats mixed year/month spans", () => {
    expect(formatDurationMonths(14)).toBe("1y 2m");
    expect(formatDurationMonths(24)).toBe("2 yrs");
    expect(formatDurationMonths(800)).toBe("50+ yrs");
    expect(formatDurationLong(62)).toBe("5 years 2 months");
  });
});
