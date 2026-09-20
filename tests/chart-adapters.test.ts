import { expect, it } from 'vitest';
import { mortgageChart, investmentChart, retirementChart, savingsChart, loanChart, debtChart, budgetChart, budgetAllocation, salaryChart, netWorthChart, netWorthProjection, rentBuyChart } from '@/lib/chart-data/adapters';
import { calculateMortgage } from '@/lib/calculators/mortgage';
import { calculateInvestment } from '@/lib/calculators/investment';
import { calculateRetirement } from '@/lib/calculators/retirement';
import { calculateSavingsGoal } from '@/lib/calculators/savings-goal';
import { calculateLoanPayoff } from '@/lib/calculators/loan-payoff';
import { calculateDebtSnowball, defaultDebts } from '@/lib/calculators/debt-snowball';
import { calculateBudget, defaultBudgetCategories } from '@/lib/calculators/budget';
import { calculateSalary } from '@/lib/calculators/salary';
import { calculateNetWorth, defaultAssets, defaultLiabilities, sumLedger, groupLedger } from '@/lib/calculators/net-worth';
import { calculateRentVsBuy } from '@/lib/calculators/rent-vs-buy';

it('mortgage yearly balance uses the engine schedule and does not add balance to cumulative interest', () => {
  const r = calculateMortgage({ homePrice: 320000, downPayment: 0, annualRatePercent: 6.5, termYears: 1.5 });
  const [balance, split] = mortgageChart(r).views;
  expect(balance.points).toHaveLength(r.years.length + 1);
  expect(balance.points[0].values[0]).toBe(r.loanAmount);
  r.years.forEach((row, i) => expect(balance.points[i + 1].values).toEqual([row.balance, r.loanAmount - row.balance, row.interest]));
  expect(balance.points.at(-1)!.values[0]).toBe(0);
  r.years.forEach((row, i) => expect(split.points[i].values).toEqual([row.principal, row.interest, row.payment]));
});

it('compound chart preserves signed losses and adds today’s-dollar view from engine real values', () => {
  const r = calculateInvestment({ startingAmount: 10000, monthlyContribution: 500, annualReturnPercent: -12, years: 1.5 });
  const v = investmentChart(r).views[0];
  expect(v.stacked).toBe(false);
  expect(v.points).toHaveLength(r.series.length);
  r.series.forEach((p, i) => expect(v.points[i].values).toEqual([p.contributed, p.growth, p.portfolio]));
  expect(v.points.at(-1)!.label).toBe('Year 1.5');
  expect(v.points.at(-1)!.values[1]).toBeLessThan(0);
  const inflated = calculateInvestment({ startingAmount: 10000, monthlyContribution: 0, annualReturnPercent: 7, years: 2, inflationPercent: 3 });
  const views = investmentChart(inflated).views;
  expect(views.map((view) => view.label)).toEqual(['Nominal', "Today's dollars"]);
  inflated.series.forEach((p, i) => expect(views[1].points[i].values[0]).toBe(p.realPortfolio));
});

it('retirement separates phases, exposes lossless tooltip fields and marks depletion', () => {
  const r = calculateRetirement({ currentAge: 60, retirementAge: 65, currentSavings: 10000, monthlyContribution: 0, annualReturnPercent: 0, monthlyNeed: 5000, lifeExpectancy: 90 });
  const [a, d] = retirementChart(r).views;
  expect(a.points.at(-1)!.values[0]).toBe(r.nestEgg);
  expect(a.points.at(-1)!.values[1]).toBe(r.totalContributions);
  expect(a.points.at(-1)!.values[2]).toBe(r.investmentGrowth);
  expect(d.points[0].values[0]).toBe(r.nestEgg);
  expect(d.points.slice(1).map((p) => p.values[0])).toEqual(r.series.filter((p) => p.phase === 'drawdown').map((p) => p.value));
  expect(d.points.at(-1)!.values[0]).toBe(0);
  expect(d.markers!.at(-1)!.index).toBe(d.points.length - 1);
  expect(retirementChart(r).summary).toMatch(/Portfolio reaches \$0/);
});

