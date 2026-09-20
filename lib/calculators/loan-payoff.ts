import { assertValid } from "@/lib/validation/index";
export type LoanPayoffInput = {
  balance: number;
  annualRatePercent: number;
  monthlyPayment: number;
  extraPayment: number;
  oneTimeExtra?: number;
  startMonth?: number;
};

export type LoanSimulation = {
  status: "paid-off" | "non-amortizing" | "horizon-exceeded";
  remaining: number;
  elapsedMonths: number;
  months: number;
  interest: number;
  totalPaid: number;
  schedule: LoanPayoffRow[];
};

export type LoanPayoffRow = {
  month: number;
  year: number;
  payment: number;
  principal: number;
  interest: number;
  remaining: number;
};

export type LoanPayoffResult = {
  standard: LoanSimulation;
  accelerated: LoanSimulation;
  monthsSaved: number;
  interestSaved: number;
  paymentTooLow: boolean;
  series: { month: number; standardBalance: number; extraBalance: number }[];
};

export function simulateLoan(
  balance: number,
  annualRatePercent: number,
  payment: number,
  options?: { oneTimeExtra?: number; startMonth?: number },
): LoanSimulation {
  assertValid("loan-payoff", { balance, annualRatePercent, monthlyPayment: payment, extraPayment: 0, ...options });
  const monthlyRate = annualRatePercent / 1200;
  const oneTimeExtra = options?.oneTimeExtra ?? 0;
  const startMonth = options?.startMonth ?? 1;
  let remaining = balance;
  let interest = 0;
  let totalPaid = 0;
  const schedule: LoanPayoffRow[] = [];
  for (let month = 1; month <= 1200 && remaining > 0; month++) {
    const monthInterest = remaining * monthlyRate;
    const actualPayment = Math.min(remaining + monthInterest, payment + (month === startMonth ? oneTimeExtra : 0));
    const principal = actualPayment - monthInterest;
    remaining = actualPayment >= remaining + monthInterest ? 0 : Math.max(0, remaining - principal);
    // Ignore only accumulated floating-point dust, scaled to the original balance.
    if (remaining <= balance * Number.EPSILON * month * 8) remaining = 0;
    interest += monthInterest;
    totalPaid += actualPayment;
    schedule.push({ month, year: Math.ceil(month / 12), payment: actualPayment, principal, interest: monthInterest, remaining });
  }
  const paid = remaining === 0 || balance === 0;
  const status = paid ? "paid-off" : payment <= remaining * monthlyRate || payment === 0 ? "non-amortizing" : "horizon-exceeded";
  return { status, remaining, elapsedMonths: schedule.length, months: paid ? schedule.length : Infinity, interest, totalPaid, schedule };
}

export function calculateLoanPayoff(input: LoanPayoffInput): LoanPayoffResult {
  assertValid("loan-payoff", input);
  const standard = simulateLoan(input.balance, input.annualRatePercent, input.monthlyPayment);
  const accelerated = simulateLoan(
    input.balance,
    input.annualRatePercent,
    input.monthlyPayment + input.extraPayment,
    { oneTimeExtra: input.oneTimeExtra, startMonth: input.startMonth },
  );
  const paymentTooLow = !Number.isFinite(standard.months);

  const maxMonths = Math.max(standard.elapsedMonths, accelerated.elapsedMonths);
  const series: LoanPayoffResult["series"] = [{ month: 0, standardBalance: input.balance, extraBalance: input.balance }];
  for (let month = 1; month <= maxMonths; month++) {
    series.push({ month, standardBalance: standard.schedule[month - 1]?.remaining ?? standard.remaining, extraBalance: accelerated.schedule[month - 1]?.remaining ?? accelerated.remaining });
  }

  return {
    standard,
    accelerated,
    monthsSaved:
      Number.isFinite(standard.months) && Number.isFinite(accelerated.months)
        ? standard.months - accelerated.months
        : Number.NaN,
    interestSaved:
      standard.status === "paid-off" && accelerated.status === "paid-off"
        ? standard.interest - accelerated.interest
        : Number.NaN,
    paymentTooLow,
    series,
  };
}
