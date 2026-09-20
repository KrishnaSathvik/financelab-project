export type FieldError = { field: string; message: string };
export type Warning = FieldError;
export type ValidationResult = { valid: true; warnings: Warning[] } | { valid: false; errors: FieldError[] };
export type Model = 'mortgage' | 'investment' | 'salary' | 'loan-payoff' | 'net-worth' | 'budget' | 'retirement' | 'savings-goal' | 'debt' | 'rent-buy';
type Rule = { min?: number; max?: number; optional?: boolean; months?: boolean; integer?: boolean; choices?: readonly unknown[]; text?: boolean };
const money: Rule = { min: 0, max: 1e12 };
const optionalMoney: Rule = { ...money, optional: true };
const rate: Rule = { min: 0, max: 100 };
const growth: Rule = { min: -99.99, max: 100 };
const optionalGrowth: Rule = { ...growth, optional: true };
const term: Rule = { min: 1 / 12, max: 100, months: true };
const horizon: Rule = { ...term, min: 0 };
const schemas: Record<Model, Record<string, Rule>> = {
  mortgage: { homePrice: money, downPayment: money, annualRatePercent: rate, termYears: term, annualPropertyTax: optionalMoney, annualInsurance: optionalMoney, monthlyHoa: optionalMoney, monthlyPmi: optionalMoney },
  investment: { startingAmount: money, monthlyContribution: money, annualReturnPercent: growth, years: horizon, compoundingFrequency: { optional: true, choices: ['annually', 'semiannually', 'quarterly', 'monthly', 'daily'] }, contributionIncreasePercent: optionalGrowth, inflationPercent: optionalGrowth },
  salary: { mode: { choices: ['salary', 'hourly'] }, annualSalary: optionalMoney, hourlyRate: optionalMoney, hoursPerWeek: { min: 0.01, max: 168 }, weeksPerYear: { min: 0.01, max: 52 }, filingStatus: { choices: ['single', 'mfj', 'hoh'] }, taxYear: { optional: true, choices: [2025, 2026] }, state: { optional: true, choices: ['NONE'] }, traditional401k: optionalMoney, healthInsurance: optionalMoney, otherPretax: optionalMoney },
  'loan-payoff': { balance: money, annualRatePercent: rate, monthlyPayment: money, extraPayment: money, oneTimeExtra: optionalMoney, startMonth: { min: 1, max: 1200, integer: true, optional: true } },
  'net-worth': { assets: money, debts: money, monthlySavings: money, monthlyDebtPaydown: money, assetReturnPercent: growth, debtInterestPercent: rate, years: { ...horizon, optional: true } },
  budget: { monthlyIncome: money },
  retirement: { currentAge: horizon, retirementAge: horizon, currentSavings: money, monthlyContribution: money, annualReturnPercent: growth, monthlyNeed: money, inflationPercent: optionalGrowth, contributionIncreasePercent: optionalGrowth, withdrawalRatePercent: { ...rate, optional: true }, lifeExpectancy: { min: 0, max: 120, months: true, optional: true } },
  'savings-goal': { goalAmount: money, alreadySaved: money, years: term, annualReturnPercent: growth },
  debt: { monthlyBudget: money, method: { optional: true, choices: ['snowball', 'avalanche'] } },
  'rent-buy': { homePrice: money, downPaymentPercent: rate, mortgageRatePercent: rate, monthlyRent: money, appreciationPercent: growth, investmentReturnPercent: growth, rentIncreasePercent: growth, loanTermYears: { ...term, optional: true }, annualPropertyTax: optionalMoney, annualInsurance: optionalMoney, annualMaintenance: optionalMoney, closingCostPercent: { ...rate, optional: true }, monthlyRenterInsurance: optionalMoney, yearsToStay: { ...horizon, optional: true } },
};
export function validate(model: Model, value: unknown): ValidationResult {
  const errors: FieldError[] = [];
  const warnings: Warning[] = [];
  const fail = (field: string, message: string) => errors.push({ field, message });
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { valid: false, errors: [{ field: 'input', message: 'Enter a valid calculator input.' }] };
  const input = value as Record<string, unknown>;
  function check(field: string, value: unknown, rule: Rule) {
    if (value === undefined && rule.optional) return;
    if (rule.choices) { if (!rule.choices.includes(value)) fail(field, `Choose a supported ${field}.`); return; }
    if (rule.text) { if (typeof value !== 'string' || value.length > 200) fail(field, `${field} must be text of at most 200 characters.`); return; }
    if (typeof value !== 'number' || !Number.isFinite(value)) { fail(field, `${field} must be a finite number.`); return; }
    if (value < (rule.min ?? -Infinity) || value > (rule.max ?? Infinity)) fail(field, `${field} must be between ${rule.min} and ${rule.max}.`);
    if (rule.integer && !Number.isInteger(value)) fail(field, `${field} must be a whole number.`);
    if (rule.months && Math.abs(value * 12 - Math.round(value * 12)) > 1e-7) fail(field, `${field} must represent a whole number of months (for example, 1.5 years).`);
    if (/Return|appreciation/.test(field) && value > 15) warnings.push({ field, message: 'This is a high growth assumption.' });
  }
  for (const [field, rule] of Object.entries(schemas[model])) check(field, input[field], rule);
  function rows(field: string, fields: Record<string, Rule>, ids = false) {
    const list = input[field];
    if (!Array.isArray(list) || list.length > 100) { fail(field, `${field} must contain at most 100 rows.`); return []; }
    const seen = new Set();
    list.forEach((row, i) => {
      if (!row || typeof row !== 'object' || Array.isArray(row)) { fail(field, 'Each row must be an object.'); return; }
      for (const [key, rule] of Object.entries(fields)) check(`${field}.${i}.${key}`, row[key], rule);
      if (ids && (typeof row.id !== 'string' || !row.id || seen.has(row.id))) fail(`${field}.${i}.id`, 'Each row needs a unique nonempty ID.');
      seen.add(row.id);
    });
    return list;
  }
  if (model === 'budget') rows('categories', { name: { text: true }, amount: money });
  if (model === 'debt') {
    const debts = rows('debts', { id: { text: true }, name: { text: true }, balance: money, rate, minimumPayment: money }, true);
    const minimum = debts.reduce((sum, d) => sum + (d && d.balance > 0 ? Math.min(d.minimumPayment, d.balance * (1 + d.rate / 1200)) : 0), 0);
    if (typeof input.monthlyBudget === 'number' && (minimum - input.monthlyBudget > Math.abs(minimum) * Number.EPSILON * 32 || (input.monthlyBudget === 0 && debts.some(d => d?.balance > 0)))) fail('monthlyBudget', 'Monthly budget must cover the active minimum payments and be positive when debt remains.');
  }
  if (model === 'mortgage' && Number(input.downPayment) > Number(input.homePrice)) fail('downPayment', 'Down payment cannot exceed the home price.');
  if (model === 'retirement') {
    if (Number(input.retirementAge) < Number(input.currentAge)) fail('retirementAge', 'Retirement age cannot precede current age.');
    if (Number(input.lifeExpectancy ?? 90) < Number(input.retirementAge)) fail('lifeExpectancy', 'Life expectancy cannot precede retirement age.');
  }
  if (model === 'salary') {
    const gross = input.mode === 'hourly' ? Number(input.hourlyRate) * Number(input.hoursPerWeek) * Number(input.weeksPerYear) : Number(input.annualSalary);
    if (!Number.isFinite(gross)) fail(input.mode === 'hourly' ? 'hourlyRate' : 'annualSalary', 'Enter gross pay for the selected mode.');
    const deductions = Number(input.traditional401k ?? 0) + Number(input.healthInsurance ?? 0) + Number(input.otherPretax ?? 0);
    if (deductions > gross) fail('deductions', 'Pretax deductions cannot exceed gross pay.');
  }
  return errors.length ? { valid: false, errors } : { valid: true, warnings };
}
export class InputValidationError extends Error {
  constructor(public errors: FieldError[]) { super(errors.map(e => e.message).join(' ')); this.name = 'InputValidationError'; }
}
export function assertValid(model: Model, input: unknown) {
  const result = validate(model, input);
  if (!result.valid) throw new InputValidationError(result.errors);
}

