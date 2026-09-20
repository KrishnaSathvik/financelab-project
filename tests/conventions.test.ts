import { describe, expect, it } from 'vitest';
import { addCalendarMonths, yearsToMonths } from '@/lib/calendar';
import { futureValue, requiredMonthlyContribution, amortizingPayment } from '@/lib/finance';
import { parseNumberInput } from '@/lib/input-parser';
import { calculateSavingsGoal, monthsToGoal } from '@/lib/calculators/savings-goal';
import { calculateRetirement } from '@/lib/calculators/retirement';
describe('calendar and numerical conventions', () => {
  it('clamps end-of-month and leap-day dates without changing the source', () => {
    const jan = new Date(2024, 0, 31, 12);
    expect(addCalendarMonths(jan, 1).getDate()).toBe(29);
    expect(addCalendarMonths(jan, 2).getDate()).toBe(31);
    expect(addCalendarMonths(new Date(2024, 1, 29), 12).getDate()).toBe(28);
    expect(jan.getMonth()).toBe(0);
    expect(() => addCalendarMonths(jan, Infinity)).toThrow();
  });
  it('normalizes fractional years to months and rejects partial months', () => {
    expect(yearsToMonths(1.5)).toBe(18);
    expect(yearsToMonths(1 / 12)).toBe(1);
    expect(() => yearsToMonths(1.1)).toThrow();
  });
  it.each(['abc100', '1e3', '12,34', '1.2.3', '', '-', 'Infinity'])('rejects malformed numeric text %s', raw => {
    expect(parseNumberInput(raw)).toBeNull();
  });
  it('retains decimals and validates grouping', () => {
    expect(parseNumberInput('1,234.56')).toBe(1234.56);
    expect(parseNumberInput('-.5')).toBe(-.5);
  });
  it('handles losses and end-period contributions', () => {
    expect(futureValue({ presentValue: 100, monthlyContribution: 10, monthlyRate: -.1, periods: 2 })).toBeCloseTo(100, 10);
    expect(requiredMonthlyContribution({ futureValueNeeded: 19, monthlyRate: -.1, periods: 2 })).toBeCloseTo(10, 10);
    expect(amortizingPayment(1000, 1e-10, 360)).toBeCloseTo(1000 / 360, 6);
  });
  it('keeps achieved-today separate from funding a future loss', () => {
    const result = calculateSavingsGoal({ goalAmount: 100, alreadySaved: 100, years: 1, annualReturnPercent: -12 });
    expect(result.alreadyThere).toBe(true);
    expect(result.noMoreDepositsRequired).toBe(false);
    expect(result.monthlyRequired).toBeGreaterThan(0);
    expect(result.series.at(-1)?.value).toBeCloseTo(100, 8);
    expect(result.interestEarned).toBeLessThan(0);
  });
  it('recognizes a goal reached exactly at month 600', () => {
    expect(monthsToGoal({ goalAmount: 600, alreadySaved: 0, years: 50, annualReturnPercent: 0 }, 1)).toBe(600);
  });
  it('inflates first retirement spending and annual drawdown independently', () => {
    const r = calculateRetirement({ currentAge: 64, retirementAge: 65, currentSavings: 1000, monthlyContribution: 0, annualReturnPercent: 0, monthlyNeed: 10, inflationPercent: 10, lifeExpectancy: 67 });
    expect(r.monthlyNeedAtRetirement).toBeCloseTo(11, 10);
    expect(r.series.at(-1)?.value).toBeCloseTo(1000 - 12 * 11 - 12 * 12.1, 8);
    expect(r.drawdownStatus).toBe('funded-through-horizon');
  });
});

it('keeps near-zero-return savings finite and tiny unfunded goals unreachable', () => {
  const r = calculateSavingsGoal({ goalAmount: 1000, alreadySaved: 0, years: 1, annualReturnPercent: 1e-20 });
  expect(r.monthlyRequired).toBeCloseTo(1000 / 12, 9);
  expect(r.series.at(-1)?.value).toBeCloseTo(1000, 8);
  expect(monthsToGoal({ goalAmount: 1e-10, alreadySaved: 0, years: 1, annualReturnPercent: 0 }, 0)).toBe(Infinity);
});
