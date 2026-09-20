import { money as m, percent as pct } from "./numbers";
import type { GuideSection } from "./types";

export type CalloutTone = "info" | "example" | "caution";

export type GuideCalloutData = {
  tone: CalloutTone;
  body: string;
};

export type GuideFormulaData = {
  title: string;
  expression: string;
  symbols: { symbol: string; meaning: string }[];
};

export type GuideComparisonColumn = {
  title: string;
  kicker?: string;
  points: string[];
};

export type GuideMetric = {
  label: string;
  value: string;
};

export type GuideExampleData = {
  kicker?: string;
  title: string;
  setup?: string[];
  metrics: GuideMetric[];
};

export type GuideDefinitionData = {
  term: string;
  expansion?: string;
  body: string;
};

export type GuideChecklistData = {
  title?: string;
  steps: string[];
};

export type GuideSectionPresentation = {
  kicker?: string;
  definitions?: GuideDefinitionData[];
  formula?: GuideFormulaData;
  comparison?: { columns: GuideComparisonColumn[] };
  example?: GuideExampleData;
  callouts?: GuideCalloutData[];
  checklist?: GuideChecklistData;
};

export type GuideOpening = {
  id: string;
  heading: string;
  kicker?: string;
  comparison?: { columns: GuideComparisonColumn[] };
};

export type GuidePresentation = {
  opening?: GuideOpening;
  sections: Record<string, GuideSectionPresentation>;
  exercise: {
    steps: string[];
    notice?: string;
  };
};

