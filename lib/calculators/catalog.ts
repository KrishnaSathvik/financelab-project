import { financialSources, sourceLinks } from "@/lib/sources";
export const calculatorSlugs = [
  "mortgage",
  "compound-interest",
  "salary-hourly",
  "loan-payoff",
  "net-worth",
  "budget",
  "retirement",
  "savings-goal",
  "debt-snowball",
  "rent-vs-buy",
] as const;

export type CalculatorSlug = (typeof calculatorSlugs)[number];

export type CalculatorCategoryId = "home" | "grow" | "manage";

export type CalculatorDefinition = {
  slug: CalculatorSlug;
  href: `/calculators/${CalculatorSlug}`;
  name: string;
  shortName: string;
  description: string;
  subtitle: string;
  intro: string;
  llmsSummary: string;
  title: string;
  metaDescription: string;
  icon: CalculatorSlug;
  category: CalculatorCategoryId;
  related: CalculatorSlug[];
  inputs: string[];
  formula: string;
  formulaNote: string;
  assumptions: string[];
  sources: { label: string; href: string }[];
  faqs: { question: string; answer: string }[];
  ogDescription: string;
  dataNote?: {
    label: string;
    value: string;
    sourceLabel: string;
    sourceHref: string;
  };
};

export const calculatorCategories: {
  id: CalculatorCategoryId;
  title: string;
  description: string;
  slugs: CalculatorSlug[];
}[] = [
  {
    id: "home",
    title: "Plan a Home",
    description: "Estimate housing costs and compare buying with renting under your own assumptions.",
    slugs: ["mortgage", "rent-vs-buy"],
  },
  {
    id: "grow",
    title: "Save & Grow",
    description: "Explore investment growth, retirement savings, goals and net worth.",
    slugs: ["compound-interest", "retirement", "savings-goal", "net-worth"],
  },
  {
    id: "manage",
    title: "Manage Your Money",
    description: "Compare income, expenses, loans and debt payoff using the numbers you enter.",
    slugs: ["budget", "salary-hourly", "loan-payoff", "debt-snowball"],
  },
];

