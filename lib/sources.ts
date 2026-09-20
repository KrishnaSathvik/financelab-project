export type FinancialSource = {
  id: string;
  title: string;
  organization: string;
  url: string;
  publicationDate: string | null;
  effectiveYear: number | null;
  verifiedAt: string;
  jurisdiction: 'US';
  supports: string[];
};
const verifiedAt = '2026-09-18';
function source(id: string, title: string, organization: string, url: string, supports: string[], effectiveYear: number | null = null, publicationDate: string | null = null): FinancialSource {
  return { id, title, organization, url, supports, effectiveYear, publicationDate, verifiedAt, jurisdiction: 'US' };
}
export const financialSources = {
  irs2026: source('irs-rp-2025-32', 'Revenue Procedure 2025-32', 'Internal Revenue Service', 'https://www.irs.gov/pub/irs-drop/rp-25-32.pdf', ['2026 federal brackets', '2026 standard deduction', 'amended 2025 standard deduction'], 2026),
  irs2025: source('irs-rp-2024-40', 'Revenue Procedure 2024-40', 'Internal Revenue Service', 'https://www.irs.gov/pub/irs-drop/rp-24-40.pdf', ['2025 federal brackets; deduction amounts superseded by RP 2025-32'], 2025),
  ssa: source('ssa-wage-base', 'Contribution and Benefit Base', 'Social Security Administration', 'https://www.ssa.gov/oact/cola/cbb.html', ['2025 and 2026 Social Security wage bases', 'employee Social Security rate']),
  medicare: source('irs-additional-medicare', 'Topic 560: Additional Medicare Tax', 'Internal Revenue Service', 'https://www.irs.gov/taxtopics/tc560', ['Additional Medicare rate and filing-status thresholds', 'liability versus employer withholding']),
  mortgage: source('cfpb-amortization', 'How does paying down a mortgage work?', 'Consumer Financial Protection Bureau', 'https://www.consumerfinance.gov/ask-cfpb/how-does-paying-down-a-mortgage-work-en-1943/', ['principal and interest allocation', 'amortization explanation']),
  housing: source('cfpb-mortgage-terms', 'Mortgage answers: key terms', 'Consumer Financial Protection Bureau', 'https://www.consumerfinance.gov/consumer-tools/mortgages/answers/key-terms/', ['housing cost and mortgage terminology']),
  compound: source('investor-compound-interest', 'Compound Interest', 'SEC Investor.gov', 'https://www.investor.gov/introduction-investing/investing-basics/glossary/compound-interest', ['compound interest definition']),
  investment: source('investor-compound-calculator', 'Compound Interest Calculator', 'SEC Investor.gov', 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator', ['contribution and compounding inputs; MoneyBasis timing is defined separately']),
  netWorth: source('investor-finances', 'Figure Out Your Finances', 'SEC Investor.gov', 'https://www.investor.gov/introduction-investing/investing-basics/save-and-invest/figure-out-your-finances', ['assets minus liabilities', 'net-worth snapshot']),
  budget: source('cfpb-cash-flow', 'Creating a cash flow budget', 'Consumer Financial Protection Bureau', 'https://www.consumerfinance.gov/documents/10038/cfpb_creating-cash-flow-budget_tool_2021-08.pdf', ['cash-flow timing', 'remaining balance versus savings']),
  savings: source('cfpb-savings-plan', 'Savings plan', 'Consumer Financial Protection Bureau', 'https://files.consumerfinance.gov/f/201508_cfpb_savings-plan-tool.pdf', ['savings goals', 'periodic saving plans']),
  debt: source('cfpb-reducing-debt', 'Reducing debt worksheet', 'Consumer Financial Protection Bureau', 'https://www.consumerfinance.gov/documents/5782/cfpb_ymyg-toolkit_reducing-debt-worksheet.pdf', ['snowball priority', 'highest-interest priority', 'redirecting payments after payoff']),
  retirement: source('dol-retirement-preparation', 'Top 10 Ways to Prepare for Retirement', 'U.S. Department of Labor', 'https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/publications/top-10-ways-to-prepare-for-retirement', ['retirement preparation', 'estimating retirement needs; not validation of a withdrawal guarantee']),
  apr: source('cfpb-note-rate-apr', 'Mortgage interest rate versus APR', 'Consumer Financial Protection Bureau', 'https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-mortgage-interest-rate-and-an-apr-en-135/', ['note interest rate versus APR including specified borrowing charges']),
  recast: source('fannie-principal-payments', 'Processing Additional Principal Payments', 'Fannie Mae', 'https://servicing-guide.fanniemae.com/svc/c-1.2-01/processing-additional-principal-payments', ['principal curtailment and re-amortization over remaining term at current rate; applies to specified Fannie Mae loans']),
  apy: source('cfpb-apy-definition', 'Regulation DD: annual percentage yield definition', 'Consumer Financial Protection Bureau', 'https://www.consumerfinance.gov/rules-policy/regulations/1030/2/', ['APY includes interest and compounding; deposit yield differs from nominal rate']),
  pmi: source('cfpb-pmi', 'What is private mortgage insurance?', 'Consumer Financial Protection Bureau', 'https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-122/', ['PMI protects lender; separate from principal and interest']),
  fees: source('sec-investment-fees', 'How Fees and Expenses Affect Your Investment Portfolio', 'SEC Investor.gov', 'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/updated', ['fees reduce invested capital and subsequent compounding']),
  inflation: source('bls-purchasing-power', 'Purchasing power and constant dollars', 'U.S. Bureau of Labor Statistics', 'https://www.bls.gov/cpi/factsheets/purchasing-power-constant-dollars.htm', ['converting nominal dollars to constant purchasing-power dollars']),
  retirementTax: source('irs-retirement-fica', 'Retirement plan contributions and withholding', 'Internal Revenue Service', 'https://www.irs.gov/retirement-plans/retirement-plan-faqs-regarding-contributions-are-retirement-plan-contributions-subject-to-withholding-for-fica-medicare-or-federal-income-tax', ['traditional employee deferrals generally reduce federal wages but not Social Security or Medicare wages', 'employer contributions differ from employee deferrals']),
  cafeteria: source('irs-pub-15b-2026', 'Publication 15-B: Employer’s Tax Guide to Fringe Benefits', 'Internal Revenue Service', 'https://www.irs.gov/pub/irs-pdf/p15b.pdf', ['qualifying cafeteria-plan benefit exclusions depend on benefit and eligibility; not every payroll deduction is FICA-exempt'], 2026),
  bengen: source('bengen-1994', 'Determining Withdrawal Rates Using Historical Data', 'William P. Bengen / Journal of Financial Planning', 'https://www.financialplanningassociation.org/learning/publications/journal/OCT94-determining-withdrawal-rates-using-historical-data', ['1994 historical stock/bond withdrawal research; initial percentage followed by inflation adjustments; original publisher page requires sign-in'], null, '1994-10'),
  bengenText: source('bengen-1994-reprint', 'Bengen 1994: original paper scan (hosted reprint)', 'William P. Bengen / Journal of Financial Planning; scan hosted by freefincal', 'https://freefincal.com/wp-content/uploads/2023/10/Bengen1.pdf', ['accessible original paper; historical portfolio longevity, asset mix and inflation assumptions'], null, '1994-10'),
  trinity: source('trinity-1998', 'Retirement Savings: Choosing a Withdrawal Rate That Is Sustainable', 'Cooley, Hubbard and Walz / AAII Journal', 'https://www.aaii.com/journal/article/retirement-savings-choosing-a-withdrawal-rate-that-is-sustainable', ['1998 Trinity research; historical US stock/bond allocations and 15–30 year payout periods; taxes and transaction costs excluded'], null, '1998-02'),
  socialSecurityPlanning: source('ssa-retirement-planning', 'Plan for Retirement', 'Social Security Administration', 'https://www.ssa.gov/retirement/plan-for-retirement', ['personal benefit estimates and claiming age; benefits are separate from portfolio withdrawals']),
} satisfies Record<string, FinancialSource>;
export type SourceKey = keyof typeof financialSources;
export function sourceLinks(...keys: SourceKey[]) {
  return keys.map(key => ({ ...financialSources[key], label: financialSources[key].title, href: financialSources[key].url }));
}

export type SourceCategory = {
  id: string;
  title: string;
  description: string;
  keys: SourceKey[];
};

export const sourceCategories: SourceCategory[] = [
  { id: "income-taxes", title: "Income & taxes", description: "Year-specific federal tax references and payroll-tax rules.", keys: ["irs2026", "irs2025", "ssa", "medicare", "retirementTax", "cafeteria"] },
  { id: "home-borrowing", title: "Home & borrowing", description: "Mortgage terms, amortization, insurance and debt repayment.", keys: ["mortgage", "housing", "apr", "recast", "pmi", "debt"] },
  { id: "saving-investing", title: "Saving & investing", description: "Compounding, rates, investment costs and purchasing power.", keys: ["compound", "investment", "savings", "apy", "fees", "inflation"] },
  { id: "budget-net-worth", title: "Budget & net worth", description: "Cash flow, assets and liabilities.", keys: ["budget", "netWorth"] },
  { id: "retirement", title: "Retirement", description: "Planning resources and the historical research behind withdrawal rules.", keys: ["retirement", "bengen", "bengenText", "trinity", "socialSecurityPlanning"] },
];

