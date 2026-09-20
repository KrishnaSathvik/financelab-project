"use client";

import { InteractiveChart } from "@/components/charts/interactive-chart";
import { netWorthChart, netWorthProjection } from "@/lib/chart-data/adapters";

import { Plus, X } from "lucide-react";
import { InputValidationError, validatePayload } from "@/lib/validation/index";
import { evaluateCalculation } from "@/lib/calculation-result";
import { useMemo, useState } from "react";
import { DeviceSaveBar } from "@/components/calculator/device-save";
import {
  CalculatorActions,
  CalculatorFrame,
} from "@/components/calculator/frame";
import { ResultDataTable, ResultDetailSection, moneyCell } from "@/components/calculator/result-detail";
import { useSharedInputs } from "@/lib/use-shared-inputs";
import { ShareBar } from "@/components/calculator/share-bar";
import { useCalculatorFlow } from "@/components/calculator/use-flow";
import { NumberField } from "@/components/inputs/fields";
import { SegmentedControl } from "@/components/inputs/segmented";
import { EmptyResults, HeroResult } from "@/components/results/stats";
import { calculators } from "@/lib/calculators/catalog";
import {
  assetGroups,
  calculateNetWorth,
  defaultAssets,
  defaultLiabilities,
  groupLedger,
  liabilityGroups,
  sumLedger,
  type LedgerItem,
} from "@/lib/calculators/net-worth";
import { formatMoney } from "@/lib/format";
import { useDeviceRecord } from "@/lib/use-device-record";
import { percentFieldMessage } from "@/lib/validation";


type SavedNetWorth = {
  assets: LedgerItem[];
  liabilities: LedgerItem[];
  monthlySavings: number;
  monthlyDebtPaydown: number;
  assetReturnPercent: number;
  debtInterestPercent: number;
};

const netWorthFallback: SavedNetWorth = {
  assets: defaultAssets,
  liabilities: defaultLiabilities,
  monthlySavings: 1500,
  monthlyDebtPaydown: 800,
  assetReturnPercent: 6,
  debtInterestPercent: 5,
};