export const calculators: Record<CalculatorSlug, CalculatorDefinition> = {
  mortgage: {
    slug: "mortgage",
    href: "/calculators/mortgage",
    name: "Mortgage Calculator",
    shortName: "Mortgage",
    description: "Estimate monthly principal and interest, total interest and amortization.",
    subtitle:
      "Estimate your monthly principal and interest payment and understand how your mortgage changes over time.",
    intro:
      "This calculator estimates monthly principal and interest payments for a fixed-rate mortgage using home price, down payment, interest rate and loan term.",
    llmsSummary: "Estimate monthly principal and interest, total interest and amortization.",
    title: "Mortgage Calculator — Monthly Payment & Amortization | MoneyBasis",
    metaDescription:
      "Calculate monthly mortgage principal and interest, total interest, total loan cost and an amortization schedule using your home price, down payment, rate and term.",
    icon: "mortgage",
    category: "home",
    related: ["rent-vs-buy", "savings-goal", "loan-payoff"],
    inputs: ["homePrice", "downPayment", "interestRate", "loanTerm"],
    formula: "M = P × r × (1 + r)^n / ((1 + r)^n − 1)",
    formulaNote:
      "Monthly mortgage payment uses the standard fixed-rate amortization formula, where P is the loan amount, r is the monthly interest rate, and n is the number of payments.",
    assumptions: [
      "Taxes, insurance, PMI and HOA fees are included only when you enter them on the Taxes & Fees tab.",
      "The rate is treated as a fixed annual percentage, compounded monthly.",
      "The schedule assumes every payment is made on time.",
    ],
    sources: sourceLinks("mortgage", "housing"),
    faqs: [
      { question: "How does a down payment change the result?", answer: "At a fixed home price, a larger down payment reduces the amount borrowed. Recalculate to compare the monthly payment and total interest." },
      { question: "Can I compare repayment schedules?", answer: "Open the detailed breakdown to inspect principal, interest, and remaining balance. Switch between yearly and monthly rows." },

      {
        question: "How do I calculate my monthly mortgage payment?",
        answer:
          "Use the standard amortization formula: M = P × r × (1+r)^n / ((1+r)^n − 1), where P is the loan amount, r is the monthly interest rate, and n is the total number of payments.",
      },
      {
        question: "Does this include taxes and insurance?",
        answer:
          "Principal and interest are always shown. Add property tax, insurance, HOA and PMI on the Taxes & Fees tab to see an estimated total monthly cost.",
      },
    ],
    ogDescription: "Monthly payment, amortization and total interest.",
  },
  "compound-interest": {
    slug: "compound-interest",
    href: "/calculators/compound-interest",
    name: "Compound Interest Calculator",
    shortName: "Compound Interest",
    description: "Explore how contributions and compound growth may affect an investment over time.",
    subtitle: "Explore how contributions and compound growth can affect an investment over time.",
    intro:
      "This calculator estimates the future value of an investment using the starting amount, recurring contributions, expected annual return and investment period you enter. Future returns are assumptions, not guarantees.",
    llmsSummary:
      "Estimate investment growth using a starting amount, recurring contributions, expected return and time period.",
    title: "Compound Interest Calculator — Investment Growth | MoneyBasis",
    metaDescription:
      "Estimate how an investment may grow over time using a starting amount, recurring contributions, expected annual return and investment period.",
    icon: "compound-interest",
    category: "grow",
    related: ["retirement", "savings-goal", "net-worth"],
    inputs: ["startingBalance", "monthlyContribution", "annualReturn", "years"],
    formula: "FV = PV × (1 + r)^n + PMT × ((1 + r)^n − 1) / r",
    formulaNote:
      "Future value uses monthly deposits and the monthly growth equivalent of the selected compounding frequency. PV is the starting balance, PMT is the monthly contribution, r is the monthly return, and n is the number of months. The annual return is a user-adjustable assumption, not a predicted market result.",
    assumptions: [
      "Returns are a user-adjustable assumption. The default is not a historical guarantee or a forecast.",
      "The input is a nominal annual return. For frequency k, monthly return is (1 + annual rate/k)^(k/12) − 1.",
      "Contributions are made at the end of each month.",
      "Taxes and fees are excluded. The optional inflation-adjusted value expresses purchasing power separately.",
    ],
    sources: sourceLinks("compound", "investment"),
    faqs: [
      { question: "Does the result include my starting amount?", answer: "Yes. Total contributed includes the starting balance and recurring deposits; growth is shown separately." },
      { question: "Can I compare different return assumptions?", answer: "Change the annual return while keeping contributions and years fixed. The chart updates the scenario; the assumed return is not a forecast." },

      {
        question: "How often does this calculator compound?",
        answer:
          "Monthly. Annual return is converted to a monthly rate so contributions and growth stay aligned with a typical investing calendar.",
      },
    ],
    ogDescription: "See how contributions and compound growth add up.",
  },
  "salary-hourly": {
    slug: "salary-hourly",
    href: "/calculators/salary-hourly",
    name: "Salary ↔ Hourly Calculator",
    shortName: "Salary",
    description: "Convert annual salary and hourly pay and estimate federal taxes and FICA.",
    subtitle: "Convert annual and hourly compensation and explore estimated federal tax and FICA deductions.",
    intro:
      "This calculator converts annual and hourly compensation and estimates federal income tax and FICA using the stated tax year. Tax estimates include the components explicitly shown in the calculator. State and local taxes are not included.",
    llmsSummary: "Convert annual and hourly compensation and estimate supported federal tax components.",
    title: "Salary to Hourly Calculator — Pay & Tax Estimate | MoneyBasis",
    metaDescription:
      "Convert salary to hourly pay or hourly pay to annual salary and estimate federal income tax and FICA using clearly stated tax-year assumptions.",
    icon: "salary-hourly",
    category: "manage",
    related: ["budget", "savings-goal", "retirement"],
    inputs: ["annualSalary", "hourlyWage", "hoursPerWeek", "filingStatus"],
    formula: "Estimated take-home pay = Gross pay − Entered deductions − Federal income tax − Social Security − Medicare",
    formulaNote:
      "Annualized estimate for one worker using the selected tax year, federal income tax, employee FICA and qualifying pretax deductions. It does not recreate W-4 withholding.",
    assumptions: [
      "The selected tax year defaults to 2026; 2025 is also supported. Sources accompany the selected year.",
      "Only the federal standard deduction is applied — no credits or itemized deductions.",
      "State/local taxes, credits and spouse income are excluded. MFJ assumes one worker.",
      "Social Security tax applies only up to the 2026 wage base of $184,500.",
      "Medicare is 1.45% plus 0.9% above $200,000 of Medicare wages for single/head-of-household or $250,000 for MFJ.",
    ],
    sources: sourceLinks("irs2026", "irs2025", "ssa", "medicare"),
    faqs: [
      { question: "Can I switch between monthly and annual pay?", answer: "After calculating, use Pay frequency to change the main result and breakdown. The supporting metrics explicitly labeled monthly remain monthly." },
      { question: "Which tax year does the estimate use?", answer: "The selected tax year appears in the form and above the result. Change the year to use that year\u2019s available data." },

      {
        question: "Does this include state tax?",
        answer:
          "No. State and local taxes are excluded. This estimate models federal income tax and employee FICA only.",
      },
    ],
    ogDescription: "Hourly, annual and estimated take-home pay for tax year 2026.",
    dataNote: {
      label: "Tax year",
      value: "2026",
      sourceLabel: "Internal Revenue Service",
      sourceHref: financialSources.irs2026.url,
    },
  },
  "loan-payoff": {
    slug: "loan-payoff",
    href: "/calculators/loan-payoff",
    name: "Loan Payoff Calculator",
    shortName: "Loan Payoff",
    description: "Estimate payoff time, interest and the effect of additional payments.",
    subtitle: "Estimate how long a loan may take to repay and see how additional payments can change the result.",
    intro:
      "This calculator estimates how long a loan may take to repay and how extra monthly payments can change payoff time and total interest.",
    llmsSummary: "Estimate loan payoff time, interest and the impact of additional payments.",
    title: "Loan Payoff Calculator — Payoff Time & Interest | MoneyBasis",
    metaDescription:
      "Estimate how long a loan may take to repay and see how additional monthly payments can change payoff time and total interest.",
    icon: "loan-payoff",
    category: "manage",
    related: ["debt-snowball", "budget", "mortgage"],
    inputs: ["balance", "interestRate", "monthlyPayment", "extraPayment"],
    formula: "Each month: interest = balance × r; principal = payment − interest.",
    formulaNote:
      "Payoff time is simulated month by month. If the payment does not cover interest, the loan cannot be paid off.",
    assumptions: [
      "Interest is charged monthly on the remaining balance.",
      "Extra payments go entirely to principal.",
      "Fees, deferments and variable rates are not modeled.",
    ],
    sources: sourceLinks("mortgage", "debt"),
    faqs: [
      { question: "How do I compare an extra payment?", answer: "Keep the balance, rate, and current payment fixed, then enter an extra monthly payment. The two chart lines compare the current and accelerated plans." },
      { question: "Where can I see the principal paid?", answer: "Expand the payoff schedule below the chart to inspect the displayed payments, principal, interest, and remaining balance." },

      {
        question: "Why does it say the payment is too low?",
        answer:
          "The monthly payment has to cover that month’s interest. If it does not, the balance grows instead of shrinking.",
      },
    ],
    ogDescription: "Payoff time, total interest and the impact of extra payments.",
  },
  "net-worth": {
    slug: "net-worth",
    href: "/calculators/net-worth",
    name: "Net Worth Calculator",
    shortName: "Net Worth",
    description: "Compare assets and liabilities and calculate your current net worth.",
    subtitle: "Calculate net worth by subtracting total liabilities from total assets.",
    intro:
      "Net worth is calculated by subtracting total liabilities from total assets. Current net worth is an arithmetic result. Any future projection is separate and depends on the growth and paydown assumptions you enter.",
    llmsSummary: "Calculate net worth from assets and liabilities.",
    title: "Net Worth Calculator — Assets & Liabilities | MoneyBasis",
    metaDescription:
      "Calculate your net worth by comparing assets and liabilities, then explore how changes in savings and debt may affect future estimates.",
    icon: "net-worth",
    category: "grow",
    related: ["retirement", "budget", "debt-snowball"],
    inputs: ["assets", "liabilities"],
    formula: "Net worth = Assets − Liabilities",
    formulaNote:
      "The optional projection applies your selected asset growth, savings, debt interest and debt-payment assumptions month by month. Extra debt payments are redirected to assets once debts reach zero.",
    assumptions: [
      "Asset returns and debt interest are constant user-selected assumptions, not forecasts.",
      "Savings and debt payments stay the same every month.",
      "Inflation and taxes are not modeled.",
    ],
    sources: sourceLinks("netWorth"),
    faqs: [
      { question: "Should I enter home equity or home value?", answer: "Enter the full home value as an asset and the mortgage balance as a liability. Using equity and subtracting the mortgage again would count the debt twice." },
      { question: "Are my entries automatically saved?", answer: "Use the device save control to save your records on this browser. Sharing inputs is a separate, optional action." },

      {
        question: "Is this a full financial plan?",
        answer:
          "No. It is a simplified snapshot and optional projection so you can see the direction of travel if savings, returns and debt payments stay roughly constant.",
      },
    ],
    ogDescription: "Assets, liabilities and a private net-worth snapshot.",
  },
  budget: {
    slug: "budget",
    href: "/calculators/budget",
    name: "Monthly Budget Planner",
    shortName: "Budget",
    description: "Compare monthly income and expenses and understand your remaining cash flow.",
    subtitle: "See where your monthly money goes and how much remains after expenses.",
    intro:
      "This planner compares monthly income and expenses, calculates remaining cash flow and shows a remaining-income rate based on the numbers you enter.",
    llmsSummary: "Compare monthly income and expenses and calculate remaining cash flow.",
    title: "Monthly Budget Planner — Income & Expense Calculator | MoneyBasis",
    metaDescription:
      "Build a simple monthly budget, compare income and expenses, calculate remaining cash flow and see your spending breakdown.",
    icon: "budget",
    category: "manage",
    related: ["savings-goal", "debt-snowball", "salary-hourly", "net-worth"],
    inputs: ["monthlyIncome", "expenseCategories"],
    formula: "Remaining-income rate = (income − expenses) / income",
    formulaNote:
      "Surplus is take-home income minus the categories you enter. The remaining-income rate is remaining cash flow divided by income; it is unavailable at zero income. Remaining cash is not automatically savings.",
    assumptions: [
      "Enter after-tax income. Annual bills should be converted to monthly amounts.",
      "Categories are monthly cash amounts, not annual totals.",
    ],
    sources: sourceLinks("budget"),
    faqs: [
      { question: "How should I enter an annual bill?", answer: "Divide the annual amount by 12 to include a monthly equivalent in the budget." },
      { question: "Does remaining income mean I have saved it?", answer: "No. Remaining income is income minus entered expenses. It becomes savings only when you set it aside." },

      {
        question: "What does the remaining-income rate measure?",
        answer:
          "It is remaining cash flow divided by income. It is not a savings rate: remaining cash is only savings when you explicitly set it aside.",
      },
    ],
    ogDescription: "Monthly income, expenses, cash flow and remaining-income rate.",
  },
  retirement: {
    slug: "retirement",
    href: "/calculators/retirement",
    name: "Retirement Calculator",
    shortName: "Retirement",
    description: "Estimate retirement savings based on contributions, time and return assumptions.",
    subtitle: "Explore how your savings could change between now and retirement under different assumptions.",
    intro:
      "This calculator estimates retirement savings using your age, current balance, contributions, retirement age and expected-return assumptions. Projected values are estimates, not guaranteed outcomes.",
    llmsSummary: "Estimate future retirement savings based on contributions, time and return assumptions.",
    title: "Retirement Calculator — Estimate Future Savings | MoneyBasis",
    metaDescription:
      "Estimate retirement savings using your age, current balance, contributions, retirement age and expected-return assumptions.",
    icon: "retirement",
    category: "grow",
    related: ["compound-interest", "savings-goal", "net-worth"],
    inputs: ["currentAge", "retirementAge", "currentSavings", "monthlyContribution", "annualReturn"],
    formula: "Estimated withdrawal ≈ nest egg × selected withdrawal rate / 12",
    formulaNote:
      "Accumulation uses nominal annual returns compounded monthly. Withdrawal rate is an adjustable planning assumption, not guaranteed income. Monthly spending is entered in today’s dollars and inflated to retirement, then raised annually.",
    assumptions: [
      "Contributions continue until retirement age.",
      "The expected return is a user-adjustable assumption, not a predicted market result.",
      "The drawdown illustration uses a nominal annual return capped at 5% as a planning assumption. It is not a forecast.",
      "Social Security, pensions and taxes are excluded. Inflation adjusts the spending target; portfolio charts show future nominal dollars.",
    ],
    sources: sourceLinks("retirement"),
    faqs: [
      { question: "What does the target line mean?", answer: "It shows the balance implied by your desired monthly income and selected withdrawal rate. Both remain assumptions, not guarantees." },
      { question: "Can I change the retirement age?", answer: "Yes. Changing retirement age changes how long you contribute before the modeled withdrawal phase." },

      {
        question: "What is the 4% rule for retirement?",
        answer:
          "The 4% rule comes from the 1998 Trinity Study. It says withdrawing 4% of a retirement portfolio in the first year, then adjusting for inflation, historically sustained many 30-year retirements with a stock/bond mix. It is a historical heuristic, not a promise.",
      },
    ],
    ogDescription: "Estimate your future retirement savings.",
  },
  "savings-goal": {
    slug: "savings-goal",
    href: "/calculators/savings-goal",
    name: "Savings Goal Calculator",
    shortName: "Savings Goal",
    description: "Estimate how much to save each month toward a financial goal.",
    subtitle: "Estimate the monthly savings that may reach a target under the assumptions you enter.",
    intro:
      "This calculator estimates how much you may need to save each month to reach a target amount based on current savings, time horizon and a return assumption.",
    llmsSummary: "Estimate the monthly savings needed to reach a specified financial goal.",
    title: "Savings Goal Calculator — Monthly Savings Planner | MoneyBasis",
    metaDescription:
      "Estimate how much you may need to save each month to reach a target amount based on your current savings, time horizon and return assumption.",
    icon: "savings-goal",
    category: "grow",
    related: ["compound-interest", "budget", "retirement"],
    inputs: ["goalAmount", "currentSavings", "years", "annualReturn"],
    formula: "Future gap = Goal − Current savings × (1 + r)^n\nMonthly contribution = max(0, Future gap) / Contribution growth factor\nContribution growth factor = ((1 + r)^n − 1) / r; at r = 0, use n",
    formulaNote:
      "MoneyBasis first projects the savings you already have. It then calculates the recurring end-of-month contribution needed to cover the remaining future gap. Here r is the nominal annual return divided by 12, and n is the number of months. The return is an assumption, not a forecast.",
    assumptions: [
      "Returns compound monthly and stay constant at the rate you enter.",
      "You already have some savings that continues to earn the same assumed return.",
    ],
    sources: sourceLinks("savings", "compound"),
    faqs: [
      { question: "What if I have already saved part of the goal?", answer: "Enter that amount in Already saved. The calculation starts with that balance and estimates contributions for the remaining target." },
      { question: "What happens if I change the time available?", answer: "The required monthly contribution updates with the new timeline. Compare a zero-return scenario to see the contribution needed without assumed growth." },

      {
        question: "What if I already have enough?",
        answer:
          "If today’s savings can grow to the goal on its own under the return you entered, the required monthly amount is zero.",
      },
    ],
    ogDescription: "Monthly savings needed to reach a specific goal.",
  },
  "debt-snowball": {
    slug: "debt-snowball",
    href: "/calculators/debt-snowball",
    name: "Debt Snowball Calculator",
    shortName: "Debt Snowball",
    description: "Create an estimated debt payoff schedule based on balance-first repayment.",
    subtitle:
      "Organize debts from smallest balance to largest and estimate a snowball payoff schedule. This method is not universally best.",
    intro:
      "This calculator estimates a debt payoff schedule using your entered minimum payments, total monthly debt budget and selected snowball or avalanche method.",
    llmsSummary: "Estimate a debt payoff schedule using the debt snowball method.",
    title: "Debt Snowball Calculator — Debt Payoff Planner | MoneyBasis",
    metaDescription:
      "Organize debts from smallest balance to largest and estimate a debt snowball payoff schedule using your balances, rates and monthly payment budget.",
    icon: "debt-snowball",
    category: "manage",
    related: ["loan-payoff", "budget", "net-worth"],
    inputs: ["debts", "monthlyBudget", "payoffMethod"],
    formula: "1. Interest is added to each active balance.\n2. Required minimum payments are reserved.\n3. Remaining budget goes to the selected priority debt.\n4. Any unused payment rolls to the next debt in the same month.",
    formulaNote:
      "Snowball prioritizes the smallest balance in the starting payoff order. Avalanche prioritizes the highest APR. Minimum payments are reserved for all active debts before extra payments follow the selected order.",
    assumptions: [
      "The minimum payment entered for each debt is used throughout payoff, capped at the amount owed.",
      "The monthly budget is the total you can put toward all debts.",
      "The total monthly budget must cover entered minimum payments before a schedule can be calculated.",
    ],
    sources: sourceLinks("debt"),
    faqs: [
      { question: "How do I compare snowball and avalanche?", answer: "Keep the same debts and monthly budget, then switch methods. Compare payoff order, duration, and total interest." },
      { question: "Why is my budget too low?", answer: "The monthly budget must cover the entered minimum payments. Increase it or correct the minimums before interpreting a payoff estimate." },

      {
        question: "How does the debt snowball method work?",
        answer:
          "You pay minimums on every debt and put extra money toward the smallest balance. When that one is gone, you roll the payment into the next smallest debt.",
      },
    ],
    ogDescription: "Smallest-balance-first payoff plan and debt-free timeline.",
  },
  "rent-vs-buy": {
    slug: "rent-vs-buy",
    href: "/calculators/rent-vs-buy",
    name: "Rent vs Buy Calculator",
    shortName: "Rent vs Buy",
    description: "Compare estimated long-term outcomes of buying versus renting and investing.",
    subtitle: "Compare two financial scenarios using your own assumptions.",
    intro:
      "This calculator compares estimated long-term financial outcomes of renting versus buying using home price, mortgage rate, rent, appreciation and investment-return assumptions. It does not conclude that buying or renting is universally better.",
    llmsSummary: "Compare estimated financial outcomes of renting and buying under selected assumptions.",
    title: "Rent vs Buy Calculator — Compare Long-Term Costs | MoneyBasis",
    metaDescription:
      "Compare estimated long-term financial outcomes of renting versus buying using home price, mortgage rate, rent, appreciation and investment-return assumptions.",
    icon: "rent-vs-buy",
    category: "home",
    related: ["mortgage", "compound-interest", "savings-goal"],
    inputs: ["homePrice", "downPayment", "interestRate", "monthlyRent", "years"],
    formula: "Buyer net worth = home value − loan balance + owner portfolio; renter net worth = renter portfolio.",
    formulaNote:
      "Both sides start with equal resources. The renter invests the down payment and closing costs; the buyer starts with down-payment equity. Each month whichever side spends less invests the difference. Appreciation, rent growth and investment returns are user-adjustable assumptions, not forecasts.",
    assumptions: [
      "Closing costs are estimated at 3% of the home price as a planning default.",
      "Annual property tax is 1.2% of the original price, scaled with appreciation, as a planning default — not a sourced local tax rate.",
      "Insurance is 0.5% and maintenance is 1.0% of the original price, also scaled.",
      "The loan has your selected fixed term; payments stop at payoff. Returns use nominal annual rates divided by 12. Appreciation is effective annual growth.",
      "Selling costs, tax deductions and moving costs are not modeled.",
    ],
    sources: sourceLinks("mortgage", "housing"),
    faqs: [
      { question: "Why can the crossover be later than my selected horizon?", answer: "The crossover searches at least 30 years, or your longer selected horizon, and can reverse later. The two headline positions still show only your selected year." },
      { question: "What does renting plus investing represent?", answer: "The renter scenario includes investing the modeled upfront and ongoing savings relative to buying, using your selected return assumption." },

      {
        question: "Is it better to rent or buy a home?",
        answer:
          "It depends on prices, rates, rent, how long you stay, and investment returns. This calculator compares buyer equity with a renter’s investment portfolio using the assumptions you enter. Those assumptions are not predictions.",
      },
    ],
    ogDescription: "Compare long-term renting and buying costs using your assumptions.",
  },
};

