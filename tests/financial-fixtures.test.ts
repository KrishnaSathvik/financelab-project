import { describe, expect, it } from 'vitest';
import { calculateMortgage } from '@/lib/calculators/mortgage';
import { calculateInvestment } from '@/lib/calculators/investment';
import { calculateSalary } from '@/lib/calculators/salary';
import { calculateLoanPayoff, simulateLoan } from '@/lib/calculators/loan-payoff';
import { calculateNetWorth } from '@/lib/calculators/net-worth';
import { calculateBudget } from '@/lib/calculators/budget';
import { calculateRetirement } from '@/lib/calculators/retirement';
import { calculateSavingsGoal } from '@/lib/calculators/savings-goal';
import { calculateDebtSnowball } from '@/lib/calculators/debt-snowball';
import { calculateRentVsBuy } from '@/lib/calculators/rent-vs-buy';
import { InputValidationError } from '@/lib/validation/index';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const engines = { calculateMortgage, calculateInvestment, calculateSalary, calculateLoanPayoff, simulateLoan, calculateNetWorth, calculateBudget, calculateRetirement, calculateSavingsGoal, calculateDebtSnowball, calculateRentVsBuy };
type Fixture = { id: string; function: keyof typeof engines; args: unknown[]; expected: Record<string, unknown>; tolerance: number };
function select(value: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((v, part) => part === 'last' && Array.isArray(v) ? v.at(-1) : v == null ? null : (v as Record<string, unknown>)[part], value);
}
const dir = join(process.cwd(), 'tests/fixtures/financial');
for (const file of readdirSync(dir).filter(f => f.endsWith('.json'))) {
  const { cases } = JSON.parse(readFileSync(join(dir, file), 'utf8')) as { cases: Fixture[] };
  describe(file, () => {
    for (const fixture of cases) it(fixture.id, () => {
      const run = () => (engines[fixture.function] as (...args: unknown[]) => unknown)(...fixture.args);
      if (fixture.expected.error === true) { expect(run).toThrow(InputValidationError); return; }
      const actual = run();
      for (const [path, expected] of Object.entries(fixture.expected)) {
        const value = select(actual, path);
        if (expected === 'Infinity') expect(value, path).toBe(Infinity);
        else if (typeof expected === 'number') {
          expect(typeof value, path).toBe('number');
          const tolerance = /(?:^months$|\.length$|monthsFundsLast)/.test(path) ? 0 : fixture.tolerance;
          expect(Math.abs(Number(value) - expected), `${fixture.id}: ${path} = ${value}, expected ${expected}`).toBeLessThanOrEqual(tolerance);
        } else expect(value, path).toEqual(expected);
      }
    });
  });
}
