'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type PointerEvent as ReactPointerEvent } from 'react';
import type { ChartColumn, ChartModel, ChartView } from '@/lib/chart-data/types';
import { formatMoney } from '@/lib/format';
import { seriesColorVars, seriesStroke } from '@/lib/chart-theme';

const ChartCanvas = dynamic(() => import('./interactive-canvas'), { ssr: false });
export const seriesColors = [...seriesColorVars];
export function chartValue(value: number | null, column: ChartColumn, cents = false) {
  return value === null ? 'Not applicable' : column.format === 'percent' ? `${value.toFixed(1)}%` : formatMoney(value, { cents });
}

function subscribeCompact(onStoreChange: () => void) {
  const media = window.matchMedia('(max-width: 767px)');
  media.addEventListener('change', onStoreChange);
  return () => media.removeEventListener('change', onStoreChange);
}

function ChartInspection({
  point,
  view,
  selected,
  compact,
  side,
  onClose,
}: {
  point: ChartView['points'][number];
  view: ChartView;
  selected: number;
  compact: boolean;
  side: 'left' | 'right';
  onClose: () => void;
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <strong>{point.label}</strong>
        <button type="button" aria-label="Close chart details" onClick={onClose}>×</button>
      </div>
      <dl>
        {view.columns.map((column, i) => (
          <div key={`${column.label}-${i}`} data-tone={column.tone}>
            <dt>{column.label}</dt>
            <dd>{chartValue(point.values[i], column)}</dd>
          </div>
        ))}
      </dl>
      {view.markers?.filter((m) => m.index === selected && m.label !== point.label).map((m, i) => (
        <p key={i} className="mt-2 font-medium">{m.label}</p>
      ))}
    </>
  );
  if (compact) {
    return <div className="chart-inspection" role="status" aria-live="polite" aria-atomic="true">{body}</div>;
  }
  return (
    <div className="money-tooltip" data-side={side} role="status" aria-live="polite" aria-atomic="true">
      {body}
    </div>
  );
}

export function InteractiveChart({
  model,
  highlightLabel,
  onHighlight,
}: {
  model: ChartModel;
  highlightLabel?: string | null;
  onHighlight?: (label: string | null) => void;
}) {
  const [mode, setMode] = useState(model.views[0].id);
  const view = model.views.find(v => v.id === mode) ?? model.views[0];
  return <section className="interactive-chart" aria-label={model.title}>
    <ChartViewContent
      key={view.id}
      title={model.title}
      summary={model.summary}
      view={view}
      highlightLabel={highlightLabel}
      onHighlight={onHighlight}
      modes={model.views.length > 1 ? <div className="chart-modes" role="group" aria-label={`${model.title} view`}>
        {model.views.map(item => <button type="button" key={item.id} aria-pressed={view.id === item.id} onClick={() => setMode(item.id)}>{item.label}</button>)}
      </div> : null}
    />
  </section>;
}

