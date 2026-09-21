# MoneyBasis financial software audit

Audit date: 2026-09-18. Target: https://moneybasis.app. Scope: first audit pass; no application code changes.

## A. Executive summary

**Do not approve this snapshot for financial-calculator launch yet.** The standard positive-rate mortgage, investment accumulation, basic loan amortization, gross-pay conversion, current net-worth subtraction and budget subtraction have sound mathematical cores. Material defects remain in debt allocation, rent-versus-buy cash flows, retirement inflation, savings-goal labels and shared input validation.

Evidence: inspected all ten calculation modules and their React consumers, calculator catalog/explanations/FAQs, chart adapters, guide catalog/examples/renderer, tax data, persistence/share restoration and existing tests. Executed `npm test`: **22/22 pass**, including 14 calculator tests. Separately ran **160 independent reference comparisons: 123 matches and 37 mismatches**. These are audit probes, not 160 production tests: mismatches include proposed validation/financial-model contracts and unsupported inputs as well as current defects. See [TEST_MATRIX.md](TEST_MATRIX.md) for every input, expected result, tolerance, observed result and reproducible reference code. Fifty-four probes check every supported 2026 federal bracket at its boundary and ±$0.01.

Snapshot: local `main`, HEAD `78a217eb0247469b47761c96a743db74a7886f64`, with substantial pre-existing uncommitted/untracked application files. HEAD alone does **not** identify the audited Next.js implementation. The final appendix records source hashes. No checkout, commit, deployment, application edit or test-suite edit was performed.

Deployment limitation: user confirmed `moneybasis.app`. Web fetch failed; direct HTTPS attempts both inside and outside the sandbox reported `Could not resolve host`. Browser runtime discovery returned no connected browser. **No deployed calculation, browser interaction or deployment/source equivalence was verified.** This is an evidence-backed local-source and function-execution audit, not production certification. The failures establish an environment access problem, not a universal claim that the domain is down.

## B. Critical issues to fix before launch

Severity reflects financial consequence and reach. “Critical” means a feasible-looking answer violates available money; “High” means materially wrong or misleading scenarios; “Medium” means narrower correctness/disclosure problems; “Low” means limited clarity. IDs remain stable for implementation tickets.

