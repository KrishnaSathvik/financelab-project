import type { RetirementResult } from "@/lib/calculators/retirement";
import type { ChartModel } from "./types";
import { money } from "./helpers";

export function retirementChart(result: RetirementResult): ChartModel {
  const accumulation = result.series.filter((point) => point.phase === "accumulation");
  const last = accumulation.at(-1)!;
  const drawdown = [last, ...result.series.filter((point) => point.phase === "drawdown")];
  const depleted = result.drawdownStatus === "depleted";
  return {
    title: "Portfolio over time",
    summary: `${money(result.nestEgg)} at age ${last.age}. ${depleted ? `Portfolio reaches $0 at age ${drawdown.at(-1)!.age}.` : "Balance remains at selected horizon."} Illustration under selected assumptions, not a probability of success.`,
    views: [
      {
        id: "growth",
        label: "Growth to retirement",
        kind: "area",
        columns: [
          { label: "Portfolio balance", tone: "retirement" },
          { label: "Contributed", plot: false },
          { label: "Modeled growth", plot: false },
        ],
        points: accumulation.map((point) => ({
          x: point.age,
          label: `Age ${Number(point.age.toFixed(2))}`,
          values: [point.value, point.contributed ?? null, point.growth ?? null],
        })),
        markers: [
          { index: 0, label: "Current age", chip: `Current age: ${accumulation[0]?.age ?? ""}`, emphasis: true, style: "solid" },
          { index: accumulation.length - 1, label: "Retirement", chip: `Retirement age: ${last.age}`, emphasis: true, style: "solid" },
        ],
      },
      {
        id: "drawdown",
        label: "Drawdown",
        kind: "area",
        columns: [
          { label: "Remaining portfolio", tone: "retirement" },
          { label: "Annual spending", plot: false },
        ],
        points: drawdown.map((point) => ({
          x: point.age,
          label: `Age ${Number(point.age.toFixed(2))}`,
          values: [point.value, point.annualSpending ?? null],
        })),
        markers: [
          { index: 0, label: "Retirement", chip: `Retirement age: ${drawdown[0]?.age ?? ""}`, emphasis: true, style: "solid" },
          { index: drawdown.length - 1, label: depleted ? `Portfolio reaches $0 at age ${Number(drawdown.at(-1)!.age.toFixed(1))}` : "Selected horizon", chip: depleted ? `Depleted: age ${Number(drawdown.at(-1)!.age.toFixed(1))}` : "Selected horizon", emphasis: true, style: "dashed" },
        ],
      },
    ],
  };
}