export const guidePresentations: Record<string, GuidePresentation> = {
  "apr-vs-apy": {
    opening: {
      id: "four-rates",
      heading: "Four rates that look similar but mean different things",
      comparison: {
        columns: [
          {
            title: "Note rate",
            kicker: "Borrowing",
            points: ["Interest on the outstanding loan", "Used to amortize principal and interest"],
          },
          {
            title: "APR",
            kicker: "Borrowing",
            points: ["Broader annualized borrowing cost", "May include specified fees and charges"],
          },
          {
            title: "APY",
            kicker: "Deposits",
            points: ["Deposit-account annual yield", "Compounding is already reflected"],
          },
          {
            title: "Investment return",
            kicker: "Scenario",
            points: ["An assumed rate paired with a frequency", "Not a deposit contract or a forecast"],
          },
        ],
      },
    },
    sections: {
      borrowing: {
        definitions: [
          {
            term: "APR",
            expansion: "Annual Percentage Rate",
            body: "A standardized borrowing-cost measure that can include interest and certain additional loan costs.",
          },
        ],
        callouts: [
          {
            tone: "info",
            body: "Mortgage APR can differ from the note rate because it may include certain additional loan costs that the note rate does not represent.",
          },
        ],
      },
      "deposit-yield": {
        definitions: [
          {
            term: "APY",
            expansion: "Annual Percentage Yield",
            body: "A deposit-account yield that already includes compounding under the account’s stated calculation rules.",
          },
        ],
        formula: {
          title: "Effective annual yield",
          expression: "APY = (1 + a/k)^k − 1",
          symbols: [
            { symbol: "a", meaning: "nominal annual rate" },
            { symbol: "k", meaning: "compounding periods per year" },
          ],
        },
      },
      example: {
        kicker: "Worked example",
        example: {
          title: "12% nominal annual rate, monthly compounding",
          setup: ["$10,000 deposit", "12% nominal annual rate", "Monthly compounding"],
          metrics: [
            { label: "Nominal rate", value: "12.00%" },
            { label: "Monthly rate", value: "1.00%" },
            { label: "Effective annual yield", value: pct("apy.effective12") },
          ],
        },
        callouts: [
          {
            tone: "example",
            body: `A quoted 5% APY is not generally the same as a 5% nominal rate compounded monthly. The monthly-equivalent nominal input is approximately ${pct("apy.nominal5", 6)}.`,
          },
        ],
      },
      "investment-return": {
        callouts: [
          {
            tone: "caution",
            body: "An investment input is a scenario assumption. Copying a historical or advertised return into a different compounding convention changes the effective annual assumption.",
          },
        ],
      },
      "field-check": {
        kicker: "Before copying a rate",
        checklist: {
          title: "Match the quote to the field",
          steps: [
            "Identify the object: a debt balance, a deposit account or a market investment.",
            "Check whether the percentage includes fees or compounding.",
            "Match the period and compounding convention to the calculator field.",
          ],
        },
      },
    },
    exercise: {
      steps: [
        "Enter $10,000, no monthly deposits, one year and 5% with annual compounding; the result is $10,500.",
        "Switch to monthly compounding while leaving 5% unchanged and notice that the result changes.",
        "Then enter the monthly-equivalent nominal rate shown above to recover approximately the same annual result; rounding the rate can introduce a small difference.",
      ],
      notice: "The annual outcome should remain approximately equivalent after converting the rate correctly.",
    },
  },
  "mortgage-amortization": {
    sections: {
      "rate-and-timing": {
        callouts: [
          {
            tone: "info",
            body: "The note rate determines interest under the loan contract. Substituting a disclosure APR for the note rate can produce the wrong principal-and-interest payment.",
          },
        ],
      },
      example: {
        kicker: "Worked example",
        example: {
          title: "$320,000 loan at 6.5%",
          setup: ["$400,000 home", "$80,000 down", "6.5% fixed note rate", "360 monthly payments"],
          metrics: [
            { label: "Monthly P&I", value: m("mortgage.payment") },
            { label: "First-month interest", value: m("mortgage.firstInterest") },
            { label: "First-month principal", value: m("mortgage.firstPrincipal") },
            { label: "Total interest", value: m("mortgage.totalInterest") },
          ],
        },
      },
    },
    exercise: {
      steps: [
        "Enter a $400,000 price, $80,000 down, 6.5% note rate and 30-year term.",
        "Leave taxes, insurance, HOA and PMI at zero to reproduce the schedule. Compare the first payment with year 20.",
        "Then switch only the term to 15 years, and finally add your separately estimated ownership costs.",
      ],
    },
  },
  "compound-interest": {
    sections: {
      frequency: {
        formula: {
          title: "Effective annual growth factor",
          expression: "(1 + a/k)^k",
          symbols: [
            { symbol: "a", meaning: "nominal annual rate as a decimal" },
            { symbol: "k", meaning: "compounding periods per year" },
          ],
        },
      },
      "lump-sum": {
        example: {
          kicker: "Example A",
          title: "Lump sum with annual compounding",
          setup: ["$10,000 starting balance", "No further contributions", "5% nominal annual rate", "10 years"],
          metrics: [
            { label: "Contributions", value: "$10,000.00" },
            { label: "Modeled value", value: m("compound.lump") },
          ],
        },
      },
      example: {
        kicker: "Worked example",
        example: {
          title: "$10,000 plus $500 each month",
          setup: ["$10,000 starting balance", "$500 month-end deposits", "7% nominal annual return, monthly", "20 years"],
          metrics: [
            { label: "Contributed", value: m("compound.contributed") },
            { label: "Modeled growth", value: m("compound.growth") },
            { label: "Final value", value: m("compound.total") },
            { label: "Today’s dollars at 3% inflation", value: m("compound.real") },
          ],
        },
      },
      "zero-and-negative": {
        callouts: [
          {
            tone: "example",
            body: `A $1,000 lump sum with a −12% nominal annual return compounded monthly becomes ${m("compound.loss")} after one year. Negative returns remain negative.`,
          },
        ],
      },
    },
    exercise: {
      steps: [
        "Use $10,000 initially, $500 monthly, 7% nominal annual return, monthly compounding, 20 years, 0% contribution increase and 3% inflation.",
        "Compare the final value with total contributions and the inflation-adjusted result. Then set return to 0% without changing deposits.",
        "Separately reproduce the $1,000 + $100/month one-year control.",
      ],
    },
  },
  "how-much-to-save": {
    sections: {
      example: {
        kicker: "Worked example",
        example: {
          title: "$12,000 goal with $3,000 already saved",
          setup: ["$9,000 funding gap", "Zero return"],
          metrics: [
            { label: "12 months", value: "$750.00 / month" },
            { label: "24 months", value: "$375.00 / month" },
            { label: "36 months", value: "$250.00 / month" },
          ],
        },
      },
      "include-growth": {
        example: {
          title: "Then allow growth",
          setup: ["$50,000 goal", "$5,000 saved", "4% nominal annual return", "48 months"],
          metrics: [
            { label: "Solved deposit", value: m("savings.deposit") },
            { label: "New contributions", value: m("savings.new") },
            { label: "Modeled growth", value: m("savings.growth") },
          ],
        },
      },
      "three-states": {
        comparison: {
          columns: [
            { title: "Achieved today", points: ["Current balance already equals or exceeds the target"] },
            { title: "Growth-funded", points: ["Below target today, but modeled future value reaches it with no new deposits"] },
            { title: "Deposits required", points: ["Projected existing balance still leaves a gap at the deadline"] },
          ],
        },
        callouts: [
          {
            tone: "example",
            body: `$9,000 with a deliberately illustrative 12% nominal annual return compounded monthly becomes ${m("savings.growthFunded")} after a year. The monthly deposit is zero under that assumption, yet the goal is not funded today.`,
          },
        ],
      },
    },
    exercise: {
      steps: [
        "First enter a $12,000 goal, $3,000 saved, 0% return and one year; change only the time to two and three years.",
        "Then try $50,000, $5,000 saved, 4% nominal return and four years.",
        "Compare the solved deposit with the amount explicitly available in your budget.",
      ],
    },
  },
  "nominal-vs-real-return": {
    sections: {
      "two-units": {
        formula: {
          title: "Today-dollar value",
          expression: "F ÷ (1 + i)^t",
          symbols: [
            { symbol: "F", meaning: "future nominal amount" },
            { symbol: "i", meaning: "annual inflation assumption" },
            { symbol: "t", meaning: "years" },
          ],
        },
      },
      "exact-rate": {
        formula: {
          title: "Exact real return",
          expression: "(1 + nominal) ÷ (1 + inflation) − 1",
          symbols: [
            { symbol: "nominal", meaning: "effective return over the matching period" },
            { symbol: "inflation", meaning: "price change over the same period" },
          ],
        },
        callouts: [
          {
            tone: "info",
            body: `If an investment grows by an effective 7% while prices rise 3%, exact real return is ${pct("real.rate")}. Subtracting 3% from 7% is only an approximation.`,
          },
        ],
      },
      example: {
        kicker: "Worked example",
        example: {
          title: "One account, two views",
          setup: ["$10,000 starting balance", "7% annual growth", "3% constant inflation", "10 years"],
          metrics: [
            { label: "Nominal future value", value: m("real.nominal") },
            { label: "Today’s purchasing power", value: m("real.value") },
          ],
        },
      },
    },
    exercise: {
      steps: [
        "In Compound Interest enter $10,000, no monthly contribution, 7%, annual compounding, ten years and 3% inflation.",
        "Compare the nominal and inflation-adjusted figures.",
        "Then change only inflation to see why spending assumptions can change while the nominal account projection remains the same.",
      ],
    },
  },
  "salary-vs-hourly": {
    sections: {
      "gross-conversion": {
        formula: {
          title: "Gross hourly equivalent",
          expression: "annual salary ÷ paid weeks ÷ hours per week",
          symbols: [
            { symbol: "paid weeks", meaning: "weeks that are actually paid" },
            { symbol: "hours", meaning: "hours in each paid week" },
          ],
        },
      },
      example: {
        kicker: "Worked example",
        example: {
          title: "$30 an hour",
          setup: ["$30 per hour", "40 hours per paid week", "52 paid weeks"],
          metrics: [
            { label: "Annual gross", value: "$62,400.00" },
            { label: "Monthly average", value: "$5,200.00" },
            { label: "Biweekly (26)", value: "$2,400.00" },
            { label: "Semimonthly (24)", value: "$2,600.00" },
          ],
        },
      },
      "tax-2026": {
        example: {
          title: "2026 federal estimate",
          setup: ["$75,000 ordinary wages", "Single", "Base standard deduction", "No pretax deductions"],
          metrics: [
            { label: "Taxable income", value: m("salary.taxableIncome") },
            { label: "Federal income tax", value: m("salary.federalTax") },
            { label: "Social Security", value: m("salary.socialSecurity") },
            { label: "Medicare", value: m("salary.medicare") },
            { label: "Modeled net", value: m("salary.netAnnual") },
          ],
        },
      },
    },
    exercise: {
      steps: [
        "For the gross example, choose hourly mode, $30, 40 hours and 52 paid weeks.",
        "For the separate tax example, choose salary mode, $75,000, single and 2026 with deductions at zero.",
        "Then add $10,000 traditional 401(k) and $2,000 qualifying health deductions and inspect the tax layers rather than only the net headline.",
      ],
    },
  },
  "gross-vs-net-pay": {
    sections: {
      "pay-layers": {
        comparison: {
          columns: [
            { title: "Gross wages", points: ["Compensation before employee deductions"] },
            { title: "Federal taxable income", points: ["Modeled wages after qualifying pretax amounts and the standard deduction"] },
            { title: "FICA wages", points: ["Social Security and Medicare wages can differ from federal wages"] },
            { title: "Modeled net", points: ["Annual federal income tax, employee FICA and entered qualifying deductions"] },
          ],
        },
      },
      example: {
        kicker: "Worked example",
        example: {
          title: "Same $75,000 worker with deductions",
          setup: ["$10,000 traditional 401(k)", "$2,000 qualifying health deductions"],
          metrics: [
            { label: "Taxable income", value: m("deductions.taxableIncome") },
            { label: "Federal tax", value: m("deductions.federalTax") },
            { label: "Social Security", value: m("deductions.socialSecurity") },
            { label: "Medicare", value: m("deductions.medicare") },
            { label: "Modeled net", value: m("deductions.netAnnual") },
          ],
        },
      },
    },
    exercise: {
      steps: [
        "Set Salary Calculator to $75,000, single, 2026, with a $10,000 traditional 401(k) contribution and $2,000 qualifying health deduction.",
        "Reconcile deductions plus federal tax plus Social Security plus Medicare plus estimated net to gross.",
        "Use actual take-home receipts when building a cash budget that needs to match real bill dates.",
      ],
    },
  },
  "net-worth": {
    sections: {
      snapshot: {
        formula: {
          title: "Net worth",
          expression: "total assets − total liabilities",
          symbols: [
            { symbol: "assets", meaning: "what is owned on the valuation date" },
            { symbol: "liabilities", meaning: "what is owed on the same date" },
          ],
        },
      },
      example: {
        kicker: "Worked example",
        example: {
          title: "Full home value, separate mortgage",
          setup: ["$12,000 cash", "$45,000 investments", "$300,000 home", "$240,000 mortgage"],
          metrics: [
            { label: "Assets", value: "$357,000.00" },
            { label: "Liabilities", value: "$240,000.00" },
            { label: "Net worth", value: "$117,000.00" },
            { label: "Home equity", value: "$60,000.00" },
          ],
        },
        callouts: [
          {
            tone: "caution",
            body: "Entering only home equity and then subtracting the mortgage again counts the debt twice.",
          },
        ],
      },
      liquidity: {
        comparison: {
          columns: [
            { title: "Liquid", points: ["Cash and amounts readily available for spending"] },
            { title: "Illiquid", points: ["Home equity and other assets that may need time, a sale or new borrowing"] },
          ],
        },
      },
    },
    exercise: {
      steps: [
        "Enter assets of $357,000 and debts of $240,000 to reproduce the $117,000 snapshot.",
        "In the optional projection, set growth, debt interest, monthly savings and debt paydown to zero; all future snapshots then remain equal to the current value.",
        "Then change one projection assumption at a time while keeping the current snapshot distinct from the future scenario.",
      ],
    },
  },
  "monthly-budget": {
    sections: {
      example: {
        kicker: "Worked example",
        example: {
          title: "Assign $500 of the remainder",
          setup: ["$5,000 take-home income", "$1,500 housing", "$2,200 other expenses"],
          metrics: [
            { label: "Remaining before savings", value: "$1,300.00" },
            { label: "Remaining-income rate", value: "26%" },
            { label: "After $500 transfer", value: "$800.00" },
            { label: "Savings-transfer rate", value: "10%" },
          ],
        },
        callouts: [
          {
            tone: "info",
            body: "The first $1,300 was room left in the entered plan; it was not evidence that $1,300 had been transferred to savings.",
          },
        ],
      },
    },
    exercise: {
      steps: [
        "Enter $5,000 income, $1,500 housing and $2,200 other expenses. Confirm $1,300 remaining.",
        "Add a $500 savings category and confirm $800 remaining with a 16% remaining-income rate.",
        "Compare that with the separate 10% savings-transfer rate, then add your irregular costs on a consistent monthly basis.",
      ],
    },
  },
  "savings-rate-vs-cash-flow": {
    sections: {
      example: {
        kicker: "Worked example",
        comparison: {
          columns: [
            { title: "Unassigned cash", kicker: "26%", points: ["$1,300 remaining", "No entered savings transfer"] },
            { title: "Remaining after transfer", kicker: "16%", points: ["$800 remaining", "$500 now has an explicit destination"] },
            { title: "Savings-transfer rate", kicker: "10%", points: ["$500 ÷ $5,000", "Uses the identified transfer, not leftover cash"] },
          ],
        },
      },
      denominators: {
        example: {
          title: "Gross and employer-inclusive definitions",
          setup: ["$8,000 gross monthly pay", "$400 employee retirement contribution", "$500 take-home saving", "$200 employer contribution"],
          metrics: [
            { label: "Employee-only / gross", value: "11.25%" },
            { label: "Including employer / $8,200", value: "13.41%" },
          ],
        },
      },
    },
    exercise: {
      steps: [
        "Use the $5,000 budget example and add or remove the $500 savings transfer.",
        "Watch remaining cash change, then calculate the transfer rate separately with the same take-home denominator.",
        "If including payroll or employer retirement contributions in a broader measure, write down both the numerator and the compensation denominator before comparing percentages.",
      ],
    },
  },
  "debt-snowball-vs-avalanche": {
    sections: {
      priority: {
        comparison: {
          columns: [
            {
              title: "Snowball",
              kicker: "Smallest balance first",
              points: ["Keep paying required minimums", "Send extra money to the smallest starting balance"],
            },
            {
              title: "Avalanche",
              kicker: "Highest rate first",
              points: ["Keep paying required minimums", "Send extra money to the highest interest rate"],
            },
          ],
        },
      },
      example: {
        kicker: "Worked example",
        example: {
          title: "Three debts and $800 per month",
          setup: ["$4,200 at 19.9%, $120 minimum", "$3,500 at 12%, $110 minimum", "$11,000 at 6.5%, $265 minimum"],
          metrics: [
            { label: "Both methods", value: "26 months" },
            { label: "Snowball interest", value: m("debt.snowballInterest") },
            { label: "Avalanche interest", value: m("debt.avalancheInterest") },
          ],
        },
        callouts: [
          {
            tone: "info",
            body: "Identical whole-month payoff counts therefore do not imply identical costs.",
          },
        ],
      },
    },
    exercise: {
      steps: [
        "Enter the three balances, rates and minimums from the example with an $800 total monthly budget.",
        "Switch only the method. Compare first-month payments, each account’s payoff month and total interest.",
        "Then change the budget separately to distinguish the effect of paying more from the effect of changing priority.",
      ],
    },
  },
  "loan-prepayments": {
    sections: {
      example: {
        kicker: "Worked example",
        example: {
          title: "$10,000 at 12%, paying $300",
          setup: ["$10,000 balance", "12% annual rate ÷ 12", "$300 payment"],
          metrics: [
            { label: "First-month interest", value: "$100.00" },
            { label: "First principal reduction", value: "$200.00" },
            { label: "Payoff", value: "41 months" },
            { label: "Total interest", value: m("loan.300Interest") },
          ],
        },
      },
      "extra-payment": {
        comparison: {
          columns: [
            { title: "$300 / month", points: ["41 months", `Interest ${m("loan.300Interest")}`] },
            { title: "$400 / month", points: ["29 months", `Interest ${m("loan.400Interest")}`] },
          ],
        },
        callouts: [
          {
            tone: "example",
            body: `The higher payment clears the loan 12 months sooner and saves ${m("loan.saved")} of interest under these assumptions.`,
          },
        ],
      },
    },
    exercise: {
      steps: [
        "Enter $10,000 balance, 12% annual rate and a $300 regular monthly payment. Set one-time extra to zero.",
        "Compare no monthly extra with $100 monthly extra. Inspect the first two payments and final payment.",
        "Then try a $100 regular payment to see the interest-only boundary.",
      ],
    },
  },
  "four-percent-rule": {
    sections: {
      "first-year": {
        kicker: "Withdrawal arithmetic",
        example: {
          title: "First-year 4% on $750,000",
          metrics: [
            { label: "Initial annual withdrawal", value: "$30,000.00" },
            { label: "Monthly equivalent", value: "$2,500.00" },
          ],
        },
      },
      origins: {
        kicker: "Historical research",
        comparison: {
          columns: [
            { title: "Bengen 1994", points: ["Initial withdrawal followed by inflation adjustments", "Influential historical foundation for a roughly thirty-year horizon"] },
            { title: "Trinity 1998", points: ["Multiple withdrawal rates and 15–30 year payout periods", "Taxes and transaction costs were excluded"] },
          ],
        },
      },
      example: {
        kicker: "Policy A",
        example: {
          title: "Fix the initial percentage, then adjust the dollars",
          setup: ["$750,000 portfolio", "$30,000 year-1 withdrawal", "3% constant inflation"],
          metrics: [
            { label: "Year 2", value: "$30,900.00" },
            { label: "Year 3", value: "$31,827.00" },
          ],
        },
        callouts: [
          {
            tone: "info",
            body: "The policy does not recompute 4% of the portfolio each year. Spending rises with the assumed price level even if the portfolio falls.",
          },
        ],
      },
      "current-percentage": {
        kicker: "Policy B",
        comparison: {
          columns: [
            { title: "Policy A", points: ["Percentage of the original portfolio", "Later dollars follow inflation"] },
            { title: "Policy B", points: ["Percentage of the current portfolio", "Spending moves with the balance"] },
          ],
        },
      },
      "sequence-risk": {
        callouts: [
          {
            tone: "caution",
            body: "Without withdrawals, both invented return paths end at $96,000. With withdrawals, their ending balances differ because earlier losses leave fewer dollars participating in a later recovery.",
          },
        ],
      },
      "moneybasis-model": {
        example: {
          title: "What the retirement calculator actually does",
          setup: ["Age 30 to 65", "$25,000 saved", "$800 monthly", "7% nominal return", "3% inflation", "$4,000 today-dollar monthly need"],
          metrics: [
            { label: "Projected nest egg", value: m("retirement.nest") },
            { label: "4% monthly equivalent", value: m("retirement.monthly") },
            { label: "Spending at retirement", value: m("retirement.need") },
          ],
        },
      },
    },
    exercise: {
      steps: [
        "Enter age 30, retirement at 65, ending age 90, $25,000 saved, $800 monthly contributions, 0% contribution increase, 7% annual return, 3% inflation, $4,000 desired monthly spending in today’s dollars and a 4% withdrawal rate.",
        "Compare the initial-rate estimate with inflated desired spending.",
        "Change only the withdrawal rate, then separately change desired spending and observe which result each controls.",
      ],
    },
  },
  "rent-vs-buy-costs": {
    sections: {
      "same-resources": {
        kicker: "Equal resources",
      },
      example: {
        kicker: "Worked example",
        example: {
          title: "Expose the bookkeeping with zero rates",
          setup: ["$120,000 home", "20% down", "Ten-year zero-interest loan", "$800 rent", "All other costs and returns set to zero"],
          metrics: [
            { label: "Year 1 buyer", value: "$33,600.00" },
            { label: "Year 1 renter", value: "$24,000.00" },
            { label: "Year 11 buyer", value: "$129,600.00" },
            { label: "Year 11 renter", value: "$24,000.00" },
          ],
        },
        callouts: [
          {
            tone: "caution",
            body: "These are deliberately incomplete housing costs, not a market scenario. The zero-rate case is a teaching control for the bookkeeping.",
          },
        ],
      },
    },
    exercise: {
      steps: [
        "Reproduce the zero-rate example with a $120,000 price, 20% down, ten-year term and $800 rent. Set every cost and growth input to zero.",
        "Compare stay lengths of 1, 10 and 11 years. Then change only rent to $1,000 or $400 for a one-year comparison; inspect which portfolio receives the monthly difference.",
        "Replace zero costs with your own estimates for a more relevant scenario.",
      ],
    },
  },
};

export function presentationFor(slug: string): GuidePresentation {
  const presentation = guidePresentations[slug];
  if (!presentation) throw new Error(`Missing guide presentation: ${slug}`);
  return presentation;
}

export function sectionPresentation(slug: string, section: GuideSection): GuideSectionPresentation {
  return presentationFor(slug).sections[section.id] ?? {};
}
