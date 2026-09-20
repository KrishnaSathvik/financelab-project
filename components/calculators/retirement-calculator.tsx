"use client";

import { InteractiveChart } from "@/components/charts/interactive-chart";
import { retirementChart } from "@/lib/chart-data/adapters";

import { evaluateCalculation } from "@/lib/calculation-result";
import { useMemo, useState } from "react";
import { CalculatorActions, CalculatorFrame } from "@/components/calculator/frame";
import { ResultDataTable, ResultDetailSection, moneyCell } from "@/components/calculator/result-detail";
import { useSharedInputs } from "@/lib/use-shared-inputs";
import { ShareBar } from "@/components/calculator/share-bar";
import { useCalculatorFlow } from "@/components/calculator/use-flow";
import { NumberField } from "@/components/inputs/fields";
import { EmptyResults, HeroResult } from "@/components/results/stats";
import { calculators } from "@/lib/calculators/catalog";
import { calculateRetirement, type RetirementResult } from "@/lib/calculators/retirement";
import { formatMoney } from "@/lib/format";
import { percentFieldMessage } from "@/lib/validation";

const defaults = {
  currentAge: 30,
  retirementAge: 65,
  currentSavings: 25000,
  monthlyContribution: 800,
  annualReturnPercent: 7,
  monthlyNeed: 4000,
  inflationPercent: 0,
  contributionIncreasePercent: 0,
  withdrawalRatePercent: 4,
  lifeExpectancy: 90,
};

