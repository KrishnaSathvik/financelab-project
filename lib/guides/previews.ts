import fixtures from './fixtures.json';

export type GuidePreview = {
  context: string;
  values: { label: string; value: string }[];
  takeaway: string;
};

const exhibits = fixtures.exhibits as Record<string, { rows: (number | string)[][] }>;
function money(exhibit: string, row: number, column: number) {
  const rows = exhibits[exhibit].rows;
  const amount = Number(rows.at(row)![column]);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

/** Preview numbers come from the same reviewed fixtures as the guide articles. */
export const guidePreviews: Record<string, GuidePreview> = {
  'mortgage-amortization': {
    context: '$320,000 loan · 6.5% fixed · 30 years',
    values: [
      { label: 'Year 1 interest', value: money('mortgage', 0, 2) },
      { label: 'Year 30 interest', value: money('mortgage', -1, 2) },
    ],
    takeaway: 'Same scheduled payment. More principal repaid over time.',
  },
  'rent-vs-buy-costs': {
    context: 'Two paths with equal starting resources',
    values: [
      { label: 'Buy', value: 'Equity + investments' },
      { label: 'Rent', value: 'Investment portfolio' },
    ],
    takeaway: 'Compare the full financial picture, beyond rent versus mortgage.',
  },
  'compound-interest': {
    context: '20 years · $10,000 + $500/month · 7% nominal, compounded monthly',
    values: [
      { label: 'Contributed', value: money('compound', -1, 1) },
      { label: 'Modeled growth', value: money('compound', -1, 2) },
      { label: 'Future balance', value: money('compound', -1, 3) },
    ],
    takeaway: 'Separate the money you add from the growth you assume.',
  },
  'how-much-to-save': {
    context: '$12,000 goal · $3,000 saved · no return assumed',
    values: [
      { label: '12 months', value: `${money('savings-zero', 0, 1)}/mo` },
      { label: '24 months', value: `${money('savings-zero', 1, 1)}/mo` },
      { label: '36 months', value: `${money('savings-zero', 2, 1)}/mo` },
    ],
    takeaway: 'Same funding gap. More time means a smaller monthly deposit.',
  },
  'nominal-vs-real-return': {
    context: '$10,000 over 10 years · 7% annual growth · 3% inflation',
    values: [
      { label: 'Future dollars', value: money('real', -1, 1) },
      { label: 'Today’s buying power', value: money('real', -1, 2) },
    ],
    takeaway: 'One future balance, viewed in two different dollar units.',
  },
  'apr-vs-apy': {
    context: 'Illustrative rates · separate examples',
    values: [
      { label: 'APR', value: '6.5%' },
      { label: 'APY', value: '5.00%' },
      { label: 'Investment return', value: '7.00%' },
    ],
    takeaway: 'Same “%” symbol. Different meaning.',
  },
  'salary-vs-hourly': {
    context: '40 hours per week · 52 paid weeks',
    values: [
      { label: 'Annual gross pay', value: money('pay-periods', 0, 1) },
      { label: 'Hourly equivalent', value: money('pay-periods', -1, 1) },
    ],
    takeaway: 'A different pay period changes the unit, not the salary.',
  },
  'gross-vs-net-pay': {
    context: '2026 example · one single worker · federal tax and FICA only',
    values: [
      { label: 'Annual gross pay', value: money('salary', 0, 1) },
      { label: 'Estimated net pay', value: money('salary', -1, 1) },
    ],
    takeaway: 'Follow the deductions between what you earn and what you keep.',
  },
  'monthly-budget': {
    context: 'Monthly example with an explicit $500 savings transfer',
    values: [
      { label: 'Income', value: money('budget', -1, 2) },
      { label: 'Expenses', value: money('budget', 0, 2) },
      { label: 'Unassigned cash', value: money('budget', 2, 2) },
    ],
    takeaway: 'Account for bills and savings before deciding what is left.',
  },
  'savings-rate-vs-cash-flow': {
    context: 'Same $5,000 monthly take-home income',
    values: [
      { label: 'Savings transfer', value: money('budget', 1, 2) },
      { label: 'Unassigned cash', value: money('budget', 2, 2) },
    ],
    takeaway: 'Money left over is only savings when you set it aside.',
  },
  'debt-snowball-vs-avalanche': {
    context: 'Two ways to prioritize extra debt payments',
    values: [
      { label: 'Snowball', value: 'Smallest balance' },
      { label: 'Avalanche', value: 'Highest APR' },
    ],
    takeaway: 'Reserve the minimums, then choose where the extra payment goes.',
  },
  'loan-prepayments': {
    context: '$10,000 loan · 12% annual rate',
    values: [
      { label: '$300 per month', value: `${exhibits['loan-comparison'].rows[0][1]} months` },
      { label: '$400 per month', value: `${exhibits['loan-comparison'].rows[1][1]} months` },
    ],
    takeaway: 'Extra principal reduces the balance that future interest is charged on.',
  },
  'net-worth': {
    context: 'Illustrative balance sheet · one date',
    values: [
      { label: 'Assets', value: money('net-worth', 0, 1) },
      { label: 'Liabilities', value: money('net-worth', 1, 1) },
      { label: 'Net worth', value: money('net-worth', 2, 1) },
    ],
    takeaway: 'What you own minus what you owe. A snapshot, not spendable cash.',
  },
  'four-percent-rule': {
    context: 'First-year withdrawal arithmetic · illustrative portfolio',
    values: [
      { label: 'Starting portfolio', value: '$750,000' },
      { label: 'Initial rate', value: '4%' },
      { label: 'First-year withdrawal', value: money('retirement-rates', 1, 1) },
    ],
    takeaway: 'An initial withdrawal rule, not a guarantee of lifelong income.',
  },
};
