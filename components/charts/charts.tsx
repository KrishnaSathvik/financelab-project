"use client";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { useTheme } from "next-themes";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { formatMoney } from "@/lib/format";
import { readChartTheme } from "@/lib/chart-theme";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
);

function useChartColors() {
  const { resolvedTheme } = useTheme();
  const theme = readChartTheme();
  void resolvedTheme;
  return {
    tick: theme.tick,
    grid: theme.grid,
    legend: theme.tick,
  };
}

function axisOptions(colors: ReturnType<typeof useChartColors>, legend: boolean): ChartOptions<"line" | "bar"> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    plugins: {
      legend: {
        display: legend,
        labels: { color: colors.legend, boxWidth: 12, padding: 16 },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y ?? context.parsed;
            return ` ${formatMoney(Number(value))}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: colors.tick, maxTicksLimit: 10 },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: colors.tick,
          callback: (value) => formatMoney(Number(value), { compact: true }),
        },
        grid: { color: colors.grid },
      },
    },
  };
}

export function LineChart({
  data,
  legend = false,
  stacked = false,
}: {
  data: ChartData<"line">;
  legend?: boolean;
  stacked?: boolean;
}) {
  const colors = useChartColors();
  const options = axisOptions(colors, legend);
  if (stacked && options.scales?.y) options.scales.y.stacked = true;
  return <Line data={data} options={options} />;
}

export function BarChart({
  data,
  legend = true,
}: {
  data: ChartData<"bar">;
  legend?: boolean;
}) {
  const colors = useChartColors();
  return <Bar data={data} options={axisOptions(colors, legend)} />;
}

export function DoughnutChart({ data }: { data: ChartData<"doughnut"> }) {
  const colors = useChartColors();
  return (
    <Doughnut
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 300 },
        cutout: "58%",
        plugins: {
          legend: {
            display: true,
            position: "right",
            labels: { color: colors.legend, boxWidth: 12, padding: 10 },
          },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.label}: ${formatMoney(Number(context.parsed))}`,
            },
          },
        },
      }}
    />
  );
}

export function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow)]">
      <p className="mb-4 text-sm font-semibold text-foreground">{title}</p>
      <div className="h-64 sm:h-72">{children}</div>
    </div>
  );
}
