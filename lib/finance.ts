export function monthlyRateFromApr(annualPercent: number) {
  return annualPercent / 100 / 12;
}

export function compoundGrowth(rate: number, periods: number) {
  return Math.exp(periods * Math.log1p(rate));
}

export function amortizingPayment(
  principal: number,
  monthlyRate: number,
  periods: number,
) {
  if (principal <= 0 || periods <= 0) return 0;
  if (monthlyRate === 0) return principal / periods;
  return principal * monthlyRate / -Math.expm1(-periods * Math.log1p(monthlyRate));
}

export function futureValue({
  presentValue,
  monthlyContribution,
  monthlyRate,
  periods,
}: {
  presentValue: number;
  monthlyContribution: number;
  monthlyRate: number;
  periods: number;
}) {
  const growth = compoundGrowth(monthlyRate, periods);
  if (monthlyRate === 0) {
    return presentValue + monthlyContribution * periods;
  }
  return presentValue * growth + monthlyContribution * (Math.expm1(periods * Math.log1p(monthlyRate)) / monthlyRate);
}

export function requiredMonthlyContribution({
  futureValueNeeded,
  monthlyRate,
  periods,
}: {
  futureValueNeeded: number;
  monthlyRate: number;
  periods: number;
}) {
  if (futureValueNeeded <= 0) return 0;
  if (periods <= 0) return futureValueNeeded;
  if (monthlyRate === 0) return futureValueNeeded / periods;
  return (futureValueNeeded * monthlyRate) / Math.expm1(periods * Math.log1p(monthlyRate));
}