function ChartViewContent({
  title,
  summary,
  view,
  modes,
  highlightLabel,
  onHighlight,
}: {
  title: string;
  summary: string;
  view: ChartView;
  modes: React.ReactNode;
  highlightLabel?: string | null;
  onHighlight?: (label: string | null) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const pinned = useRef(false);
  const [selection, setSelection] = useState<number | null>(null);
  const [hint, setHint] = useState(true);
  const [side, setSide] = useState<'left' | 'right'>('right');
  const compact = useSyncExternalStore(subscribeCompact, () => window.matchMedia('(max-width: 767px)').matches, () => false);
  const selected = selection === null ? null : Math.min(selection, view.points.length - 1);
  const point = selected === null ? null : view.points[selected];
  const select = useCallback((index: number | null, pin = false) => {
    if (pin) pinned.current = true;
    if (!pinned.current || pin) {
      setSelection(index);
      if (index !== null) setHint(false);
      onHighlight?.(index === null ? null : view.points[index]?.label ?? null);
    }
  }, [onHighlight, view.points]);
  const close = useCallback(() => {
    pinned.current = false;
    setSelection(null);
    onHighlight?.(null);
  }, [onHighlight]);
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) close(); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [close]);
  useEffect(() => {
    if (!highlightLabel) return;
    const index = view.points.findIndex(item => item.label === highlightLabel || item.label === `Year ${highlightLabel}` || item.label === `Month ${highlightLabel}`);
    if (index < 0) return;
    const frame = requestAnimationFrame(() => setSelection(index));
    return () => cancelAnimationFrame(frame);
  }, [highlightLabel, view.points]);
  const plotted = view.columns.map((c, index) => ({ ...c, index })).filter(c => c.plot !== false);
  const empty = !view.points.length || (view.kind === 'donut' && !view.points.some(p => (p.values[0] ?? 0) > 0));
  const move = (delta: number) => {
    const next = selected === null ? (delta > 0 ? 0 : view.points.length - 1) : Math.min(view.points.length - 1, Math.max(0, selected + delta));
    select(next, true);
  };
  const trackPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSide(event.clientX < rect.left + rect.width / 2 ? 'right' : 'left');
  };
  const inspection = point && selected !== null ? (
    <ChartInspection point={point} view={view} selected={selected} compact={compact} side={side} onClose={close} />
  ) : null;
  return <div ref={root} onKeyDown={event => {
    if (event.key === 'Escape') close();
    const fromStage = event.target instanceof Element && event.target.closest('.chart-stage');
    if (!fromStage || empty) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); move(1); }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); move(-1); }
    if (event.key === 'Home') { event.preventDefault(); select(0, true); }
    if (event.key === 'End') { event.preventDefault(); select(view.points.length - 1, true); }
  }}>
    <div className="chart-header">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="chart-summary">{summary}</p>
      </div>
    </div>
    {modes}
    {view.markers?.some((marker) => marker.chip) ? (
      <div className="chart-chips" aria-label="Chart scenario markers">
        {view.markers.filter((marker) => marker.chip).map((marker, index) => (
          <span key={`${marker.chip}-${index}`} className="chart-chip">{marker.chip}</span>
        ))}
      </div>
    ) : null}
    {empty ? <p className="chart-empty">No amounts to plot for this view. Your result above remains the source of the estimate.</p> : <>
      {compact ? inspection : null}
      <div className="chart-stage" tabIndex={0} data-chart-kind={view.kind} data-point-count={view.points.length} aria-label={`${view.label} chart. Hover or tap to inspect values. Use left and right arrows when the chart is focused.`} onPointerMove={trackPointer} style={view.kind === 'horizontal' ? { height: `${Math.min(400, Math.max(240, view.points.length * 40 + 80))}px` } : undefined}>
        <ChartCanvas view={view} selected={selected} onSelect={select} />
        {view.kind === 'donut' && !point && <div className="donut-total"><span>{view.centerLabel ?? 'Total'}</span><strong>{formatMoney(view.points.reduce((sum, p) => sum + (p.values[0] ?? 0), 0))}</strong></div>}
        {!compact ? inspection : null}
      </div>
      <div className="chart-legend" aria-label="Chart legend">
        {view.kind === 'donut' ? view.points.map((p, i) => <button type="button" key={`${p.label}-${i}`} aria-pressed={selected === i} onClick={() => select(i, true)}><span aria-hidden="true" style={{ background: seriesColors[i % seriesColors.length] }} />{p.label}</button>) : plotted.map((c, i) => <span key={c.index}><i aria-hidden="true" style={{ borderColor: seriesStroke(c.tone, i), borderTopStyle: c.dashed ? 'dashed' : 'solid' }} />{c.label}</span>)}
      </div>
      {hint ? <p className="chart-instruction">Hover or tap the chart to inspect values. Use ← → when the chart is focused.</p> : null}
    </>}
  </div>;
}