it('savings retains yearly engine values, signed growth and only reached milestones', () => {
  const r = calculateSavingsGoal({ goalAmount: 10000, alreadySaved: 1000, years: 1.5, annualReturnPercent: -12 });
  const v = savingsChart(r).views[0];
  const yearly = r.series.filter((p, i, series) => i === 0 || i === series.length - 1 || Number.isInteger(p.year));
  expect(v.points).toHaveLength(yearly.length);
  yearly.forEach((p, i) => expect(v.points[i].values.slice(0, 2)).toEqual([p.value, p.goal]));
  expect(v.points.at(-1)!.values[4]).toBeCloseTo(r.interestEarned, 8);
  expect(v.points.at(-1)!.label).toBe('Year 1.5');
  expect(v.markers![0]).toMatchObject({ label: 'Today', index: 0, emphasis: true });
  expect(v.markers!.at(-1)).toMatchObject({ label: 'Goal date', index: v.points.length - 1, emphasis: true });
  expect(v.markers!.filter((m) => m.label.includes('%')).map((m) => m.index)).toEqual(
    r.milestones.filter((m) => m.year !== null).map((m) => yearly.findIndex((p) => p.year === m.year)).filter((index) => index > 0 && index < yearly.length - 1),
  );
});

it('loan uses paired engine balances including post-payoff zero and horizon states', () => {
  const r = calculateLoanPayoff({ balance: 1201, annualRatePercent: 0, monthlyPayment: 1, extraPayment: 100 });
  const v = loanChart(r).views[0];
  expect(v.points).toHaveLength(r.series.length);
  r.series.forEach((p, i) => expect(v.points[i].values.slice(0, 2)).toEqual([p.standardBalance, p.extraBalance]));
  expect(v.points.at(-1)!.values.slice(0, 2)).toEqual([1, 0]);
  expect(v.markers![0]).toMatchObject({ label: 'Start', index: 0 });
  expect(v.markers!.filter((m) => m.label.includes('payoff'))).toHaveLength(1);
});

it.each(['snowball', 'avalanche'] as const)('debt stack matches total debt for %s, preserving payoff markers', (method) => {
  const r = calculateDebtSnowball({ debts: defaultDebts, monthlyBudget: 800, method });
  const v = debtChart(r).views[0];
  r.series.forEach((p, i) => {
    expect(v.points[i].values.slice(0, -1)).toEqual(p.balances);
    expect(v.points[i].values.slice(0, -1).reduce<number>((s, n) => s + n!, 0)).toBeCloseTo(p.total, 8);
  });
  expect(v.points.at(-1)!.values.at(-1)).toBe(0);
  expect(v.markers![0]).toMatchObject({ label: 'Start', index: 0 });
  expect(v.markers!.filter((m) => m.label.includes('paid off')).map((m) => m.index)).toEqual(r.payoffOrder.map((p) => p.months));
});

it('budget category aggregation reconciles and deficit remains signed', () => {
  const r = calculateBudget({ monthlyIncome: 1000, categories: defaultBudgetCategories });
  const views = budgetChart(r).views;
  for (const v of views) expect(v.points.reduce((s, p) => s + p.values[0]!, 0)).toBe(r.expenses);
  expect(budgetAllocation(r).views[0].points.at(-1)!.values[0]).toBe(r.surplus);
  const zero = budgetChart(calculateBudget({ monthlyIncome: 0, categories: [{ name: 'Food', amount: 100 }] }));
  expect(zero.views[0].points[0].values[2]).toBeNull();
});

it('salary stacked segments reconcile to gross without a state tax series', () => {
  const r = calculateSalary({ mode: 'salary', annualSalary: 75000, hoursPerWeek: 40, weeksPerYear: 52, filingStatus: 'single', traditional401k: 10000, healthInsurance: 2000, taxYear: 2026 });
  const [pay] = salaryChart(r).views;
  const plotted = pay.columns.map((column, index) => ({ column, index })).filter((item) => item.column.plot !== false);
  expect(salaryChart(r).views).toHaveLength(1);
  expect(plotted.reduce((sum, item) => sum + Number(pay.points[0].values[item.index]), 0)).toBeCloseTo(r.annualSalary, 8);
  expect(pay.points[0].values).toContain(r.netAnnual);
  expect(pay.points[0].values).toContain(r.federalTax);
  expect(pay.points[0].values).toContain(r.socialSecurity);
  expect(pay.points.some((p) => /state/i.test(p.label))).toBe(false);
  expect(pay.columns.some((column) => /state/i.test(column.label))).toBe(false);
});

