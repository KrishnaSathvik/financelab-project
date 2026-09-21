# MoneyBasis content and guide audit

Audit date: 2026-09-18. Editorial specification only; no guide or application code edited. Companion reports: [CALCULATOR_AUDIT.md](CALCULATOR_AUDIT.md) and [TEST_MATRIX.md](TEST_MATRIX.md). The full requested A–T report is organized in CALCULATOR_AUDIT; this document expands M–P.

## M. Current guide audit

Actual inventory: ten guides in `lib/guides/catalog.ts`, each with three core sections. Nine use static worked-example tables in `lib/guides/examples.ts`; mortgage renders a live example from `calculateMortgage` in `app/guides/[slug]/page.tsx`. Renderer adds introduction/summary, takeaway, example, exercise, calculator CTA, inherited calculator sources, update label and two related guides. Do not mistake the short catalog body for the entire page. Related guides are selected by category/order rather than an individually curated learning path. Non-mortgage TopicVisual artwork is illustrative; it is not an evidence-based financial chart.

All nine static table examples were reviewed: compound annual5% rounds correctly to12763 at5y and16289 at10y; salary62400/2080=30; net worth357000−240000=117000; budget5000−3700=1300 and26%; debt priority example ranks2000 balance vs22%APR correctly but has no payoff result; loan first-month interest100 and principal200/300 are correct; retirement750000×3/4/5%=22500/30000/37500; housing4800+2400+3600 annual=900 monthly; savings9000/12,24,36=750,375,250. Mortgage's independently checked payment is2022.617675, appropriately rounded2023 in prose. **Numerical correctness of these small examples does not validate the full calculators.**

The following reviews cover intent, accuracy, omissions, sources, examples/visuals, calculator integration, related guides, FAQs, length and removal/expansion decisions. Suggested word counts are editorial ranges, not ranking targets. Keep original URLs unless a deliberate redirect plan exists.

### Mortgage amortization — `/guides/mortgage-amortization`

- Intent/question: “Why is most of my mortgage payment interest, and how does the balance fall?” Strong match to informational search; preserve title **How Mortgage Amortization Works**.
- Accuracy: core explanation and P&I exclusions correct for a fully amortizing fixed-rate loan. “Early payments are mostly interest” is not universal at low rates/short terms; qualify with the actual example. Equity also changes with price/down payment, not just principal.
- Missing/expand: note rate versus APR; zero-rate case; payment timing; annual totals vs cumulative totals; final rounding; extra payments vs recasting; escrow can change while P&I is fixed.
- Sources/freshness: CFPB payment mechanics H1 and mortgage terms H2; PMI H3. Formula static; rule caveats annual. Do not cite Fannie homepage as formula proof.
- Example/table/chart: retain400k/80k/6.5%/30y; add first month interest1733.33/principal289.28; first12 payment rows and annual1/5/10/20/30 totals. Label stock balance versus flow payments. Diagram: payment → interest/principal; compare15y/30y under same loan/rate.
- Calculator task: load identical example assumptions into Mortgage, then add housing fees separately. Existing CTA opens generic calculator; specify prefilled links after scenario validation is repaired.
- Related: Loan Prepayments; Rent vs Buy Costs. FAQs: Why did escrow rise? Does extra principal change monthly payment? What happens at0%?
- Target900–1300 words. Remove universal “mostly interest” phrasing and unexplained agency homepage links; expand interpretation, not introductory repetition.

### Compound interest — `/guides/compound-interest`

- Intent/question: “How do interest, time and monthly deposits produce a future balance?” Preserve topic; title **Compound Interest: Growth, Contributions and Inflation**.
- Accuracy: annual5% lump-sum table correct and explicitly annual; differs from default calculator monthly compounding. Heading “Nominal return versus future results” does not teach nominal versus real return. Calculator's negative-growth clipping must be fixed before a loss example is wired.
- Missing/expand: PV/FV/deposit distinction; end-month timing; nominal rate vs effective annual yield; annual frequency with monthly contributions; signed losses, fees and purchasing power; deposit step-ups.
- Sources: I1 compounding, I2 fees, A1 yield definitions, internal A2 derivation. Static math; annual link/product-copy review.
- Examples/table/chart: retain10000×1.05^10=16288.95; pair with500/month scenario and0% control. Show contributions and growth separately; real-dollar layer labeled with inflation/base date. Frequency comparison must hold either nominal rate or effective yield constant and say which.
- Calculator task: select **annual** frequency to reproduce current example; then add monthly contributions. Related: Savings Goal; 4% Rule; new Nominal vs Real guide.
- FAQs: Can growth be negative? Why do frequencies change results? Do deposits earn a full year's return?
- Target1100–1500 words. Remove any suggestion that assumed market growth is contract interest or that compounding always dominates contributions; expand controls users can actually influence.

### Salary versus hourly — `/guides/salary-vs-hourly`

