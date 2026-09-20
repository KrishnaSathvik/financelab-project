"use client";

import { InteractiveChart } from "@/components/charts/interactive-chart";
import { mortgageChart } from "@/lib/chart-data/adapters";

import { evaluateCalculation } from "@/lib/calculation-result";
import { useMemo, useState } from "react";
import { CalculatorActions, CalculatorFrame } from "@/components/calculator/frame";
import { DownloadAction, PeriodModeToggle, ResultDataTable, ResultDetailSection, YearSelector, moneyCell } from "@/components/calculator/result-detail";
import { useSharedInputs } from "@/lib/use-shared-inputs";
import { ShareBar } from "@/components/calculator/share-bar";
import { useCalculatorFlow } from "@/components/calculator/use-flow";
import { NumberField, SelectField } from "@/components/inputs/fields";
import { SegmentedControl } from "@/components/inputs/segmented";
import { EmptyResults, HeroResult } from "@/components/results/stats";
import { calculators } from "@/lib/calculators/catalog";
import { calculateMortgage } from "@/lib/calculators/mortgage";
import { downloadCsv, formatMoney, formatPercent } from "@/lib/format";
import { rateFieldMessage } from "@/lib/validation";

const defaults = {
  homePrice: 400000,
  downPayment: 80000,
  downPercent: 20,
  annualRatePercent: 6.5,
  termYears: 30,
  annualPropertyTax: 0,
  annualInsurance: 0,
  monthlyHoa: 0,
  monthlyPmi: 0,
};

