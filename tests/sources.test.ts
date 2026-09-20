import { expect, it } from 'vitest';
import { financialSources, sourceCategories } from '@/lib/sources';
import { calculatorList } from '@/lib/calculators/catalog';
import { getTaxYearData } from '@/data/tax';
it('uses centrally registered claim-specific references for every calculator', () => {
  const sources = Object.values(financialSources);
  expect(new Set(sources.map(s => s.id)).size).toBe(sources.length);
  for (const s of sources) {
    expect(new URL(s.url).pathname).not.toBe('/');
    expect(s.supports.length).toBeGreaterThan(0);
    expect(s.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(s.jurisdiction).toBe('US');
  }
  for (const calculator of calculatorList) for (const source of calculator.sources) expect(sources.some(s => s.url === source.href)).toBe(true);
  expect(getTaxYearData(2025).sources.some(s => s.id === 'irs-rp-2024-40')).toBe(true);
  expect(getTaxYearData(2026).sources.some(s => s.id === 'irs-additional-medicare')).toBe(true);
});

it('places every registered source in exactly one generated category', () => {
  const listed = sourceCategories.flatMap((category) => category.keys);
  expect(listed).toHaveLength(new Set(listed).size);
  expect(new Set(listed)).toEqual(new Set(Object.keys(financialSources) as Array<keyof typeof financialSources>));
  expect(sourceCategories.map((category) => category.id)).toHaveLength(new Set(sourceCategories.map((category) => category.id)).size);
});
