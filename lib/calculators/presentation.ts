import type { CalculatorSlug } from './catalog';

export const calculatorOutputs: Record<CalculatorSlug, string[]> = {
  mortgage: ['Monthly payment', 'Total interest', 'Amortization schedule'],
  'compound-interest': ['Future balance', 'Contributions vs growth', 'Inflation-adjusted value'],
  'salary-hourly': ['Salary and hourly equivalents', 'Federal tax and FICA', 'Estimated take-home pay'],
  'loan-payoff': ['Payoff date', 'Interest costs', 'Extra-payment comparison'],
  'net-worth': ['Assets and liabilities', 'Current net worth', 'Optional projection'],
  budget: ['Spending breakdown', 'Remaining cash flow', 'Remaining-income rate'],
  retirement: ['Projected retirement balance', 'Spending target', 'Drawdown illustration'],
  'savings-goal': ['Monthly contribution', 'Savings milestones', 'Progress toward the goal'],
  'debt-snowball': ['Snowball vs avalanche', 'Payoff order', 'Debt-free timeline'],
  'rent-vs-buy': ['Buyer and renter positions', 'Housing costs', 'Crossover estimate'],
};
