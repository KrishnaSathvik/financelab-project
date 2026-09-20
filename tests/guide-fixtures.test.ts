import { describe, expect, it } from 'vitest';
import { calculateMortgage } from '@/lib/calculators/mortgage';
import { calculateInvestment } from '@/lib/calculators/investment';
import { calculateSalary } from '@/lib/calculators/salary';
import { simulateLoan } from '@/lib/calculators/loan-payoff';
import { calculateNetWorth } from '@/lib/calculators/net-worth';
import { calculateBudget } from '@/lib/calculators/budget';
import { calculateRetirement } from '@/lib/calculators/retirement';
import { calculateSavingsGoal } from '@/lib/calculators/savings-goal';
import { calculateDebtSnowball } from '@/lib/calculators/debt-snowball';
import { calculateRentVsBuy } from '@/lib/calculators/rent-vs-buy';
import fixtures from '@/lib/guides/fixtures.json';
const engines = { calculateMortgage, calculateInvestment, calculateSalary, simulateLoan, calculateNetWorth, calculateBudget, calculateRetirement, calculateSavingsGoal, calculateDebtSnowball, calculateRentVsBuy };
describe('independently derived guide examples against frozen engines', () => {
  for (const fixture of fixtures.cases) it(fixture.id, () => {
    const engine = engines[fixture.function as keyof typeof engines] as (...args: unknown[]) => unknown;
    const actual = engine(...fixture.args);
    for (const [path, expected] of Object.entries(fixture.expected)) {
      const value = path.split('.').reduce<unknown>((v, key) => Array.isArray(v) && key === 'last' ? v.at(-1) : (v as Record<string, unknown>)[key], actual);
      if (typeof expected === 'number') {
        expect(typeof value, path).toBe('number');
        expect(Math.abs(Number(value) - expected), `${fixture.id}: ${path}`).toBeLessThanOrEqual(path === 'months' ? 0 : fixture.tolerance);
      } else expect(value, path).toBe(expected);
    }
  });
});
it('keeps independent policy illustrations arithmetically reconciled', () => {
  const { exhibits: e } = fixtures;
  expect(e.sequence.rows[2]).toEqual([2, (100000 * 1.2 - 10000) * .8 - 10000, (100000 * .8 - 10000) * 1.2 - 10000]);
  expect(100000 * 1.2 * .8).toBe(96000);
  expect(e.gross.rows.reduce((sum, row) => sum + Number(row[1]), 0)).toBeCloseTo(75000, 8);
  for (const column of [1, 2]) expect(e.budget.rows.slice(0,3).reduce((s,r) => s+Number(r[column]),0)).toBe(5000);
  for (const row of e['savings-rate'].rows) expect(Number(row[1]) / Number(row[2]) * 100).toBeCloseTo(Number(row[3]), 8);
  for (const row of e['retirement-rates'].rows) expect(Number(row[1]) / 12).toBe(Number(row[2]));
  for (const row of e.retirement.rows) expect(Number(row[1])).toBeCloseTo(30000 * 1.03 ** (Number(row[0])-1), 6);
});

it('reconciles every plotted amortization, accumulation, debt and payoff point with the engines',()=>{
  const e=fixtures.exhibits;
  const run=(id:string)=>{const f=fixtures.cases.find(c=>c.id===id)!;return (engines[f.function as keyof typeof engines] as (...args:unknown[])=>unknown)(...f.args);};
  const mortgage=run('mortgage') as ReturnType<typeof calculateMortgage>;
  for(const row of e.mortgage.rows){const point=mortgage.years[Number(row[0])-1];[point.principal,point.interest,point.balance].forEach((v,i)=>expect(v).toBeCloseTo(Number(row[i+1]),2));}
  const investment=run('compound-monthly') as ReturnType<typeof calculateInvestment>;
  for(const row of e.compound.rows){const point=investment.series.find(p=>p.year===Number(row[0]))!;[point.contributed,point.growth,point.portfolio].forEach((v,i)=>expect(v).toBeCloseTo(Number(row[i+1]),2));}
  for(const method of ['snowball','avalanche'] as const){
    const debt=run(`debt-${method}`) as ReturnType<typeof calculateDebtSnowball>;
    for(const row of e[`debt-${method}`].rows){const priority=Number(row[1])-1;const item=debt.ordered[priority];expect(item.name).toBe(row[0]);expect(debt.ledger[0].allocations.find(a=>a.id===item.id)!.payment).toBeCloseTo(Number(row[2]),2);expect(debt.payoffOrder.find(d=>d.id===item.id)!.months).toBe(row[3]);}
  }
  for(const payment of [300,400] as const){
    const loan=run(`loan-${payment}`) as ReturnType<typeof simulateLoan>;
    for(const row of e[`loan-ledger-${payment}`].rows){const point=loan.schedule[Number(row[0])-1];[point.payment,point.interest,point.principal,point.remaining].forEach((v,i)=>expect(v).toBeCloseTo(Number(row[i+1]),2));}
    for(const row of e.loan.rows){const n=Number(row[0]);const balance=n===0?10000:loan.schedule[Math.min(n,loan.schedule.length)-1].remaining;expect(balance).toBeCloseTo(Number(row[payment===300?1:2]),2);}
  }
  const real=run('nominal-real') as ReturnType<typeof calculateInvestment>;
  for(const row of e.real.rows){const year=Number(row[0]);const amount=real.series.find(p=>p.year===year)!.portfolio;expect(amount).toBeCloseTo(Number(row[1]),2);expect(amount/1.03**year).toBeCloseTo(Number(row[2]),2);}
  const rent=run('rent-buy-11') as ReturnType<typeof calculateRentVsBuy>;
  for(const row of e['rent-buy'].rows){const year=Number(row[0]);if(year===0)continue;const ledger=rent.ledger[year*12-1];[ledger.homeValue-ledger.loanBalance,ledger.ownerPortfolio,ledger.homeValue-ledger.loanBalance+ledger.ownerPortfolio,ledger.renterPortfolio].forEach((v,i)=>expect(v).toBeCloseTo(Number(row[i+1]),2));}
});
