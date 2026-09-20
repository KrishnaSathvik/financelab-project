export type ChartTone = 'primary' | 'growth' | 'cost' | 'retirement' | 'neutral' | 'savings' | 'net-worth' | 'comparison';
export type ChartColumn = { label: string; tone?: ChartTone; format?: 'money' | 'percent'; plot?: boolean; dashed?: boolean };
export type ChartPoint = { x?: number; label: string; values: (number | null)[] };
export type ChartMarker = {
  index: number;
  label: string;
  emphasis?: boolean;
  chip?: string;
  style?: "solid" | "dashed";
};
export type ChartView = {
  id: string;
  label: string;
  kind: 'line' | 'area' | 'bar' | 'horizontal' | 'donut';
  stacked?: boolean;
  centerLabel?: string;
  columns: ChartColumn[];
  points: ChartPoint[];
  markers?: ChartMarker[];
};
export type ChartModel = { title: string; summary: string; views: ChartView[] };