| ID | Severity | Finding and evidence | Acceptance criterion |
|---|---|---|---|
| D-01 | Critical | Debt engine pays contractual minimums even when their sum exceeds the budget. Two $100 debts with $60 minimums and $100 budget spend $120 in month one. | Reject infeasible minimum budget before simulating; monthly paid never exceeds available budget. |
| D-02 | High | Leftover final payments disappear instead of rolling within the same month. Two $100 zero-rate debts, $10 minimums, $200 budget take 2 months instead of 1. Default snowball costs $2,103.92/27 months vs independent $2,075.23/26. | Allocate unused amounts to the next priority debt immediately; preserve every dollar. |
| V-01 | High | Rent/buy continues charging the original mortgage payment after amortization completes, including cash-flow investment and cost rows. | Actual mortgage cash cost is zero after payoff; cap final payment. |
| V-02 | High | Only renter savings are invested; buyer savings when renting costs more are ignored. This is an unequal-cash-budget model. | Implement a symmetric available-budget comparison or explicitly narrow the product claim; recommended specification is symmetric investment. |
| V-03 | High | Buyer year-zero equity is hardcoded to zero while later points are home value minus debt. | Year-zero buyer equity equals down payment (less modeled immediate liquidation costs only if that convention is selected). |
| R-01 | High | Retirement accepts and displays `inflationPercent` but never reads it in the engine. | Implement a defined real/nominal model or remove/disable the input and label all values nominal. |
| S-01 | High | Additional Medicare omitted; $300,000 single wages overstates net by $900/year under the wage-only liability model. | Include applicable surcharge or prominently restrict the estimate; distinguish annual liability from payroll withholding. [IRS](https://www.irs.gov/taxtopics/tc560) |
| S-02 | High | State estimates are unversioned arbitrary flat/blended rates on federal wages, without state deductions. NC code is 4.25%; 2026 statutory rate is 3.99%. | Remove named-state approximations in favor of a user-entered estimate, or maintain sourced year-specific state engines. [NC DOR](https://www.ncdor.gov/income-tax-withholding-tables-and-instructions-employers/open) |
| X-01 | High | Text field error messages do not block calculation. Negative amounts, fractional years, inconsistent ages and huge values reach engines. Shared payloads perform only partial checks; saved JSON is unvalidated. | One domain validation contract at every entry point; no result for invalid state. |
| G-01 | High | $9,000 saved toward $10,000 at 12% for one year produces “Already there,” although only future growth would reach it. | Separate `achievedNow` from `noFurtherContributionsNeeded`. |
| G-02 | Medium | Goal chart caps balances at 102% of goal, clips losses and reports target gap as growth when no deposits are required. | Actual balances, signed growth and milestones reconcile to one monthly schedule. |
| L-01 | High | Loan stops at 1,200 months and returns finite payoff even if debt remains. $1,201 at 0%, $1/month returns 1,200 months and $1,200 paid. | Explicit not-paid-within-horizon status, remaining balance, no payoff date. |
| X-02 | Medium | Negative-rate growth is clipped to zero; helper functions treat negative rates as zero; long-year loops truncate fractional years. | Defined allowed domains, signed loss handling, integer month count shared by all outputs. |

## C. Calculator-by-calculator audit table

All routes are generated by `app/calculators/[slug]/page.tsx` → `components/calculators/calculator-app.tsx` → the corresponding calculator component. Components invoke pure functions during `useMemo`; Calculate controls visibility, not validation. Source and guide mappings below are actual catalog values. Shared copy lives in `lib/calculators/{catalog,page-copy,guides}.ts`; guide content in `lib/guides/{catalog,examples}.ts` and `app/guides/[slug]/page.tsx`.

| Calculator / status / severity | Route | Implementation files / main functions | Inputs | Outputs | Current sources | Current guide | Immediate concerns |
|---|---|---|---|---|---|---|---|
| Mortgage Calculator — Mostly correct / Medium | `/calculators/mortgage` | `lib/calculators/mortgage.ts`, `components/calculators/mortgage-calculator.tsx`; `calculateMortgage` | homePrice, downPayment, interestRate, loanTerm; advanced inputs in D | P&I; housing cost; interest; loan payments; schedules | [Consumer Financial Protection Bureau — Owning a Home](https://www.consumerfinance.gov/owning-a-home/); [Fannie Mae — Home buying resources](https://www.fanniemae.com/) | `/guides/mortgage-amortization` | Invalid input; fractional term; fee/PMI assumptions |
| Compound Interest Calculator — Mostly correct / Medium | `/calculators/compound-interest` | `lib/calculators/investment.ts`, `components/calculators/investment-calculator.tsx`; `calculateInvestment` | startingBalance, monthlyContribution, annualReturn, years; advanced inputs in D | FV; deposits; growth; real FV; annual series | [Investor.gov — Compound interest](https://www.investor.gov/introduction-investing/investing-basics/glossary/compound-interest); [U.S. Securities and Exchange Commission — Investor.gov](https://www.investor.gov/) | `/guides/compound-interest` | Frequency copy; signed losses; partial years |
| Salary ↔ Hourly Calculator — Needs revision / High | `/calculators/salary-hourly` | `lib/calculators/salary.ts`, `components/calculators/salary-calculator.tsx`; `calculateSalary; federalIncomeTax` | annualSalary, hourlyWage, hoursPerWeek, filingStatus; advanced inputs in D | gross; taxable wages; federal/state/FICA; estimated net | [IRS tax year 2026 inflation adjustments](https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill); [IRS Revenue Procedure 2025-32](https://www.irs.gov/pub/irs-drop/rp-25-32.pdf); [SSA contribution and benefit base](https://www.ssa.gov/oact/cola/cbb.html) | `/guides/salary-vs-hourly` | Medicare; state data; payroll vs liability |
| Loan Payoff Calculator — Needs revision / High | `/calculators/loan-payoff` | `lib/calculators/loan-payoff.ts`, `components/calculators/loan-payoff-calculator.tsx`; `calculateLoanPayoff; simulateLoan` | balance, interestRate, monthlyPayment, extraPayment; advanced inputs in D | standard/extra payoff; interest; savings; selected rows | [Consumer Financial Protection Bureau — Paying down debt](https://www.consumerfinance.gov/consumer-tools/debt/) | `/guides/loan-prepayments` | Horizon cap; chart replay; sparse schedule |
| Net Worth Calculator — Mostly correct / Medium | `/calculators/net-worth` | `lib/calculators/net-worth.ts`, `components/calculators/net-worth-calculator.tsx`; `calculateNetWorth; sumLedger, groupLedger` | assets, liabilities; advanced inputs in D | assets−debts; projected series; 10/20/30-year values | [Investor.gov — Net worth](https://www.investor.gov/introduction-investing/investing-basics/glossary/net-worth) | `/guides/net-worth` | Default equity naming; homogeneous asset return |
| Monthly Budget Planner — Mostly correct / Medium | `/calculators/budget` | `lib/calculators/budget.ts`, `components/calculators/budget-calculator.tsx`; `calculateBudget` | monthlyIncome, expenseCategories; advanced inputs in D | expenses; remaining; remaining-income ratio; category chart | [Consumer Financial Protection Bureau — Budgeting](https://www.consumerfinance.gov/consumer-tools/budgeting/) | `/guides/monthly-budget` | Savings label; zero denominator; negative categories |
| Retirement Calculator — Needs revision / High | `/calculators/retirement` | `lib/calculators/retirement.ts`, `components/calculators/retirement-calculator.tsx`; `calculateRetirement` | currentAge, retirementAge, currentSavings, monthlyContribution, annualReturn; advanced inputs in D | nest egg; withdrawal estimate; drawdown; target comparison | [U.S. Department of Labor — Retirement](https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/publications/top-10-ways-to-prepare-for-retirement); [Investor.gov — Retirement](https://www.investor.gov/additional-resources/retirement-toolkit) | `/guides/four-percent-rule` | Ignored inflation; deterministic drawdown |
| Savings Goal Calculator — Needs revision / High | `/calculators/savings-goal` | `lib/calculators/savings-goal.ts`, `components/calculators/savings-goal-calculator.tsx`; `calculateSavingsGoal; monthsToGoal` | goalAmount, currentSavings, years, annualReturn; advanced inputs in D | required deposit; gap; growth; progress; milestones | [Consumer Financial Protection Bureau — Saving](https://www.consumerfinance.gov/consumer-tools/savings-on-a-shoestring/) | `/guides/how-much-to-save` | Already-there label; cap; dates; loss handling |
| Debt Snowball Calculator — Incorrect / Critical | `/calculators/debt-snowball` | `lib/calculators/debt-snowball.ts`, `components/calculators/debt-snowball-calculator.tsx`; `calculateDebtSnowball` | debts, monthlyBudget; advanced inputs in D | months; interest; order; per-debt balances | [Consumer Financial Protection Bureau — Debt tools](https://www.consumerfinance.gov/consumer-tools/debt/) | `/guides/debt-snowball-vs-avalanche` | Budget overspend; lost rollover; duplicate names |
| Rent vs Buy Calculator — Incorrect / High | `/calculators/rent-vs-buy` | `lib/calculators/rent-vs-buy.ts`, `components/calculators/rent-vs-buy-calculator.tsx`; `calculateRentVsBuy` | homePrice, downPayment, interestRate, monthlyRent, years; advanced inputs in D | buyer/renter positions; difference; crossover; costs | [Consumer Financial Protection Bureau — Owning a Home](https://www.consumerfinance.gov/owning-a-home/); [Federal Reserve — Consumer credit and housing data](https://www.federalreserve.gov/) | `/guides/rent-vs-buy-costs` | Post-payoff costs; one-sided investment; year zero |

Catalog input names are descriptive aliases, not always engine property names; D records actual fields. No tool earns an unqualified end-to-end Correct status because validation and rendered/deployed verification remain open.

## D. Detailed validation for each of the 10 calculators

All monetary inputs/outputs are USD. Rate inputs are percentages, converted by `/100`; annual nominal rates normally divide by 12. Engines use native Number without monthly cent rounding. Charts normally round to whole dollars and tables use `formatMoney` (whole dollars at |value| ≥100, cents below). Consequently display sums need not equal the rounded headline, even where underlying numbers reconcile. Tests below compare underlying values, not rounded text.

### 1. Mortgage — Mostly correct / Medium

Question: What fixed-rate principal-and-interest payment amortizes the borrowed amount, and what is an illustrative payment with optional recurring housing costs?

Trace: `lib/calculators/mortgage.ts:37` → `MortgageCalculator`. Inputs/defaults: homePrice 400000, downPayment 80000 (UI also downPercent 20), annualRatePercent 6.5, termYears 30; annualPropertyTax/annualInsurance/monthlyHoa/monthlyPmi all 0. Terms offered: 10/15/20/30. Editing price preserves current down-payment percentage; editing dollars or percentage updates the other.

Method: P=price−down; r=rate/1200; n=12×years; payment=P/sum((1+r)^−k,k=1..n), equivalent to the standard formula. Zero interest gives P/n. Independent M1 gives **$2,022.617675/month**, **$408,142.363064 interest**, **$728,142.363064 total loan payments**. M2 (240000 at 5%/15y) gives $1,897.904704; M3 (300000 at 7%/20y) $2,325.896807. The monthly loop, annual sums and final balance agree for valid integer terms. This independently derived math aligns with the CFPB's monthly amortization explanation and its published $200,000/7%/30y example (about $1,331). [CFPB mechanics](https://www.consumerfinance.gov/ask-cfpb/how-does-paying-down-a-mortgage-work-en-1943/), [CFPB example](https://www.consumerfinance.gov/rules-policy/regulations/1026/2021-02-17/43/).

Headline “Monthly payment” is explicitly qualified as P&I; “Estimated monthly cost” separately includes taxes/12 + insurance/12 + HOA + entered PMI. That distinction is good. “Total loan cost” means principal plus interest, not purchase price, down payment, financing fees or all housing costs. Rename to “Total principal and interest paid.” Graphs use `result.years`, table and CSV use `years`/`months`; rows reconcile before display rounding. Monthly row's misleading internal property `year` stores month number but its consumer labels it correctly.

Boundaries: equal down payment/price returns null, currently explaining that price must exceed down payment; a debt-free purchase is a legitimate state and deserves “No mortgage required.” Negative down payments and fees are not guarded. Nonfinite inputs can return nonfinite values. 1.5-year term calculates an 18-payment headline but generates only 12 schedule rows (M11); UI select avoids this normally, but engine does not enforce its contract. Very small positive rates merit a numerically stable payment formula. No scheduled PMI cancellation or growing taxes/insurance; entered PMI is a monthly estimate, not lifetime PMI accounting. Qualify the below-20% hint as conventional-loan context. [CFPB PMI](https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-122/).

### 2. Compound interest — Mostly correct / Medium

Question: What balance results from assumed constant growth and monthly deposits? Trace: `investment.ts:49` → `InvestmentCalculator`. Defaults: startingAmount=10000, monthlyContribution=500, annualReturnPercent=7, years=20, frequency=monthly, annual contribution increase=0%, inflation=0%. Available horizons 5/10/20/30/40; frequencies annual/semiannual/quarterly/monthly/daily. Advanced: contribution step-up and inflation.

Implemented effective monthly rate is `(1+a/k)^(k/12)−1`, k=1/2/4/12/365. Then balance=balance×(1+r)+deposit, **end of month**, deposit rises after each completed year. For monthly frequency, r=a/12. For annual compounding and monthly deposits, fractional-period growth is interpolated: mathematically coherent equivalent yield, but not a literal annual-crediting bank contract. A 7% effective annual-return assumption is different from 7% nominal compounded monthly; current “annual return” label leaves that distinction unstated.

Independent I1: final $300,850.718403, total contributed $130,000, growth $170,850.718403. I2: $10,000 at 5% annual for 10 years, no deposits → $16,288.946268. Inflation calculation FV/(1+i)^years is a valid today-dollar view for annual inflation. Thus the requested optional real view already exists. Chart/table share `series`; contribution line includes starting money while hero “Contributions” excludes it, with starting amount separately shown. Explicitly label this distinction.

Defects: signed losses clamp to zero in series and headline. I6 $1,000 at −12% nominal for 12 months ends $886.384872; growth should be −$113.615128, not zero. Negative return shows an error in UI but is not blocked, so this is reachable. Fractional years silently truncate (I11). Catalog/FAQ says monthly-only and no inflation deduction despite frequency/real-value controls. Change copy to selected convention; retain constant-return caveat. Taxes and fees excluded. Daily means 365 periods, not calendar day counting. [Investor.gov definition](https://www.investor.gov/introduction-investing/investing-basics/glossary/compound-interest).

### 3. Salary ↔ Hourly — Needs revision / High

Question: Convert gross compensation and estimate selected annual wage taxes; **not** recreate a W-4 paycheck or full tax return. Trace: `salary.ts:47,68`, `data/tax/{2025,2026,states,index,types}.ts` → `SalaryCalculator`. Defaults: salary mode $75,000; hourly mode $36.06; 40 hours, 52 weeks; single; 2026; state NONE; traditional401k/healthInsurance/otherPretax=0. Advanced deductions are annual. Results switch hourly/weekly/biweekly/monthly/annual; supporting tax and gross metrics remain monthly (tax metric lacks explicit “monthly”).

Gross annual=hourly×hours×weeks or entered salary; equivalent hourly=annual/(hours×weeks). Progressive federal bracket slicing is correct for supported ordinary-wage assumptions. Verified 2026 caps in ascending rate order (10,12,22,24,32,35%, then 37% above last cap): single **12,400; 50,400; 105,700; 201,775; 256,225; 640,600**; MFJ **24,800; 100,800; 211,400; 403,550; 512,450; 768,700**; HOH **17,700; 67,450; 105,700; 201,750; 256,200; 640,600**. The HOH $25 differences are intentional, not typos. Standard deductions are **16,100 / 32,200 / 24,150**, respectively. All match the October 9, 2025 publication for tax year 2026. [IRS Revenue Procedure 2025-32, §4.01 and §4.14](https://www.irs.gov/pub/irs-drop/rp-25-32.pdf).

SSA wage base **$184,500**, employee SS **6.2%**, regular Medicare **1.45%**, no regular Medicare cap: correct. [SSA](https://www.ssa.gov/oact/cola/cbb.html). $75,000 single, no deductions/state: taxable $58,900; federal $7,670; SS $4,650; Medicare $1,087.50; net $61,592.50; $36.057692 gross/hour. This is annualized tax arithmetic, not withholding.

Additional Medicare is not implemented, though omitted status is disclosed below the calculator. Wage-only annual liability is another 0.9% above $200,000 single/HOH or $250,000 MFJ; employer withholding starts above $200,000 independent of filing status. $300k single: regular Medicare $4,350 + surcharge $900. MFJ cannot be accurate without clarifying whether income includes spouse wages, and SS caps apply **per worker**, not per household. Keep MFJ mode explicitly one worker/one income, or add spouse wages with separate SS caps. [IRS Topic 560](https://www.irs.gov/taxtopics/tc560).

Traditional 401(k) correctly reduces federal wages but not FICA wages. Health and ALL “other pretax” are assumed cafeteria-plan FICA-exempt; that is overbroad. Specify deduction tax treatment rather than inferring it from “pretax.” [IRS retirement contribution treatment](https://www.irs.gov/retirement-plans/retirement-plan-faqs-regarding-contributions-are-retirement-plan-contributions-subject-to-withholding-for-fica-medicare-or-federal-income-tax), [IRS Publication 15-B](https://www.irs.gov/pub/irs-pdf/p15b.pdf). Enforce deduction sums ≤gross; contribution limits depend on plan and age, which are not collected. No credits, itemization, dependent/age/blind adjustments, qualified tip/overtime deductions, AMT, self-employment or investment taxes. Name these scope exclusions rather than implying comprehensive take-home accuracy.

State rate×federal wages omits state exemptions, brackets, deductions, local taxes and different wage definitions. Several values are unsourced; NC demonstrates stale-year error. The state array is shared even when selecting 2025. **Recommended launch policy: remove named-state precision, offer optional user-entered annual state/local tax or explicitly user-assumed effective rate.** Full 50-state modeling is unjustified without maintenance ownership.

Doughnut values sum to gross **minus pretax deductions**, not gross; add a deductions slice or name its denominator. Taxable income is returned but not displayed in details. `periods` exists but UI does not render a full pay-period table. Weekly divides by worked weeks while biweekly divides by 26: at 48 weeks these describe different calendars. Label weekly as paid-week equivalent or standardize all calendar averages. Zero weeks produces division by zero; negative or excessive deductions produce negative net pay and invalid donut data. 2025 is separately stored (no mixed federal arrays), but sources/methodology remain hardcoded 2026 when that option changes.

### 4. Loan payoff — Needs revision / High

Question: How do monthly/one-time additional payments change amortization? Trace: `loan-payoff.ts:35,78` → `LoanPayoffCalculator`. Defaults: balance=25000, rate=8%, payment=500, extra=100, oneTimeExtra=0, startMonth=1. Start month applies **only** to the one-time payment; recurring extra begins month one.

Simulation accrues balance×APR/1200, pays interest then principal, caps last principal to balance. $25,000/8%/$500 → 62 months, $5,511.173344 interest; $10,000/12%/$300 → 41 months, $2,224.952582; same with $400 → 29 months, $1,564.883703. Zero rate and final partial payments work. Extra-payment timing is after that month's interest, a defensible month-end convention. No lender-specific day counts, variable rates, prepayment penalties or allocation rules.

Headline totals come from simulations; chart **re-simulates** balances independently. In a below-interest case its `max(0,payment−interest)` freezes debt rather than showing unpaid interest growth. Remove/suppress unsupported comparison or model negative amortization consistently. Sampling by rounded steps can omit actual terminal month (62 months uses step 2; other odd terminal months may be missed). Payoff table is not a complete monthly schedule: it stores month 1, multiples of 12 and terminal month, each row being that single month's payment, not annual sums. Label “Selected monthly payments” or retain every month. Never sum current displayed rows as lifetime paid.

L-01 horizon truncation needs a status. Standard paymentTooLow flag ignores whether accelerated schedule itself is infeasible; handle both independently. A future one-time payment that would rescue temporary negative amortization is rejected at the first month; either explicitly disallow that model or support it accurately. Exactly interest-only debt is flat, not growing (FAQ overgeneralizes). Dates use first of current month + payoff months and disclose first payment next month: reasonable. Guard finite date and zero debt; shared duration formatting maps >700 months to “50+ years,” a coarse estimate requiring an explicit horizon label.

### 5. Net worth — Mostly correct / Medium

Question: What is current assets minus liabilities; separately what happens under selected aggregate cash-flow assumptions? Trace: `net-worth.ts:50,54,64` → `NetWorthCalculator`. Asset groups cash/investments/retirement/home/vehicles/other; liabilities mortgage/cards/student/auto/personal/other. Defaults assets $150,000, debt $80,000, current $70,000. Item defaults: cash12000, brokerage45000, retirement38000, Home42000, vehicle13000; mortgage52000, card4500, auto23500. Optional projection off initially; monthly savings1500, debt payments800, growth6%, debt rate5%, 30 years.

Current arithmetic is correct including zero and negative net worth. Full asset value and debt must be entered separately. The Home seed's internal name is **“Home equity value”** while mortgage is separately deducted; FAQ/guide correctly instruct full market value. UI shows category Home, hiding the seed name. This is a contradictory seed/accessible label, not proof of every user's double-counting. Rename/reseed with unambiguous full market value.

Projection: assets grow monthly then receive savings; debts accrue monthly interest then receive a payment. Unused payoff dollars and all subsequent debt-payment budget are invested. Independent N1 yields $2,754,958.617192 at 30 years. Zero-rate $10,000 assets/$1,000 debts/$100 savings/$200 debt budget ends $12,600 at one year. This conservation logic is coherent. Contribution/debt budget must come from outside assets; otherwise double counting occurs. One rate grows cash, home, vehicle and retirement assets identically; one debt rate ignores debt-specific APR/order. Taxes, depreciation, transaction costs, inflation and asset-specific liquidity excluded. Rename “Illustrative projection under selected assumptions,” not forecast. Failing debt payment can make balances grow, with no warning.

Asset donut uses grouped positive amounts; negative entries remain in headline but disappear from chart. Plain number inputs accept negative values. Duplicate IDs can update/delete multiple accounts after malformed restore; duplicate names can be legitimate, but require unique IDs. Custom `years<30` makes at10/at20/at30 missing horizons return misleading zero; return unavailable instead. Chart and headline otherwise use the same series. No projection table exists; no table mismatch is claimed.

### 6. Monthly budget — Mostly correct / Medium

Question: How much of entered monthly take-home income remains after entered outflows? Trace: `budget.ts:34` → `BudgetCalculator`. Default income5000; categories Housing1500, Food600, Transportation400, Utilities200, Insurance180, Healthcare150, Subscriptions80, Entertainment200, Debt250, Other140. Total3700; remaining1300; rate26%.

Exact sum/subtraction is correct. Current savingsRate=(income−expenses)/income×100. **Adopt “remaining-income rate” for this field.** Actual savings rate should only appear if savings transfers are explicitly recorded; choose actual transfers divided by take-home income, with employer/prepayroll retirement excluded unless denominator policy changes. Existing FAQ says remaining is not saved, while hero calls it savings and how-to says treat leftover as savings. Also a guide recommends savings as a category, which reduces this alleged savings rate.

Category donut is amount-weighted and represents **percentage of spending**, consistent with largest-category insight; income progress bar is **percentage of income**. Label denominators. Negative surplus must remain negative; zero income rate is undefined, not 0%. At income0/expense100 the current 0% spent is misleading. All-zero categories need an empty state. Addition/deletion correctly changes sums by index. Duplicate category names are counted separately (not automatically wrong); warn or group for display, never silently discard money. Subscriptions insight only finds the first matching category; aggregate matches. Negative categories are summed but removed from chart. Cents should remain visible in inputs; totals can round for summaries.

### 7. Retirement — Needs revision / High

Question A: deterministic accumulation; B: first-year withdrawal-rate arithmetic and an illustrative drawdown scenario. Trace `retirement.ts:26` → `RetirementCalculator`. Defaults: age30, retire65, current25000, monthly800, return7%, need4000/month; advanced inflation0%, contribution increase0%, withdrawal4%, life expectancy90.

Accumulation correctly compounds a nominal rate/12 and adds deposits at month-end, increasing contributions after each year. Independent default nest egg **$1,728,497.477022**; withdrawal at 4% **$69,139.899081 annually**, **$5,761.658257/month**. Contributions include initial savings. Annual chart and headline share series; no annual table is rendered.

R-01: inflation input has zero effect on engine outputs; catalog says inflation excluded, contradicting the enabled control. Current nest egg, income target and withdrawals are all effectively nominal, but desired-income basis is not specified. Recommendation: label need “monthly spending in today's dollars”; inflate to retirement date, then index nominal withdrawals annually; show explicit nominal/today-dollar views. Alternatively remove inflation field and clearly say the need must be future nominal dollars. Do not merely deflate final nest egg while comparing against a nominal target.

Drawdown uses `min(assumedReturn,5%)/12`, fixed nominal `monthlyNeed`, month-end withdrawals. The 5% cap is disclosed in catalog but called “conservative,” which is not established by a constant-return assumption. Selected withdrawal rate affects headline/target, **not actual drawdown withdrawals**, which use desired income. Explain the two separate scenarios. The chart omits the retirement-date starting point in the drawdown dataset. `monthsFundsLast` is capped at life expectancy and cannot distinguish depletion from survival to horizon; R11 returns 300 months despite zero withdrawals. Age order clamps to zero rather than rejecting; life expectancy below retirement still simulates a year. Negative returns clip reported growth.

Historical qualification: Bengen's 1994 research preceded the 1998 Cooley/Hubbard/Walz Trinity paper. The original research investigates historical portfolios/withdrawal policies; it does not guarantee future success. The fixed nominal drawdown here does not reproduce an inflation-adjusted historical withdrawal study. Include sequence risk, market volatility, longevity, taxes/fees, allocation, Social Security/pension exclusions and nonconstant spending. [Bengen original article](https://www.financialplanningassociation.org/learning/publications/journal/OCT94-determining-withdrawal-rates-using-historical-data), [Trinity original paper](https://www.aaii.com/journal/article/retirement-savings-choosing-a-withdrawal-rate-that-is-sustainable).

### 8. Savings goal — Needs revision / High

Question: What end-of-month deposit bridges a future goal after growth of existing savings? Trace `savings-goal.ts:18,68` → `SavingsGoalCalculator`. Defaults goalName “House down payment”, goal50000, alreadySaved5000, years4, return4%. No separate advanced options. Exact inversion is correct for positive/zero rates: C=max(0,(goal−PV(1+r)^n)/sum((1+r)^k,k=0..n−1)). Default C=**$849.390792/month**, growth $4,229.241974, 48 deposits. The displayed formula omits the future-value-of-existing-savings subtraction unless its FV is defined as the remaining future gap; make it explicit.

G-01 distinguishes future sufficient funds from achieved today. G5 $12k already/$10k goal/5% one year: actual future balance $12,613.94; chart caps to $10,200 and growth reports zero. G6 $9k/$10k/12% one year: no deposits needed but current progress90%; growth actually $1,141.43, not $1,000. `alreadyThere` means monthlyRequired≤0, not current≥goal. Do not hide excess balance.

Negative rate algebra for required deposit works but chart switches to zero-growth branch, clips losses and caps output. Fractional years use 18 months in formula but only 12 in chart for 1.5y; JS `setFullYear(currentYear+years)` is not reliable fractional-year month arithmetic. Goal date is approximate based on current date, no selected date input. Normalize months, base date and first deposit explicitly. Annual milestone sampling misses exact month and can miss 100% due to floating error (default terminal value is 49,999.99999999999); use schedule tolerance. `monthsToGoal` wrongly returns Infinity for a goal reached exactly at month600. Progress above100% is reasonable as text if defined, with bounded visual fill. What-if minimum $1000/month is arbitrary; show user-controlled extra deposit and suppress “sooner” when already achieved. No actual annual table exists.

### 9. Debt snowball / avalanche — Incorrect / Critical

Question: How does a fixed total debt budget repay balances using a chosen priority? Trace `debt-snowball.ts:38` → `DebtSnowballCalculator`. Defaults debts Credit Card4200/19.9%/120 minimum, Personal Loan3500/12%/110, Car Loan11000/6.5%/265; total budget800; snowball. Add/remove supported; method toggle avalanche.

Ordering: snowball initial ascending balance; ties stable input order. Avalanche descending APR, then smaller balance; exact ties stable. Static original snowball ordering is a valid convention if disclosed; distinguish target priority from chronological account payoff (another debt's minimum can clear it first). Interest nominal APR/12, fixed minimum amounts, monthly interest before payment. Budget includes all minimums. Next-month freed minimums roll forward, but same-month excess is discarded. D-01 and D-02 invalidate feasibility/cost comparisons. Independent defaults: snowball26mo/$2075.23; avalanche26mo/$1883.84; current27mo/$2103.92 and27mo/$1916.16. These values assume fixed minimums, no fees/new charges and full same-month rollover; neither strategy is universally preferable. [CFPB worksheet](https://www.consumerfinance.gov/documents/5782/cfpb_ymyg-toolkit_reducing-debt-worksheet.pdf).

Minimum assumptions contradict each other: catalog states max($10,1% balance+interest); new-debt UI seeds **max($25,round(2% initial balance))**; engine uses supplied minimum unchanged. Require entered statement minimum, clearly label any estimate and allow explicit dynamic-minimum policy only if sourced. Name-based payoff deduplication drops a second “Card” with a different ID (D10). Empty debts returns0 correctly; positive debt with zero/negative budget also returns0 and budgetTooLow=false, incorrectly. Horizon600 is mislabeled budgetTooLow even when exactly paid in month600. Return distinct insufficient-minimum, nonamortizing, horizon-exceeded and paid statuses.

Chart balances are rounded in engine, while total is full precision; stacked rounded components can differ. UI samples only month0 and multiples of3, losing final zero for other payoff months. Schedule tab repeats payoff-order list; it is not a monthly allocation ledger. Date uses `setMonth` on current day: January31 +1 month can become March, unlike loan payoff's month-first convention. Use one date helper.

### 10. Rent vs buy — Incorrect / High

Question: Compare selected housing scenarios' estimated net positions at the same horizon and resource budget. Trace `rent-vs-buy.ts:47` → `RentVsBuyCalculator`. Defaults price400000, down20%, rate6.5%, loan30y, rent2200, appreciation3%, investment7%, rent increase3.5%, annual property tax4800/insurance2000/maintenance4000, closing3%, renter insurance20/month, stay10y. All costs entered as dollars except closing percentage; no PMI/HOA/selling costs.

Mortgage formula initially matches Mortgage. Home appreciates annually; year's costs grow by `(1+appreciation)^(year−1)`; rent rises after each year. Renter grows monthly and adds positive avoided housing costs at month-end, initially investing down payment+closing costs. All are nominal. Modeling annual home appreciation before monthly amortization gives the correct year-end home value; the timing problem is not that multiplication, but inconsistent cash flows and initial point.

V-01: ten-year, zero-rate $96k loan means $800/month stops after120 payments. At11 years current cost table incorrectly totals $105,600 vs $96,000. Rent0/return0 then invents $9,600 renter investment. V-02: rent1000 versus own800 yields buyer savings200/month; after1 year equal-budget buyer position=$36,000 vs current $33,600, renter$24,000. V-03: price120k/down20% means initial equity24k; current graph starts0.

Buy position is gross equity, not sale proceeds. Current closing costs are an outflow represented implicitly by renter opportunity cost; do not subtract them twice from buyer wealth. Missing selling costs must remain explicit or be a separate liquidation scenario. Add HOA/PMI or warn when omitted; optional tax deductions/capital gains are better excluded than guessed. Current property tax, insurance and maintenance all grow with home appreciation; these need separate assumptions or prominent disclosure. Editing price in UI does not reset default dollar costs to the engine's percentage defaults; catalog percentages are only fallback assumptions, not live UI ratios.

Crossover scans at least30 years (more if stay>30), uses strict `>` not the UI's “reaches or exceeds,” and reports the first annual crossing, which may not persist. “Not within 30 years” is wrong if modeled horizon exceeds30. Horizon fractional indexing falls back to final modeled year, potentially showing a 30-year result under a1.5-year label. Chart uses the same positions as headline at integer horizons but all30+ years; label selected horizon. Cost table includes “Invested upfront difference,” a retained asset allocation, among expenses, and does not show terminal balance reconciliation. Separate spending, transfers, debt reduction and ending assets. UI appropriately avoids declaring a universal winner; retain conditional net-position language after repairing the model.

## E. Formula corrections

1. Shared loan primitive: `interest=B*r; actual=min(payment+extra,B+interest); principal=actual−interest; Bnext=B−principal`. Validate first. If payment does not amortize, distinguish interest-only from negative amortization. End only on verified payoff; a loop cap is a computational horizon, not payoff. Use r=0 branch, stable `log1p`/`expm1` near zero, and a declared lender-rounding policy if added.
2. Shared growth primitive: `Bnext=B*(1+r)+C`; retain signed `growth=B−contributed`. Nominal a compounded k times/year implies monthly r=(1+a/k)^(k/12)−1. Effective annual R instead implies r=(1+R)^(1/12)−1. These are alternative input semantics, not interchangeable formulas.
3. Savings inversion: `C=max(0,(G−PV*(1+r)^n)/A)`, `A=sum((1+r)^j,j=0..n−1)`; for r=0, A=n. Actual terminal value may exceed goal. Zero horizon only succeeds if goal already achieved; otherwise invalid/immediate funding gap.
4. Debt allocation: accrue interest; reserve capped minimums; reject budget below required minimum total; allocate remaining dollars by priority repeatedly until no budget/debt remains. Track payments and payoff by immutable ID.
5. Rent/buy: actual ownership cost uses capped mortgage payment only while balance positive. Choose common monthly resource budget=max(ownerCost,renterCost), then ownerInvestment += max(0,renterCost−ownerCost); renterInvestment += max(0,ownerCost−renterCost), both after growth. Buyer terminal=home−debt+ownerInvestment; renter terminal=renterInvestment. For liquidation subtract explicitly entered selling costs and any separately supported taxes. This equal-budget specification is a recommended model change, not an assertion that current code intended it.
6. Retirement: choose dollar basis first. If need is today's dollars, initial nominal need at retirement=need×(1+inflation)^yearsToRetirement; annual nominal spending can then increase by inflation. Depletion simulation must specify pre/post-retirement returns independently and return whether balance survives horizon. Withdrawal-rate estimate is separate from modeled spending.
7. Salary: progressive ordinary-income tax plus independently modeled employment taxes. Additional Medicare under the explicitly single-worker wage-liability scope; named-state values need real tax-year engines or replacement by user estimates. Use per-worker SS limits.
8. Budget: current arithmetic need not change except undefined zero-income ratios; rename result to remaining-income rate. Net worth: maintain separate snapshot and aggregate illustrative projection; never mix equity and gross asset values.

Do not route everything through current `lib/finance.ts` unchanged: `futureValue`, `requiredMonthlyContribution`, and `amortizingPayment` treat all rates≤0 as zero. Active calculators presently mostly duplicate formulas rather than using these helpers. Share a validated, documented primitive only after fixtures pass.

## F. Source audit

Checks below were performed 2026-09-18. All current source organizations are U.S. bodies/institutions. The product is USD/U.S.-tax oriented; general arithmetic is portable but mortgage, payroll and retirement context must not be presented as jurisdiction-neutral. A reputable homepage does not substantiate a particular formula or current value. “Fetch failed” is not a verified 404. Publication dates and effective years are different concepts.

| Current URL (all unique references in calculator catalog and Sources page) | Retrieval / freshness | Claim support | Decision |
|---|---|---|---|
| [CFPB Owning a Home](https://www.consumerfinance.gov/owning-a-home/) | Retrieved; page modified June16,2026 | Housing education, not mathematical proof or local cost estimates | Keep as further reading; add exact amortization/PMI/closing pages |
| [Fannie Mae home](https://www.fanniemae.com/) | Retrieved; current site | Homepage does not substantiate mortgage formula; label “Fannie Mae / Freddie Mac” incorrectly implies two linked sources | Replace with specific education page or remove duplicate |
| [Investor.gov compound interest](https://www.investor.gov/introduction-investing/investing-basics/glossary/compound-interest) | Retrieved; no claim-level update date established | Definition, not selected-frequency deposit treatment | Keep definition; add internal formula derivation |
| [Investor.gov home](https://www.investor.gov/) | Retrieved | Broad investor context only | Replace generic duplicate with fees/return-risk page |
| [IRS 2026 announcement](https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill) | Retrieved; Oct9,2025; effective2026 | Standard deduction/basic rates | Keep; attach effective year |
| [IRS RP2025-32](https://www.irs.gov/pub/irs-drop/rp-25-32.pdf) | Retrieved; effective2026 tables §4.01, deductions §4.14 | Exact supported federal values; verifies HOH distinctions | Keep as canonical tax table source |
| [SSA contribution base](https://www.ssa.gov/oact/cola/cbb.html) | Retrieved; explicitly2026 | Wage base/regular employee payroll rates | Keep; archive year snapshot |
| [IRS home](https://www.irs.gov/) | Retrieved | Agency identity, not a tax-year evidence link | Replace data-note source with exact publication |
| [CFPB debt](https://www.consumerfinance.gov/consumer-tools/debt/) | Fetch failed; HTTP404 not established | Unverified current destination; not proof of simulated fixed minimums | Replace with retrieved reducing-debt worksheet |
| [Investor.gov net-worth glossary path](https://www.investor.gov/introduction-investing/investing-basics/glossary/net-worth) | Retrieved “Glossary: NET-WORTH” heading with no definition in accessible body | Insufficient support at this destination | Replace with DOL balance-sheet worksheet |
| [CFPB budgeting](https://www.consumerfinance.gov/consumer-tools/budgeting/) | Fetch failed; status not established | Not verified; cannot justify calling all surplus savings | Replace with cash-flow budget worksheet |
| [DOL Top10 retirement](https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/publications/top-10-ways-to-prepare-for-retirement) | Fetch403 | Guidance source; not original withdrawal research | Keep only after manual access check; add original papers |
| [Investor.gov retirement toolkit](https://www.investor.gov/additional-resources/retirement-toolkit) | Tool reports inaccessible | Unverified; cannot substantiate Trinity findings | Replace/repair and add original papers |
| [CFPB savings-on-a-shoestring](https://www.consumerfinance.gov/consumer-tools/savings-on-a-shoestring/) | Fetch failed | Unverified; not an annuity derivation | Replace with savings-plan worksheet |
| [Federal Reserve home](https://www.federalreserve.gov/) | Retrieved; homepage current September18,2026 | No specific series/model used in rent/buy | Remove unless an identified, actually-used data series is cited |
| [CFPB home](https://www.consumerfinance.gov/) | Retrieved | Agency directory | Retain only organization directory, not claim evidence |
| [DOL home](https://www.dol.gov/) | Fetch failed | Agency directory | Same restriction; no claim-level verification |

Per-calculator disposition:

| Calculator | Keep | Replace / remove | Add | Reason |
|---|---|---|---|---|
| Mortgage | CFPB homebuying as further reading | Fannie homepage | CFPB payment mechanics, PMI, Loan Estimate; independent annuity derivation | Separate expenses from loan math |
| Compound | Investor.gov definition | Investor homepage | SEC fee bulletin; effective-rate definition; documented deposit convention | Frequency and real-dollar assumptions require support |
| Salary | IRS2026 announcement/RP; SSA | IRS homepage data note; unsupported states | Additional Medicare; deduction treatment; historical2025 source; state authorities only if retained | Annual correctness and modeled scope |
| Loan | None of current debt destination verified | CFPB generic debt link | CFPB amortization/negative-amortization explanation; lender allocation caveat | Fixed monthly estimate differs from many credit products |
| Net worth | Formula as direct arithmetic | Generic glossary response | DOL Savings Fitness asset/liability worksheet | Full asset values, debt and liquidity |
| Budget | No current deep link verified | CFPB budgeting path | CFPB cash-flow budget worksheet | Budget timing and remaining money |
| Retirement | DOL guidance conditional on manual check | Broken/unverified toolkit as sole basis | Bengen1994 and Cooley/Hubbard/Walz1998 originals | Historical attribution and scope |
| Savings | No current deep link verified | Shoestring path | CFPB savings-plan worksheet; internal annuity inversion | Goals, time and deposit mechanics |
| Debt | Recognized CFPB organization | Generic debt link | CFPB reducing-debt worksheet; actual statement minimum instructions | Methods do not specify universal minimum-payment formula |
| Rent/buy | CFPB housing context | Fed homepage | CFPB Loan Estimate/PMI/points; explicit internal model ledger | No external authority endorses this bespoke net-position model |

## G. Missing sources

Canonical additions (source codes reused in CONTENT_AUDIT):

- **H1** [CFPB mortgage payment mechanics](https://www.consumerfinance.gov/ask-cfpb/how-does-paying-down-a-mortgage-work-en-1943/): amortization education, retrieved.
- **H2** [CFPB mortgage terms](https://www.consumerfinance.gov/consumer-tools/mortgages/answers/key-terms/): closing/escrow/refinancing definitions, retrieved in search.
- **H3** [CFPB PMI](https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-122/): conventional-loan PMI, retrieved in search.
- **H4** [CFPB points and lender credits](https://www.consumerfinance.gov/ask-cfpb/how-should-i-use-lender-credits-and-points-also-called-discount-points-en-136/): rate/upfront-cost trade-off, retrieved in search.
- **I1** [Investor.gov compounding](https://www.investor.gov/introduction-investing/investing-basics/glossary/compound-interest): definition.
- **I2** [SEC fee bulletin](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/updated): fees and long-run portfolio effects, source found; verify displayed publication date at editorial handoff.
- **I3** [Investor.gov dollar-cost averaging](https://www.investor.gov/introduction-investing/investing-basics/glossary/dollar-cost-averaging): definition, not a universal outperformance claim.
- **T1** [IRS2026 Revenue Procedure](https://www.irs.gov/pub/irs-drop/rp-25-32.pdf); **T2** [SSA base](https://www.ssa.gov/oact/cola/cbb.html); **T3** [IRS Additional Medicare](https://www.irs.gov/taxtopics/tc560); **T4** [IRS retirement contribution tax treatment](https://www.irs.gov/retirement-plans/retirement-plan-faqs-regarding-contributions-are-retirement-plan-contributions-subject-to-withholding-for-fica-medicare-or-federal-income-tax); **T5** [Publication15-B](https://www.irs.gov/pub/irs-pdf/p15b.pdf). No government source validates blended state rates.
- **R1** [Bengen1994](https://www.financialplanningassociation.org/learning/publications/journal/OCT94-determining-withdrawal-rates-using-historical-data); **R2** [Trinity1998 original](https://www.aaii.com/journal/article/retirement-savings-choosing-a-withdrawal-rate-that-is-sustainable); **R3** [SSA retirement planning](https://www.ssa.gov/retirement/plan-for-retirement); **R4** [IRS401(k) overview](https://www.irs.gov/retirement-plans/401k-plans).
- **B1** [CFPB cash-flow worksheet](https://www.consumerfinance.gov/documents/10038/cfpb_creating-cash-flow-budget_tool_2021-08.pdf); **B2** [CFPB savings plan](https://files.consumerfinance.gov/f/201508_cfpb_savings-plan-tool.pdf); **B3** [CFPB emergency-fund guide](https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/); **B4** [DOL Savings Fitness worksheets](https://www.askebsa.dol.gov/savingsfitness/worksheets), retrieved balance-sheet/budget resource.
- **D1** [CFPB debt reduction](https://www.consumerfinance.gov/documents/5782/cfpb_ymyg-toolkit_reducing-debt-worksheet.pdf); **D2** [CFPB credit-card terms](https://www.consumerfinance.gov/consumer-tools/credit-cards/answers/key-terms/).
- **A1** [CFPB Regulation DD definitions](https://www.consumerfinance.gov/rules-policy/regulations/1030/2/): APY-related deposit terminology. **A2** Internal first-principles derivations and independently generated fixtures; label as MoneyBasis methodology, never as an external endorsement.

Older worksheets can remain appropriate for static budgeting concepts; age alone does not invalidate them. Recheck rule-dependent statements. Current rates, future returns and home-cost defaults should not be falsely attributed to these sources. Figures such as 7% return or 3% appreciation are user assumptions, not “current data.”

## H. Assumptions and limitations

| Calculator | Currently user-visible assumptions | Internal technical assumptions / missing material disclosure |
|---|---|---|
| Mortgage | Fixed rate; on-time payments; fees only if entered | Month-end payment; unrounded schedule; constant optional costs; no PMI cancellation; totalCost excludes fees/down payment; integer years |
| Compound | Constant assumed returns; end-month contributions; no guarantee | Selected nominal frequency converted to equivalent monthly growth; 365-day convention; annual deposit step-up; no fractional years; losses clipped; copy incorrectly monthly-only/inflation-excluded |
| Salary | Standard deduction only; selected year; simplified state; Additional Medicare excluded | One worker; state applied to federal wages; otherPretax treated cafeteria; weekly worked weeks vs biweekly calendar; no W-4 withholding; missing deduction chart slice |
| Loan | Monthly interest; extras to principal; no fees/deferments/variable rates | One-time after interest; recurring extra immediate; one-cent payoff cutoff; sparse rows; 100-year cap; chart independent replay |
| Net worth | Snapshot separate; constant rates/payments; no taxes/inflation; redirected paydown in methodology | All assets same return; debt budget external to assets; end-month rollover; no depreciation; at10/20/30 unavailable treated0 |
| Budget | Monthly categories; after-tax intended; ratio defined in copy | All category amounts treated spending incl savings; zero denominator returns0; positive-only chart; only first subscription entry |
| Retirement | Constant return assumption; 4% heuristic; 5% drawdown cap; no taxes/pension/SS/inflation | Enabled inflation ignored; fixed nominal need; drawdown not selected-rate policy; no depletion status; age clamping; asset-allocation/sequence risk absent |
| Savings | Constant monthly growth; current money earns return | End-month deposit; annual chart/capped values; alreadyThere based on future FV; current date implicit; exact600 off-by-one; no taxes/fees |
| Debt | Minimums on others; selected priority visible | Fixed supplied mins vs inconsistent estimated min; static order; lost intra-month excess; no new charges/fees; 600-month cap; name dedup |
| Rent/buy | Invested upfront difference; assumed returns/appreciation; excluded sale/tax costs | Positive renter savings only; no buyer investment; costs tied to appreciation; no HOA/PMI; mortgage cost never stops; asymmetric time-zero position |

User-visible caveats should be next to consequential outputs/controls, not only in footer methodology. Do not call the retirement return cap “conservative” without qualification. Today's money and future money need explicit labels on every headline, chart, table and export. Shared scenarios should include model version so old links do not silently change meaning after fixes.

## I. Cross-calculator consistency issues

### MoneyBasis Calculation Conventions

1. **Units:** USD; distinguish annual versus monthly money; engine rate decimals separate from UI percentage values. Salary explicitly U.S. wage-only estimate. Mortgage input must mean contractual interest rate, not a fees-inclusive disclosure APR.
2. **Time:** normalize horizons to nonnegative integer months. UI may offer years, but require years×12 integral or constrain whole years. Use one schedule for calculations, graph and table. Include time0 and exact final month; aggregate annual flows by sum and stocks by end-of-year balance.
3. **Contributions/payments:** month-end after monthly accrual by default; initial deposit at time0; increase recurring contribution on annual anniversary, not before first year. Expose beginning-of-month only if every tool implements it consistently.
4. **Rates:** preserve existing nominal conventions until an explicit migration; label nominal annual rate and selected frequency. Offer effective-annual-return mode separately if desired, shared across retirement, goal and investment. Loan nominal rate/12 is consistent in mortgage/rent-buy/loan/debt now; their schedules and payoff handling are not. Net-worth uses the same nominal monthly growth as default compound/retirement/goal.
5. **Rounding:** retain full precision in illustrative projections; display money cents in detailed schedules and calculations where cents matter, optionally whole-dollar summaries. Do not round chart source data in engine. For lender-like cent ledgers declare per-period half-up rounding and compare against that separate oracle. Rates displayed to sensible precision without modifying inputs. Do not hide cents in input while retaining them in state.
6. **Dates:** injected reference month/first-payment date, calendar month arithmetic with month-end clamp; no elapsed-day approximations. Nonfinite/unreached horizons have no date. Test Jan31, leap day and timezone boundaries. Shared links need a reference date if they promise reproducible payoff dates.
7. **Dollar basis:** projections default explicitly nominal; optional real values use a stated base date. Inflation=annual purchasing-power assumption, not investment return adjustment by simple subtraction. Never compare nominal nest egg to today's spending without conversion.
8. **Final payments:** cap at outstanding balance+interest, use remaining allocated budget immediately, include terminal point, distinguish paid from horizon reached and invalid. A one-cent tolerance is for numerical cleanup, not erasing a legitimate one-cent debt.
9. **Terminology:** remaining cash flow ≠ saved money; total loan payments ≠ total housing cost; selected withdrawal ≠ safe income; equity ≠ sale proceeds; priority ≠ chronological payoff order.
10. **Return/result contract:** structured success/invalid/nonamortizing/horizon-exceeded statuses, finite outputs on success, field errors and warnings, shared model version. Current nullable mortgage, Infinity loans, false debt-free flags and NaN savings differ materially.

## J. Edge cases

The following is the required entry-point policy, not a claim that it already exists. It applies equally to typing, shared URLs, saved browser records and direct engine calls. Numeric type plus `Number.isFinite` comes first; clamp only display pixels, never meaningful financial values.

| Field/scenario | Block / warn / allow | Required result |
|---|---|---|
| Required blank, letters, lone sign, malformed separators | Block pending completion | No silent zero or stale previous result; explicitly optional fees may default0 |
| NaN, Infinity, numeric overflow; malformed stored JSON | Block / recover | Field error or safe reset option; no crash; never render nonfinite chart |
| All monetary inputs negative except explicitly modeled signed results | Block | Negative assets/debt/fees/income/rent/deposits invalid in current product contracts |
| Negative net worth, cash-flow deficit, investment loss | Allow | Signed value; no positive-only clipping |
| Zero income | Allow | Absolute deficit/remaining; rate unavailable, not0% |
| Zero initial assets/savings; empty budget/ledger/debts | Allow | Correct0/empty chart; debt-free0 months; no invented payments |
| Zero loan rate / assumed return | Allow | Division-free limit cases |
| Negative loan APR | Block for launch | Current loan domain does not model it |
| Negative assumed investment return or appreciation, greater than −100% effective/year | Allow after consistent support; currently block until fixed | Signed losses and same monthly rate in every output; warn market assumption |
| Annual return40%, unusually high APR/appreciation | Warn, allow within finite bounds | “This is unusually high. Check your assumption.” Rate≥100% is not automatically impossible for all debts; stress fixture, horizon/overflow limits still apply |
| ≤−100% effective annual return; inflation≤−100% | Block | Invalid growth base; no complex/undefined values |
| Huge finite amounts | Allow within documented computational range; warn | Relative projection tolerance; block unsafe cent magnitudes and nonfinite results |
| Down payment>price or percent>100; price≤0 | Block | Explain relationship |
| Down payment=price | Allow | No mortgage required; zero P&I; recurring housing costs separate |
| Term0 with unpaid principal; negative horizon | Block | No payment estimate |
| Zero goal horizon with unmet target | Block monthly estimate | Show immediate funding gap; achieved goal is allowed |
| Fractional years | Allow only if represented as integral months; otherwise block | Headline, schedule and date use same month count |
| Current age<0, retire<current, life expectancy≤retire | Block | Clear cross-field validation; do not silently clamp |
| Age fractions | Block for whole-age interface or explicitly support months | No truncated age-year loops |
| Hours/week≤0 or>168; weeks/year≤0 or>52 under chosen convention | Block | Define paid weeks; use explicit separate payroll calendar |
| Deductions>gross; unsupported status/year/state code | Block | Unknown state must not silently mean no tax; reject unsupported year without UI crash |
| Debt payment<interest / =interest | Warn and return nonamortizing | Balance grows / stays flat respectively; no payoff date |
| Budget<sum required capped minimums | Block schedule | Show required minimum and shortfall |
| Duplicate debt/account ID | Block | Unique identifiers; duplicate names allowed with warning/identification |
| Duplicate budget names | Allow/warn | Count all amounts; optionally group display; no loss of data |
| Minimum0 on positive debt | Warn/require confirmation | Not a credible default contractual minimum; don't silently guess |
| Goal saved≥target | Allow | Achieved now, monthly deposit0, full actual balances; suppress misleading what-if |
| Goal met by future growth only | Allow | No additional deposits estimated; current goal not achieved |
| Schedule cap reached with debt/balance remaining | Warn/explicit status | Not paid within horizon; no debt-free date |
| Exact payoff at horizon | Allow | Success; boundary checked after final payment |
| Invalid date / nonfinite months | Block date output | Keep a valid financial status and no misleading date |

Current parser strips nonnumeric characters (`1e3` becomes13, `12abc` becomes12), maps blank to0, formats default step1 inputs as whole dollars, and doesn't enforce `min` on text fields. Error props are visual only. `useSharedInputs` limits finite magnitudes and some year keys but not all relational/rate domains; `yearsToStay` is caught by its prefix, while lifeExpectancy lacks the age/year-name check. `useDeviceRecord` directly JSON.parse's saved records without catch/schema. These are correctness inputs, not merely UX polish.

## K. Test cases

[TEST_MATRIX.md](TEST_MATRIX.md) contains 160 executed reference cases: at least3 normal,3 edge,2 extreme and1 invalid per tool, plus bracket-boundary and defect probes. Each includes actual function name/arguments, expected fields, observed fields, tolerance and why it matters. Recommended behaviors are labeled; mismatches are not all newly discovered arithmetic bugs. Independent expectations use Python Decimal (50 digits), discounted-payment sums, geometric contribution sums and explicit money-conserving ledgers, never a call to production logic.

Notable independent examples: M1 $2,022.617675 P&I; I1 $300,850.718403 future value; S1 $61,592.50 annual net under stated narrow scope; L1 62 payments/$5,511.17 interest; default budget $1,300 remaining/26%; R1 $1,728,497.477022 nominal nest egg; G1 $849.390792 required monthly. Debt and rent/buy mismatch cases have explicit counterfactual model definitions.

## L. Automated test architecture

Keep existing Vitest. Split `tests/calculators.test.ts` into calculator-specific suites as coverage grows; preserve existing tests. No new production test files were installed during this audit.

```text
tests/
  fixtures/financial/*.json     # reviewed independent literals + source/effective year
  mortgage.test.ts
  compound-interest.test.ts
  salary.test.ts
  loan-payoff.test.ts
  net-worth.test.ts
  budget.test.ts
  retirement.test.ts
  savings-goal.test.ts
  debt-snowball.test.ts
  rent-vs-buy.test.ts
  conventions.test.ts          # dates, units, statuses, rounding
  validation.test.ts           # UI/share/storage/function input parity
  integration/outputs.test.ts  # result→chart/table/CSV reconciliation
  e2e/calculators.spec.ts      # rendered defaults, editing, invalid fields, advanced options
  sources.test.ts              # metadata completeness; network link check separately
```

Unit: rate conversion, payment, signed growth, tax slices, exact payoff boundaries. Financial fixtures: committed inputs/literal expectations independently reviewed. Properties: ledger conservation; principal sum=original; monthly paid≤budget; final positions reconcile; same assumptions produce same investment accumulation across tools. Do not assert avalanche universally dominates with differing fees/constraints; restrict comparison to the declared fixed-rate equal-budget model. Integration: schedule terminal and headline agree; graph and table use same source; fees stay separate; choosing frequency/tax year updates explanations as well as numbers. UI: blank/negative/cents/malformed input, age relationships, zero goals, state warning, inflation effect, shared URLs, corrupted storage recovery. Freeze clock; no screenshot-only financial tests.

Native Number is sufficient for bounded illustrative projections and unrounded amortization with explicit absolute/relative tolerances. Use integer cents for budgets/current ledger amounts if exact reconciliation is promised. Decimal.js or Big.js is appropriate for a contractual monthly-cent ledger and deterministic half-cent/tax rounding; choose one only if that feature is specified. Do not add a decimal dependency merely to conceal incorrect cash flows. Independent Python Decimal is an oracle, not a mandate for the JS runtime. Avoid subtractive cancellation near zero rates with stable annuity factors.

Tax fixture expectations should be externally reviewed literals, not imports from the data being tested. Link checking runs scheduled separately from deterministic unit tests; distinguish403/timeout from404 and manual follow-up from verification. CI gate: all agreed monetary fixtures, validation and reconciliation tests pass; audit mismatch baseline is not a launch gate until model policies are approved and corresponding implementation repaired.

## M. Current guide audit

All ten actual guides are assessed in [CONTENT_AUDIT.md, section M](CONTENT_AUDIT.md#m-current-guide-audit). They already have worked tables, exercises, calculator CTAs and sources inherited from calculator metadata; they are not empty pages. Most are short introductions with three core sections. Expand explanations and examples, fix contradictions, and replace generic inherited citations with claim-specific sources. The mortgage example is generated by the production mortgage function, so it is not independent evidence of that function's correctness.

## N. New outline for every existing guide

[CONTENT_AUDIT.md, section N](CONTENT_AUDIT.md#n-new-outline-for-every-existing-guide) provides ten individual editorial outlines, worked examples, diagrams/tables, FAQs, calculator tasks, source requirements and suggested length ranges. These are rewrite specifications, not published rewrites.

## O. New guide/blog recommendations

[CONTENT_AUDIT.md, section O](CONTENT_AUDIT.md#o-new-guideblog-recommendations) maps research-backed topic clusters across housing, saving/investing, retirement, debt, income/budgeting and net worth. Search results established topic relevance and primary-source availability; no keyword-volume or difficulty data was available. Priority is editorial judgment, not invented SEO metrics.

## P. Content priority roadmap

[CONTENT_AUDIT.md, section P](CONTENT_AUDIT.md#p-content-priority-roadmap) gives tiers1–4, each topic's intent, calculator, rationale, visual, primary sources, update frequency and evergreen/annual treatment. Financial correctness precedes publishing/SEO. Avoid separate near-duplicate pages for the same search intent.

## Q. Data freshness/update strategy

| Class | Current data/content | Review/version strategy |
|---|---|---|
| Static formula | Payment/FV/subtraction/progressive slicing | Version on methodology change; fixtures on every change; annual review of explanation |
| Annual data | Federal brackets/deductions/SSA cap, selected2025/2026 | Keep existing `data/tax/2026.ts` structure; new year separate immutable file; verify official effective year |
| Annual/rule-dependent if added | State rules, contribution limits, deduction eligibility | Explicit owner and primary sources before enabling; state version must follow selected tax year |
| Rule-dependent, not inherently annual inflation | SS/Medicare rates and Additional Medicare thresholds | Annual review plus legislation-triggered review; never auto-inflate fixed thresholds |
| Frequently changing | Any future live mortgage rate/APY/product offers | None currently imported. Timestamp/context and refresh SLA if added; defaults are not live data |
| User-supplied assumption | Returns, inflation, appreciation, rents, costs, fixed payments, lifespan | Store with scenario/model version; no “last verified market data” claim |
| Educational statements and links | Sources/FAQs/guides/4% discussion | Quarterly link check; annual editorial review; changes in law trigger focused review |
| Runtime dates | Goal/payoff dates | Stable reference month in reproducible scenarios; explicit display basis |

Add per dataset: source URL, document title/section, publication date, effective tax year, verifiedAt ISO date, verifiedBy reviewer, jurisdiction, modeled exclusions, supersedes and checksum. Existing `source` is a descriptive string without URL/date/reviewer; global “September2026 reviewed” is not a source-by-source record. Unsupported future years must not silently reuse current values. Keep2025 sources visible when2025 selected. In autumn check IRS/SSA announcements, verify before January release, rerun tax boundaries and compare changes; monitor intervening laws. Do not invent2027 values now. Annual limits are not presently implemented in retirement; adding contribution-limit claims creates a new maintenance obligation.

## R. Recommended implementation order

1. Agree input/rate/dollar-basis/result-status contracts and freeze independent fixtures. Implement validation at the engine boundary and typing/share/storage adapters.
2. Repair debt budget/rollover/IDs/horizon and rent/buy actual payments/year-zero/symmetric investment. These have direct conservation failures.
3. Repair retirement inflation/drawdown semantics and savings achieved-state/chart/date errors; add explicit nominal/real labels.
4. Repair salary scope: Medicare, deduction categories, per-worker interpretation and state policy; then year-dependent explanatory copy.
5. Unify loan schedule generation and statuses; derive charts/tables/CSV from schedules; fix final endpoints and cents input formatting.
6. Reconcile remaining copy, sources, minimum assumptions, budget labels and net-worth seed; implement source metadata/update checks.
7. Rewrite existing guides with verified fixtures and publish foundational gaps. Expand long-tail content only after correctness gates.
8. Verify live deployment against a recorded build/source manifest, run browser acceptance tests, re-audit all changed formulas and then decide launch readiness.

## S. Launch-blocking items

- D-01/D-02 and all false debt-free/horizon results resolved with budget-conservation and boundary tests.
- V-01/V-03 corrected; V-02's equal-budget policy implemented or product narrowed with unambiguous comparison limits. No invented post-payoff costs.
- Inflation field genuinely works or is removed; spending/withdrawal and dollar bases explicit.
- Salary claims restricted to supported scope; state estimates corrected/removed; Additional Medicare treatment clear at result and tested.
- Savings achieved status truthful; graph not capped; no partial-year mismatch or zero-term monthly solution.
- All supported entry paths validate; errors prevent result generation; malformed saved data cannot crash calculators.
- Headline/chart/table/export reconciliation and final payoff points covered by tests; source links supporting material claims verified or replaced.
- Browser acceptance and production/source parity verified. This audit cannot sign off that gate because deployment access failed.

## T. Nice-to-have improvements

Optional inflation views in net worth/rent-buy, separate cash/property/investment growth rates, user-specified start dates, adjustable contribution timing, explicit retirement income sources, sensitivity tables, additional withdrawal strategies and forecast uncertainty illustrations. Historical scenario/Monte Carlo analysis is a separate scoped model requiring assumptions, data provenance and tests; not necessary to fix today's deterministic bugs. Do not delay core corrections for visual redesign or broad infrastructure changes.

### Inventory appendix: related calculators

| Calculator | Current related calculator slugs |
|---|---|
| Mortgage Calculator | rent-vs-buy, savings-goal, loan-payoff |
| Compound Interest Calculator | retirement, savings-goal, net-worth |
| Salary ↔ Hourly Calculator | budget, savings-goal, retirement |
| Loan Payoff Calculator | debt-snowball, budget, mortgage |
| Net Worth Calculator | retirement, budget, debt-snowball |
| Monthly Budget Planner | savings-goal, debt-snowball, salary-hourly, net-worth |
| Retirement Calculator | compound-interest, savings-goal, net-worth |
| Savings Goal Calculator | compound-interest, budget, retirement |
| Debt Snowball Calculator | loan-payoff, budget, net-worth |
| Rent vs Buy Calculator | mortgage, compound-interest, savings-goal |

### Snapshot evidence manifest

SHA-256 hashes identify the local files used for the audit, including untracked files. These hashes do not identify the deployed build.

| File | SHA-256 |
|---|---|
| `app/guides/[slug]/page.tsx` | `60987a81ab8a766065bfc4d6d62b54e8f688dfb0471ebaeb7812ad5c02133463` |
| `components/calculators/budget-calculator.tsx` | `82e6a6ccdfbf7bd03be07404dfb3f9e946deafe70e7da29dedfe7be83784e7d3` |
| `components/calculators/calculator-app.tsx` | `7243974b54ea8b1e651636903f7a903efeb393af1b3dddfdb343bc30d2d0d618` |
| `components/calculators/debt-snowball-calculator.tsx` | `3bea5c9ca90352a14cbbd612a11ad7905ae10a3480202eb31527a145edc61cfc` |
| `components/calculators/directory.tsx` | `074658e19d0bd0dc09b4008eb742795e6f44067e9267eb2b629c159983bc277c` |
| `components/calculators/investment-calculator.tsx` | `25f036023946290f591efc32fd96b4e31ec4884846943e55c9ecadbe691ca37f` |
| `components/calculators/loan-payoff-calculator.tsx` | `6f632880d506f5fcd392289426e1d74568ef73bc07b9d920443535caaa58ec67` |
| `components/calculators/mortgage-calculator.tsx` | `b8ecf690124d51eb955a2690c770988ea8797a524198a5cfebad8dda1670547d` |
| `components/calculators/net-worth-calculator.tsx` | `f96d1285f3767de53a16987af903c1cd2310550b32a9ab84022c98c81e019456` |
| `components/calculators/rent-vs-buy-calculator.tsx` | `34e33d50b0c90ac469ed64975df41b99eaf923595a2e4097542087b710ccd8b1` |
| `components/calculators/retirement-calculator.tsx` | `cbabdfa4eaf2b977241375975c4736773f01e50e077edc9e07f73351e7ca5bac` |
| `components/calculators/salary-calculator.tsx` | `890421a657d0c33fca1e1efcebc5e5c3b0b27e8f3b15a580091ace91b09c0651` |
| `components/calculators/savings-goal-calculator.tsx` | `a08ace7ef10fe55060de60c8aead8b3c417fe3b2e681cb4ca981278d099cf142` |
| `components/inputs/fields.tsx` | `9c77186666788667566c80c42b1f1775448639fc24950b3c10def5815b26c62f` |
| `data/tax/2025.ts` | `9471aa636252f01823a25c7310dc97f8b550ebf6d96869ee32da35a079196f9e` |
| `data/tax/2026.ts` | `0c97318c8cfa718a1555181eefe7fe2cfbbb6112f3c42b8d1e0e07f98b6c7999` |
| `data/tax/index.ts` | `32dd42a74710c8381945997c6423998b36c078e1d34f8235445221edd20943a1` |
| `data/tax/states.ts` | `2f69656fc26bfce304be98c7b77a5c3c3161cb60fec03294095ff99556300fc4` |
| `data/tax/types.ts` | `89ed08a8441db8e05adecbe2cee16271f38591ae2f8d5d5a9085f7e2e143b341` |
| `lib/calculators/budget.ts` | `f4fcb9173157c4156a72c27e995dba8a522c3bd4af06e862b21d0eb46f1bca02` |
| `lib/calculators/catalog.ts` | `61e995bed8a223772163fe31f082220ece2060635daad124effb05f1074fddd5` |
| `lib/calculators/debt-snowball.ts` | `fb020d831495cbc90158df808fc3c029164f19c403fc59e3ce1b4b99414c455b` |
| `lib/calculators/guides.ts` | `733e466ae23f6dea5f12af1ce53604718ec8356fadc116d1c38e3500f5eb2b68` |
| `lib/calculators/investment.ts` | `eeb0f8c8cdb91f8ca178f816e1df635bdb9cdcd2051dda7de094ed3a18f5fca7` |
| `lib/calculators/loan-payoff.ts` | `04d137019f54b582293caf7c4c2f514049d162266810879358e55cb13f0ab7f4` |
| `lib/calculators/mortgage.ts` | `5970b2ce49361dd3dbb3d1d93e01b33e7a82b482e041446e07ce44a62bb3720f` |
| `lib/calculators/net-worth.ts` | `4d78e6760004f690cf1b62f1e0d249eead980822352ba7ea3326c6ccdba553d1` |
| `lib/calculators/page-copy.ts` | `f46942c53b72fb246ef279eb928e1f7cc7e78f856f49f6f797b769e9b51f1125` |
| `lib/calculators/rent-vs-buy.ts` | `864c6fdd31d0188863e9c8b1441cf9a15dd64d1c08a11b334b043fcd983dc226` |
| `lib/calculators/retirement.ts` | `caa9ebd8de97d7e159306f352387f31fc13249d52e0665631492fde39daadb55` |
| `lib/calculators/salary.ts` | `69518e91e0b512fb6c3e38a276c33954410c078ca3ad921485dc29b12d0cc63b` |
| `lib/calculators/savings-goal.ts` | `829567db6bc53303b104bcad107664a64db91457bcaf10cc1fd9b25ffc1ff405` |
| `lib/finance.ts` | `8c8e1fcedbec44b71dc37729984d00f7e2251dbf81f2f3171f39533349a7e264` |
| `lib/format.ts` | `7473f3f5e7d93ea4fa5163797c4b58461d1895a3df74850ee8479ddde16f90ca` |
| `lib/guides/catalog.ts` | `ac71c95c5321c3a5f016c6520e0822a27562abca3bede2df922861aaf2925537` |
| `lib/guides/examples.ts` | `b22a5189011341f0934f9c69cb4f44b09d097fc61b9cf6d2793ebea7fe8e6ee9` |
| `lib/persistence.ts` | `36c59e07b8875a7f800d1ac32ea0dc57f8de8f3def421cac5015c12b3e286ec6` |
| `lib/use-device-record.ts` | `b53fc0772aa48b8633fd1d0f0eb2567fd63583c36656174d1bd175233e453965` |
| `lib/use-shared-inputs.ts` | `6ff2af84a4beda7ed6b0e3915f0527eae780ecad46eeb103d92730617b91d868` |
| `tests/calculators.test.ts` | `653483a93215aaabd6761a6b90df8cd844dcb6a70d7b88bab0aaf78f25bdb091` |