/** Saved net-worth ledgers and URL payloads use the same financial constraints as engines. */
export function validatePayload(model: Model, value: unknown): ValidationResult {
  if (model !== 'net-worth' || !value || typeof value !== 'object' || !Array.isArray((value as Record<string, unknown>).assets)) return validate(model, value);
  const input = value as Record<string, unknown>;
  const errors: FieldError[] = [];
  for (const key of ['assets', 'liabilities']) {
    const list = input[key];
    const ids = new Set();
    if (!Array.isArray(list) || list.length > 100) { errors.push({ field: key, message: 'Invalid ledger.' }); continue; }
    for (const item of list) {
      if (!item || typeof item.id !== 'string' || !item.id || ids.has(item.id) || typeof item.name !== 'string' || item.name.length > 200 || typeof item.group !== 'string' || item.group.length > 200 || typeof item.amount !== 'number' || !Number.isFinite(item.amount) || item.amount < 0 || item.amount > 1e12) errors.push({ field: key, message: 'Ledger rows need a unique ID, text labels, and a nonnegative finite amount.' });
      ids.add(item?.id);
    }
  }
  if (errors.length) return { valid: false, errors };
  const sum = (rows: unknown) => (rows as { amount: number }[]).reduce((s, r) => s + r.amount, 0);
  return validate(model, { ...input, assets: sum(input.assets), debts: sum(input.liabilities) });
}
export const modelForSlug: Record<string, Model> = { mortgage: 'mortgage', 'compound-interest': 'investment', 'salary-hourly': 'salary', 'loan-payoff': 'loan-payoff', 'net-worth': 'net-worth', budget: 'budget', retirement: 'retirement', 'savings-goal': 'savings-goal', 'debt-snowball': 'debt', 'rent-vs-buy': 'rent-buy' };
