export function temporalTickLimit(chartWidth: number): number {
  if (chartWidth >= 900) return 7;
  if (chartWidth >= 650) return 5;
  if (chartWidth >= 430) return 4;
  return 3;
}

export function temporalTickStep(span: number, tickLimit: number): number {
  if (span <= 0) return 1;
  const raw = span / Math.max(tickLimit - 1, 1);
  const nice = [1, 2, 5, 10, 15, 20, 25, 50, 100];
  return nice.find((n) => n >= raw) ?? Math.ceil(raw / 10) * 10;
}

export function markersCollide(left: number, right: number, threshold = 80): boolean {
  return Math.abs(left - right) < threshold;
}
