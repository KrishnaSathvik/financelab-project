"use client";

import { InteractiveChart } from "@/components/charts/interactive-chart";
import { salaryChart } from "@/lib/chart-data/adapters";

import { evaluateCalculation } from "@/lib/calculation-result";
import { useMemo, useState } from "react";
import { CalculatorActions, CalculatorFrame } from "@/components/calculator/frame";
import { BreakdownList, ResultDetailSection, moneyCell } from "@/components/calculator/result-detail";
import { useSharedInputs } from "@/lib/use-shared-inputs";
import { ShareBar } from "@/components/calculator/share-bar";
import { useCalculatorFlow } from "@/components/calculator/use-flow";
import { NumberField, SelectField } from "@/components/inputs/fields";
import { SegmentedControl } from "@/components/inputs/segmented";
import { EmptyResults, HeroResult } from "@/components/results/stats";
import { getTaxYearData, type FilingStatus } from "@/data/tax";
import { calculateSalary } from "@/lib/calculators/salary";
import { calculators } from "@/lib/calculators/catalog";
import { formatMoney, formatPercent } from "@/lib/format";
import { TAX_YEAR } from "@/lib/site";

const defaults = {
  annualSalary: 75000,
  hourlyRate: 36.06,
  hoursPerWeek: 40,
  weeksPerYear: 52,
  filingStatus: "single" as FilingStatus,
  mode: "salary" as "salary" | "hourly",
  state: "NONE",
  taxYear: TAX_YEAR,
  traditional401k: 0,
  healthInsurance: 0,
  otherPretax: 0,
};

type PayFrequency = "hourly" | "weekly" | "biweekly" | "monthly" | "annual";