export function NetWorthCalculator() {
  const { hasCalculated, calculate, markReset } = useCalculatorFlow();
  const { value, update, save, clear, saved } = useDeviceRecord(
    "net-worth",
    netWorthFallback,
  );
  const {
    assets,
    liabilities,
    monthlySavings,
    monthlyDebtPaydown,
    assetReturnPercent,
    debtInterestPercent,
  } = value;
  const [showProjection, setShowProjection] = useState(false);

  const totalAssets = sumLedger(assets);
  const totalLiabilities = sumLedger(liabilities);
  const { result: snapshot, error } = useMemo(
    () =>
      evaluateCalculation(() => {
        const validation = validatePayload("net-worth", value);
        if (!validation.valid) throw new InputValidationError(validation.errors);
        return calculateNetWorth({
        assets: totalAssets,
        debts: totalLiabilities,
        monthlySavings: showProjection ? monthlySavings : 0,
        monthlyDebtPaydown: showProjection ? monthlyDebtPaydown : 0,
        assetReturnPercent: showProjection ? assetReturnPercent : 0,
        debtInterestPercent: showProjection ? debtInterestPercent : 0,
      }); }),
    [
      value,
      totalAssets,
      totalLiabilities,
      showProjection,
      monthlySavings,
      monthlyDebtPaydown,
      assetReturnPercent,
      debtInterestPercent,
    ],
  );
  const assetBreakdown = useMemo(() => groupLedger(assets), [assets]);
  const payload = value;

  function addItem(kind: "asset" | "liability") {
    const group = kind === "asset" ? assetGroups[5] : liabilityGroups[5];
    const item: LedgerItem = {
      id: crypto.randomUUID(),
      name: "",
      amount: 0,
      group,
    };
    if (kind === "asset") update({ ...value, assets: [...assets, item] });
    else update({ ...value, liabilities: [...liabilities, item] });
  }

  function updateItem(
    kind: "asset" | "liability",
    id: string,
    patch: Partial<LedgerItem>,
  ) {
    const updater = (items: LedgerItem[]) =>
      items.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry));
    if (kind === "asset") update({ ...value, assets: updater(assets) });
    else update({ ...value, liabilities: updater(liabilities) });
  }

  useSharedInputs(payload, (shared) => { update(shared); });

  const chartModel = useMemo(() => netWorthChart(totalAssets, totalLiabilities, assetBreakdown), [totalAssets, totalLiabilities, assetBreakdown]);
  const projectionModel = useMemo(() => snapshot ? netWorthProjection(snapshot) : null, [snapshot]);

  return (
    <CalculatorFrame
      validationError={error}
      share={<ShareBar slug="net-worth" payload={payload} />}
      title="Net Worth Calculator"
      description={calculators["net-worth"].subtitle}
      formTitle="Your balance sheet"
      inputs={
        <div className="space-y-6">
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Assets</h3>
            <div className="row-editor text-xs text-muted">
              <span>Asset type</span>
              <span>Value ($)</span>
            </div>
            {assets.map((item) => (
              <LedgerRow
                key={item.id}
                item={item}
                groups={[...assetGroups]}
                onChange={(patch) => updateItem("asset", item.id, patch)}
                onRemove={() =>
                  update({
                    ...value,
                    assets: assets.filter((entry) => entry.id !== item.id),
                  })
                }
              />
            ))}
            <button
              type="button"
              onClick={() => addItem("asset")}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Add asset
            </button>
          </section>
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Liabilities</h3>
            <div className="row-editor text-xs text-muted">
              <span>Liability type</span>
              <span>Balance ($)</span>
            </div>
            {liabilities.map((item) => (
              <LedgerRow
                key={item.id}
                item={item}
                groups={[...liabilityGroups]}
                onChange={(patch) => updateItem("liability", item.id, patch)}
                onRemove={() =>
                  update({
                    ...value,
                    liabilities: liabilities.filter(
                      (entry) => entry.id !== item.id,
                    ),
                  })
                }
              />
            ))}
            <button
              type="button"
              onClick={() => addItem("liability")}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Add liability
            </button>
          </section>
          <CalculatorActions
            confirmReset
            calculateAriaLabel="Calculate net worth"
            onCalculate={calculate}
            onReset={() => {
              update(netWorthFallback);
              setShowProjection(false);
              markReset();
            }}
          />
          <DeviceSaveBar saved={saved} onSave={save} onClear={clear} />
        </div>
      }
      results={
        !hasCalculated || !snapshot ? (
          <EmptyResults slug="net-worth"
            labels={["Current net worth", "Total assets", "Total liabilities"]}
          />
        ) : (
          <>
            <HeroResult
              label="Current net worth"
              value={formatMoney(snapshot.current)}
              tone={snapshot.current >= 0 ? "positive" : "negative"}
              note="Current net worth is total assets minus total liabilities. Future projections, if shown, depend on separate assumptions."
              stats={[
                { label: "Total assets", value: formatMoney(totalAssets) },
                {
                  label: "Total liabilities",
                  value: formatMoney(totalLiabilities),
                  tone: "negative",
                },
              ]}
            />
            <InteractiveChart model={chartModel} />
            <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow)]">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">Future projection</p>
                <SegmentedControl
                  value={showProjection ? "on" : "off"}
                  onChange={(value) => setShowProjection(value === "on")}
                  options={[
                    { value: "off", label: "Current only" },
                    { value: "on", label: "Project" },
                  ]}
                />
              </div>
              {showProjection ? (
                <div className="mt-4 space-y-4">
                  <NumberField
                    id="savings"
                    label="Monthly savings"
                    prefix="$"
                    value={monthlySavings}
                    onChange={(next) =>
                      update({ ...value, monthlySavings: next })
                    }
                  />
                  <NumberField
                    id="growth"
                    label="Expected asset growth"
                    suffix="%"
                    step="0.5"
                    value={assetReturnPercent}
                    onChange={(next) =>
                      update({ ...value, assetReturnPercent: next })
                    }
                    {...percentFieldMessage(
                      assetReturnPercent,
                      15,
                      "Asset growth",
                    )}
                  />
                  <NumberField
                    id="pay"
                    label="Monthly debt payments"
                    prefix="$"
                    value={monthlyDebtPaydown}
                    onChange={(next) =>
                      update({ ...value, monthlyDebtPaydown: next })
                    }
                  />
                  <NumberField
                    id="debt-rate"
                    label="Average debt rate"
                    suffix="%"
                    step="0.5"
                    value={debtInterestPercent}
                    onChange={(next) =>
                      update({ ...value, debtInterestPercent: next })
                    }
                    {...percentFieldMessage(
                      debtInterestPercent,
                      30,
                      "Debt rate",
                    )}
                  />
                  <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                    <div>
                      <p className="text-muted">Today</p>
                      <p className="font-semibold">
                        {formatMoney(snapshot.current)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted">10 years</p>
                      <p className="font-semibold">
                        {formatMoney(snapshot.at10)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted">20 years</p>
                      <p className="font-semibold">
                        {formatMoney(snapshot.at20)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted">30 years</p>
                      <p className="font-semibold">
                        {formatMoney(snapshot.at30)}
                      </p>
                    </div>
                  </div>
                  <InteractiveChart model={projectionModel!} />
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted">
                  Current net worth stays separate from any future projection.
                </p>
              )}
            </div>
          </>
        )
      }
      analysis={
        hasCalculated && snapshot ? (
          <ResultDetailSection
              title="Assets & liabilities"
              description="The current balance sheet behind net worth. Projection, if enabled, stays separate."
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <ResultDataTable
                  caption="Assets"
                  columns={[
                    { key: "name", label: "Assets" },
                    { key: "amount", label: "Amount" },
                  ]}
                  rows={assets.filter((item) => item.amount).map((item) => ({
                    key: item.id,
                    cells: { name: item.name, amount: moneyCell(item.amount, false) },
                  }))}
                />
                <ResultDataTable
                  caption="Liabilities"
                  columns={[
                    { key: "name", label: "Liabilities" },
                    { key: "amount", label: "Amount" },
                  ]}
                  rows={liabilities.filter((item) => item.amount).map((item) => ({
                    key: item.id,
                    cells: { name: item.name, amount: moneyCell(item.amount, false) },
                  }))}
                />
              </div>
            </ResultDetailSection>
        ) : null
      }
    />
  );
}