export function RetirementCalculator() {
  const { hasCalculated, calculate, markReset } = useCalculatorFlow();
  const [currentAge, setCurrentAge] = useState(defaults.currentAge);
  const [retirementAge, setRetirementAge] = useState(defaults.retirementAge);
  const [currentSavings, setCurrentSavings] = useState(defaults.currentSavings);
  const [monthlyContribution, setMonthlyContribution] = useState(
    defaults.monthlyContribution,
  );
  const [annualReturnPercent, setAnnualReturnPercent] = useState(
    defaults.annualReturnPercent,
  );
  const [monthlyNeed, setMonthlyNeed] = useState(defaults.monthlyNeed);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [inflationPercent, setInflationPercent] = useState(
    defaults.inflationPercent,
  );
  const [contributionIncreasePercent, setContributionIncreasePercent] =
    useState(defaults.contributionIncreasePercent);
  const [withdrawalRatePercent, setWithdrawalRatePercent] = useState(
    defaults.withdrawalRatePercent,
  );
  const [lifeExpectancy, setLifeExpectancy] = useState(defaults.lifeExpectancy);
  const { result, error } = useMemo(
    () =>
      evaluateCalculation(() => calculateRetirement({
        currentAge,
        retirementAge,
        currentSavings,
        monthlyContribution,
        annualReturnPercent,
        monthlyNeed,
        inflationPercent,
        contributionIncreasePercent,
        withdrawalRatePercent,
        lifeExpectancy,
      })),
    [
      currentAge,
      retirementAge,
      currentSavings,
      monthlyContribution,
      annualReturnPercent,
      monthlyNeed,
      inflationPercent,
      contributionIncreasePercent,
      withdrawalRatePercent,
      lifeExpectancy,
    ],
  );
  const returnMessage = percentFieldMessage(
    annualReturnPercent,
    15,
    "Annual return",
  );

  useSharedInputs({
                currentAge,
                retirementAge,
                currentSavings,
                monthlyContribution,
                annualReturnPercent,
                monthlyNeed,
                inflationPercent,
                contributionIncreasePercent,
                withdrawalRatePercent,
                lifeExpectancy,
              }, (shared) => { setCurrentAge(shared.currentAge); setRetirementAge(shared.retirementAge); setCurrentSavings(shared.currentSavings); setMonthlyContribution(shared.monthlyContribution); setAnnualReturnPercent(shared.annualReturnPercent); setMonthlyNeed(shared.monthlyNeed); setInflationPercent(shared.inflationPercent); setContributionIncreasePercent(shared.contributionIncreasePercent); setWithdrawalRatePercent(shared.withdrawalRatePercent); setLifeExpectancy(shared.lifeExpectancy); });

  const chartModel = useMemo(() => result ? retirementChart(result) : null, [result]);

  return (
    <CalculatorFrame
      validationError={error}
      share={<ShareBar
              slug="retirement"
              payload={{
                currentAge,
                retirementAge,
                currentSavings,
                monthlyContribution,
                annualReturnPercent,
                monthlyNeed,
                inflationPercent,
                contributionIncreasePercent,
                withdrawalRatePercent,
                lifeExpectancy,
              }}
            />}
      title="Retirement Calculator"
      description={calculators.retirement.subtitle}
      formTitle="Your details"
      formNote="Enter your information to see your estimated retirement fund."
      inputs={
        <div className="space-y-4">
          <NumberField
            id="age"
            label="Current age"
            value={currentAge}
            onChange={setCurrentAge}
          />
          <NumberField
            id="retire"
            label="Retirement age"
            value={retirementAge}
            onChange={setRetirementAge}
          />
          <NumberField
            id="savings"
            label="Current retirement savings"
            prefix="$"
            value={currentSavings}
            onChange={setCurrentSavings}
          />
          <NumberField
            id="contribution"
            label="Monthly contribution"
            prefix="$"
            value={monthlyContribution}
            onChange={setMonthlyContribution}
          />
          <NumberField
            id="return"
            label="Expected annual return"
            suffix="%"
            step="0.5"
            value={annualReturnPercent}
            onChange={setAnnualReturnPercent}
            error={returnMessage.error}
            warning={returnMessage.warning}
          />
          <NumberField
            id="need"
            label="Monthly retirement spending (today’s dollars)"
            prefix="$"
            value={monthlyNeed}
            onChange={setMonthlyNeed}
          />
          <button
            type="button"
            className="text-sm font-medium text-primary"
            onClick={() => setShowAdvanced((value) => !value)}
          >
            {showAdvanced ? "Hide advanced options" : "Show advanced options"}
          </button>
          {showAdvanced ? (
            <>
              <NumberField
                id="inflation"
                label="Inflation"
                suffix="%"
                step="0.5"
                value={inflationPercent}
                onChange={setInflationPercent}
                {...percentFieldMessage(inflationPercent, 15, "Inflation")}
              />
              <NumberField
                id="increase"
                label="Annual contribution increase"
                suffix="%"
                step="0.5"
                value={contributionIncreasePercent}
                onChange={setContributionIncreasePercent}
              />
              <NumberField
                id="withdraw"
                label="Withdrawal rate"
                suffix="%"
                step="0.1"
                value={withdrawalRatePercent}
                onChange={setWithdrawalRatePercent}
              />
              <NumberField
                id="life"
                label="Life expectancy"
                value={lifeExpectancy}
                onChange={setLifeExpectancy}
              />
            </>
          ) : null}
          <CalculatorActions
            calculateAriaLabel="Calculate retirement savings"
            onCalculate={calculate}
            onReset={() => {
              setCurrentAge(defaults.currentAge);
              setRetirementAge(defaults.retirementAge);
              setCurrentSavings(defaults.currentSavings);
              setMonthlyContribution(defaults.monthlyContribution);
              setAnnualReturnPercent(defaults.annualReturnPercent);
              setMonthlyNeed(defaults.monthlyNeed);
              setInflationPercent(defaults.inflationPercent);
              setContributionIncreasePercent(
                defaults.contributionIncreasePercent,
              );
              setWithdrawalRatePercent(defaults.withdrawalRatePercent);
              setLifeExpectancy(defaults.lifeExpectancy);
              setShowAdvanced(false);
              markReset();
            }}
          />
        </div>
      }
      results={
        !hasCalculated || !result ? (
          <EmptyResults slug="retirement"
            labels={[
              "Projected retirement balance",
              "Contributions",
              "Monthly retirement income",
            ]}
          />
        ) : (
          <>
            <HeroResult
              label={`Estimated at age ${retirementAge} · future dollars`}
              value={formatMoney(result.nestEgg)}
              note={
                result.exceedsTarget
                  ? "Based on these assumptions, projected savings exceed your selected income target."
                  : "Based on these assumptions, projected savings are below your selected income target."
              }
              stats={[
                {
                  label: "Your contributions",
                  value: formatMoney(result.totalContributions),
                },
                {
                  label: "Estimated growth",
                  value: formatMoney(result.investmentGrowth),
                  tone: "positive",
                },
                {
                  label: "Years until retirement",
                  value: String(result.yearsToSave),
                },
                {
                  label: `Illustrative ${withdrawalRatePercent}% amount`,
                  value: `${formatMoney(result.safeAnnualWithdrawal)}/yr`,
                },
              ]}
            />
            <div className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-5">
              <div>
                <p className="text-sm text-muted">
                  Illustrative monthly amount
                </p>
                <p className="mt-2 text-xl font-semibold">
                  {formatMoney(result.safeMonthlyWithdrawal)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted">Spending at retirement (future dollars)</p>
                <p className="mt-2 text-xl font-semibold">
                  {formatMoney(result.monthlyNeedAtRetirement)}
                </p>
              </div>
            </div>
            <InteractiveChart model={chartModel!} />
          </>
        )
      }
      analysis={
        hasCalculated && result ? (
          <>
            <ResultDetailSection
              title="Retirement projection"
              description="Milestone ages from this illustration. Accumulation and drawdown use the same returned series as the chart."
            >
              <RetirementProjectionTable series={result.series} currentAge={currentAge} retirementAge={retirementAge} />
            </ResultDetailSection>
            <p className="text-sm text-muted">The monthly withdrawal estimate equals {formatMoney(result.monthlyWithdrawalToday)} in today’s dollars. Spending rises annually with your inflation assumption. Drawdown {result.drawdownStatus === "depleted" ? `depletes after ${result.monthsFundsLast} months` : `remains funded through age ${lifeExpectancy}`}. These are deterministic estimates, not guaranteed income. Drawdown return is capped at 5% nominal annually.</p>
          </>
        ) : null
      }
    />
  );
}

function retirementPreview(series: RetirementResult["series"], currentAge: number, retirementAge: number) {
  const targets = [currentAge, 40, 50, 60, retirementAge];
  const picked: RetirementResult["series"] = [];
  for (const age of targets) {
    const row = series.find((point) => point.phase === "accumulation" && Math.abs(point.age - age) < 0.05);
    if (row && !picked.some((item) => item.age === row.age && item.phase === row.phase)) picked.push(row);
  }
  const last = series.at(-1);
  if (last && !picked.some((item) => item.age === last.age && item.phase === last.phase)) picked.push(last);
  return picked;
}

function RetirementProjectionTable({
  series,
  currentAge,
  retirementAge,
}: {
  series: RetirementResult["series"];
  currentAge: number;
  retirementAge: number;
}) {
  const [open, setOpen] = useState(false);
  const rows = open ? series : retirementPreview(series, currentAge, retirementAge);
  return (
    <div>
      <ResultDataTable
        caption="Retirement projection"
        columns={[
          { key: "age", label: "Age" },
          { key: "phase", label: "Phase" },
          { key: "value", label: "Portfolio" },
        ]}
        rows={rows.map((row) => ({
          key: `${row.phase}-${row.age}`,
          cells: {
            age: Number(row.age.toFixed(row.age % 1 === 0 ? 0 : 1)),
            phase: row.phase === "accumulation" ? "Accumulation" : "Drawdown",
            value: moneyCell(row.value, false),
          },
        }))}
      />
      {series.length > retirementPreview(series, currentAge, retirementAge).length ? (
        <button type="button" className="expand-action" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          {open ? "Show milestone ages" : "View full projection"}
        </button>
      ) : null}
    </div>
  );
}
