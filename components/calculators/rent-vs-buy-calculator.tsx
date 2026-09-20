"use client";

import { InteractiveChart } from "@/components/charts/interactive-chart";
import { rentBuyChart } from "@/lib/chart-data/adapters";

import { evaluateCalculation } from "@/lib/calculation-result";
import { useMemo, useState } from "react";
import {
  CalculatorActions,
  CalculatorFrame,
} from "@/components/calculator/frame";
import { ResultDataTable, ResultDetailSection, moneyCell } from "@/components/calculator/result-detail";
import { useSharedInputs } from "@/lib/use-shared-inputs";
import { ShareBar } from "@/components/calculator/share-bar";
import { useCalculatorFlow } from "@/components/calculator/use-flow";
import { NumberField } from "@/components/inputs/fields";
import { EmptyResults } from "@/components/results/stats";
import { calculators } from "@/lib/calculators/catalog";
import { calculateRentVsBuy } from "@/lib/calculators/rent-vs-buy";
import { formatMoney } from "@/lib/format";
import { percentFieldMessage, rateFieldMessage } from "@/lib/validation";

const defaults = {
  homePrice: 400000,
  downPaymentPercent: 20,
  mortgageRatePercent: 6.5,
  loanTermYears: 30,
  annualPropertyTax: 4800,
  annualInsurance: 2000,
  annualMaintenance: 4000,
  closingCostPercent: 3,
  appreciationPercent: 3,
  monthlyRent: 2200,
  rentIncreasePercent: 3.5,
  monthlyRenterInsurance: 20,
  investmentReturnPercent: 7,
  yearsToStay: 10,
};

