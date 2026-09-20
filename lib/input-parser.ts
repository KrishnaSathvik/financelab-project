/** Accept decimal numbers and correctly grouped US thousands; never strip arbitrary text. */
export function parseNumberInput(raw: string): number | null {
  const text = raw.trim();
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+|\d{1,3}(?:,\d{3})+(?:\.\d*)?)$/.test(text)) return null;
  const value = Number(text.replaceAll(',', ''));
  return Number.isFinite(value) ? value : null;
}