export const calculatorList = calculatorSlugs.map((slug) => calculators[slug]);

export type CalculatorFilter = "home" | "investing" | "retirement" | "budgeting" | "debt";

export const calculatorFilters: { id: "all" | CalculatorFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "home", label: "Home" },
  { id: "investing", label: "Investing" },
  { id: "retirement", label: "Retirement" },
  { id: "budgeting", label: "Budgeting" },
  { id: "debt", label: "Debt" },
];

export const calculatorTags: Record<CalculatorSlug, CalculatorFilter[]> = {
  mortgage: ["home"],
  "rent-vs-buy": ["home"],
  "compound-interest": ["investing"],
  retirement: ["retirement"],
  "savings-goal": ["investing"],
  "net-worth": ["investing"],
  budget: ["budgeting"],
  "salary-hourly": ["budgeting"],
  "loan-payoff": ["debt"],
  "debt-snowball": ["debt"],
};

export function getCalculator(slug: string) {
  if (isCalculatorSlug(slug)) return calculators[slug];
  return null;
}

export function isCalculatorSlug(slug: string): slug is CalculatorSlug {
  return calculatorSlugs.some((item) => item === slug);
}

export function relatedCalculators(slug: CalculatorSlug) {
  return calculators[slug].related.map((item) => calculators[item]);
}