- Intent/question: “What hourly wage equals my salary, and why is take-home different?” Title **Salary to Hourly: Gross Pay, Paid Weeks and Tax Estimates**.
- Accuracy:62400/2080=30 and monthly/weekly table correct for52 paid weeks. Tax explanation is incomplete rather than a paycheck guarantee; technical discussion of storing tax data is low value for readers.
- Missing/expand: paid versus worked hours, unpaid leave, overtime/benefits/bonus exclusions, biweekly26 vs semimonthly24, annual liability vs withholding, standard deduction vs credits, marginal/effective rates, FICA/deduction treatment, spouse-income scope and state limitation.
- Sources/current data: T1–T5, with effective2026 explicit. Keep conversion evergreen and put annual tax example in a versioned box. No unsupported state-by-state assertions. Any overtime eligibility detail requires a separately checked DOL source before publication.
- Example/table/visual: retain30/hour conversion; add independently verified75000 single2026 waterfall gross75000−federal7670−SS4650−Medicare1087.50=61592.50 under no other deductions/state. Diagram distinguishes gross→taxable wages→tax→net. Add a deductible401k contrast without implying FICA exemption.
- Calculator task: reproduce gross example and then change paid weeks while preserving annual salary; enter selected tax year/deductions. Related: Monthly Budget; new Gross vs Net/FICA guide.
- FAQs: Why isn't biweekly twice monthly? Does401k lower FICA? Is this my paycheck? Does MFJ include my spouse?
- Target1200–1700 words. Remove implementation-storage paragraph; replace with practical tax-year scope and annual verified-source badge.

### Net worth — `/guides/net-worth`

- Intent/question: “What should I count and how do I avoid double-counting my home?” Preserve **How to Calculate Your Net Worth**.
- Accuracy: snapshot formula and117000 worked example correct; full-value instruction is strong and conflicts with calculator seed name “Home equity value.” “Not a statement of financial health” is too categorical; net worth is one incomplete indicator.
- Missing/expand: valuation date, market vs purchase value, full home/mortgage separation, liquid assets, retirement tax status, joint ownership allocation, negative net worth and meaningful changes over time. Do not conflate nominal gain with improved liquidity.
- Sources: B4 DOL balance-sheet worksheet; internal A2 arithmetic. Review yearly, formulas static.
- Example/table/chart: retain357000 assets/240000 liabilities; add double-counting error60k equity−240k mortgage vs correct300k−240k. Table gross assets/liabilities with common valuation bases; asset/liability bars plus liquidity grouping; projection in a visibly separate box.
- Calculator task: enter example full values as of same date; only then toggle projection and inspect assumptions. Related: Monthly Budget; new Liquid vs Illiquid Assets.
- FAQs: Count retirement accounts? Home equity or value? Is negative net worth possible? Does a credit limit count as debt?
- Target900–1300 words. Remove moralizing/implied score language; expand valuation consistency and clarify a snapshot is not a spending budget.

### Monthly budget — `/guides/monthly-budget`

- Intent/question: “How do I build a usable budget and know what's actually left?” Preserve **How to Build a Monthly Budget**.
- Accuracy:5000−3700 and26% example correct; takeaway correctly says leftover becomes savings only when set aside. Core section calls it savings rate and suggests savings as expense category: internally inconsistent with current formula.
- Missing/expand: after-tax income, irregular bills/annual equivalents, transfers versus expenses, debt interest/principal, irregular income, zero-income and deficit cases, timing of cash rather than just monthly totals, duplicate transactions.
- Sources: B1 cash-flow worksheet, B3 emergency fund. Annual editorial review; no universal target percentage needed.
- Example/table/chart:5000 income/3700 expenses/1300 remaining; add500 savings transfer to show cash remaining800 and actual transfer rate10%, not16% “savings.” Include annual600 bill→50/month. Donut percentage-of-spending versus income allocation bar must label denominator.
- Calculator task: reconcile complete spending before assigning goal payments; until savings categories exist, explain current planner treats every category as an outflow. Related: How Much to Save; Debt Snowball; new Sinking Funds.
- FAQs: Are transfers spending? What if expenses exceed income? How to handle income paid every2weeks? Why isn't remaining cash already savings?
- Target1100–1500 words. Remove instruction to automatically treat leftovers as savings; expand tracking and end-month reconciliation rather than imposing50/30/20.

### Debt methods — `/guides/debt-snowball-vs-avalanche`

- Intent/question: “Which account gets extra payments, and what changes the cost?” Preserve **Debt Snowball vs Debt Avalanche**.
- Accuracy: method descriptions and priority example correct; behavioral motivation qualified. Existing table lacks minimums/budget, so cannot substantiate payoff time or interest. Engine fixes must precede worked payoff claims.
- Missing/expand: same budget, contractual minimums, fees/promotional rates, monthly vs actual daily interest, immediate rollover, infeasible budget, stable ties and no new borrowing. Explain why priority order may differ from chronological payoff order.
- Sources: D1 CFPB worksheet; D2 credit-card terms. Review annually and when minimum/promotional assumptions change.
- Example/table/chart: use full default debts/budget800 after repair. Independent fixed-minimum reference: snowball26mo/$2075.23 interest; avalanche26mo/$1883.84. Give first2 month allocations and comparison ledger; these are conditional examples, not individualized advice. Chart debt balances with both final endpoints.
- Calculator task: keep all inputs/budget fixed while switching method; then separately test budget changes. Related: Loan Prepayments; Monthly Budget; Credit-card Minimum Payments.
- FAQs: What if minimums exceed budget? Is avalanche always best? Why did an untargeted account finish first? Can rates change?
- Target1100–1500 words. Remove any categorical winner or exact date without stated first-payment month; expand feasibility and follow-through.

### Loan prepayments — `/guides/loan-prepayments`

