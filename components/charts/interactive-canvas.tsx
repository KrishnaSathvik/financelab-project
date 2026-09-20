'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, LineController, BarController, DoughnutController, Filler, type ChartConfiguration } from 'chart.js';
import type { ChartMarker, ChartView } from '@/lib/chart-data/types';
import { temporalTickLimit, temporalTickStep } from '@/lib/chart-data/ticks';
import { readChartTheme, seriesColor, withAlpha } from '@/lib/chart-theme';
const axisMoney = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(value);

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, LineController, BarController, DoughnutController, Filler);
type Kind = 'line' | 'bar' | 'doughnut';
type Datum = number | null | { x: number; y: number | null };

function markerDash(marker: ChartMarker): number[] {
  if (marker.style === 'solid') return [];
  if (marker.style === 'dashed') return [5, 4];
  return marker.emphasis ? [] : [5, 4];
}

export default function ChartCanvas({ view, selected, onSelect }: { view: ChartView; selected: number | null; onSelect: (index: number | null, pin?: boolean) => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const instance = useRef<Chart<Kind, Datum[], string> | null>(null);
  const active = useRef(selected);
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    if (!canvas.current) return;
    const theme = readChartTheme();
    const tick = theme.tick;
    const grid = theme.grid;
    const donut = view.kind === 'donut';
    const horizontal = view.kind === 'horizontal';
    const line = view.kind === 'line' || view.kind === 'area';
    const type: Kind = donut ? 'doughnut' : line ? 'line' : 'bar';
    const compact = window.matchMedia('(max-width: 639px)').matches;
    const initialWidth = canvas.current.parentElement?.clientWidth ?? window.innerWidth;
    const monthly = view.points.some(p => p.label.startsWith('Month'));
    const timeUnit = monthly && (view.points.at(-1)?.x ?? 0) > 60 ? 12 : 1;
    const xTicks = temporalTickLimit(initialWidth);
    const xMin = (view.points[0]?.x ?? 0);
    const xMax = (view.points.at(-1)?.x ?? view.points.length - 1);
    const xSpan = (xMax - xMin) / timeUnit;
    const xStep = temporalTickStep(xSpan, xTicks);
    const yTicks = compact ? 3 : 5;
    const plotted = view.columns.map((c, index) => ({ ...c, index })).filter(c => c.plot !== false);
    const datasets = plotted.map((column, i) => {
      const ink = seriesColor(column.tone, i, theme);
      return {
      label: column.label,
      data: view.points.map((p, index) => line ? { x: (p.x ?? index) / timeUnit, y: p.values[column.index] } : p.values[column.index]),
      borderColor: donut ? theme.fill : ink,
      backgroundColor: donut ? view.points.map((_, n) => theme.palette[n % theme.palette.length]) : withAlpha(ink, line ? 0.19 : 0.8),
      borderWidth: donut ? 2 : 2.3,
      borderDash: line && column.dashed ? [6, 4] : [],
      pointRadius: (context: { dataIndex: number }) => active.current === context.dataIndex ? 5 : view.markers?.some(m => m.index === context.dataIndex) ? 3 : 0,
      pointHoverRadius: 5,
      pointHitRadius: 20,
      tension: 0,
      fill: view.kind === 'area' ? (view.stacked && i > 0 ? '-1' : 'origin') : false,
      ...(horizontal ? { maxBarThickness: view.points.length <= 2 ? 44 : 26, borderRadius: 4 } : {}),
    };
    });
    const tickFont = { size: 12, family: 'ui-sans-serif, system-ui, sans-serif' };
    const config: ChartConfiguration<Kind, Datum[], string> = {
      type, data: { labels: view.points.map(p => p.label), datasets },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: false, // Instant, including reduced-motion; no replay on input updates.
        indexAxis: horizontal ? 'y' : 'x',
        interaction: { mode: donut ? 'nearest' : 'index', intersect: false, axis: donut ? 'xy' : horizontal ? 'y' : 'x' },
        events: ['mousemove', 'mouseout', 'click'],
        onHover: (event, elements) => {
          if (event.type !== 'mousemove') return;
          if (elements[0]) onSelect(elements[0].index);
          else if (horizontal && view.points.length === 1) onSelect(0);
          else onSelect(null);
        },
        onClick: (_event, elements) => { if (elements[0]) onSelect(elements[0].index, true); },
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        ...(donut ? { cutout: '62%' } : { scales: {
          x: { type: line ? 'linear' : horizontal ? 'linear' : 'category', ...(line ? { min: xMin / timeUnit, max: xMax / timeUnit } : {}), stacked: view.stacked, grid: { display: horizontal, color: grid }, ticks: { color: tick, font: tickFont, maxTicksLimit: horizontal ? 3 : xTicks, ...(line ? { stepSize: xStep, autoSkip: false } : {}), maxRotation: 0, ...(horizontal ? { callback: (v: string | number) => axisMoney(Number(v)) } : line ? { callback: (v: string | number) => monthly ? `${Number(Number(v).toFixed(1))}${timeUnit === 12 ? 'y' : 'mo'}` : view.points[0]?.label.startsWith('Age') ? `${Number(Number(v).toFixed(1))}` : `${Number(Number(v).toFixed(1))}y` } : {}) } },
          y: { stacked: view.stacked, beginAtZero: true, grid: { display: !horizontal, color: grid }, ticks: { color: tick, font: tickFont, maxTicksLimit: horizontal ? (compact ? 6 : 10) : yTicks, ...(!horizontal ? { callback: (v: string | number) => axisMoney(Number(v)) } : { callback: function(value: string | number) { const label = view.points[Number(value)]?.label ?? ''; return label.length > 17 ? `${label.slice(0, 15)}…` : label; } }) } },
        } }),
      },
      plugins: [{
        id: 'moneybasis-selection',
        resize(chart) {
          if (donut || horizontal || !line) return;
          const ticks = chart.options.scales?.x?.ticks;
          if (!ticks) return;
          const width = chart.chartArea?.width || chart.width;
          const limit = temporalTickLimit(width);
          Object.assign(ticks, { maxTicksLimit: limit, stepSize: temporalTickStep(xSpan, limit), autoSkip: false });
        },
        afterDraw(chart) {
        const { ctx, chartArea } = chart;
        const index = active.current;
        if (index !== null && line) {
          const element = chart.getDatasetMeta(0).data[index];
          if (element) {
            ctx.save();
            ctx.beginPath(); ctx.setLineDash([3, 4]); ctx.strokeStyle = tick;
            ctx.moveTo(element.x, chartArea.top); ctx.lineTo(element.x, chartArea.bottom); ctx.stroke();
            ctx.beginPath(); ctx.setLineDash([]); ctx.arc(element.x, element.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = theme.primary; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = theme.fill; ctx.stroke();
            ctx.restore();
          }
        }
        if (donut || horizontal) return;
        for (const marker of view.markers ?? []) {
          if (marker.index < 0) continue;
          const element = chart.getDatasetMeta(0).data[marker.index];
          if (!element || element.x < chartArea.left + 8) continue;
          ctx.save();
          ctx.beginPath();
          ctx.setLineDash(markerDash(marker));
          ctx.strokeStyle = marker.emphasis ? theme.primary : tick;
          ctx.globalAlpha = 0.55;
          ctx.lineWidth = marker.emphasis ? 1.5 : 1.25;
          ctx.moveTo(element.x, chartArea.top);
          ctx.lineTo(element.x, chartArea.bottom);
          ctx.stroke();
          ctx.restore();
        }
      } }],
    };
    const chart = new Chart(canvas.current, config);
    instance.current = chart;
    const leave = () => onSelect(null);
    const element = canvas.current;
    const tap = (event: PointerEvent) => {
      // Include the axis-label gutter in the touch target, not just the plotted ink.
      const elements = chart.getElementsAtEventForMode(event, donut ? 'nearest' : 'index', { intersect: false, axis: donut ? 'xy' : horizontal ? 'y' : 'x', includeInvisible: true }, false);
      if (elements[0]) onSelect(elements[0].index, true);
    };
    element.addEventListener('pointerleave', leave);
    element.addEventListener('pointerup', tap);
    return () => { element.removeEventListener('pointerleave', leave); element.removeEventListener('pointerup', tap); chart.destroy(); instance.current = null; };
  }, [view, resolvedTheme, onSelect]);
  useEffect(() => {
    active.current = selected;
    const chart = instance.current;
    if (!chart) return;
    chart.setActiveElements(selected === null ? [] : chart.data.datasets.map((_, datasetIndex) => ({ datasetIndex, index: selected })));
    chart.update('none');
  }, [selected, view, resolvedTheme]);
  return <canvas ref={canvas} role="img" aria-hidden="true" />;
}
