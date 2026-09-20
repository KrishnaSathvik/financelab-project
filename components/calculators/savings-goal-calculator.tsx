"use client";

import { InteractiveChart } from "@/components/charts/interactive-chart";
import { savingsChart } from "@/lib/chart-data/adapters";

import { evaluateCalculation } from "@/lib/calculation-result";
import { addCalendarMonths } from "@/lib/calendar";
import { useMemo, useState } from "react";
import { CalculatorActions, CalculatorFrame } from "@/components/calculator/frame";
import { ResultDataTable, ResultDetailSection, moneyCell } from "@/components/calculator/result-detail";
import { ProgressBar } from "@/components/calculator/progress-bar";
import { useSharedInputs } from "@/lib/use-shared-inputs";
import { ShareBar } from "@/components/calculator/share-bar";
import { useCalculatorFlow } from "@/components/calculator/use-flow";
import { NumberField } from "@/components/inputs/fields";
import { EmptyResults, HeroResult } from "@/components/results/stats";
import { calculators } from "@/lib/calculators/catalog";
import { calculateSavingsGoal, monthsToGoal } from "@/lib/calculators/savings-goal";
import { formatDurationLong, formatMoney } from "@/lib/format";
import { percentFieldMessage } from "@/lib/validation";

const defaults = {
  goalName: "House down payment",
  goalAmount: 50000,
  alreadySaved: 5000,
  years: 4,
  annualReturnPercent: 4,
};