- Intent/question: “How much time and interest can an extra payment save?” Title **Extra Loan Payments: How Principal, Interest and Payoff Change**.
- Accuracy:10000/12% first-month100 interest correct for monthly model;300 payment leaves9800,400 leaves9700. “Interest typically calculated monthly” needs qualification for daily-accrual products.
- Missing/expand: final partial payment, monthly vs one-time extras, interest-only vs below-interest behavior, penalties, due-date advancement vs principal allocation, variable rates, recasting/refinancing distinction.
- Sources: H1 mechanics, H2 terms, D2 credit-card APR; lender-specific instructions remain user-specific, not assumed.
- Example/table/chart: extend existing example:300→41mo/$2224.95 interest,400→29mo/$1564.88; savings12mo/$660.07. Use full-precision planning convention, separate from real lender cent rounding. Show first two payments and terminal payment; difference chart marks payoff months.
- Calculator task: identical balance/rate with0 vs100 extra, then one-time extra month1. Related: Mortgage Amortization; Debt Methods.
- FAQs: Does extra reduce next month's required payment? What if payment only covers interest? Can I pay off with a lump sum? Why differs from lender?
- Target1000–1400 words. Remove unqualified monthly/day-count language; expand contract limitations and payment allocation.

### 4% rule — `/guides/four-percent-rule`

- Intent/question: “What does4% mean and why isn't it a guarantee?” Title **The 4% Rule: Origins, Inflation and Retirement Risk**.
- Accuracy: table750k×3/4/5% correct; first-year versus monthly equivalent distinguished. Guide's “including1998Trinity” is better than calculator's exclusive attribution; add Bengen1994. Current deterministic nominal drawdown is not a historical test of inflation-adjusted withdrawals.
- Missing/expand: initial-balance percentage vs annually recalculating percentage, inflation indexing, allocation, study horizons, sequence risk, expenses/taxes/longevity and spending flexibility. Explain that “success” depends on study's definition/time horizon, not lifetime certainty.
- Sources: R1 original1994 article, R2 original1998 paper; R3 benefits separate from investment withdrawal. Historical sources stable; annual interpretation review. Avoid specific success percentages unless reproduced from exact table/portfolio/period.
- Example/table/diagram: retain750k sensitivity; hypothetical3% inflation changes year-two30000 to30900 under fixed-real-spending policy; variable percentage is a different policy. Sequence diagram with same two returns in reversed order and withdrawals illustrates path dependency; calculate independently before publication.
- Calculator task: explain selected-rate arithmetic versus desired-income drawdown and choose dollar basis after R-01 repair. Related: Compound Interest; new Sequence Risk/Nominal Retirement Income.
- FAQs: Is4% of original or current balance? Does rule include tax? What about40-year retirement? Why doesn't an average return ensure success?
- Target1400–1900 words. Remove unsupported “safe/conservative” language; expand distinctions rather than prescribing a withdrawal rate.

### Rent versus buy — `/guides/rent-vs-buy-costs`

- Intent/question: “What should I include beyond rent and the mortgage payment?” Title **Rent vs Buy: Compare Cash Costs, Equity and Opportunity Cost**.
- Accuracy: ownership4800+2400+3600=10800/year=900/month correct. Conditional no-universal-winner language is good. Missing sale/PMI/HOA costs and asymmetric investment assumptions limit usefulness.
- Missing/expand: both sides' equal starting resources and monthly budgets, principal as cash outflow but asset transfer, closing vs selling costs, liquid portfolio vs illiquid equity, maintenance uncertainty, separate cost growth, time horizon and nonpersistent crossings, taxes excluded rather than guessed.
- Sources: H1–H4; no Federal Reserve homepage as support for bespoke model. Annual rule review; examples are assumptions, not current-market statistics.
- Example/table/diagram: retain monthly cost conversion; add corrected120k/20%/0%/10y/800rent example and after-payoff comparison. Table upfront/monthly/exit costs vs wealth transfers. Two-lane cash-flow diagram including buyer portfolio; sensitivity grid rent/appreciation/horizon with neutral labels.
- Calculator task: short/medium/long horizons with same assumptions, then vary only one return assumption. Publish comparison examples only after V fixes. Related: Mortgage Amortization; new Down Payment/Closing Costs.
- FAQs: Is equity spendable? Where does down payment go? Are taxes/sale costs included? Can a crossover reverse?
- Target1400–1800 words. Remove vague “cost difference invested” unless both directions specified; expand exit costs and same-resource comparison.

### Monthly savings — `/guides/how-much-to-save`

- Intent/question: “What monthly deposit reaches my goal and fits my budget?” Title **How Much to Save Each Month for a Specific Goal** narrows an overly broad promise.
- Accuracy:9000 gap/12,24,36 correct. Guide correctly says future growth can require zero deposits, unlike calculator's “Already there.” No personalized universal savings recommendation is warranted.
- Missing/expand: today vs future goal dollars, precise monthly horizon/end-month timing, future growth of existing savings, achieved vs on-track-without-deposits, short-horizon risk, taxes/fees, changing deposit capacity and multiple goals.
- Sources: B2 savings-plan worksheet, B3 emergency fund, I1 growth; A2 annuity inversion. Static math; annual link review.
- Example/table/chart: retain12000goal/3000saved/0% table; then50000/5000/4%/48months →849.390792 monthly and future-current-savings subtraction. Show gap, existing savings' future value, deposited contributions and growth without cap. Date timeline should use actual months.
- Calculator task: start0% and compare target dates; budget-check result; only then add a clearly assumed return. Related: Monthly Budget; Compound Interest; Emergency Fund.
- FAQs: What if goal already funded? Can required monthly amount be0 while below target? What if investment falls? Does goal include inflation?
- Target1000–1400 words. Remove generalized “should save” implication; expand affordability and target-date uncertainty.

