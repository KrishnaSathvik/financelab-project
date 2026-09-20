"use client";

import { InteractiveChart } from "@/components/charts/interactive-chart";
import { loanChart } from "@/lib/chart-data/adapters";

import { evaluateCalculation } from "@/lib/calculation-result";
import { addCalendarMonths } from "@/lib/calendar";
import { useMemo, useState } from "react";
import {
  CalculatorActions,
  CalculatorFrame,
} from "@/components/calculator/frame";
import { PeriodModeToggle, ResultDataTable, ResultDetailSection, YearSelector, moneyCell } from "@/components/calculator/result-detail";
import { useSharedInputs } from "@/lib/use-shared-inputs";
import { ShareBar } from "@/components/calculator/share-bar";
import { useCalculatorFlow } from "@/components/calculator/use-flow";
import { NumberField } from "@/components/inputs/fields";
import { EmptyResults, HeroResult } from "@/components/results/stats";
import { calculators } from "@/lib/calculators/catalog";
import { calculateLoanPayoff, type LoanPayoffRow } from "@/lib/calculators/loan-payoff";
import {
  formatDurationLong,
  formatDurationMonths,
  formatMoney,
} from "@/lib/format";
import { rateFieldMessage } from "@/lib/validation";

const defaults = {
  balance: 25000,
  annualRatePercent: 8,
  monthlyPayment: 500,
  extraPayment: 100,
  oneTimeExtra: 0,
  startMonth: 1,
};

