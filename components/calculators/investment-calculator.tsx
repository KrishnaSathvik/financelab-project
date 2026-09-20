"use client";

import { InteractiveChart } from "@/components/charts/interactive-chart";
import { investmentChart } from "@/lib/chart-data/adapters";

import { evaluateCalculation } from "@/lib/calculation-result";
import { useMemo, useState } from "react";
import { CalculatorActions, CalculatorFrame } from "@/components/calculator/frame";
import { ResultDataTable, ResultDetailSection, moneyCell } from "@/components/calculator/result-detail";
import { useSharedInputs } from "@/lib/use-shared-inputs";
import { ShareBar } from "@/components/calculator/share-bar";
import { useCalculatorFlow } from "@/components/calculator/use-flow";
import { NumberField, SelectField } from "@/components/inputs/fields";
import { EmptyResults, HeroResult } from "@/components/results/stats";
import { calculators } from "@/lib/calculators/catalog";
import {
  calculateInvestment,
  type CompoundingFrequency,
} from "@/lib/calculators/investment";
import { formatMoney } from "@/lib/format";
import { percentFieldMessage, rateFieldMessage } from "@/lib/validation";

const defaults = {
  startingAmount: 10000,
  monthlyContribution: 500,
  annualReturnPercent: 7,
  years: 20,
  compoundingFrequency: "monthly" as CompoundingFrequency,
  contributionIncreasePercent: 0,
  inflationPercent: 0,
};

