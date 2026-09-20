import { compoundGrowth, requiredMonthlyContribution } from "@/lib/finance";
import { yearsToMonths } from "@/lib/calendar";
import { assertValid } from "@/lib/validation/index";
export type SavingsGoalInput = {
  goalAmount: number;
  alreadySaved: number;
  years: number;
  annualReturnPercent: number;
};

export type SavingsGoalResult = {
  status: "achieved-today" | "growth-funded" | "deposits-required";
  noMoreDepositsRequired: boolean;
  alreadyThere: boolean;
  monthlyRequired: number;
  stillNeed: number;
  interestEarned: number;
  progressPercent: number;
  series: { year: number; value: number; goal: number }[];
  milestones: { percent: number; year: number | null }[];
};

export function calculateSavingsGoal(input: SavingsGoalInput): SavingsGoalResult {
  assertValid("savings-goal", input);
  const monthlyRate = input.annualReturnPercent / 100 / 12;
  const periods = yearsToMonths(input.years);
  const growth = compoundGrowth(monthlyRate, periods);
  const futureValueOfCurrent = input.alreadySaved * growth;
  const futureValueNeeded = input.goalAmount - futureValueOfCurrent;

  const monthlyRequired = requiredMonthlyContribution({ futureValueNeeded, monthlyRate, periods });

  const totalContributed = input.alreadySaved + Math.max(0, monthlyRequired) * periods;

  const series: SavingsGoalResult["series"] = [
    { year: 0, value: input.alreadySaved, goal: input.goalAmount },
  ];

  let balance = input.alreadySaved;
  for (let month = 1; month <= periods; month++) {
    balance = balance * (1 + monthlyRate) + monthlyRequired;
    series.push({ year: month / 12, value: balance, goal: input.goalAmount });
  }
  const interestEarned = balance - totalContributed;

  const milestones = [25, 50, 75, 100].map((percent) => {
    const target = (input.goalAmount * percent) / 100;
    const hit = series.find((point) => point.value + Math.abs(target) * Number.EPSILON * 32 >= target);
    return { percent, year: hit ? hit.year : null };
  });

  return {
    status: input.alreadySaved >= input.goalAmount ? "achieved-today" : monthlyRequired === 0 ? "growth-funded" : "deposits-required",
    noMoreDepositsRequired: monthlyRequired === 0,
    alreadyThere: input.alreadySaved >= input.goalAmount,
    monthlyRequired,
    stillNeed: Math.max(0, input.goalAmount - input.alreadySaved),
    interestEarned,
    progressPercent: input.goalAmount > 0 ? (input.alreadySaved / input.goalAmount) * 100 : 0,
    series,
    milestones,
  };
}

export function monthsToGoal(input: SavingsGoalInput, monthlySave: number) {
  assertValid("savings-goal", input);
  if (!Number.isFinite(monthlySave) || monthlySave < 0) throw new RangeError("Monthly saving must be nonnegative and finite.");
  const monthlyRate = input.annualReturnPercent / 100 / 12;
  let balance = input.alreadySaved;
  let months = 0;
  const tolerance = input.goalAmount * Number.EPSILON * 32;
  while (balance + tolerance < input.goalAmount && months < 600) {
    balance = balance * (1 + monthlyRate) + monthlySave;
    months += 1;
  }
  return balance + tolerance < input.goalAmount ? Number.POSITIVE_INFINITY : months;
}