export function LoanPayoffCalculator() {
  const { hasCalculated, calculate, markReset } = useCalculatorFlow();
  const [balance, setBalance] = useState(defaults.balance);
  const [annualRatePercent, setAnnualRatePercent] = useState(
    defaults.annualRatePercent,
  );
  const [monthlyPayment, setMonthlyPayment] = useState(defaults.monthlyPayment);
  const [extraPayment, setExtraPayment] = useState(defaults.extraPayment);
  const [showOptional, setShowOptional] = useState(false);
  const [oneTimeExtra, setOneTimeExtra] = useState(defaults.oneTimeExtra);
  const [startMonth, setStartMonth] = useState(defaults.startMonth);
  const { result, error } = useMemo(
    () =>
      evaluateCalculation(() => calculateLoanPayoff({
        balance,
        annualRatePercent,
        monthlyPayment,
        extraPayment,
        oneTimeExtra,
        startMonth,
      })),
    [
      balance,
      annualRatePercent,
      monthlyPayment,
      extraPayment,
      oneTimeExtra,
      startMonth,
    ],
  );
  const payoffDate = addCalendarMonths(new Date(), Number.isFinite(result?.accelerated.months) ? result!.accelerated.months : 0);
  const rateMessage = rateFieldMessage(annualRatePercent, 30);

  useSharedInputs({
                balance,
                annualRatePercent,
                monthlyPayment,
                extraPayment,
                oneTimeExtra,
                startMonth,
              }, (shared) => { setBalance(shared.balance); setAnnualRatePercent(shared.annualRatePercent); setMonthlyPayment(shared.monthlyPayment); setExtraPayment(shared.extraPayment); setOneTimeExtra(shared.oneTimeExtra); setStartMonth(shared.startMonth); });

  const chartModel = useMemo(() => result ? loanChart(result) : null, [result]);

  return (
    <CalculatorFrame
      validationError={error}
      share={<ShareBar
              slug="loan-payoff"
              payload={{
                balance,
                annualRatePercent,
                monthlyPayment,
                extraPayment,
                oneTimeExtra,
                startMonth,
              }}
            />}
      title="Loan Payoff Calculator"
      description={calculators["loan-payoff"].subtitle}
      formTitle="Loan details"
      inputs={
        <div className="space-y-4">
          <NumberField
            id="balance"
            label="Current loan balance"
            prefix="$"
            value={balance}
            onChange={setBalance}
          />
          <NumberField
            id="rate"
            label="Interest rate"
            suffix="%"
            step="0.1"
            value={annualRatePercent}
            onChange={setAnnualRatePercent}
            error={rateMessage.error}
            warning={rateMessage.warning}
          />
          <NumberField
            id="payment"
            label="Current monthly payment"
            prefix="$"
            value={monthlyPayment}
            onChange={setMonthlyPayment}
          />
          <NumberField
            id="extra"
            label="Extra monthly payment"
            prefix="$"
            value={extraPayment}
            onChange={setExtraPayment}
          />
          <button
            type="button"
            className="text-sm font-medium text-primary"
            onClick={() => setShowOptional((value) => !value)}
          >
            {showOptional ? "Hide optional extras" : "Optional extras"}
          </button>
          {showOptional ? (
            <>
              <NumberField
                id="onetime"
                label="One-time extra payment"
                prefix="$"
                value={oneTimeExtra}
                onChange={setOneTimeExtra}
              />
              <NumberField
                id="start"
                label="Start month"
                value={startMonth}
                onChange={setStartMonth}
                hint="Month number when the one-time extra is applied"
              />
            </>
          ) : null}
          <CalculatorActions
            calculateAriaLabel="Calculate loan payoff"
            onCalculate={calculate}
            onReset={() => {
              setBalance(defaults.balance);
              setAnnualRatePercent(defaults.annualRatePercent);
              setMonthlyPayment(defaults.monthlyPayment);
              setExtraPayment(defaults.extraPayment);
              setOneTimeExtra(defaults.oneTimeExtra);
              setStartMonth(defaults.startMonth);
              markReset();
            }}
          />
        </div>
      }
      results={
        !hasCalculated || !result ? (
          <EmptyResults slug="loan-payoff"
            labels={["Payoff time", "Interest saved", "New payoff date"]}
          />
        ) : (
          <>
            <HeroResult
              label="Estimated debt-free"
              value={
                Number.isFinite(result.accelerated.months)
                  ? payoffDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
                  : "—"
              }
              note={
                result.accelerated.status === "non-amortizing"
                  ? "Payment does not reduce the remaining debt. The chart includes unpaid interest."
                  : result.accelerated.status === "horizon-exceeded"
                    ? "Payoff was not reached within 1,200 months. Totals cover only the modeled period."
                    : "Payments stop at payoff, including the final partial payment."
              }
              tone="positive"
              stats={[
                {
                  label: result.accelerated.status === "paid-off" ? "Total interest" : "Interest through horizon",
                  value: Number.isFinite(result.accelerated.interest)
                    ? formatMoney(result.accelerated.interest)
                    : "—",
                },
                {
                  label: "Time remaining",
                  value: Number.isFinite(result.accelerated.months)
                    ? formatDurationLong(result.accelerated.months)
                    : "—",
                },
                {
                  label: "Interest saved",
                  value: Number.isFinite(result.interestSaved)
                    ? formatMoney(result.interestSaved)
                    : "—",
                  tone: "positive",
                },
                {
                  label: "Time saved",
                  value: Number.isFinite(result.monthsSaved)
                    ? formatDurationMonths(result.monthsSaved)
                    : "—",
                  tone: "positive",
                },
              ]}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-xs text-muted">Current payment</p>
                <p className="mt-1 text-lg font-semibold">
                  {formatMoney(monthlyPayment)}/mo
                </p>
                <p className="mt-1 text-sm text-muted">
                  {Number.isFinite(result.standard.months)
                    ? formatDurationLong(result.standard.months)
                    : result.standard.status === "non-amortizing" ? "Non-amortizing" : "Beyond 1,200 months"}
                </p>
              </div>
              <div className="rounded-2xl border border-primary/30 bg-card p-4">
                <p className="text-xs text-muted">Payment + extra</p>
                <p className="mt-1 text-lg font-semibold text-primary">
                  {formatMoney(monthlyPayment + extraPayment)}/mo
                </p>
                <p className="mt-1 text-sm text-muted">
                  {Number.isFinite(result.accelerated.months)
                    ? formatDurationLong(result.accelerated.months)
                    : "—"}
                </p>
              </div>
            </div>
            {Number.isFinite(result.accelerated.months) ? (
              <p className="text-sm text-muted">
                Estimated payoff:{" "}
                {payoffDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })} (assuming payments begin next month)
              </p>
            ) : null}
            <InteractiveChart model={chartModel!} />
          </>
        )
      }
      analysis={
        hasCalculated && result ? (
          <>
            <ResultDetailSection
              title="Payoff schedule"
              description="Compare the current plan with extra payments, then inspect the extra-payment schedule by year."
            >
              <ResultDataTable
                caption="Current plan versus extra-payment plan"
                columns={[
                  { key: "plan", label: "Plan" },
                  { key: "date", label: "Payoff" },
                  { key: "interest", label: "Total interest", tone: "interest" },
                  { key: "time", label: "Time" },
                ]}
                rows={[
                  {
                    key: "current",
                    cells: {
                      plan: "Current plan",
                      date: Number.isFinite(result.standard.months) ? formatDurationLong(result.standard.months) : result.standard.status === "non-amortizing" ? "Non-amortizing" : "Beyond 1,200 months",
                      interest: Number.isFinite(result.standard.interest) ? moneyCell(result.standard.interest, false) : "—",
                      time: Number.isFinite(result.standard.months) ? formatDurationLong(result.standard.months) : "—",
                    },
                  },
                  {
                    key: "extra",
                    cells: {
                      plan: "Extra-payment plan",
                      date: Number.isFinite(result.accelerated.months) ? formatDurationLong(result.accelerated.months) : "—",
                      interest: Number.isFinite(result.accelerated.interest) ? moneyCell(result.accelerated.interest, false) : "—",
                      time: Number.isFinite(result.monthsSaved) ? `${formatDurationLong(result.monthsSaved)} saved` : "—",
                    },
                  },
                ]}
              />
              {result.accelerated.schedule.length ? (
                <LoanScheduleTable schedule={result.accelerated.schedule} />
              ) : null}
            </ResultDetailSection>
          </>
        ) : null
      }
    />
  );
}

