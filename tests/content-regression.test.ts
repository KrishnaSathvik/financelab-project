import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { calculators } from '../lib/calculators/catalog';
import { inputLabel, calculationScope } from '../lib/calculators/explanation';

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : /\.(tsx?|json)$/.test(path) ? [path] : [];
  });
}

describe('reviewed consumer content', () => {
  it('does not reintroduce retired copy anywhere in application content', () => {
    const retired = [
      'Treat leftover income as savings',
      'if added later',
      'conservative return',
      'max($10, 1% of balance',
      'Sources & methodology',
      'State and local taxes are not included unless stated otherwise',
      'Pairs with',
      '} savings rate',
      'Model conventions reviewed',
      'Calculations reviewed:',
      'Reviewed September',
      'Updated September',
      'Detailed breakdown / schedule',
      'Choose a point',
    ];
    for (const path of ['app', 'components', 'lib', 'data'].flatMap(sourceFiles)) {
      const content = readFileSync(path, 'utf8').toLowerCase();
      for (const phrase of retired) expect(content, `${path}: ${phrase}`).not.toContain(phrase.toLowerCase());
    }
  });

  it('provides consumer input labels and scope for every calculator', () => {
    for (const calculator of Object.values(calculators)) {
      for (const input of calculator.inputs) expect(inputLabel(input)).not.toMatch(/[a-z][A-Z]/);
      expect(calculationScope[calculator.slug].included.length).toBeGreaterThan(0);
      expect(calculationScope[calculator.slug].notModeled.length).toBeGreaterThan(0);
    }
  });

  it('keeps calculator result copy specific instead of generic breakdown labels', () => {
    const files = ['app', 'components', 'lib'].flatMap(sourceFiles);
    for (const path of files) {
      const content = readFileSync(path, 'utf8');
      expect(content, path).not.toContain('Detailed breakdown / schedule');
      expect(content, path).not.toMatch(/>(View data)</);
      expect(content, path).not.toContain('<summary>View data</summary>');
      expect(content, path).not.toContain('View chart data');
    }
  });

  it('keeps the corrected savings, debt and budget conventions explicit', () => {
    expect(calculators['savings-goal'].formula).toContain('Current savings × (1 + r)^n');
    expect(calculators['savings-goal'].formula).toContain('at r = 0, use n');
    expect(calculators['debt-snowball'].formula).toContain('Required minimum payments are reserved');
    expect(calculators.budget.formula).toContain('Remaining-income rate');
    expect(calculators['net-worth'].formula).toBe('Net worth = Assets − Liabilities');
  });
});
