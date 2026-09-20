import { describe, expect, it, vi, afterEach } from 'vitest';
import { InputValidationError, validate, validatePayload } from '@/lib/validation/index';
import { evaluateCalculation } from '@/lib/calculation-result';
import { calculateMortgage } from '@/lib/calculators/mortgage';
import { loadLocal, saveLocal } from '@/lib/persistence';
import { decodeSharePayload, encodeSharePayload } from '@/lib/persistence';
const mortgage = { homePrice: 100, downPayment: 20, annualRatePercent: 5, termYears: 1.5 };
describe('shared validation contract', () => {
  afterEach(() => vi.unstubAllGlobals());
  it.each([NaN, Infinity, -1, '100', null])('rejects an invalid home price %s through engine and UI', value => {
    const input = { ...mortgage, homePrice: value };
    expect(validate('mortgage', input).valid).toBe(false);
    const run = () => calculateMortgage(input as typeof mortgage);
    expect(run).toThrow(InputValidationError);
    expect(evaluateCalculation(run)).toMatchObject({ result: null, error: expect.any(String) });
  });
  it('rejects the same invalid object from a shared link', () => {
    const restored = decodeSharePayload(encodeSharePayload({ ...mortgage, downPayment: -10 }));
    expect(validatePayload('mortgage', restored).valid).toBe(false);
    expect(validatePayload('mortgage', mortgage).valid).toBe(true);
  });
  it('rejects duplicate IDs but permits duplicate debt names', () => {
    const a = { id: 'a', name: 'Card', balance: 10, rate: 0, minimumPayment: 5 };
    expect(validate('debt', { debts: [a, a], monthlyBudget: 10 }).valid).toBe(false);
    expect(validate('debt', { debts: [a, { ...a, id: 'b' }], monthlyBudget: 10 }).valid).toBe(true);
    expect(validate('debt', { debts: [null], monthlyBudget: 0 }).valid).toBe(false);
  });
  it('rejects invalid net-worth ledger amounts before aggregation', () => {
    expect(validatePayload('net-worth', { assets: [{ id: 'a', name: 'Home', group: 'Home', amount: -100 }], liabilities: [], monthlySavings: 0, monthlyDebtPaydown: 0, assetReturnPercent: 0, debtInterestPercent: 0 }).valid).toBe(false);
  });
  it('rejects unsupported tax years, state models, and excessive deductions', () => {
    const salary = { mode: 'salary', annualSalary: 1000, filingStatus: 'single', hoursPerWeek: 40, weeksPerYear: 52 };
    for (const patch of [{ state: 'CA' }, { taxYear: 2027 }, { traditional401k: 1001 }]) expect(validate('salary', { ...salary, ...patch }).valid).toBe(false);
  });
  it('recovers from malformed storage and rejects invalid saved values', () => {
    const storage = new Map<string, string>();
    const setItem = vi.fn((k, v) => storage.set(k, v));
    vi.stubGlobal('window', { localStorage: { getItem: (k: string) => storage.get(k), setItem } });
    storage.set('moneybasis:mortgage', '{broken');
    expect(loadLocal('mortgage', mortgage)).toEqual(mortgage);
    storage.set('moneybasis:mortgage', JSON.stringify({ ...mortgage, termYears: -5 }));
    expect(loadLocal('mortgage', mortgage)).toEqual(mortgage);
    saveLocal('mortgage', { ...mortgage, homePrice: NaN });
    expect(setItem).not.toHaveBeenCalled();
    saveLocal('mortgage', mortgage);
    expect(loadLocal('mortgage', {})).toEqual(mortgage);
  });
});

it('does not reject a budget because of sub-cent floating-point addition noise', () => {
  expect(validate('debt', { monthlyBudget: 0.3, debts: [0.1, 0.2].map((minimumPayment, i) => ({ id: String(i), name: 'Card', balance: 1, rate: 0, minimumPayment })) }).valid).toBe(true);
});