## N. New outline for every existing guide

These are complete structural briefs; each includes plain-language opening, takeaway, mechanics, example, visual, errors/limits, practical scenarios, CTA, sources and related learning. Do not turn them into ten identical articles. Claim-specific sources belong beside factual statements, with a short source list at end.

### Mortgage amortization

1. Open on a statement showing little principal reduction; takeaway: balance determines interest, not an arbitrary front-loaded fee.
2. Annotated payment: outstanding principal, note rate, period interest, principal reduction; distinguish escrow.
3. Formula with symbols/units; zero-rate branch; derive from discounted payments in an optional expandable box.
4. Walk first payment of320000/6.5%/30years; show unrounded math then display cents.
5. First12-month table and annual1/5/10/20/30 table; label annual flow versus ending stock. Principal/interest stacked bars.
6. Compare15 and30years with same loan/rate; identify payment versus total-interest trade-off.
7. Extra principal scenario; distinguish reduced term, recast and refinancing without assuming eligibility.
8. Common mistakes: APR vs note rate, total payment vs P&I, down payment vs principal, escrow changes, cents reconciliation.
9. Assumptions/limits: fixed rate, monthly timing, no late fees/prepayment penalties; PMI context linked.
10. CTA: reproduce example then add taxes/insurance; FAQ; H1/H2/H3 sources; related Loan Prepayments/Rent vs Buy.

### Compound interest

1. Open with10000 at5% for one year; key idea is growth on retained growth, not guaranteed return.
2. Lump-sum mechanics and year1/5/10 table with annual frequency explicitly selected.
3. Contributions are new money, not returns; end-month deposit timeline and annuity sum explanation.
4. Compare0% versus selected positive return, constant contribution; show contributions/growth separation.
5. Nominal compounding frequency vs effective annual yield: change one assumption at a time.
6. Advanced scenario: annual deposit increase, then fees and inflation; real/nominal labeling.
7. Negative return example and volatile path caveat; deterministic curve is not forecast.
8. Common mistakes: beginning/end timing, rate semantics, contributions miscounted, growth clipped, confusing balances with purchasing power.
9. Practical tasks: long-run investment versus short-term savings goal; CTA with exact frequency inputs; FAQs.
10. I1/I2/A1 and internal derivation; related Goal/Retirement/Nominal vs Real.

### Salary versus hourly

1. Open with62400 and30/hour; takeaway: gross conversion and net estimate answer different questions.
2. Define hours and paid weeks; formula; unpaid leave/overtime/bonus/benefit exclusions.
3. Gross annual/month/week/hour table;26biweekly vs24semimonthly and calendar averages.
4. Gross→taxable federal wages after eligible deductions→standard deduction→progressive slices.
5.2026 single75000 example; show every tax and deduction in a reconciled waterfall.
6. Social Security cap/Medicare and high-income surcharge; one-worker scope and MFJ caution.
7. Traditional401k vs FICA-exempt benefit distinction; state/local estimates and unsupported tax situations.
8. Annual tax liability vs withholding/W-4; why a payroll deposit may differ.
9. Practical comparison of48 vs52paid weeks; calculator CTA; FAQs about deductions/pay periods/year.
10. Versioned T1–T5 citations; related Budget/Gross vs Net. Keep annual facts isolated from evergreen conversion.

### Net worth

1. Open with one-date balance sheet; takeaway assets minus liabilities is a snapshot.
2. What qualifies as asset/liability; market value/date and ownership share.
3. Worked357000−240000=117000 table with full home value, separate mortgage.
4. Show double-counting mistake and correct alternatives; choose full values consistently.
5. Assets/liabilities bars and liquid/illiquid grouping; why equal net worth can imply different cash access.
6. Negative net worth, changes since last snapshot, and effect of principal payment versus investment gain.
7. Separate illustrative projection: one assumed asset rate, debt interest, savings and payment rollover; no promised trajectory.
8. Practical monthly/quarterly update checklist, valuation uncertainty and retirement taxes excluded.
9. Calculator CTA entering full values; FAQs; B4 source and internal arithmetic; related Budget/Liquidity.

### Monthly budget

1. Open on a month with money left but bills still coming; takeaway “remaining” is not saved.
2. Gather take-home income and month/annual/irregular outflows with dates.
3. Build5000/3700/1300 worked table; show600annual→50monthly.
4. Explain spending, transfers, debt payments and explicit savings assignments; demonstrate500transfer/800unassigned.
5. Define remaining-income rate versus actual savings-transfer rate; zero-income and deficit examples.
6. Spending donut vs income allocation bar, denominator labels and cash-timing timeline.
7. Practical paths: irregular pay, deficit, planned large bill; avoid counting debt purchases/payment twice.
8. Reconcile to actual transactions and update categories; duplicated names vs duplicated spending.
9. CTA: budget first, then goal/debt plan; FAQs; B1/B3 references; related Savings/Debt/Sinking Funds.

### Debt snowball versus avalanche