export function InvestmentCalculator() {
  const { hasCalculated, calculate, markReset } = useCalculatorFlow();
  const [startingAmount, setStartingAmount] = useState(defaults.startingAmount);
  const [monthlyContribution, setMonthlyContribution] = useState(defaults.monthlyContribution);
  const [annualReturnPercent, setAnnualReturnPercent] = useState(defaults.annualReturnPercent);
  const [years, setYears] = useState(defaults.years);
  const [compoundingFrequency, setCompoundingFrequency] = useState<CompoundingFrequency>(defaults.compoundingFrequency);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [contributionIncreasePercent, setContributionIncreasePercent] = useState(defaults.contributionIncreasePercent);
  const [inflationPercent, setInflationPercent] = useState(defaults.inflationPercent);
  const { result, error } = useMemo(
    () =>
      evaluateCalculation(() => calculateInvestment({
        startingAmount,
        monthlyContribution,
        annualReturnPercent,
        years,
        compoundingFrequency,
        contributionIncreasePercent,
        inflationPercent,
      })),
    [startingAmount, monthlyContribution, annualReturnPercent, years, compoundingFrequency, contributionIncreasePercent, inflationPercent],
  );
  const returnMessage = rateFieldMessage(annualReturnPercent, 15);

  useSharedInputs({ startingAmount, monthlyContribution, annualReturnPercent, years, compoundingFrequency, contributionIncreasePercent, inflationPercent }, (shared) => { setStartingAmount(shared.startingAmount); setMonthlyContribution(shared.monthlyContribution); setAnnualReturnPercent(shared.annualReturnPercent); setYears(shared.years); setCompoundingFrequency(shared.compoundingFrequency); setContributionIncreasePercent(shared.contributionIncreasePercent); setInflationPercent(shared.inflationPercent); });

  const chartModel = useMemo(() => result ? investmentChart(result) : null, [result]);

  return (
    <CalculatorFrame
      validationError={error}
      share={<ShareBar
              slug="compound-interest"
              payload={{ startingAmount, monthlyContribution, annualReturnPercent, years, compoundingFrequency, contributionIncreasePercent, inflationPercent }}
            />}
      title="Compound Interest Calculator"
      description={calculators["compound-interest"].subtitle}
      formTitle="Investment details"
      formNote="Enter your details to calculate your future value."
      inputs={
        <div className="space-y-4">
          <NumberField id="starting" label="Initial investment" prefix="$" value={startingAmount} onChange={setStartingAmount} />
          <NumberField id="monthly" label="Monthly contribution" prefix="$" value={monthlyContribution} onChange={setMonthlyContribution} />
          <NumberField
            id="return"
            label="Annual return"
            suffix="%"
            step="0.5"
            value={annualReturnPercent}
            onChange={setAnnualReturnPercent}
            error={returnMessage.error}
            warning={returnMessage.warning}
          />
          <SelectField
            id="years"
            label="Time period"
            value={String(years)}
            onChange={(value) => setYears(Number(value))}
            options={[5, 10, 20, 30, 40].map((year) => ({
              value: String(year),
              label: `${year} years`,
            }))}
          />
          <SelectField
            id="compounding"
            label="Compounding frequency"
            value={compoundingFrequency}
            onChange={(value) => setCompoundingFrequency(value as CompoundingFrequency)}
            options={[
              { value: "annually", label: "Annually" },
              { value: "semiannually", label: "Semiannually" },
              { value: "quarterly", label: "Quarterly" },
              { value: "monthly", label: "Monthly" },
              { value: "daily", label: "Daily" },
            ]}
          />
          <button type="button" className="text-sm font-medium text-primary" onClick={() => setShowAdvanced((value) => !value)}>
            {showAdvanced ? "Hide advanced options" : "Show advanced options"}
          </button>
          {showAdvanced ? (
            <>
              <NumberField
                id="increase"
                label="Annual contribution increase"
                suffix="%"
                step="0.5"
                value={contributionIncreasePercent}
                onChange={setContributionIncreasePercent}
                {...percentFieldMessage(contributionIncreasePercent, 20, "Contribution increase")}
              />
              <NumberField
                id="inflation"
                label="Inflation"
                suffix="%"
                step="0.5"
                value={inflationPercent}
                onChange={setInflationPercent}
                {...percentFieldMessage(inflationPercent, 15, "Inflation")}
              />
            </>
          ) : null}
          <CalculatorActions
            calculateAriaLabel="Calculate compound interest"
            onCalculate={calculate}
            onReset={() => {
              setStartingAmount(defaults.startingAmount);
              setMonthlyContribution(defaults.monthlyContribution);
              setAnnualReturnPercent(defaults.annualReturnPercent);
              setYears(defaults.years);
              setCompoundingFrequency(defaults.compoundingFrequency);
              setContributionIncreasePercent(defaults.contributionIncreasePercent);
              setInflationPercent(defaults.inflationPercent);
              setShowAdvanced(false);
              markReset();
            }}
          />
        </div>
      }
      results={
        !hasCalculated || !result ? (
          <EmptyResults slug="compound-interest" labels={["Future value", "Contributions", "Investment growth"]} />
        ) : (
          <>
            <HeroResult
              label="Estimated future value"
              value={formatMoney(result.finalValue)}
              note={`in ${years} years`}
              stats={[
                { label: "Starting amount", value: formatMoney(startingAmount) },
                { label: "Contributions", value: formatMoney(result.totalContributed - startingAmount) },
                { label: "Modeled growth", value: formatMoney(result.interestEarned), tone: result.interestEarned < 0 ? "negative" : "positive" },
                { label: "Years", value: String(years) },
              ]}
            />
            {inflationPercent !== 0 ? (
              <p className="text-sm text-muted">Inflation-adjusted value: {formatMoney(result.realFutureValue)}.</p>
            ) : null}
            <InteractiveChart model={chartModel!} />
          </>
        )
      }
      analysis={
        hasCalculated && result ? (
          <>
            <ResultDetailSection
              title="Growth by year"
              description="Year-end contributions, modeled growth, and balance from the same result used in the chart."
            >
              <ResultDataTable
                caption="Growth by year"
                columns={[
                  { key: "year", label: "Year" },
                  { key: "contributed", label: "Contributed" },
                  { key: "growth", label: "Modeled growth", tone: result.series.some((row) => row.growth < 0) ? undefined : "growth" },
                  { key: "balance", label: "Balance" },
                ]}
                previewCount={5}
                expandLabel="View full projection"
                collapseLabel="Show fewer years"
                rows={result.series.map((row) => ({
                  key: `Year ${row.year}`,
                  cells: {
                    year: row.year === 0 ? "Now" : `Year ${row.year}`,
                    contributed: moneyCell(row.contributed),
                    growth: moneyCell(row.growth),
                    balance: moneyCell(row.portfolio),
                  },
                }))}
              />
            </ResultDetailSection>
          </>
        ) : null
      }
    />
  );
}