function LedgerRow({
  item,
  groups,
  onChange,
  onRemove,
}: {
  item: LedgerItem;
  groups: string[];
  onChange: (patch: Partial<LedgerItem>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="row-editor ledger-row">
      <div>
        <select
          aria-label="Account type"
          value={item.group}
          onChange={(event) => onChange({ group: event.target.value })}
          className="h-12 rounded-xl border border-border bg-card px-2 text-sm"
        >
          {groups.map((group) => (
            <option key={group} value={group}>
              {(
                {
                  Cash: "Cash / savings",
                  Investments: "Brokerage",
                  Vehicles: "Vehicle",
                } as Record<string, string>
              )[group] ?? group}
            </option>
          ))}
        </select>
        {item.group.startsWith("Other") ? (
          <input
            aria-label="Custom account name"
            placeholder="Custom name (optional)"
            value={item.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="mt-2 h-12 rounded-xl border border-border px-2"
          />
        ) : null}
      </div>
      <input
        type="number"
        value={item.amount || ""}
        onChange={(event) =>
          onChange({ amount: event.target.value.trim() === "" ? Number.NaN : Number(event.target.value) })
        }
        className="h-12 rounded-xl border border-border bg-card px-3 text-base"
        aria-label={`${item.name || "Item"} value`}
      />
      <button
        type="button"
        className="inline-flex h-12 w-11 items-center justify-center rounded-xl border border-border"
        onClick={onRemove}
        aria-label={`Remove ${item.name}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
