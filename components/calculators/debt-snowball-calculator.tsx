"use client";

import { InteractiveChart } from "@/components/charts/interactive-chart";
import { debtChart } from "@/lib/chart-data/adapters";

import { Plus, X } from "lucide-react";
import { evaluateCalculation } from "@/lib/calculation-result";
import { addCalendarMonths } from "@/lib/calendar";
import { useMemo, useState } from "react";
import { DeviceSaveBar } from "@/components/calculator/device-save";
import {
  CalculatorActions,
  CalculatorFrame,
} from "@/components/calculator/frame";
import { ResultDataTable, ResultDetailSection, YearSelector, moneyCell } from "@/components/calculator/result-detail";
import { useSharedInputs } from "@/lib/use-shared-inputs";
import { ShareBar } from "@/components/calculator/share-bar";
import { useCalculatorFlow } from "@/components/calculator/use-flow";
import { NumberField } from "@/components/inputs/fields";
import { SegmentedControl } from "@/components/inputs/segmented";
import { EmptyResults, HeroResult } from "@/components/results/stats";
import { calculators } from "@/lib/calculators/catalog";
import {
  calculateDebtSnowball,
  defaultDebts,
  type DebtItem,
  type DebtMethod,
} from "@/lib/calculators/debt-snowball";
import { formatDurationLong, formatMoney } from "@/lib/format";
import { useDeviceRecord } from "@/lib/use-device-record";


type SavedDebts = {
  monthlyBudget: number;
  debts: DebtItem[];
  method: DebtMethod;
};

const debtFallback: SavedDebts = {
  monthlyBudget: 800,
  debts: defaultDebts,
  method: "snowball",
};