function yearlyFrom(schedule: LoanPayoffRow[]) {
  const years = new Map<number, { year: number; payment: number; principal: number; interest: number; remaining: number }>();
  for (const row of schedule) {
    const current = years.get(row.year) ?? { year: row.year, payment: 0, principal: 0, interest: 0, remaining: 0 };
    current.payment += row.payment;
    current.principal += row.principal;
    current.interest += row.interest;
    current.remaining = row.remaining;
    years.set(row.year, current);
  }
  return [...years.values()];
}

function LoanScheduleTable({ schedule }: { schedule: LoanPayoffRow[] }) {
  const [mode, setMode] = useState<"yearly" | "monthly">("yearly");
  const [year, setYear] = useState(1);
  const years = yearlyFrom(schedule);
  const yearNumbers = years.map((row) => row.year);
  const selectedYear = yearNumbers.includes(year) ? year : yearNumbers[0] ?? 1;
  const monthly = schedule.filter((row) => row.year === selectedYear);
  return (
    <div className="mt-6">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <PeriodModeToggle
          label="Payoff schedule period"
          value={mode}
          onChange={setMode}
          options={[{ value: "yearly", label: "Yearly" }, { value: "monthly", label: "Monthly" }]}
        />
        {mode === "monthly" ? <YearSelector value={selectedYear} years={yearNumbers} onChange={setYear} /> : null}
      </div>
      <ResultDataTable
        caption={mode === "yearly" ? "Yearly extra-payment schedule" : `Monthly extra-payment schedule, year ${selectedYear}`}
        columns={[
          { key: "period", label: mode === "yearly" ? "Year" : "Month" },
          { key: "payment", label: "Payment" },
          { key: "principal", label: "Principal", tone: "principal" },
          { key: "interest", label: "Interest", tone: "interest" },
          { key: "remaining", label: "Remaining" },
        ]}
        previewCount={mode === "yearly" ? 4 : undefined}
        expandLabel={`View all ${years.length} years`}
        note={mode === "monthly" ? `Showing ${monthly.length} of ${schedule.length} payments` : undefined}
        rows={
          mode === "yearly"
            ? years.map((row) => ({
                key: `Year ${row.year}`,
                cells: {
                  period: row.year,
                  payment: moneyCell(row.payment),
                  principal: moneyCell(row.principal),
                  interest: moneyCell(row.interest),
                  remaining: moneyCell(row.remaining),
                },
              }))
            : monthly.map((row) => ({
                key: `Month ${row.month}`,
                cells: {
                  period: row.month,
                  payment: moneyCell(row.payment),
                  principal: moneyCell(row.principal),
                  interest: moneyCell(row.interest),
                  remaining: moneyCell(row.remaining),
                },
              }))
        }
      />
    </div>
  );
}