export function SalaryCalculator() {
  const { hasCalculated, calculate, markReset } = useCalculatorFlow();
  const [mode, setMode] = useState<"salary" | "hourly">(defaults.mode);
  const [annualSalary, setAnnualSalary] = useState(defaults.annualSalary);
  const [hourlyRate, setHourlyRate] = useState(defaults.hourlyRate);
  const [hoursPerWeek, setHoursPerWeek] = useState(defaults.hoursPerWeek);
  const [weeksPerYear, setWeeksPerYear] = useState(defaults.weeksPerYear);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>(defaults.filingStatus);
  const [state, setState] = useState(defaults.state);
  const [taxYear, setTaxYear] = useState(defaults.taxYear);
  const [showOptional, setShowOptional] = useState(false);
  const [traditional401k, setTraditional401k] = useState(defaults.traditional401k);
  const [healthInsurance, setHealthInsurance] = useState(defaults.healthInsurance);
  const [otherPretax, setOtherPretax] = useState(defaults.otherPretax);
  const [frequency, setFrequency] = useState<PayFrequency>("monthly");

  const { result, error } = useMemo(
    () =>
      evaluateCalculation(() => calculateSalary({
        mode,
        annualSalary,
        hourlyRate,
        hoursPerWeek,
        weeksPerYear,
        filingStatus,
        taxYear,
        state,
        traditional401k,
        healthInsurance,
        otherPretax,
      })),
    [mode, annualSalary, hourlyRate, hoursPerWeek, weeksPerYear, filingStatus, taxYear, state, traditional401k, healthInsurance, otherPretax],
  );
  const tax = getTaxYearData(taxYear);
  const selectedPeriod = result?.periods.find((item) => item.id === frequency) ?? result?.periods[1];

  useSharedInputs({ mode, annualSalary, hourlyRate, hoursPerWeek, weeksPerYear, filingStatus, state, taxYear, traditional401k, healthInsurance, otherPretax }, (shared) => { setMode(shared.mode); setAnnualSalary(shared.annualSalary); setHourlyRate(shared.hourlyRate); setHoursPerWeek(shared.hoursPerWeek); setWeeksPerYear(shared.weeksPerYear); setFilingStatus(shared.filingStatus); setState(shared.state); setTaxYear(shared.taxYear); setTraditional401k(shared.traditional401k); setHealthInsurance(shared.healthInsurance); setOtherPretax(shared.otherPretax); });

  const chartModel = useMemo(() => result ? salaryChart(result) : null, [result]);

  return (
    <CalculatorFrame
      validationError={error}
      share={<ShareBar
              slug="salary-hourly"
              payload={{ mode, annualSalary, hourlyRate, hoursPerWeek, weeksPerYear, filingStatus, state, taxYear, traditional401k, healthInsurance, otherPretax }}
            />}
      title="Salary ↔ Hourly Calculator"
      description={calculators["salary-hourly"].subtitle}
      formTitle="Salary details"
      inputs={
        <div className="space-y-4">
          <SegmentedControl
            value={mode}
            onChange={setMode}
            options={[
              { value: "salary", label: "Salary → Hourly" },
              { value: "hourly", label: "Hourly → Salary" },
            ]}
          />
          {mode === "salary" ? (
            <NumberField id="salary" label="Annual salary" prefix="$" value={annualSalary} onChange={setAnnualSalary} />
          ) : (
            <NumberField id="hourly" label="Hourly rate" prefix="$" step="0.01" value={hourlyRate} onChange={setHourlyRate} />
          )}
          <NumberField id="hours" label="Hours per week" value={hoursPerWeek} onChange={setHoursPerWeek} />
          <NumberField id="weeks" label="Weeks per year" value={weeksPerYear} onChange={setWeeksPerYear} />
          <SelectField
            id="filing"
            label="Filing status"
            value={filingStatus}
            onChange={(value) => setFilingStatus(value as FilingStatus)}
            options={[
              { value: "single", label: "Single" },
              { value: "mfj", label: "Married filing jointly" },
              { value: "hoh", label: "Head of household" },
            ]}
          />
          <SelectField
            id="state"
            label="Tax scope"
            value={state}
            onChange={setState}
            options={[{ value: "NONE", label: "State/local taxes excluded" }]}
          />
          <p className="rounded-xl bg-surface px-3 py-2 text-sm font-medium text-muted">
            Tax year: {taxYear}
          </p>
          <SelectField
            id="year"
            label="Tax year"
            value={String(taxYear)}
            onChange={(value) => setTaxYear(Number(value))}
            options={[
              { value: "2026", label: "2026" },
              { value: "2025", label: "2025" },
            ]}
          />
          <button type="button" className="text-sm font-medium text-primary" onClick={() => setShowOptional((value) => !value)}>
            {showOptional ? "Hide optional deductions" : "Optional pre-tax deductions"}
          </button>
          {showOptional ? (
            <>
              <NumberField id="k401" label="401(k)" prefix="$" value={traditional401k} onChange={setTraditional401k} hint="Annual traditional 401(k) contribution" />
              <NumberField id="health" label="Health insurance" prefix="$" value={healthInsurance} onChange={setHealthInsurance} hint="Annual pre-tax premium" />
              <NumberField id="other" label="Other pre-tax deductions" prefix="$" value={otherPretax} onChange={setOtherPretax} />
            </>
          ) : null}
          <CalculatorActions
            calculateAriaLabel="Calculate salary and take-home pay"
            onCalculate={calculate}
            onReset={() => {
              setMode(defaults.mode);
              setAnnualSalary(defaults.annualSalary);
              setHourlyRate(defaults.hourlyRate);
              setHoursPerWeek(defaults.hoursPerWeek);
              setWeeksPerYear(defaults.weeksPerYear);
              setFilingStatus(defaults.filingStatus);
              setState(defaults.state);
              setTaxYear(defaults.taxYear);
              setTraditional401k(defaults.traditional401k);
              setHealthInsurance(defaults.healthInsurance);
              setOtherPretax(defaults.otherPretax);
              setFrequency("monthly");
              markReset();
            }}
          />
        </div>
      }
      results={
        !hasCalculated || !result || !selectedPeriod ? (
          <EmptyResults slug="salary-hourly" labels={["Estimated take-home", "Gross pay", "Taxes"]} />
        ) : (
          <>
            <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-xs text-primary">{taxYear} federal estimate</span>
            <p className="text-xs text-muted">Tax year {taxYear} sources: {tax.sources.map(source => <a key={source.id} href={source.url} target="_blank" rel="noreferrer" className="mr-3 underline">{source.title}</a>)}</p>
            <HeroResult
              label="Estimated take-home"
              value={selectedPeriod.isHourly ? `$${selectedPeriod.net.toFixed(2)}` : formatMoney(selectedPeriod.net)}
              unit={frequency === "monthly" ? "/ month" : frequency === "annual" ? "/ year" : undefined}
              note="Annualized federal and employee FICA estimate for one worker, including Additional Medicare Tax. State/local taxes and tax credits are excluded; this does not recreate W-4 withholding."
              stats={[
                { label: "Annual gross", value: formatMoney(result.annualSalary) },
                { label: "Federal income tax", value: formatMoney(result.federalTax) },
                { label: "Employee FICA", value: formatMoney(result.fica) },
                { label: "Qualifying pretax", value: formatMoney(result.pretax) },
              ]}
            />
            <div className="salary-frequency">
              <p className="mb-2 text-sm font-medium">Pay frequency</p>
              <SegmentedControl
                value={frequency}
                onChange={setFrequency}
                options={[
                  { value: "hourly", label: "Hourly" },
                  { value: "weekly", label: "Weekly" },
                  { value: "biweekly", label: "Biweekly" },
                  { value: "monthly", label: "Monthly" },
                  { value: "annual", label: "Annual" },
                ]}
              />
            </div>
            <dl className="period-metrics">
              {result.periods.map((period) => (
                <div key={period.period}>
                  <dt>{period.period}</dt>
                  <dd>{period.isHourly ? `$${period.net.toFixed(2)}` : formatMoney(period.net)}</dd>
                </div>
              ))}
            </dl>
            <InteractiveChart model={chartModel!} />
          </>
        )
      }
      analysis={
        hasCalculated && result && selectedPeriod ? (
          <>
            <ResultDetailSection
              title="Pay & tax breakdown"
              description="This reconciliation is the federal estimate behind take-home pay. State and local taxes are excluded."
            >
              <BreakdownList
                rows={[
                  { label: "Gross pay", value: moneyCell(result.annualSalary, false) },
                  { label: "Pretax deductions", value: moneyCell(result.pretax, false) },
                  { label: "Federal income tax", value: moneyCell(result.federalTax, false) },
                  { label: "Social Security", value: moneyCell(result.socialSecurity, false) },
                  { label: "Medicare", value: moneyCell(result.medicare, false) },
                  ...(result.additionalMedicare > 0 ? [{ label: "Additional Medicare", value: moneyCell(result.additionalMedicare, false) }] : []),
                  { label: "Estimated take-home", value: moneyCell(result.netAnnual, false) },
                ]}
              />
            </ResultDetailSection>
            <details className="rounded-2xl border border-border bg-card p-5 text-sm shadow-[var(--shadow)]">
              <summary className="min-h-11 content-center font-semibold">Tax calculation details</summary>
              <ul className="mt-3 space-y-2 text-muted">
                <li>Standard deduction: {formatMoney(result.standardDeduction)}</li>
                <li>Federal brackets: {tax.brackets[filingStatus].map((item) => `${(item.rate * 100).toFixed(0)}%`).join(", ")}</li>
                <li>Social Security wage base: {formatMoney(tax.socialSecurityWageBase)}</li>
                <li>Medicare rate: {formatPercent(tax.medicareRate * 100, 2)}</li>
              </ul>
              <p className="mt-3 text-muted">
                MFJ assumes one worker and no spouse income. Traditional 401(k) reduces federal wages, but not FICA wages. Health insurance and other pretax entries assume qualifying cafeteria-plan deductions. Actual payroll withholding can differ.
              </p>
            </details>
          </>
        ) : null
      }
    />
  );
}
