# MoneyBasis calculation conventions — v1

Implemented 2026-09-18. These are deterministic educational models, not lender ledgers, tax filing software, or forecasts. Financial sources support the identified claims in `lib/sources.ts`; they do not endorse our model choices.

## Input contract

`lib/validation/index.ts` returns `{ valid: true, warnings }` or `{ valid: false, errors }`. Each error has a field path and message. Engines call `assertValid` before financial work and throw `InputValidationError`; the UI adapter renders its message and suppresses results. URL restoration, device saving/restoration, and share generation use these same model rules. Corrupt/unsupported stored records fall back to defaults. Negative amounts, nonfinite values, unsupported enum/tax-year values, invalid age order, and impossible down payments are rejected.

The input parser accepts decimal numbers and US comma grouping, not arbitrary text with letters stripped away. Empty numeric input is invalid, not silently zero. Monetary inputs are bounded at $1 trillion, editable lists at 100 rows, projection horizons at 100 years, ages at 100 (life expectancy 120), and modeled rates at 100% annually. Growth/inflation assumptions may be negative, strictly above -100%; borrowing rates cannot be negative. These are product bounds, not financial laws.

## Time, dates, and contributions

- Convert years to integer months. 1.5 years is 18 months; inputs that cannot represent whole months are rejected rather than truncated.
- Initial balances are time zero. Growth/interest occurs before end-of-month deposits and payments.
- Contributions increase after each completed contribution year. Retirement spending increases after each completed retirement year.
- `addCalendarMonths` clamps the original day to the destination month's last day. January 31 plus one month ends in February, not March.
- Dates shown in the UI are illustrative, based on the current local calendar date and payments beginning next month.

## Rates and dollar basis

Loans use nominal annual note/APR-style interest divided by 12; origination fees, daily accrual, and lender APR disclosure calculations are outside the model. Mortgage total loan cost is principal plus interest, not lifetime housing cost.

Investment accepts a nominal annual rate with the chosen compounding frequency `k`. Its equivalent monthly growth factor is `(1 + annualRate/k)^(k/12)`. Savings, retirement accumulation and net-worth projections use nominal annual return divided by 12. Constant negative returns preserve signed losses. No assumed market return is a guarantee. Inflation-adjusted investment value is nominal terminal value divided by `(1 + inflation)^years`.

Retirement monthly spending is entered in **today's dollars**. Multiply by `(1 + inflation)^yearsToRetirement` for first-year retirement spending, then adjust annually during drawdown. Portfolio and withdrawal headline values are nominal future dollars; the UI separately translates withdrawal purchasing power back to today's dollars. Drawdown retains the existing explicit planning assumption of a nominal return capped at 5% annually. Withdrawal-rate arithmetic is an estimate, never safe or guaranteed income. `drawdownStatus` distinguishes depletion from funding through the selected age; an infinite legacy `monthsFundsLast` means no depletion observed within the modeled horizon, not proof of perpetual funding. Social Security, pensions, taxes and variable returns are excluded.

Rent/buy home appreciation uses effective annual growth; rent and recurring housing costs step annually. Both scenarios start with down payment plus closing costs in resources. Buyer starts with down-payment equity; renter invests the initial resources. Each month the resource budget is the larger of ownership and rental costs. Both portfolios grow; the less expensive side deposits the difference. Mortgage payments stop at payoff, including a capped final payment. Buyer position is equity plus owner portfolio. **Equity is not cash available from a sale.** Selling/moving costs and taxes are excluded. First crossover can reverse and is not a permanent winner. Annual chart samples include the exact selected fractional-year endpoint.

## Ledgers, payoff and rounding

Compute at full floating-point precision; round only for display/CSV. Payoff checks remove only accumulated machine-precision residue scaled to original principal and elapsed months, not a fixed cent cutoff. Detailed monetary tables and CSV use cents. This is not a promise to reproduce lenders' monthly cent rounding.

Mortgage month rows determine annual rows, interest totals and CSV. Loan payoff chart and table consume a single monthly schedule per scenario, including negative amortization and one-time payments. Final payments are capped. Debt reserves all actual minimums, then rolls unused monthly budget through the chosen priority order in the **same month**. Duplicate names are allowed; stable unique IDs identify debts and payoff events. Infeasible budgets are validation errors. A final unused budget remains visible in the ledger.

Loan status is `paid-off`, `non-amortizing`, or `horizon-exceeded` (1,200 months). Debt status is `paid-off` or `horizon-exceeded` (600 months). Payoff exactly at the limit is success. A horizon result includes actual remaining debt and accrued totals, never an invented payoff date. Mortgage all-cash purchases return `no-loan` with zero debt/payment and applicable entered housing costs.

Savings distinguishes `achieved-today`, `growth-funded`, and `deposits-required`. Current achievement does not imply that future negative returns require no deposits. `noMoreDepositsRequired` explicitly states that separate fact. Charts retain uncapped balances and negative growth. The goal is a nominal target, not automatically inflation adjusted.

## Tax and terminology

Salary is annualized federal income tax and employee FICA liability for one worker using the selected supported tax year. MFJ does not model a second worker. Additional Medicare is 0.9% above $200,000 single/head-of-household or $250,000 MFJ Medicare wages; employer withholding uses a different rule. State/local taxes and credits are excluded. Legacy shared state estimates are rejected. Traditional 401(k) reduces federal wages only; health insurance/other pretax inputs assume qualifying cafeteria-plan treatment and reduce both federal and FICA wages. Deduction eligibility/limits are not assessed; combined deductions cannot exceed gross pay. Annual pay is apportioned over 26 biweekly periods, 12 months, or entered paid weeks/hours.

Budget remaining cash flow is income minus entered categories. Its remaining-income rate is not an actual savings-transfer rate. Zero-income ratios are `null`, not 0%. The legacy `savingsRate` result is a compatibility alias for `remainingIncomeRate`. Net worth is a snapshot; enter **full home market value** as an asset and mortgage debt separately. Projection is separately labeled and redirects unused debt payments into assets after payoff.

## Independent fixture reconciliation

All 160 cases were transcribed from `TEST_MATRIX.md`, whose independent Python Decimal calculations did not import production code. Numeric literals retain the audit's reported precision and tolerances. Financial count assertions are exact. Two contract changes preserve the original expectations alongside their rationale in JSON:

- M5: original `null` becomes explicit `no-loan`, balance/payment zero.
- L8: independent payoff is month 1,201. Our bounded model reports `horizon-exceeded`, 1,200 elapsed months and $1 remaining instead of claiming payoff at 1,200.

These changes are not new independent numerical approvals. `tests/integration/output-reconciliation.test.ts` additionally checks conservation and presentation-source consistency. Future model-policy changes must document fixture migrations explicitly.
