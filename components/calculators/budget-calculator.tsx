"use client";

import { InteractiveChart } from "@/components/charts/interactive-chart";
import { budgetChart, budgetAllocation } from "@/lib/chart-data/adapters";

import { Plus, X } from "lucide-react";
import { evaluateCalculation } from "@/lib/calculation-result";
import { useMemo } from "react";
import { DeviceSaveBar } from "@/components/calculator/device-save";
import { CalculatorActions, CalculatorFrame } from "@/components/calculator/frame";
import { ResultDataTable, ResultDetailSection, moneyCell } from "@/components/calculator/result-detail";
import { ProgressBar } from "@/components/calculator/progress-bar";
import { useSharedInputs } from "@/lib/use-shared-inputs";
import { ShareBar } from "@/components/calculator/share-bar";
import { useCalculatorFlow } from "@/components/calculator/use-flow";
import { NumberField } from "@/components/inputs/fields";
import { EmptyResults, HeroResult } from "@/components/results/stats";
import { calculateBudget, defaultBudgetCategories, type BudgetCategory } from "@/lib/calculators/budget";
import { calculators } from "@/lib/calculators/catalog";
import { formatMoney, formatPercent } from "@/lib/format";
import { useDeviceRecord } from "@/lib/use-device-record";


type SavedBudget = { monthlyIncome: number; categories: BudgetCategory[] };

const budgetFallback: SavedBudget = { monthlyIncome: 5000, categories: defaultBudgetCategories };

export function BudgetCalculator() {
  const { hasCalculated, calculate, markReset } = useCalculatorFlow();
  const { value, update, save, clear, saved } = useDeviceRecord("budget", budgetFallback);
  const { monthlyIncome, categories } = value;
  const { result, error } = useMemo(() => evaluateCalculation(() => calculateBudget({ monthlyIncome, categories })), [monthlyIncome, categories]);

  useSharedInputs({ monthlyIncome, categories }, (shared) => { update(shared); });

  const chartModel = useMemo(() => result ? budgetChart(result) : null, [result]);
  const allocationModel = useMemo(() => result ? budgetAllocation(result) : null, [result]);

  return (
    <CalculatorFrame
      validationError={error}
      share={<ShareBar slug="budget" payload={{ monthlyIncome, categories }} />}
      title="Monthly Budget Planner"
      description={calculators.budget.subtitle}
      formTitle="Monthly income"
      formNote="Enter your total monthly income (after taxes)."
      inputs={
        <div className="space-y-4">
          <NumberField id="income" label="Take-home income" prefix="$" value={monthlyIncome} onChange={(next) => update({ ...value, monthlyIncome: next })} />
          <p className="text-sm font-medium">Monthly expenses</p>
          <div className="space-y-2">
            {categories.map((category, index) => (
              <div key={index} className="row-editor">
                <input
                  value={category.name}
                  onChange={(event) => {
                    const next = [...categories];
                    next[index] = { ...category, name: event.target.value };
                    update({ ...value, categories: next });
                  }}
                  className="h-12 rounded-xl border border-border bg-card px-3 text-base"
                  aria-label="Category name"
                />
                <input
                  type="number"
                  value={Number.isFinite(category.amount) ? category.amount : ""}
                  onChange={(event) => {
                    const next = [...categories];
                    next[index] = { ...category, amount: event.target.value.trim() === "" ? Number.NaN : Number(event.target.value) };
                    update({ ...value, categories: next });
                  }}
                  className="h-12 rounded-xl border border-border bg-card px-3 text-base"
                  aria-label={`${category.name} amount`}
                />
                <button
                  type="button"
                  className="inline-flex h-12 w-11 items-center justify-center rounded-xl border border-border"
                  onClick={() => update({ ...value, categories: categories.filter((_, itemIndex) => itemIndex !== index) })}
                  aria-label={`Remove ${category.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => update({ ...value, categories: [...categories, { name: "New category", amount: 0 }] })}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-semibold"
          >
            <Plus className="h-4 w-4" />
            Add category
          </button>
          <CalculatorActions
            confirmReset
            calculateAriaLabel="Calculate monthly budget"
            onCalculate={calculate}
            onReset={() => {
              update(budgetFallback);
              markReset();
            }}
          />
          <DeviceSaveBar
            saved={saved}
            onSave={save}
            onClear={clear}
          />
        </div>
      }
      results={
        !hasCalculated || !result ? (
          <EmptyResults slug="budget" labels={["Remaining each month", "Income", "Expenses"]} />
        ) : (
          <>
            <HeroResult
              label="Remaining cash flow"
              value={formatMoney(result.surplus)}
              unit="/ month"
              note={`${formatPercent(result.remainingIncomeRate)} remaining-income rate`}
              tone={result.surplus >= 0 ? "positive" : "negative"}
              stats={[
                { label: "Income", value: formatMoney(monthlyIncome) },
                { label: "Expenses", value: formatMoney(result.expenses), tone: "negative" },
                { label: "Remaining-income rate", value: formatPercent(result.remainingIncomeRate) },
              ]}
            />
            <ProgressBar
              percent={result.spentPercent ?? 0}
              leftLabel={`${formatPercent(result.spentPercent, 0)} spent`}
              rightLabel={`${formatPercent(result.remainingIncomeRate, 0)} remaining`}
            />
            <div className="analysis-split">
              <InteractiveChart model={chartModel!} />
              <InteractiveChart model={allocationModel!} />
            </div>
          </>
        )
      }
      analysis={
        hasCalculated && result ? (
          <>
            <ResultDetailSection
              title="Expense breakdown"
              description="Each category as a share of spending and take-home income."
            >
              <ResultDataTable
                caption="Expense breakdown"
                columns={[
                  { key: "category", label: "Category" },
                  { key: "amount", label: "Amount" },
                  { key: "spending", label: "% spending" },
                  { key: "income", label: "% income" },
                ]}
                previewCount={5}
                expandLabel="Show all categories"
                collapseLabel="Show top categories"
                rows={result.chartItems.map((item) => ({
                  key: item.name,
                  cells: {
                    category: item.name,
                    amount: moneyCell(item.amount, false),
                    spending: result.expenses > 0 ? formatPercent((item.amount / result.expenses) * 100, 0) : "Not applicable",
                    income: monthlyIncome > 0 ? formatPercent((item.amount / monthlyIncome) * 100, 0) : "Not applicable",
                  },
                }))}
              />
            </ResultDetailSection>
            <div className="rounded-2xl border border-border bg-card p-5 text-sm shadow-[var(--shadow)]">
              <p className="font-semibold">Useful insights</p>
              <p className="mt-1 text-xs text-muted">Not financial advice — these are just the numbers you entered.</p>
              <ul className="mt-3 space-y-2 text-muted">
                {result.insights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </>
        ) : null
      }
    />
  );
}