1. Open with two different rankings; takeaway same money, different target priority.
2. List statement balances/APRs/minimums; feasibility check before choosing strategy.
3. Snowball ordering, avalanche ordering, deterministic ties; minimums on every active debt.
4. Worked three-debt800budget scenario; first2-month allocation table; explain immediate rollover.
5. Full comparison26months under both in this example but different interest; assumptions and independent fixture IDs D1/D2.
6. Balance chart and chronological payoff markers; priority is not always completion order.
7. Behavioral trade-offs without universal winner; compare budget changes separately.
8. Limits: daily APR, variable/promotional rates, new spending, fees and changing minimums.
9. Practical insufficient-budget branch; CTA only after repaired engine; FAQs; D1/D2 references; related Loan/Budget.

### Extra loan payments

1. Open with10000 at12% and300 payment; key idea: extra principal reduces subsequent interest base.
2. Annotate interest100/principal200/balance9800; parallel400 payment example.
3. Extend to full payoff41vs29months and2224.95vs1564.88 interest; disclose full-precision model.
4. Monthly versus one-time extra timeline; show when first interest is charged.
5. First/final payment table and current/accelerated balance chart with exact endpoints.
6. Interest-only and below-interest cases; distinguish nonamortizing from horizon limit.
7. Lender realities: day count, principal instructions, prepayment terms, due-date advance, recast/refinance.
8. Practical fixed-budget scenario; limits and rounding; CTA; FAQs; H1/H2/D2; related Mortgage/Debt.

### 4% rule

1. Open750000×4%=30000 first-year amount; key takeaway arithmetic does not establish sustainability.
2. Historical timeline Bengen1994 → Trinity1998; research question, historical data and horizons, no unsupported success-rate statistic.
3. Fixed inflation-adjusted dollars vs variable percentage of current balance; side-by-side policy timeline.
4.3/4/5% sensitivity table and hypothetical year2inflation illustration.
5. Sequence-of-returns diagram with independently calculated order reversal; distinguish average return from spending path.
6. Taxes, fees, allocation, longevity and flexible spending; Social Security/pension separate.
7. What MoneyBasis does: accumulation, selected-rate arithmetic and separately specified desired-income drawdown; nominal/real basis.
8. Practical30vs40-year scenario and lower/higher spending; never label selected rate safe.
9. CTA after inflation repair; FAQs; R1/R2 originals; related Compound/Sequence Risk/Nominal Retirement.

### Rent versus buy

1. Open on rent vs mortgage comparison that omits costs; takeaway compare resources and ending positions.
2. Define equal starting resources/common monthly budget and chosen horizon.
3. Buying ledger: down payment, closing, interest/principal, recurring costs, mortgage payoff, equity, optional sale proceeds.
4. Renting ledger: rent/insurance/growth, invested upfront savings; both parties invest monthly savings when applicable.
5. Worked monthly cost table900beyond mortgage; distinguish spending from retained assets/transfers.
6. Corrected120000 example with before/after-payoff rows; cash-flow diagram both portfolios.
7. Ending equity versus liquid portfolio, selling-cost view and tax omissions; no invented tax advantage.
8. Sensitivity grid time horizon/appreciation/return; first crossing can reverse, not a buy recommendation.
9. Practical short stay/long stay/high maintenance scenarios; CTA after model fix; FAQs; H1–H4; related Mortgage/Down Payment.

### Saving for a goal

1. Open with12000goal/3000saved; takeaway required deposit depends on time and assumptions, not a universal percentage.
2. Zero-return gap division;12/24/36-month table.
3. Existing money's future value before solving deposit gap; ordinary-annuity formula/zero-rate branch.
4. Worked50000/5000/4%/48months case849.390792; chart balances, deposits and signed growth, no clipping.
5. Achieved today vs no further deposits needed;9000→future10141 at assumed12% example explicitly hypothetical.
6. Target amount/date and nominal/real goal; short-horizon investment uncertainty, fees/taxes and current-date convention.
7. Budget affordability and several competing goals; change date/deposit/target one at a time, not assumed return to force a fit.
8. Practical no-return plan and contribution increases; goal achieved/unreachable states.
9. CTA0%first then selected assumptions; FAQs; B2/B3/I1/internal math; related Budget/Compound/Emergency Fund.

## O. New guide/blog recommendations

Research performed: public web searches for primary educational material on mortgage amortization, PMI/points/closing costs, cash-flow budgeting/emergency funds, compounding/fees/dollar-cost averaging, payroll taxes, retirement research and benefits, and credit-card terms. The source set supports useful education clusters. **No Search Console, paid keyword database, keyword volumes, CPC, ranking difficulty or conversion data was available.** Search phrases below are intent hypotheses; prioritization is based on user decisions, calculator adjacency, evergreen usefulness and correctness risk, not purported search demand.

