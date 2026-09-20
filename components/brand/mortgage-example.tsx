import { calculateMortgage } from "@/lib/calculators/mortgage";
import { formatMoney } from "@/lib/format";
export function MortgageExample() {
  const result = calculateMortgage({
    homePrice: 425000,
    downPayment: 85000,
    annualRatePercent: 6.25,
    termYears: 30,
  })!;
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow)]">
      <div className="flex justify-between border-b border-border px-6 py-4 text-sm">
        <span className="font-semibold">MoneyBasis / Mortgage</span>
        <span className="text-muted">Example estimate</span>
      </div>
      <div className="p-6 sm:p-8">
        <p className="text-sm text-muted">Monthly principal & interest</p>
        <p className="mt-2 text-5xl font-semibold tracking-tight text-primary">
          {formatMoney(result.monthlyPayment)}
          <span className="text-base font-normal text-muted"> / mo</span>
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 border-y border-border py-5">
          <div>
            <p className="text-xs text-muted">Loan amount</p>
            <p className="mt-1 text-lg font-semibold">$340,000</p>
          </div>
          <div>
            <p className="text-xs text-muted">Total interest</p>
            <p className="mt-1 text-lg font-semibold">
              {formatMoney(result.totalInterest)}
            </p>
          </div>
        </div>
        <p className="mt-6 text-sm font-medium">Your loan balance over time</p>
        <svg
          role="img"
          aria-label="Illustrative mortgage balance declining over 30 years"
          viewBox="0 0 440 140"
          className="mt-4 w-full"
        >
          <path
            d="M0 30H440 M0 75H440 M0 120H440"
            stroke="var(--border)"
            fill="none"
          />
          <path
            d="M0 12 C160 28 310 65 440 135 L440 140H0Z"
            fill="var(--primary-soft)"
          />
          <path
            d="M0 12 C160 28 310 65 440 135"
            stroke="var(--primary)"
            strokeWidth="3"
            fill="none"
          />
        </svg>
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>Today</span>
          <span>15 years</span>
          <span>30 years</span>
        </div>
        <p className="mt-6 text-xs leading-5 text-muted">
          $425,000 home · 20% down · 6.25% fixed · 30 years. Excludes taxes,
          insurance, and fees.
        </p>
      </div>
    </div>
  );
}
