import { describe, expect, it } from 'vitest';
import { calculateDebtSnowball } from '@/lib/calculators/debt-snowball';
import { calculateLoanPayoff, simulateLoan } from '@/lib/calculators/loan-payoff';
import { calculateMortgage } from '@/lib/calculators/mortgage';
import { calculateRentVsBuy } from '@/lib/calculators/rent-vs-buy';
import { calculateInvestment } from '@/lib/calculators/investment';
import { calculateSavingsGoal } from '@/lib/calculators/savings-goal';
describe('money conservation and output reconciliation', () => {
  it('rolls multiple payoffs forward without exceeding the budget', () => {
    const result = calculateDebtSnowball({ debts: [10, 20, 100].map((balance, i) => ({ id: String(i), name: 'Card', balance, rate: 0, minimumPayment: 5 })), monthlyBudget: 100 });
    expect(result.ledger.map(row => row.payment)).toEqual([100, 30]);
    expect(result.payoffOrder.map(row => row.months)).toEqual([1, 1, 2]);
    expect(result.ledger[1].unusedBudget).toBe(70);
    for (const row of result.ledger) {
      const before = result.series[row.month - 1].total;
      expect(row.payment).toBeLessThanOrEqual(100);
      expect(before + row.interest - row.payment).toBeCloseTo(result.series[row.month].total, 8);
      expect(row.allocations.reduce((s, a) => s + a.balance, 0)).toBeCloseTo(result.series[row.month].total, 8);
    }
  });
  it('shares loan chart balances with the complete monthly ledger including missed interest', () => {
    const result = calculateLoanPayoff({ balance: 1000, annualRatePercent: 12, monthlyPayment: 5, extraPayment: 0, oneTimeExtra: 2000, startMonth: 2 });
    expect(result.standard.status).toBe('non-amortizing');
    expect(result.series[1].standardBalance).toBe(1005);
    expect(result.accelerated.status).toBe('paid-off');
    expect(result.accelerated.months).toBe(2);
    expect(result.accelerated.schedule[1].payment).toBeCloseTo(1015.05, 8);
    for (const row of result.accelerated.schedule) expect(result.series[row.month].extraBalance).toBe(row.remaining);
    expect(result.accelerated.schedule.reduce((s, row) => s + row.payment, 0)).toBeCloseTo(result.accelerated.totalPaid, 8);
  });
  it('does not fabricate a payoff at the horizon, including its exact boundary', () => {
    expect(simulateLoan(1200, 0, 1)).toMatchObject({ status: 'paid-off', months: 1200, remaining: 0 });
    expect(simulateLoan(1201, 0, 1)).toMatchObject({ status: 'horizon-exceeded', months: Infinity, remaining: 1 });
  });
  it('reconciles partial final mortgage years, monthly rows and totals', () => {
    const r = calculateMortgage({ homePrice: 1200, downPayment: 0, annualRatePercent: 0, termYears: 1.5 });
    expect(r.months).toHaveLength(18);
    expect(r.years[1].principal).toBeCloseTo(400, 8);
    expect(r.months.reduce((sum, row) => sum + row.payment, 0)).toBeCloseTo(r.totalCost, 8);
    expect(r.years.at(-1)?.balance).toBe(0);
  });
  it('invests the owner difference after payoff and reconciles housing cost rows', () => {
    const r = calculateRentVsBuy({ homePrice: 1200, downPaymentPercent: 0, mortgageRatePercent: 0, monthlyRent: 100, appreciationPercent: 0, investmentReturnPercent: 0, rentIncreasePercent: 0, loanTermYears: 1, yearsToStay: 1.5, annualPropertyTax: 0, annualInsurance: 0, annualMaintenance: 0, monthlyRenterInsurance: 0, closingCostPercent: 0 });
    expect(r.buyAtHorizon).toBe(1800);
    expect(r.ledger[12].mortgagePayment).toBe(0);
    expect(r.ledger[17].ownerPortfolio).toBe(600);
    expect(r.costRows[2].buy).toBe(1200);
    expect(r.series.find(p => p.year === 1.5)?.buyNetWorth).toBe(r.buyAtHorizon);
    for (const row of r.ledger) expect(row.ownerCost + row.ownerDeposit).toBeCloseTo(row.renterCost + row.renterDeposit, 8);
  });
  it('reconciles signed growth and partial terms across investment and savings', () => {
    const goal = calculateSavingsGoal({ goalAmount: 1000, alreadySaved: 100, years: 1.5, annualReturnPercent: -12 });
    const investment = calculateInvestment({ startingAmount: 100, monthlyContribution: goal.monthlyRequired, years: 1.5, annualReturnPercent: -12 });
    expect(investment.finalValue).toBeCloseTo(goal.series.at(-1)!.value, 8);
    expect(investment.finalValue).toBeCloseTo(1000, 8);
    expect(investment.series.at(-1)?.growth).toBe(investment.interestEarned);
    expect(investment.interestEarned).toBeLessThan(0);
  });
});

it('recognizes penny payments at the exact horizon without erasing tiny real debts', () => {
  expect(simulateLoan(12, 0, .01)).toMatchObject({ status: 'paid-off', months: 1200 });
  expect(simulateLoan(1e-10, 0, 0).status).toBe('non-amortizing');
  const result = calculateDebtSnowball({ monthlyBudget: .01, debts: [{ id: 'a', name: 'Card', balance: 6, rate: 0, minimumPayment: .01 }] });
  expect(result.status).toBe('paid-off');
  expect(result.months).toBe(600);
});