export function DebtSnowballCalculator() {
  const { hasCalculated, calculate, markReset } = useCalculatorFlow();
  const { value, update, save, clear, saved } = useDeviceRecord(
    "debt-snowball",
    debtFallback,
  );
  const { monthlyBudget, debts, method } = value;
  const [draft, setDraft] = useState({
    name: "",
    balance: 0,
    rate: 0,
    minimumPayment: 0,
  });
  const { result, error } = useMemo(
    () => evaluateCalculation(() => calculateDebtSnowball({ monthlyBudget, debts, method })),
    [monthlyBudget, debts, method],
  );
  const payoffDate = addCalendarMonths(new Date(), Number.isFinite(result?.months) ? result!.months : 0);

  useSharedInputs({ monthlyBudget, debts, method }, (shared) => { update(shared); });

  const chartModel = useMemo(() => result ? debtChart(result) : null, [result]);

  return (
    <CalculatorFrame
      validationError={error}
      share={<ShareBar
              slug="debt-snowball"
              payload={{ monthlyBudget, debts, method }}
            />}
      title="Debt Snowball Calculator"
      description={calculators["debt-snowball"].subtitle}
      formTitle="Your debts"
      formNote="Compare repayment methods with the same monthly budget."
      inputs={
        <div className="space-y-4">
          <NumberField
            id="budget"
            label="Total amount available each month"
            prefix="$"
            value={monthlyBudget}
            onChange={(next) => update({ ...value, monthlyBudget: next })}
          />
          <div>
            <p className="mb-2 text-sm font-medium">Method</p>
            <SegmentedControl
              value={method}
              onChange={(next) => update({ ...value, method: next })}
              options={[
                { value: "snowball", label: "Snowball" },
                { value: "avalanche", label: "Avalanche" },
              ]}
            />
            <p className="mt-2 text-xs leading-5 text-muted">
              {method === "snowball"
                ? "Snowball: smallest balance first."
                : "Avalanche: highest interest rate first."}
            </p>
          </div>
          <div className="space-y-2">
            {debts.map((debt) => (
              <div key={debt.id} className="debt-editor">
                <label className="debt-name">
                  <span>Debt</span>
                  <input
                    aria-label="Debt name"
                    value={debt.name}
                    onChange={(e) =>
                      update({
                        ...value,
                        debts: debts.map((x) =>
                          x.id === debt.id ? { ...x, name: e.target.value } : x,
                        ),
                      })
                    }
                  />
                </label>
                {(
                  [
                    ["balance", "Balance"],
                    ["rate", "APR %"],
                    ["minimumPayment", "Minimum"],
                  ] as const
                ).map(([field, label]) => (
                  <label key={field}>
                    <span>{label}</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      aria-label={`${debt.name} ${label}`}
                      value={Number.isFinite(debt[field]) ? debt[field] : ""}
                      onChange={(e) =>
                        update({
                          ...value,
                          debts: debts.map((x) =>
                            x.id === debt.id
                              ? { ...x, [field]: e.target.value.trim() === "" ? Number.NaN : Number(e.target.value) }
                              : x,
                          ),
                        })
                      }
                    />
                  </label>
                ))}
                <button
                  type="button"
                  aria-label={`Remove ${debt.name}`}
                  onClick={() =>
                    update({
                      ...value,
                      debts: debts.filter((x) => x.id !== debt.id),
                    })
                  }
                  className="debt-remove"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              placeholder="Debt name"
              aria-label="New debt debt name"
              value={draft.name}
              onChange={(event) =>
                setDraft({ ...draft, name: event.target.value })
              }
              className="h-12 rounded-xl border border-border bg-card px-3 text-base"
            />
            <input
              type="number"
              placeholder="Balance"
              aria-label="New debt balance"
              value={draft.balance || ""}
              onChange={(event) =>
                setDraft({ ...draft, balance: Number(event.target.value) || 0 })
              }
              className="h-12 rounded-xl border border-border bg-card px-3 text-base"
            />
            <input
              type="number"
              placeholder="APR %"
              aria-label="New debt apr %"
              step="0.1"
              value={draft.rate || ""}
              onChange={(event) =>
                setDraft({ ...draft, rate: Number(event.target.value) || 0 })
              }
              className="h-12 rounded-xl border border-border bg-card px-3 text-base"
            />
            <input
              type="number"
              placeholder="Minimum payment"
              aria-label="New debt minimum payment"
              value={draft.minimumPayment || ""}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  minimumPayment: Number(event.target.value) || 0,
                })
              }
              className="h-12 rounded-xl border border-border bg-card px-3 text-base"
            />
          </div>
          <button
            type="button"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-semibold"
            onClick={() => {
              if (draft.balance <= 0) return;
              update({
                ...value,
                debts: [
                  ...debts,
                  {
                    id: crypto.randomUUID(),
                    name: draft.name.trim() || "Debt",
                    balance: draft.balance,
                    rate: draft.rate,
                    minimumPayment:
                      draft.minimumPayment ||
                      Math.max(25, Math.round(draft.balance * 0.02)),
                  },
                ],
              });
              setDraft({ name: "", balance: 0, rate: 0, minimumPayment: 0 });
            }}
          >
            <Plus className="h-4 w-4" />
            Add another debt
          </button>
          <CalculatorActions
            confirmReset
            calculateAriaLabel="Calculate debt snowball payoff plan"
            onCalculate={calculate}
            onReset={() => {
              update(debtFallback);
              setDraft({ name: "", balance: 0, rate: 0, minimumPayment: 0 });
              markReset();
            }}
          />
          <DeviceSaveBar saved={saved} onSave={save} onClear={clear} />
        </div>
      }
      results={
        !hasCalculated || !result ? (
          <EmptyResults slug="debt-snowball"
            labels={["Debt-free date", "Total debt", "Interest paid"]}
          />
        ) : (
          <>
            <HeroResult
              label="Debt free in"
              value={
                result.budgetTooLow
                  ? "Beyond 50-year horizon"
                  : formatDurationLong(result.months)
              }
              note={
                result.budgetTooLow
                  ? "Debt remains after 600 months. Interest and balances shown cover only that period; increase your budget or review the rates."
                  : `Payoff date ${payoffDate.toLocaleString("en-US", { month: "short", year: "numeric" })}`
              }
              stats={[
                { label: "Selected method", value: method === "snowball" ? "Snowball" : "Avalanche" },
                {
                  label: "Starting debt",
                  value: formatMoney(result.totalDebt),
                  tone: "negative",
                },
                {
                  label: "Interest paid",
                  value: formatMoney(result.totalInterest),
                  tone: "negative",
                },
                {
                  label: "Monthly budget",
                  value: formatMoney(monthlyBudget),
                },
              ]}
            />
            {result.series.length > 0 ? (
              <InteractiveChart model={chartModel!} />
            ) : null}
            <ResultDetailSection
              title="Debt payoff timeline"
              description="Payoff events are listed first. Monthly remaining balances stay available for inspection without dumping the full ledger."
            >
              <div className="payoff-timeline">
                <ol>{result.payoffOrder.map((item, index) => {
                  const debt = result.ordered.find(d => d.id === item.id)!;
                  return <li key={item.id}><p className="font-medium">Month {item.months}</p><p>{index + 1}. {item.name} paid off</p><p>Starting balance {formatMoney(debt.balance)} · APR {debt.rate}% · Minimum {formatMoney(debt.minimumPayment)}/month</p></li>;
                })}</ol>
                {!result.payoffOrder.length && <p>No debt payoff occurs within the modeled period.</p>}
              </div>
            </ResultDetailSection>
          </>
        )
      }
      analysis={
        hasCalculated && result && result.series.length > 1 ? (
          <ResultDetailSection
            title="Monthly remaining balances"
            description="Inspect remaining total debt by year without dumping the full ledger into the summary."
          >
            <DebtMonthlyBalances series={result.series} />
          </ResultDetailSection>
        ) : null
      }
    />
  );
}

function DebtMonthlyBalances({ series }: { series: { month: number; total: number }[] }) {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(1);
  const maxYear = Math.max(1, Math.ceil(Math.max(...series.map((row) => row.month)) / 12));
  const rows = series.filter((row) => row.month > 0 && Math.ceil(row.month / 12) === year);
  if (!open) {
    return (
      <button type="button" className="expand-action" aria-expanded={false} onClick={() => setOpen(true)}>
        View monthly balances
      </button>
    );
  }
  return (
    <div className="mt-4">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <YearSelector value={year} years={Array.from({ length: maxYear }, (_, index) => index + 1)} onChange={setYear} />
        <button type="button" className="expand-action mt-0" aria-expanded={true} onClick={() => setOpen(false)}>
          Hide monthly balances
        </button>
      </div>
      <ResultDataTable
        caption={`Monthly remaining debt, year ${year}`}
        note={`Showing ${rows.length} of ${series.filter((row) => row.month > 0).length} months`}
        columns={[
          { key: "month", label: "Month" },
          { key: "total", label: "Remaining debt" },
        ]}
        rows={rows.map((row) => ({
          key: `Month ${row.month}`,
          cells: { month: row.month, total: moneyCell(row.total, false) },
        }))}
      />
    </div>
  );
}
