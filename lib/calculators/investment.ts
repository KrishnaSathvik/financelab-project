import { yearsToMonths } from "@/lib/calendar";
import { assertValid } from "@/lib/validation/index";
export type CompoundingFrequency = "annually" | "semiannually" | "quarterly" | "monthly" | "daily";

export type InvestmentInput = {
  startingAmount: number;
  monthlyContribution: number;
  annualReturnPercent: number;
  years: number;
  compoundingFrequency?: CompoundingFrequency;
  contributionIncreasePercent?: number;
  inflationPercent?: number;
};

export type InvestmentPoint = {
  year: number;
  portfolio: number;
  contributed: number;
  growth: number;
  realPortfolio: number;
};

export type InvestmentResult = {
  finalValue: number;
  totalContributed: number;
  interestEarned: number;
  growthPercent: number;
  multiplier: number;
  realFutureValue: number;
  inflationPercent: number;
  series: InvestmentPoint[];
};

function periodsPerYear(frequency: CompoundingFrequency) {
  switch (frequency) {
    case "annually":
      return 1;
    case "semiannually":
      return 2;
    case "quarterly":
      return 4;
    case "monthly":
      return 12;
    case "daily":
      return 365;
    default: {
      const exhaustive: never = frequency;
      return exhaustive;
    }
  }
}

export function calculateInvestment(input: InvestmentInput): InvestmentResult {
  assertValid("investment", input);
  const frequency = input.compoundingFrequency ?? "monthly";
  const compounds = periodsPerYear(frequency);
  const annualRate = input.annualReturnPercent / 100;
  const monthlyRate = (1 + annualRate / compounds) ** (compounds / 12) - 1;
  const increase = (input.contributionIncreasePercent ?? 0) / 100;
  const inflation = (input.inflationPercent ?? 0) / 100;

  let portfolio = input.startingAmount;
  let contributed = input.startingAmount;
  let contribution = input.monthlyContribution;
  const realValue = (value: number, year: number) => inflation === 0 ? value : value / (1 + inflation) ** year;
  const series: InvestmentPoint[] = [
    { year: 0, portfolio, contributed, growth: 0, realPortfolio: realValue(portfolio, 0) },
  ];

  const periods = yearsToMonths(input.years);
  for (let month = 1; month <= periods; month++) {
    portfolio = portfolio * (1 + monthlyRate) + contribution;
    contributed += contribution;
    if (month % 12 === 0) contribution *= 1 + increase;
    if (month % 12 === 0 || month === periods) {
      const year = month / 12;
      series.push({ year, portfolio, contributed, growth: portfolio - contributed, realPortfolio: realValue(portfolio, year) });
    }
  }

  const finalValue = series[series.length - 1]?.portfolio ?? input.startingAmount;
  const totalContributed = contributed;
  const interestEarned = finalValue - totalContributed;

  return {
    finalValue,
    totalContributed,
    interestEarned,
    growthPercent: totalContributed > 0 ? (interestEarned / totalContributed) * 100 : 0,
    multiplier: finalValue / Math.max(totalContributed, 1),
    realFutureValue: realValue(finalValue, input.years),
    inflationPercent: input.inflationPercent ?? 0,
    series,
  };
}