- **Home & mortgage:** intent families “mortgage payment vs total housing cost,” “15 vs30year mortgage,” “down payment5/10/20,” “PMI,” “escrow,” “mortgage points,” “refinancing break even,” “closing costs,” and “rent buy how long to stay.” Focus on reusable cost tables and equal-assumption comparisons. [CFPB mortgage terms](https://www.consumerfinance.gov/consumer-tools/mortgages/answers/key-terms/), [points](https://www.consumerfinance.gov/ask-cfpb/how-should-i-use-lender-credits-and-points-also-called-discount-points-en-136/).
- **Saving & investing:** “nominal vs real return,” “APR vs APY,” “investment fees over time,” “monthly vs lump sum,” “Rule of72,” “emergency fund size,” and “increase contributions.” Explain controllable contributions separately from uncertain return. [Investor.gov regular investing](https://www.investor.gov/introduction-investing/investing-basics/glossary/dollar-cost-averaging), [SEC fees](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/updated).
- **Retirement:** “sequence risk,” “retirement income today's dollars,” “withdrawal sensitivity,” “early retirement years,” “Social Security basics,” “Roth vs traditional.” Avoid universal milestones or guaranteed safe rates. R1/R2 original research and [SSA retirement planning](https://www.ssa.gov/retirement/plan-for-retirement) provide a primary-source starting point.
- **Debt:** “minimum payment trap,” “APR payoff,” “balance transfer fee,” “consolidation math,” “personal loan vs credit card,” and “debt to income.” Every comparison includes same balance, time, fees and budget; no recommendation based on rate alone. [CFPB credit-card terms](https://www.consumerfinance.gov/consumer-tools/credit-cards/answers/key-terms/).
- **Income & budgeting:** “gross vs net,” “FICA,” “tax bracket vs effective rate,” “biweekly budget,” “sinking funds,” “fixed variable expenses,” “savings rate.” Separate evergreen concepts from annual tax tables. [IRS payroll guide](https://www.irs.gov/publications/p15), [CFPB cash-flow toolkit](https://www.consumerfinance.gov/consumer-tools/educator-tools/your-money-your-goals/toolkit/).
- **Net worth / basics:** “asset vs liability,” “liquid net worth,” “home equity double counting,” “inflation purchasing power,” “simple vs compound interest,” and “financial ratios.” Teach what an indicator cannot tell you. [DOL balance-sheet worksheets](https://www.askebsa.dol.gov/savingsfitness/worksheets).

Publishing policy: one substantial page per distinct intent; enrich an existing guide rather than publish a near-duplicate compound/debt article. Each new article must contain a worked example, explicit assumptions, a useful visual/table and a calculator task that currently works. Do not imply existing tools support refinancing, balance transfers, multiple workers or historical simulation until they do. A manual example or downloadable worksheet can teach an unsupported scenario without inventing calculator functionality.

## P. Content priority roadmap

Source keys H1–H4/I1–I3/T1–T5/R1–R4/B1–B4/D1–D2/A1–A2 are defined with direct links in [CALCULATOR_AUDIT.md §G](CALCULATOR_AUDIT.md#g-missing-sources). They identify editorial source starting points, not automatic evidence for every planned claim. Follow-up verification of specific claims is required before publication. “Annual” in review column means annual accuracy/link review, not necessarily annually changing mathematics. Priority rank is within tier.

### Tier 1 — must-have foundational guides

First repair the existing ten pages according to M/N. New foundational gaps follow immediately. Each existing guide's visual/sources/intent is specified above and retained in this table for scheduling.

| Rank / title | Primary intent | Calculator | Why it matters | Suggested visual | Primary sources | Review frequency | Evergreen vs annual |
|---|---|---|---|---|---|---|---|
|1 Salary to Hourly: Gross Pay, Paid Weeks and Tax Estimates (rewrite) | Convert pay without confusing net | Salary | High consequence tax scope | Pay waterfall | T1–T5 | Each tax year + law changes | Evergreen conversion + annual tax box |
|2 The 4% Rule: Origins, Inflation and Retirement Risk (rewrite) | Interpret withdrawal estimate | Retirement | Avoid guaranteed-income implication | Policy comparison timeline | R1/R2 | Annual | Evergreen historical |
|3 Rent vs Buy: Cash Costs, Equity and Opportunity Cost (rewrite) | Compare same-resource scenarios | Rent/buy | Explain corrected model | Two-sided cash-flow diagram | H1–H4/A2 | Annual | Evergreen |
|4 Debt Snowball vs Debt Avalanche (rewrite) | Choose payoff priority | Debt | Budget feasibility and rollover | Allocation ledger | D1/D2 | Annual | Evergreen |
|5 How Much to Save Each Month for a Specific Goal (rewrite) | Solve deposit amount | Savings goal | Fix already-achieved confusion | Deposit timeline | B2/I1 | Annual | Evergreen |
|6 How to Build a Monthly Budget (rewrite) | Find usable remaining cash | Budget | Define surplus vs savings | Cash-flow table | B1/B3 | Annual | Evergreen |
|7 How to Calculate Your Net Worth (rewrite) | Build a balance sheet | Net worth | Avoid equity double count | Assets/liabilities bars | B4 | Annual | Evergreen |
|8 How Mortgage Amortization Works (rewrite) | Understand payment split | Mortgage | Core loan literacy | Amortization bars | H1/H2 | Annual | Evergreen |
|9 Compound Interest: Growth, Contributions and Inflation (rewrite) | Understand future value | Compound | Clarify rate semantics | Contributions/growth chart | I1/I2/A1 | Annual | Evergreen |
|10 Extra Loan Payments (rewrite) | Compare payoff changes | Loan | Explain actual principal impact | Two payoff curves | H1/D2 | Annual | Evergreen |
|11 Nominal vs Real Return: What Future Dollars Can Buy | Understand purchasing power | Compound/retirement | Prerequisite to inflation controls | Nominal/real paired lines | I1/I2/A2 | Annual | Evergreen |
|12 Gross Pay vs Net Pay: Taxes, Benefits and Deductions | Understand paycheck components | Salary/budget | Avoid full-payroll claim | Annotated pay stub with invented example | T2/T3/T4/T5 | Annual + law changes | Evergreen + year-specific examples |
|13 APR vs APY vs Investment Return | Choose correct input units | Mortgage/compound/loan | Prevent rate mis-entry | Rate conversion table | A1/H2/I1 | Annual + rule changes | Evergreen |
|14 Savings Rate vs Remaining Cash Flow | Define numerator/denominator | Budget/savings | Cross-product terminology | Transfer/spending reconciliation | B1/A2 | Annual | Evergreen |

### Tier 2 — calculator-supporting guides

| Rank / title | Primary intent | Calculator | Why it matters | Suggested visual | Primary sources | Review frequency | Evergreen vs annual |
|---|---|---|---|---|---|---|---|
|1 15-Year vs 30-Year Mortgage: Payment and Interest | Compare loan terms | Mortgage | Direct parameter comparison | Same-loan table | H1/A2 | Annual | Evergreen |
|2 Down Payments of5%,10% and20% | Compare cash and borrowing needs | Mortgage/rent-buy | P&I and PMI context | Three-scenario ledger | H1/H3 | Annual + rules | Evergreen |
|3 PMI Explained: Cost, Coverage and Cancellation | Understand insurance cost | Mortgage | Current fee input needs scope | Eligibility/cancellation timeline | H3; CFPB HPA guidance | Annual + rules | Evergreen rules |
|4 Property Taxes, Insurance and Escrow | Separate P&I from total housing | Mortgage/budget | Common payment confusion | Payment component stack | H2 | Annual; local values user-supplied | Evergreen |
|5 Closing Costs vs Down Payment | Plan upfront cash | Mortgage/rent-buy/savings | Distinguish equity from expense | Cash-to-close table | H2/H4 | Annual | Evergreen |
|6 Rent vs Buy: Why Time Horizon Matters | Compare short/long stay | Rent/buy | Crossover depends on assumptions | Horizon sensitivity table | H2/A2 | Annual | Evergreen |
|7 Credit-Card Minimum Payments and the Payoff Trap | Understand statement minimum | Debt/loan | Fixed-minimum model limitation | Fixed vs declining payment chart | D2/D1 | Annual + rules | Evergreen |
|8 Why APR Changes Your Debt Payoff | Compare interest assumptions | Loan/debt | Explain APR/12 simplification | First-month interest table | D2/A2 | Annual | Evergreen |
|9 Federal Tax Brackets: Marginal vs Effective Rates | Understand progressive taxes | Salary | Stops applying top rate to all wages | Bracket staircase | T1 | Annually on release + law | Evergreen method + annual tables |
|10 FICA: Social Security and Medicare | Identify payroll deductions | Salary | Wage base/surcharge clarity | Capped/uncapped components | T2/T3 | Annual + law | Annual data within evergreen guide |
|11 Sinking Funds for Annual and Irregular Bills | Budget recurring irregular costs | Budget/savings | Make surplus realistic | Annual-to-monthly calendar | B1/B2 | Annual | Evergreen |
|12 Fixed vs Variable Expenses | Organize controllable cash outflows | Budget | More useful category setup | Category mapping worksheet | B1 | Annual | Evergreen |
|13 Increasing Contributions Over Time | Plan deposit step-ups | Compound/retirement | Advanced option education |0/3/5%step-up comparison | I1/A2 | Annual | Evergreen |
|14 Retirement Income in Today's Dollars | Compare spending on one basis | Retirement | Required inflation clarity | Future/real income table | R1/R2/A2 | Annual | Evergreen |
|15 Liquid vs Illiquid Assets | Assess access to money | Net worth | Equity is not emergency cash | Liquidity ladder | B4/B3 | Annual | Evergreen |
|16 What Counts as an Asset or a Liability? | Classify balance-sheet items | Net worth | Prevent entry mistakes | Classification table | B4 | Annual | Evergreen |

### Tier 3 — high-value educational expansion

| Rank / title | Primary intent | Calculator | Why it matters | Suggested visual | Primary sources | Review frequency | Evergreen vs annual |
|1 How to Size an Emergency Fund for Your Situation | Set context-based target | Savings/budget | No universal amount fits everyone | Expense×months sensitivity | B3/B1 | Annual | Evergreen |
|2 Investment Fees Over10,20 and30Years | Quantify fee drag | Compound | Small annual drag compounds | Gross/net growth lines | I2/A2 | Annual | Evergreen |
|3 Sequence-of-Returns Risk | Understand order of returns | Retirement | Constant return hides risk | Same returns reversed with withdrawals | R1/R2 | Annual | Evergreen |
|4 Retirement Withdrawal-Rate Sensitivity | Compare assumptions | Retirement | Avoid single-rate certainty | Spending×rate grid | R1/R2/A2 | Annual | Evergreen |
|5 How Many Years Might Retirement Savings Need to Last? | Choose a horizon | Retirement | Life expectancy isn't deadline |20/30/40year scenarios | R1/R2; SSA planning | Annual | Evergreen |
|6 Social Security Basics for Retirement Planning | Locate reliable benefit estimate | Retirement | Avoid invented benefit forecasts | Claiming-age concept diagram | R3; SSA benefits estimator | Annual + rule changes | Evergreen + annual facts |
|7 Traditional vs Roth: Tax Timing Overview | Understand account treatment | Retirement/salary | Net balances differ from spendable income | Contribution/withdrawal tax timeline | R4; verify relevant IRS Roth guidance | Annual + law | Rule-dependent |
|8 Mortgage Points: Upfront Cost vs Monthly Savings | Evaluate rate/cost trade-off | Mortgage | Break-even not universal | Cost vs savings table | H4 | Annual | Evergreen |
|9 Refinancing Break-Even Beyond the Monthly Payment | Compare refinancing scenarios | Mortgage/loan | New term and closing fees matter | Same-horizon loan comparison | H2/H4 | Annual | Evergreen |
|10 Debt Consolidation Math: Rate, Fees and Term | Compare restructuring | Loan/debt | Lower payment can cost more | Total-paid comparison | D2/A2; verify product-specific CFPB guidance | Annual + rules | Evergreen |
|11 Personal Loan vs Credit-Card Payoff | Compare payment structures | Loan/debt | Fees/daily interest can matter | Equal-budget payoff table | D2/H2/A2 | Annual | Evergreen |
|12 Salary with Irregular Income: A Cash-Flow Plan | Budget uneven pay | Salary/budget | Annual averages hide bill timing | Weekly cash calendar | B1/T1 | Annual + tax box | Evergreen |

### Tier 4 — later long-tail opportunities

| Rank / title | Primary intent | Calculator | Why it matters | Suggested visual | Primary sources | Review frequency | Evergreen vs annual |
|1 Monthly Investing vs Investing a Lump Sum | Compare deployment timing | Compound | Separate cash availability from forecasts | Deposit timing diagram | I3; Investor.gov lump-sum guidance | Annual | Evergreen |
|2 Rule of72: Useful Approximation and Its Errors | Estimate doubling time | Compound | Teach approximation limits | Exact vs72/r error table | I1/A2 mathematical derivation | Annual | Evergreen |
|3 Simple vs Compound Interest | Identify growth model | Compound/loan | Clarify when formula applies | Two-balance trajectories | I1/D2/A2 | Annual | Evergreen |
|4 Savings Account vs Investment Account for a Goal | Match time horizon and risk | Savings/compound | Avoid assuming return is certain | Access/risk/guarantee comparison | I1/B3; verify FDIC coverage before claims | Annual + product rules | Evergreen; avoid live yields |
|5 Early Retirement Math and Longer Horizons | Stress longer drawdown | Retirement |30-year heuristic insufficient | Horizon/spending grid | R1/R2 | Annual | Evergreen |
|6 Retirement Savings Milestones Without Universal Targets | Assess personal scenarios | Retirement | Avoid arbitrary age-multiple promises | Contribution/horizon scenarios | R1/R2/R4 | Annual | Evergreen |
|7 Balance Transfers: Fees, Promotional Rates and Expiry | Compare transfer economics | Loan/debt |0%headline can obscure cost | Promotional timeline | D2; agreement terms user-supplied | Annual + rules | Evergreen; no offers list |
|8 Debt-to-Income Ratio vs Budget Affordability | Understand a lending ratio | Salary/budget/mortgage | Approval ratio isn't spending plan | Gross-income vs take-home table | H2; lender-specific rules verified separately | Annual + rules | Evergreen |
|9 Financial Ratios That Answer Different Questions | Compare liquidity/debt/savings | Net worth/budget | A single score misleads | Ratio purpose/limits matrix | B1/B4/A2 | Annual | Evergreen |
|10 How Inflation Changes a Long-Term Savings Goal | Set future target dollars | Savings/compound | Static targets lose buying power | Target-inflation curve | I1/A2 | Annual | Evergreen |
|11 Extra Mortgage Payments vs Saving Cash: A Scenario Comparison | Compare liquidity and interest | Mortgage/savings | Not just rate optimization | Cash retained/debt avoided table | H1/B3/A2 | Annual | Evergreen |
|12 What If Your Investment Return Is Lower Than Planned? | Stress assumptions | Compound/retirement | Counter false precision | Negative/zero/positive scenarios | I1/I2/R1 | Annual | Evergreen |

Delivery sequence: correct and rewrite the highest-risk existing guides first; foundational gaps next; then16calculator-support pages, followed by educational expansion. This is a prioritized backlog, not a calendar commitment or instruction to publish all54topics immediately. A capacity-based calendar should be set only after a reviewer/editor and implementation availability are known.

Editorial acceptance gates: independently reproduce all numbers; validate calculator CTA scenario; name rate/time/dollar basis; cite primary source adjacent to nontrivial financial claim; distinguish assumption from current fact; test mobile table readability and chart labels; record article-specific updated/verified dates. Evaluate usefulness through completed calculator exercises and reader feedback, then use actual search impressions/queries if available. Avoid unsupported volume targets, thin “money hacks,” affiliate/provider rankings and duplicated intent pages.

### Measured core-copy lengths

Counts below cover only the three catalog section bodies, not the complete rendered article. Worked examples, headings, takeaways, CTAs and inherited sources add material. These counts diagnose depth, not an SEO word-count requirement.

| Guide | Core-body words |
|---|---:|
| How Mortgage Amortization Works | 149 |
| Compound Interest Explained | 127 |
| Salary vs Hourly Pay Explained | 133 |
| How to Calculate Your Net Worth | 130 |
| How to Build a Monthly Budget | 125 |
| Debt Snowball vs Debt Avalanche | 129 |
| How Loan Prepayments Affect Interest | 123 |
| Understanding the 4% Retirement Rule | 126 |
| Rent vs Buy: Costs People Often Forget | 131 |
| How Much Should I Save Each Month? | 136 |