export function MortgageCalculator() {
  const { hasCalculated, calculate, markReset } = useCalculatorFlow();
  const [scheduleMode, setScheduleMode] = useState<"yearly" | "monthly">("yearly");
  const [scheduleYear, setScheduleYear] = useState(1);
  const [focusLabel, setFocusLabel] = useState<string | null>(null);
  const [tab, setTab] = useState<"basic" | "fees">("basic");
  const [homePrice, setHomePrice] = useState(defaults.homePrice);
  const [downPayment, setDownPayment] = useState(defaults.downPayment);
  const [downPercent, setDownPercent] = useState(defaults.downPercent);
  const [annualRatePercent, setAnnualRatePercent] = useState(defaults.annualRatePercent);
  const [termYears, setTermYears] = useState(defaults.termYears);
  const [annualPropertyTax, setAnnualPropertyTax] = useState(defaults.annualPropertyTax);
  const [annualInsurance, setAnnualInsurance] = useState(defaults.annualInsurance);
  const [monthlyHoa, setMonthlyHoa] = useState(defaults.monthlyHoa);
  const [monthlyPmi, setMonthlyPmi] = useState(defaults.monthlyPmi);

  const { result, error } = useMemo(
    () =>
      evaluateCalculation(() => calculateMortgage({
        homePrice,
        downPayment,
        annualRatePercent,
        termYears,
        annualPropertyTax,
        annualInsurance,
        monthlyHoa,
        monthlyPmi,
      })),
    [homePrice, downPayment, annualRatePercent, termYears, annualPropertyTax, annualInsurance, monthlyHoa, monthlyPmi],
  );
  const rateMessage = rateFieldMessage(annualRatePercent);

  useSharedInputs({ homePrice, downPayment, annualRatePercent, termYears, annualPropertyTax, annualInsurance, monthlyHoa, monthlyPmi }, (shared) => { setHomePrice(shared.homePrice); setDownPayment(shared.downPayment); setAnnualRatePercent(shared.annualRatePercent); setTermYears(shared.termYears); setAnnualPropertyTax(shared.annualPropertyTax); setAnnualInsurance(shared.annualInsurance); setMonthlyHoa(shared.monthlyHoa); setMonthlyPmi(shared.monthlyPmi); setDownPercent(shared.homePrice > 0 ? shared.downPayment / shared.homePrice * 100 : 0); });

  const chartModel = useMemo(() => result ? mortgageChart(result) : null, [result]);

  return (
    <CalculatorFrame
      validationError={error}
      share={<ShareBar
              slug="mortgage"
              payload={{ homePrice, downPayment, annualRatePercent, termYears, annualPropertyTax, annualInsurance, monthlyHoa, monthlyPmi }}
            />}
      title="Mortgage Calculator"
      description={calculators.mortgage.subtitle}
      formTitle="Mortgage details"
      inputs={
        <div className="space-y-4">
          <SegmentedControl
            value={tab}
            onChange={setTab}
            options={[
              { value: "basic", label: "Basic" },
              { value: "fees", label: "Taxes & Fees" },
            ]}
          />
          {tab === "basic" ? (
            <>
              <NumberField
                id="home-price"
                label="Home price"
                prefix="$"
                value={homePrice}
                onChange={(value) => {
                  setHomePrice(value);
                  setDownPayment((value * downPercent) / 100);
                }}
              />
              <NumberField
                id="down-payment"
                label="Down payment"
                prefix="$"
                value={downPayment}
                onChange={(value) => {
                  setDownPayment(value);
                  setDownPercent(homePrice > 0 ? (value / homePrice) * 100 : 0);
                }}
              />
              <NumberField
                id="down-percent"
                label="Down payment percent"
                suffix="%"
                step="0.1"
                value={downPercent}
                onChange={(value) => {
                  setDownPercent(value);
                  setDownPayment((homePrice * value) / 100);
                }}
              />
              <NumberField
                id="interest-rate"
                label="Interest rate"
                suffix="%"
                step="0.1"
                value={annualRatePercent}
                onChange={setAnnualRatePercent}
                error={rateMessage.error}
                warning={rateMessage.warning}
              />
              <SelectField
                id="loan-term"
                label="Loan term"
                value={String(termYears)}
                onChange={(value) => setTermYears(Number(value))}
                options={[
                  { value: "30", label: "30 years" },
                  { value: "20", label: "20 years" },
                  { value: "15", label: "15 years" },
                  { value: "10", label: "10 years" },
                ]}
              />
            </>
          ) : (
            <>
              <NumberField id="tax" label="Property tax (annual)" prefix="$" value={annualPropertyTax} onChange={setAnnualPropertyTax} />
              <NumberField id="ins" label="Home insurance (annual)" prefix="$" value={annualInsurance} onChange={setAnnualInsurance} />
              <NumberField id="hoa" label="HOA" prefix="$" value={monthlyHoa} onChange={setMonthlyHoa} hint="Monthly" />
              <NumberField id="pmi" label="PMI" prefix="$" value={monthlyPmi} onChange={setMonthlyPmi} hint="Monthly. Often required below 20% down." />
            </>
          )}
          <CalculatorActions
            calculateAriaLabel="Calculate mortgage payment"
            onCalculate={calculate}
            onReset={() => {
              setTab("basic");
              setHomePrice(defaults.homePrice);
              setDownPayment(defaults.downPayment);
              setDownPercent(defaults.downPercent);
              setAnnualRatePercent(defaults.annualRatePercent);
              setTermYears(defaults.termYears);
              setAnnualPropertyTax(defaults.annualPropertyTax);
              setAnnualInsurance(defaults.annualInsurance);
              setMonthlyHoa(defaults.monthlyHoa);
              setMonthlyPmi(defaults.monthlyPmi);
              markReset();
            }}
          />
        </div>
      }
      results={
        !hasCalculated || !result ? (
          <EmptyResults slug="mortgage" labels={["Monthly payment", "Total interest", "Total cost"]} />
        ) : result ? (
          <>
            <HeroResult
              label="Monthly principal & interest"
              value={formatMoney(result.monthlyPrincipalAndInterest)}
              unit="/month"
              note={result.status === "no-loan" ? "All-cash purchase: no mortgage payment. Entered taxes and fees remain separate." : "Your estimated principal and interest payment."}
              stats={[
                { label: "Loan amount", value: formatMoney(result.loanAmount) },
                { label: "Down payment", value: formatMoney(downPayment) },
                { label: "Total interest", value: formatMoney(result.totalInterest), tone: "negative" },
                { label: "Total principal + interest", value: formatMoney(result.totalCost) },
              ]}
            />
            {result.hasExtraCosts ? (
              <div className="rounded-2xl border border-border bg-card p-5 text-sm shadow-[var(--shadow)]">
                <p className="font-semibold">Estimated monthly cost</p>
                <dl className="mt-3 space-y-2">
                  <div className="flex justify-between"><dt>Principal + Interest</dt><dd>{formatMoney(result.monthlyPrincipalAndInterest)}</dd></div>
                  <div className="flex justify-between"><dt>Property tax</dt><dd>{formatMoney(result.monthlyPropertyTax)}</dd></div>
                  <div className="flex justify-between"><dt>Insurance</dt><dd>{formatMoney(result.monthlyInsurance)}</dd></div>
                  <div className="flex justify-between"><dt>HOA</dt><dd>{formatMoney(result.monthlyHoa)}</dd></div>
                  <div className="flex justify-between"><dt>PMI</dt><dd>{formatMoney(result.monthlyPmi)}</dd></div>
                  <div className="flex justify-between border-t border-border pt-2 font-semibold">
                    <dt>Estimated monthly cost</dt>
                    <dd>{formatMoney(result.estimatedMonthlyCost)}</dd>
                  </div>
                </dl>
              </div>
            ) : null}
            <p className="text-sm text-muted">
              Down payment is {formatPercent(result.downPaymentPercent, 0)} of the home price.
            </p>
            <InteractiveChart model={chartModel!} highlightLabel={focusLabel} onHighlight={setFocusLabel} />
          </>
        ) : (
          <HeroResult label="Monthly principal & interest" value="—" note="Enter a home price greater than the down payment." />
        )
      }
      analysis={
        hasCalculated && result ? (
          <>
            {result.years.length ? (
            <ResultDetailSection
                title="Amortization schedule"
                kicker={`${result.years.length} years · ${result.months.length} monthly payments`}
                description="See how each payment is divided between principal and interest and how your remaining loan balance changes over time."
                actions={
                  <>
                    <PeriodModeToggle
                      label="Amortization period"
                      value={scheduleMode}
                      onChange={setScheduleMode}
                      options={[{ value: "yearly", label: "Yearly" }, { value: "monthly", label: "Monthly" }]}
                    />
                    <DownloadAction
                      onClick={() =>
                        downloadCsv("mortgage-amortization.csv", [
                          [scheduleMode === "yearly" ? "Year" : "Month", "Payment", "Principal", "Interest", "Balance"],
                          ...(scheduleMode === "yearly" ? result.years : result.months).map((row) => [
                            row.year,
                            row.payment.toFixed(2),
                            row.principal.toFixed(2),
                            row.interest.toFixed(2),
                            row.balance.toFixed(2),
                          ]),
                        ])
                      }
                    />
                  </>
                }
              >
                {scheduleMode === "monthly" ? (
                  <div className="mb-3">
                    <YearSelector
                      value={Math.min(scheduleYear, result.years.length) || 1}
                      years={result.years.map((row) => row.year)}
                      onChange={setScheduleYear}
                    />
                  </div>
                ) : null}
                <ResultDataTable
                  caption={scheduleMode === "yearly" ? "Yearly amortization schedule" : `Monthly amortization schedule, year ${scheduleYear}`}
                  columns={[
                    { key: "period", label: scheduleMode === "yearly" ? "Year" : "Month" },
                    { key: "payment", label: "Payment" },
                    { key: "principal", label: "Principal", tone: "principal" },
                    { key: "interest", label: "Interest", tone: "interest" },
                    { key: "balance", label: "Balance" },
                  ]}
                  previewCount={scheduleMode === "yearly" ? 4 : undefined}
                  expandLabel={`View all ${result.years.length} years`}
                  collapseLabel="Show fewer years"
                  highlightedKey={focusLabel}
                  onHighlight={setFocusLabel}
                  note={scheduleMode === "monthly" ? `Showing ${result.months.filter((row) => Math.ceil(row.year / 12) === (Math.min(scheduleYear, result.years.length) || 1)).length} of ${result.months.length} payments` : undefined}
                  rows={(scheduleMode === "yearly"
                    ? result.years
                    : result.months.filter((row) => Math.ceil(row.year / 12) === (Math.min(scheduleYear, result.years.length) || 1))
                  ).map((row) => {
                    const key = scheduleMode === "yearly" ? `Year ${row.year}` : `Month ${row.year}`;
                    return {
                      key,
                      cells: {
                        period: row.year,
                        payment: moneyCell(row.payment),
                        principal: moneyCell(row.principal),
                        interest: moneyCell(row.interest),
                        balance: moneyCell(row.balance),
                      },
                    };
                  })}
                />
              </ResultDetailSection>
            ) : null}
          </>
        ) : null
      }
    />
  );
}