export function SavingsGoalCalculator() {
  const { hasCalculated, calculate, markReset } = useCalculatorFlow();
  const [goalName, setGoalName] = useState(defaults.goalName);
  const [goalAmount, setGoalAmount] = useState(defaults.goalAmount);
  const [alreadySaved, setAlreadySaved] = useState(defaults.alreadySaved);
  const [years, setYears] = useState(defaults.years);
  const [annualReturnPercent, setAnnualReturnPercent] = useState(defaults.annualReturnPercent);
  const { result, error } = useMemo(
    () => evaluateCalculation(() => calculateSavingsGoal({ goalAmount, alreadySaved, years, annualReturnPercent })),
    [goalAmount, alreadySaved, years, annualReturnPercent],
  );
  const targetDate = addCalendarMonths(new Date(), result ? Math.round(years * 12) : 0);
  const whatIfPayment = Math.max(1000, Math.ceil(((result?.monthlyRequired ?? 0) + 100) / 100) * 100);
  const whatIfMonths = result ? monthsToGoal({ goalAmount, alreadySaved, years, annualReturnPercent }, whatIfPayment) : Infinity;
  const returnMessage = percentFieldMessage(annualReturnPercent, 15, "Expected return");

  useSharedInputs({ goalName, goalAmount, alreadySaved, years, annualReturnPercent }, (shared) => { setGoalName(shared.goalName); setGoalAmount(shared.goalAmount); setAlreadySaved(shared.alreadySaved); setYears(shared.years); setAnnualReturnPercent(shared.annualReturnPercent); });

  const chartModel = useMemo(() => result ? savingsChart(result) : null, [result]);

  return (
    <CalculatorFrame
      validationError={error}
      share={<ShareBar slug="savings-goal" payload={{ goalName, goalAmount, alreadySaved, years, annualReturnPercent }} />}
      title="Savings Goal Calculator"
      description={calculators["savings-goal"].subtitle}
      formTitle="Goal details"
      inputs={
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Goal name</span>
            <input
              value={goalName}
              onChange={(event) => setGoalName(event.target.value)}
              className="h-12 w-full rounded-xl border border-border bg-card px-3.5 text-base"
            />
          </label>
          <NumberField id="goal" label="Goal amount" prefix="$" value={goalAmount} onChange={setGoalAmount} />
          <NumberField id="saved" label="Already saved" prefix="$" value={alreadySaved} onChange={setAlreadySaved} />
          <NumberField id="years" label="Years to target" value={years} onChange={setYears} hint={`Target date around ${targetDate.toLocaleString("en-US", { month: "short", year: "numeric" })}`} />
          <NumberField
            id="return"
            label="Expected return"
            suffix="%"
            step="0.5"
            value={annualReturnPercent}
            onChange={setAnnualReturnPercent}
            error={returnMessage.error}
            warning={returnMessage.warning}
          />
          <CalculatorActions
            calculateAriaLabel="Calculate monthly savings needed"
            onCalculate={calculate}
            onReset={() => {
              setGoalName(defaults.goalName);
              setGoalAmount(defaults.goalAmount);
              setAlreadySaved(defaults.alreadySaved);
              setYears(defaults.years);
              setAnnualReturnPercent(defaults.annualReturnPercent);
              markReset();
            }}
          />
        </div>
      }
      results={
        !hasCalculated || !result ? (
          <EmptyResults slug="savings-goal" labels={["Monthly savings needed", "Target amount", "Investment growth"]} />
        ) : (
          <>
            <HeroResult
              label="Monthly contribution"
              value={result.alreadyThere && result.noMoreDepositsRequired ? "Achieved today" : result.noMoreDepositsRequired ? "No deposits needed" : formatMoney(result.monthlyRequired)}
              unit={result.noMoreDepositsRequired ? undefined : "/ month"}
              note={`${goalName}. ${result.alreadyThere ? "Your current balance meets the goal today." : result.noMoreDepositsRequired ? "Projected growth reaches the future goal; it has not been achieved today." : "Nominal goal; deposits occur at the end of each month."}${result.alreadyThere && !result.noMoreDepositsRequired ? " Deposits are still needed to offset the assumed losses before the target date." : ""}`}
              tone="positive"
              stats={[
                { label: "Current savings", value: formatMoney(alreadySaved) },
                { label: "Estimated growth", value: formatMoney(result.interestEarned), tone: result.interestEarned < 0 ? "negative" : "positive" },
                { label: "Target date", value: targetDate.toLocaleString("en-US", { month: "short", year: "numeric" }) },
                { label: "Goal", value: formatMoney(goalAmount) },
              ]}
            />
            <ProgressBar
              percent={result.progressPercent}
              leftLabel={formatMoney(alreadySaved)}
              rightLabel={formatMoney(goalAmount)}
            />
            <InteractiveChart model={chartModel!} />
          </>
        )
      }
      analysis={
        hasCalculated && result ? (
          <>
            <ResultDetailSection
              title="Savings timeline"
              kicker={`Goal date ${targetDate.toLocaleString("en-US", { month: "short", year: "numeric" })}`}
              description="Deposits, modeled growth, and progress toward the goal, including the selected target date."
            >
              <ResultDataTable
                caption="Savings timeline"
                columns={[
                  { key: "period", label: "Period" },
                  { key: "deposits", label: "Deposits" },
                  { key: "growth", label: "Growth", tone: "growth" },
                  { key: "balance", label: "Balance" },
                  { key: "progress", label: "Goal progress" },
                ]}
                previewCount={5}
                expandLabel="View full timeline"
                rows={result.series.filter((point, index) => index === 0 || index === result.series.length - 1 || Math.round(point.year * 12) % 12 === 0).map((point) => {
                  const months = Math.round(point.year * 12);
                  const deposited = result.monthlyRequired * months;
                  const growth = point.value - alreadySaved - deposited;
                  const progress = point.goal > 0 ? (point.value / point.goal) * 100 : 0;
                  return {
                    key: `Month ${months}`,
                    cells: {
                      period: months === 0 ? "Today" : months === Math.round(years * 12) ? `Goal date · Month ${months}` : `Month ${months}`,
                      deposits: moneyCell(deposited, false),
                      growth: moneyCell(growth, false),
                      balance: moneyCell(point.value, false),
                      progress: `${progress.toFixed(0)}%`,
                    },
                  };
                })}
              />
            </ResultDetailSection>
            {Number.isFinite(whatIfMonths) && whatIfPayment > result.monthlyRequired ? (
              <div className="rounded-xl border border-border bg-surface px-4 py-3 text-sm">
                <p className="font-semibold">What if</p>
                <p className="mt-2 text-muted">
                  If you save {formatMoney(whatIfPayment)}/month → reach the goal {formatDurationLong(Math.max(0, years * 12 - whatIfMonths))} sooner.
                </p>
              </div>
            ) : null}
          </>
        ) : null
      }
    />
  );
}
