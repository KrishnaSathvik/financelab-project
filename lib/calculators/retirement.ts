import { yearsToMonths } from "@/lib/calendar";
import { assertValid } from "@/lib/validation/index";
export type RetirementInput = {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturnPercent: number;
  monthlyNeed: number;
  inflationPercent?: number;
  contributionIncreasePercent?: number;
  withdrawalRatePercent?: number;
  lifeExpectancy?: number;
};

export type RetirementResult = {
  monthlyNeedAtRetirement: number;
  monthlyWithdrawalToday: number;
  drawdownStatus: "depleted" | "funded-through-horizon";
  yearsToSave: number;
  nestEgg: number;
  totalContributions: number;
  investmentGrowth: number;
  safeAnnualWithdrawal: number;
  safeMonthlyWithdrawal: number;
  monthsFundsLast: number;
  exceedsTarget: boolean;
  series: { age: number; value: number; phase: "accumulation" | "drawdown"; contributed?: number; growth?: number; annualSpending?: number }[];
};

export function calculateRetirement(input: RetirementInput): RetirementResult {
  assertValid("retirement", input);
  const yearsToSave = Math.max(0, input.retirementAge - input.currentAge);
  const monthlyRate = input.annualReturnPercent / 100 / 12;
  const increase = (input.contributionIncreasePercent ?? 0) / 100;
  const withdrawalRate = (input.withdrawalRatePercent ?? 4) / 100;
  const lifeExpectancy = input.lifeExpectancy ?? 90;

  let balance = input.currentSavings;
  let contribution = input.monthlyContribution;
  let contributed = input.currentSavings;
  const series: RetirementResult["series"] = [
    { age: input.currentAge, value: input.currentSavings, phase: "accumulation", contributed: input.currentSavings, growth: 0 },
  ];

  const savingMonths = yearsToMonths(yearsToSave);
  for (let month = 1; month <= savingMonths; month++) {
    balance = balance * (1 + monthlyRate) + contribution;
    contributed += contribution;
    if (month % 12 === 0) contribution *= 1 + increase;
    if (month % 12 === 0 || month === savingMonths) series.push({ age: input.currentAge + month / 12, value: balance, phase: "accumulation", contributed, growth: balance - contributed });
  }

  const nestEgg = balance;
  const totalContributions = contributed;
  const investmentGrowth = nestEgg - totalContributions;
  const safeAnnualWithdrawal = nestEgg * withdrawalRate;
  const safeMonthlyWithdrawal = safeAnnualWithdrawal / 12;
  const drawRate = Math.min(input.annualReturnPercent / 100, 0.05) / 12;
  const inflation = (input.inflationPercent ?? 0) / 100;
  const inflationToRetirement = (1 + inflation) ** yearsToSave;
  const monthlyNeedAtRetirement = input.monthlyNeed * inflationToRetirement;
  const drawPeriods = yearsToMonths(lifeExpectancy - input.retirementAge);
  let remaining = nestEgg;
  let drawMonths = 0;
  // Spending is entered in today's dollars, then raised annually throughout retirement.
  for (let month = 1; month <= drawPeriods && remaining > 0; month++) {
    const spending = monthlyNeedAtRetirement * (1 + inflation) ** Math.floor((month - 1) / 12);
    remaining = Math.max(0, remaining * (1 + drawRate) - spending);
    drawMonths = month;
    if (month % 12 === 0 || month === drawPeriods || remaining === 0) series.push({ age: input.retirementAge + month / 12, value: remaining, phase: "drawdown", annualSpending: spending * 12 });
  }

  return {
    monthlyNeedAtRetirement,
    monthlyWithdrawalToday: safeMonthlyWithdrawal / inflationToRetirement,
    drawdownStatus: remaining > 0 ? "funded-through-horizon" : "depleted",
    yearsToSave,
    nestEgg,
    totalContributions,
    investmentGrowth,
    safeAnnualWithdrawal,
    safeMonthlyWithdrawal,
    monthsFundsLast: remaining > 0 ? Infinity : drawMonths,
    exceedsTarget: safeMonthlyWithdrawal >= monthlyNeedAtRetirement,
    series,
  };
}