it('net worth separates snapshot composition and projection with assets and liabilities', () => {
  const assets = sumLedger(defaultAssets);
  const debts = sumLedger(defaultLiabilities);
  const v = netWorthChart(assets, debts, groupLedger(defaultAssets)).views;
  expect(v[0].points.map((p) => p.values[0])).toEqual([assets, debts]);
  expect(v[1].points.reduce((s, p) => s + p.values[0]!, 0)).toBe(assets);
  const r = calculateNetWorth({ assets, debts, monthlySavings: 500, monthlyDebtPaydown: 500, assetReturnPercent: 6, debtInterestPercent: 5, years: 1.5 });
  expect(netWorthProjection(r).views[0].points.map((p) => p.values)).toEqual(r.series.map((p) => [p.netWorth, p.assets, p.liabilities]));
});

it('rent/buy maps selected horizon and crossover exactly and excludes invested resources from costs', () => {
  const r = calculateRentVsBuy({ homePrice: 400000, downPaymentPercent: 20, mortgageRatePercent: 6.5, monthlyRent: 2200, appreciationPercent: 3, investmentReturnPercent: 7, rentIncreasePercent: 3.5, yearsToStay: 10.5 });
  const [v, costs] = rentBuyChart(r).views;
  expect(v.points).toHaveLength(r.series.length);
  r.series.forEach((p, i) => expect(v.points[i].values.slice(0, 2)).toEqual([p.buyNetWorth, p.rentNetWorth]));
  const horizon = v.markers!.find((m) => m.label === 'Selected horizon')!;
  expect(horizon.chip).toMatch(/Selected horizon/);
  expect(v.points[horizon.index].values.slice(0, 2)).toEqual([r.buyAtHorizon, r.rentAtHorizon]);
  if (r.breakevenYear !== null) {
    const crossover = v.markers!.find((m) => m.label.includes('crossover'))!;
    expect(crossover.index).toBe(r.series.findIndex((p) => p.year === r.breakevenYear));
    expect(crossover.chip).toMatch(/First crossover/);
  }
  expect(costs.points.some((p) => /invested|down payment/i.test(p.label))).toBe(false);
});

it('chart series use semantic category tones rather than winner-loss colors', () => {
  const mortgage = mortgageChart(calculateMortgage({ homePrice: 320000, downPayment: 64000, annualRatePercent: 6.5, termYears: 30 }));
  expect(mortgage.views[0].columns[0].tone).toBe('primary');
  expect(mortgage.views[1].columns.map((c) => c.tone)).toEqual(['primary', 'cost', undefined]);
  const investment = investmentChart(calculateInvestment({ startingAmount: 10000, monthlyContribution: 500, annualReturnPercent: 7, years: 10 }));
  expect(investment.views[0].columns.map((c) => c.tone)).toEqual(['primary', 'growth', undefined]);
  const savings = savingsChart(calculateSavingsGoal({ goalAmount: 20000, alreadySaved: 5000, years: 3, annualReturnPercent: 5 }));
  expect(savings.views[0].columns[0].tone).toBe('primary');
  expect(savings.views[0].columns[1]).toMatchObject({ tone: 'neutral', dashed: true });
  const loan = loanChart(calculateLoanPayoff({ balance: 25000, annualRatePercent: 6, monthlyPayment: 400, extraPayment: 100 }));
  expect(loan.views[0].columns.map((c) => c.tone)).toEqual(['neutral', 'primary', undefined]);
  const rent = rentBuyChart(calculateRentVsBuy({ homePrice: 400000, downPaymentPercent: 20, mortgageRatePercent: 6.5, monthlyRent: 2200, appreciationPercent: 3, investmentReturnPercent: 7, rentIncreasePercent: 3.5, yearsToStay: 10 }));
  expect(rent.views[0].columns.map((c) => c.tone)).toEqual(['primary', 'growth', undefined]);
  expect(rent.views[1].columns.map((c) => c.tone)).toEqual(['primary', 'growth']);
});
