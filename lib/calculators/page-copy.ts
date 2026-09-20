import type { CalculatorSlug } from "@/lib/calculators/catalog";

export type CalculatorPageCopy = {
  howToUse: string[];
  resultTerms: { heading: string; body: string }[];
  definitions: { term: string; definition: string }[];
};

export const calculatorPageCopy: Record<CalculatorSlug, CalculatorPageCopy> = {
  mortgage: {
    howToUse: [
      "Enter the home price, down payment, interest rate and loan term.",
      "Optionally add property tax, homeowners insurance, HOA dues and PMI on the Taxes & Fees tab.",
      "Review the estimated monthly principal and interest payment, total interest and amortization schedule.",
    ],
    resultTerms: [
      {
        heading: "Principal",
        body: "Principal is the portion of each payment that reduces the outstanding loan balance.",
      },
      {
        heading: "Interest",
        body: "Interest is the cost charged by the lender for borrowing the remaining balance.",
      },
      {
        heading: "Loan balance",
        body: "The loan balance is the amount still owed after each payment is applied.",
      },
      {
        heading: "Amortization",
        body: "Amortization is the month-by-month split of each payment into principal and interest until the loan reaches zero.",
      },
    ],
    definitions: [
      {
        term: "Mortgage payment",
        definition:
          "A mortgage payment is the recurring payment used to repay a home loan. Principal reduces the outstanding loan balance, while interest is the cost charged by the lender for borrowing the money.",
      },
    ],
  },
  "compound-interest": {
    howToUse: [
      "Enter a starting balance, recurring contribution, annual return and investment period.",
      "The calculator compounds monthly so contributions and growth stay on the same calendar.",
      "Compare the ending balance with the amount you contributed to see estimated growth.",
    ],
    resultTerms: [
      {
        heading: "Future value",
        body: "The estimated ending balance after contributions and compound growth over the period you entered.",
      },
      {
        heading: "Total contributed",
        body: "Starting balance plus every recurring contribution made during the investment period.",
      },
      {
        heading: "Interest earned",
        body: "The difference between future value and total contributed. This is an estimate, not a guaranteed return.",
      },
    ],
    definitions: [
      {
        term: "Compound interest",
        definition:
          "Compound interest is growth calculated on both the original amount and accumulated growth from previous periods.",
      },
    ],
  },
  "salary-hourly": {
    howToUse: [
      "Enter an annual salary or hourly wage, hours per week and filing status.",
      "The calculator converts between annual and hourly pay, then estimates federal income tax and FICA for the stated tax year.",
      "State/local taxes are excluded. This is annualized liability, not W-4 withholding.",
    ],
    resultTerms: [
      {
        heading: "Gross pay",
        body: "Pay before federal income tax, FICA and qualifying pretax deductions.",
      },
      {
        heading: "Federal income tax",
        body: "Estimated using the stated IRS tax-year brackets after the standard deduction. Credits and itemized deductions are not applied.",
      },
      {
        heading: "FICA",
        body: "Social Security tax up to the wage base plus Medicare tax. Additional Medicare tax is not modeled.",
      },
      {
        heading: "Take-home pay",
        body: "Estimated net pay after the taxes included in this calculator.",
      },
    ],
    definitions: [
      {
        term: "Take-home pay",
        definition:
          "Take-home pay is estimated net income after the federal income tax, FICA and qualifying pretax deductions included in this calculator.",
      },
    ],
  },
  "loan-payoff": {
    howToUse: [
      "Enter the remaining balance, interest rate and current monthly payment.",
      "Add an extra monthly amount to see how payoff time and total interest change.",
      "Compare the original schedule with the extra-payment schedule.",
    ],
    resultTerms: [
      {
        heading: "Payoff time",
        body: "The estimated number of months until the balance reaches zero if payments continue as entered.",
      },
      {
        heading: "Interest saved",
        body: "The estimated reduction in total interest when extra payments are applied to principal.",
      },
      {
        heading: "Remaining balance",
        body: "The unpaid principal after each simulated month.",
      },
    ],
    definitions: [
      {
        term: "Extra payment",
        definition:
          "An extra payment is an amount above the required monthly payment. In this calculator, extra payments are applied entirely to principal.",
      },
    ],
  },
  "net-worth": {
    howToUse: [
      "Add assets such as cash, investments, retirement accounts and property.",
      "Add liabilities such as mortgages, student loans and other debts.",
      "Net worth is total assets minus total liabilities. An optional projection estimates how that position may change if savings, returns and paydown stay constant.",
    ],
    resultTerms: [
      {
        heading: "Assets",
        body: "What you own, entered at the values you provide.",
      },
      {
        heading: "Liabilities",
        body: "What you owe, entered at the balances you provide.",
      },
      {
        heading: "Net worth",
        body: "Total assets minus total liabilities.",
      },
    ],
    definitions: [
      {
        term: "Net worth",
        definition: "Net worth equals total assets minus total liabilities.",
      },
    ],
  },
  budget: {
    howToUse: [
      "Enter monthly take-home income and spending by category.",
      "The planner totals expenses, remaining cash flow and remaining-income rate.",
      "Remaining cash flow is the amount left after entered expenses. It is not counted as savings unless you explicitly allocate it to savings.",
    ],
    resultTerms: [
      {
        heading: "Income",
        body: "The monthly amount you entered. Use take-home pay unless you intentionally enter a pre-tax figure.",
      },
      {
        heading: "Expenses",
        body: "The sum of the spending categories you entered.",
      },
      {
        heading: "Remaining cash flow",
        body: "Income minus expenses. A negative result means spending exceeds income.",
      },
      {
        heading: "Remaining-income rate",
        body: "Remaining cash flow divided by income.",
      },
    ],
    definitions: [
      {
        term: "Remaining-income rate",
        definition:
          "MoneyBasis calculates remaining-income rate as the amount of income remaining after expenses divided by total income.",
      },
    ],
  },
  retirement: {
    howToUse: [
      "Enter current age, retirement age, current savings, contribution amount and expected return.",
      "The calculator estimates the nest egg at retirement using monthly compounding.",
      "A withdrawal rate, often 4%, is shown as a planning heuristic — not a guarantee.",
    ],
    resultTerms: [
      {
        heading: "Nest egg",
        body: "Estimated savings at retirement based on the contributions and return you entered.",
      },
      {
        heading: "Withdrawal estimate",
        body: "A planning amount based on the withdrawal rate you chose. The 4% rule is a historical heuristic, not a prediction.",
      },
    ],
    definitions: [
      {
        term: "4% rule",
        definition:
          "The 4% rule is a historical planning heuristic from the Trinity Study. It is a default assumption in this calculator unless you change the withdrawal rate, not a promised retirement income.",
      },
    ],
  },
  "savings-goal": {
    howToUse: [
      "Enter the target amount, current savings, time horizon and assumed return.",
      "The calculator solves for the monthly savings amount that may reach the goal under those assumptions.",
      "If current savings can grow to the goal on their own, the required monthly amount is zero.",
    ],
    resultTerms: [
      {
        heading: "Target",
        body: "The goal amount you want to reach.",
      },
      {
        heading: "Monthly savings needed",
        body: "The estimated recurring amount required to reach the target by the date you chose.",
      },
    ],
    definitions: [
      {
        term: "Required monthly savings",
        definition:
          "The monthly amount that, together with money already saved and the return you entered, is estimated to reach the goal in the time available.",
      },
    ],
  },
  "debt-snowball": {
    howToUse: [
      "Enter each debt’s name, balance, interest rate and, if you know it, the minimum payment.",
      "Enter the total monthly amount you can put toward all debts.",
      "The calculator pays the smallest balance first, keeps minimums on the rest, and rolls freed payments forward.",
    ],
    resultTerms: [
      {
        heading: "Payoff order",
        body: "Snowball prioritizes the smallest starting balance; avalanche prioritizes the highest APR. Both reserve minimums and roll unused payments forward within the same month.",
      },
      {
        heading: "Debt-free date",
        body: "The estimated month when every entered balance reaches zero if the monthly budget continues.",
      },
    ],
    definitions: [
      {
        term: "Debt snowball",
        definition:
          "The debt snowball method pays the smallest balance first while making minimum payments on every other debt, then rolls the freed payment into the next smallest balance.",
      },
    ],
  },
  "rent-vs-buy": {
    howToUse: [
      "Enter home price, down payment, mortgage rate, monthly rent and how long you expect to stay.",
      "Adjust rent growth, appreciation and investment-return assumptions. Those values are user-selected assumptions, not forecasts.",
      "Compare the buyer’s estimated home equity with a renter who invests the difference.",
    ],
    resultTerms: [
      {
        heading: "Buyer net position",
        body: "Estimated home value minus remaining mortgage balance. Selling costs and tax effects are not modeled.",
      },
      {
        heading: "Renter net position",
        body: "Estimated portfolio built by investing the down payment, closing-cost estimate and monthly cost difference.",
      },
    ],
    definitions: [
      {
        term: "Rent vs buy",
        definition:
          "This calculator compares estimated long-term financial outcomes of renting and buying using the prices, rates, rent, appreciation and investment-return assumptions you enter.",
      },
    ],
  },
};
