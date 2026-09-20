import type { ChartTone } from "@/lib/chart-data/types";

export const seriesColorVars = [
  "var(--chart-primary)",
  "var(--chart-cost)",
  "var(--chart-growth)",
  "var(--chart-retirement)",
  "var(--chart-net-worth)",
  "var(--chart-neutral)",
] as const;

const fallbacks = {
  "--chart-primary": "#2563eb",
  "--chart-cost": "#ea580c",
  "--chart-growth": "#16a36a",
  "--chart-retirement": "#7c3aed",
  "--chart-net-worth": "#0284c7",
  "--chart-neutral": "#737373",
  "--chart-axis": "#666666",
  "--chart-grid": "#e5e5e5",
  "--chart-teal": "#0d9488",
  "--surface": "#ffffff",
  "--savings": "#d97706",
  "--comparison": "#f97316",
} as const;

export function readCssColor(name: keyof typeof fallbacks | string, fallback?: string): string {
  const defaultValue = fallback ?? (name in fallbacks ? fallbacks[name as keyof typeof fallbacks] : "#2563eb");
  if (typeof window === "undefined") return defaultValue;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || defaultValue;
}

export function withAlpha(color: string, alpha: number): string {
  const value = color.trim();
  if (value.startsWith("#")) {
    const hex = value.length === 4
      ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`
      : value;
    const r = Number.parseInt(hex.slice(1, 3), 16);
    const g = Number.parseInt(hex.slice(3, 5), 16);
    const b = Number.parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  const rgb = value.match(/rgba?\(([^)]+)\)/);
  if (rgb) {
    const [r, g, b] = rgb[1].split(",").map((part) => part.trim());
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return value;
}

export function readChartTheme() {
  return {
    palette: [
      readCssColor("--chart-primary"),
      readCssColor("--chart-cost"),
      readCssColor("--chart-growth"),
      readCssColor("--chart-retirement"),
      readCssColor("--chart-net-worth"),
      readCssColor("--chart-neutral"),
    ],
    tick: readCssColor("--chart-axis"),
    grid: readCssColor("--chart-grid"),
    fill: readCssColor("--surface"),
    growth: readCssColor("--chart-growth"),
    retirement: readCssColor("--chart-retirement"),
    cost: readCssColor("--chart-cost"),
    neutral: readCssColor("--chart-neutral"),
    primary: readCssColor("--chart-primary"),
    savings: readCssColor("--savings"),
    teal: readCssColor("--chart-teal"),
    comparison: readCssColor("--comparison"),
    netWorth: readCssColor("--chart-net-worth"),
  };
}

export function seriesColor(tone: ChartTone | undefined, index: number, theme: ReturnType<typeof readChartTheme>): string {
  switch (tone) {
    case "growth":
      return theme.growth;
    case "retirement":
      return theme.retirement;
    case "cost":
      return theme.cost;
    case "neutral":
      return theme.neutral;
    case "primary":
      return theme.primary;
    case "savings":
      return theme.savings;
    case "net-worth":
      return theme.netWorth;
    case "comparison":
      return theme.comparison;
    case undefined:
      return theme.palette[index % theme.palette.length];
    default: {
      const exhaustive: never = tone;
      return exhaustive;
    }
  }
}

export function seriesStroke(tone: ChartTone | undefined, index: number): string {
  switch (tone) {
    case "growth":
      return "var(--chart-growth)";
    case "retirement":
      return "var(--chart-retirement)";
    case "cost":
      return "var(--chart-cost)";
    case "neutral":
      return "var(--chart-neutral)";
    case "primary":
      return "var(--chart-primary)";
    case "savings":
      return "var(--savings)";
    case "net-worth":
      return "var(--chart-net-worth)";
    case "comparison":
      return "var(--comparison)";
    case undefined:
      return seriesColorVars[index % seriesColorVars.length];
    default: {
      const exhaustive: never = tone;
      return exhaustive;
    }
  }
}