export function RentVsBuyCalculator() {
  const { hasCalculated, calculate, markReset } = useCalculatorFlow();
  const [homePrice, setHomePrice] = useState(defaults.homePrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(
    defaults.downPaymentPercent,
  );
  const [mortgageRatePercent, setMortgageRatePercent] = useState(
    defaults.mortgageRatePercent,
  );
  const [loanTermYears, setLoanTermYears] = useState(defaults.loanTermYears);
  const [annualPropertyTax, setAnnualPropertyTax] = useState(
    defaults.annualPropertyTax,
  );
  const [annualInsurance, setAnnualInsurance] = useState(
    defaults.annualInsurance,
  );
  const [annualMaintenance, setAnnualMaintenance] = useState(
    defaults.annualMaintenance,
  );
  const [closingCostPercent, setClosingCostPercent] = useState(
    defaults.closingCostPercent,
  );
  const [appreciationPercent, setAppreciationPercent] = useState(
    defaults.appreciationPercent,
  );
  const [monthlyRent, setMonthlyRent] = useState(defaults.monthlyRent);
  const [rentIncreasePercent, setRentIncreasePercent] = useState(
    defaults.rentIncreasePercent,
  );
  const [monthlyRenterInsurance, setMonthlyRenterInsurance] = useState(
    defaults.monthlyRenterInsurance,
  );
  const [investmentReturnPercent, setInvestmentReturnPercent] = useState(
    defaults.investmentReturnPercent,
  );
  const [yearsToStay, setYearsToStay] = useState(defaults.yearsToStay);
  const { result, error } = useMemo(
    () =>
      evaluateCalculation(() => calculateRentVsBuy({
        homePrice,
        downPaymentPercent,
        mortgageRatePercent,
        monthlyRent,
        appreciationPercent,
        investmentReturnPercent,
        rentIncreasePercent,
        loanTermYears,
        annualPropertyTax,
        annualInsurance,
        annualMaintenance,
        closingCostPercent,
        monthlyRenterInsurance,
        yearsToStay,
      })),
    [
      homePrice,
      downPaymentPercent,
      mortgageRatePercent,
      monthlyRent,
      appreciationPercent,
      investmentReturnPercent,
      rentIncreasePercent,
      loanTermYears,
      annualPropertyTax,
      annualInsurance,
      annualMaintenance,
      closingCostPercent,
      monthlyRenterInsurance,
      yearsToStay,
    ],
  );
  const rateMessage = rateFieldMessage(mortgageRatePercent);

  useSharedInputs({
                homePrice,
                downPaymentPercent,
                mortgageRatePercent,
                loanTermYears,
                annualPropertyTax,
                annualInsurance,
                annualMaintenance,
                closingCostPercent,
                appreciationPercent,
                monthlyRent,
                rentIncreasePercent,
                monthlyRenterInsurance,
                investmentReturnPercent,
                yearsToStay,
              }, (shared) => { setHomePrice(shared.homePrice); setDownPaymentPercent(shared.downPaymentPercent); setMortgageRatePercent(shared.mortgageRatePercent); setLoanTermYears(shared.loanTermYears); setAnnualPropertyTax(shared.annualPropertyTax); setAnnualInsurance(shared.annualInsurance); setAnnualMaintenance(shared.annualMaintenance); setClosingCostPercent(shared.closingCostPercent); setAppreciationPercent(shared.appreciationPercent); setMonthlyRent(shared.monthlyRent); setRentIncreasePercent(shared.rentIncreasePercent); setMonthlyRenterInsurance(shared.monthlyRenterInsurance); setInvestmentReturnPercent(shared.investmentReturnPercent); setYearsToStay(shared.yearsToStay); });

  const chartModel = useMemo(() => result ? rentBuyChart(result) : null, [result]);

  return (
    <CalculatorFrame
      validationError={error}
      share={<ShareBar
              slug="rent-vs-buy"
              payload={{
                homePrice,
                downPaymentPercent,
                mortgageRatePercent,
                loanTermYears,
                annualPropertyTax,
                annualInsurance,
                annualMaintenance,
                closingCostPercent,
                appreciationPercent,
                monthlyRent,
                rentIncreasePercent,
                monthlyRenterInsurance,
                investmentReturnPercent,
                yearsToStay,
              }}
            />}
      title="Rent vs Buy Calculator"
      description={calculators["rent-vs-buy"].subtitle}
      formTitle="Compare the two paths"
      inputs={
        <div className="space-y-5">
          <details className="input-group" open>
            <summary>Buying</summary>
            <NumberField
              id="price"
              label="Home price"
              prefix="$"
              value={homePrice}
              onChange={setHomePrice}
            />
            <NumberField
              id="down"
              label="Down payment"
              suffix="%"
              value={downPaymentPercent}
              onChange={setDownPaymentPercent}
            />
            <NumberField
              id="mrate"
              label="Mortgage rate"
              suffix="%"
              step="0.1"
              value={mortgageRatePercent}
              onChange={setMortgageRatePercent}
              error={rateMessage.error}
              warning={rateMessage.warning}
            />
            <NumberField
              id="term"
              label="Loan term"
              value={loanTermYears}
              onChange={setLoanTermYears}
              hint="Years"
            />
          </details>
          <details className="input-group">
            <summary>Ownership costs</summary>
            <NumberField
              id="tax"
              label="Property tax"
              prefix="$"
              value={annualPropertyTax}
              onChange={setAnnualPropertyTax}
              hint="Annual"
            />
            <NumberField
              id="ins"
              label="Insurance"
              prefix="$"
              value={annualInsurance}
              onChange={setAnnualInsurance}
              hint="Annual"
            />
            <NumberField
              id="maint"
              label="Maintenance"
              prefix="$"
              value={annualMaintenance}
              onChange={setAnnualMaintenance}
              hint="Annual"
            />
            <NumberField
              id="close"
              label="Closing costs"
              suffix="%"
              step="0.1"
              value={closingCostPercent}
              onChange={setClosingCostPercent}
            />
            <NumberField
              id="appr"
              label="Home appreciation"
              suffix="%/yr"
              step="0.5"
              value={appreciationPercent}
              onChange={setAppreciationPercent}
              {...percentFieldMessage(appreciationPercent, 15, "Appreciation")}
            />
          </details>
          <details className="input-group" open>
            <summary>Renting</summary>
            <NumberField
              id="rent"
              label="Monthly rent"
              prefix="$"
              value={monthlyRent}
              onChange={setMonthlyRent}
            />
            <NumberField
              id="rinc"
              label="Annual rent increase"
              suffix="%"
              step="0.5"
              value={rentIncreasePercent}
              onChange={setRentIncreasePercent}
            />
            <NumberField
              id="rins"
              label="Renter insurance"
              prefix="$"
              value={monthlyRenterInsurance}
              onChange={setMonthlyRenterInsurance}
              hint="Monthly"
            />
          </details>
          <details className="input-group" open>
            <summary>Comparison assumptions</summary>
            <NumberField
              id="inv"
              label="Expected investment return"
              suffix="%/yr"
              step="0.5"
              value={investmentReturnPercent}
              onChange={setInvestmentReturnPercent}
              {...percentFieldMessage(
                investmentReturnPercent,
                15,
                "Investment return",
              )}
            />
            <NumberField
              id="stay"
              label="Years you plan to stay"
              value={yearsToStay}
              onChange={setYearsToStay}
            />
          </details>
          <CalculatorActions
            calculateAriaLabel="Calculate rent versus buy comparison"
            onCalculate={calculate}
            onReset={() => {
              setHomePrice(defaults.homePrice);
              setDownPaymentPercent(defaults.downPaymentPercent);
              setMortgageRatePercent(defaults.mortgageRatePercent);
              setLoanTermYears(defaults.loanTermYears);
              setAnnualPropertyTax(defaults.annualPropertyTax);
              setAnnualInsurance(defaults.annualInsurance);
              setAnnualMaintenance(defaults.annualMaintenance);
              setClosingCostPercent(defaults.closingCostPercent);
              setAppreciationPercent(defaults.appreciationPercent);
              setMonthlyRent(defaults.monthlyRent);
              setRentIncreasePercent(defaults.rentIncreasePercent);
              setMonthlyRenterInsurance(defaults.monthlyRenterInsurance);
              setInvestmentReturnPercent(defaults.investmentReturnPercent);
              setYearsToStay(defaults.yearsToStay);
              markReset();
            }}
          />
        </div>
      }
      results={
        !hasCalculated || !result ? (
          <EmptyResults slug="rent-vs-buy"
            labels={[
              "Difference at your time horizon",
              "Buyer net position",
              "Renter net position",
            ]}
          />
        ) : (
          <>
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-sm font-medium">After {result.yearsToStay} years</p>
              <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                <div><dt className="text-sm text-muted">Buyer net position</dt><dd className="mt-2 text-3xl font-semibold tracking-tight text-primary">{formatMoney(result.buyAtHorizon)}</dd></div>
                <div><dt className="text-sm text-muted">Renter net position</dt><dd className="mt-2 text-3xl font-semibold tracking-tight text-warning">{formatMoney(result.rentAtHorizon)}</dd></div>
              </dl>
              <p className="mt-6 border-t border-border pt-5 text-sm">Difference <strong className="ml-2 text-xl">{formatMoney(Math.abs(result.difference))}</strong></p>
              <p className="mt-3 text-sm leading-6 text-muted">{result.difference === 0 ? "The two scenarios have the same estimated net position." : `Under these assumptions, the ${result.difference > 0 ? "buyer" : "renter"} position is approximately ${formatMoney(Math.abs(result.difference))} higher at year ${result.yearsToStay}.`}</p>
              <details className="mt-5 text-sm"><summary className="min-h-11 content-center">Estimated crossover: {result.breakevenYear ? `Year ${result.breakevenYear}` : "Not within the modeled horizon"}</summary><p className="mt-2 leading-6 text-muted">The first sampled crossover can reverse later; compare your selected horizon. Buyer net position includes home equity plus the owner investment portfolio. Renter net position is the renter investment portfolio under the same resource budget. Selling costs and taxes are excluded.</p></details>
            </div>
            <InteractiveChart model={chartModel!} />
            <ResultDetailSection
              title="Cost comparison"
              description="Cash costs and invested difference at the selected horizon. The net-position chart remains separate."
            >
              <ResultDataTable
                caption="Cost comparison"
                columns={[
                  { key: "label", label: "Item" },
                  { key: "buy", label: "Buying" },
                  { key: "rent", label: "Renting" },
                ]}
                previewCount={6}
                expandLabel="View full cost comparison"
                collapseLabel="Show key rows"
                rows={result.costRows.map((row) => ({
                  key: row.label,
                  cells: {
                    label: row.label,
                    buy: moneyCell(row.buy, false),
                    rent: moneyCell(row.rent, false),
                  },
                }))}
              />
            </ResultDetailSection>
          </>
        )
      }
      analysis={
        hasCalculated && result ? (
          <>
            <p className="text-sm leading-6 text-muted">Initial equity transfer: {formatMoney(result.downPayment)} down payment. The renter invests the same starting resources, including {formatMoney(result.closingCosts)} that the buyer spends on closing costs. Mortgage cash payments include principal transferred to equity; invested resources are not expenses.</p>
            <p className="text-sm leading-6 text-muted">
              This comparison depends on mortgage rate, rent growth,
              appreciation, maintenance, investment return, and how long you
              stay. Selling costs and tax deductions are not modeled.
            </p>
          </>
        ) : null
      }
    />
  );
}
