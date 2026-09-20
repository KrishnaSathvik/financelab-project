# Calculator Result UX Pass v2

## A. Previous discoverability problems

The visualization pass made charts inspectable, but the information architecture under them was still confusing. After Calculate, the user saw:

1. Interactive chart
2. Large keyboard point controls (`←`, Choose a point, `→`, Start, Paid off)
3. A full-width **View data** disclosure
4. A generic **Detailed breakdown / schedule** accordion

That forced people to guess the difference between chart data and the schedule, and it hid the most useful ledger behind a collapsed, vaguely named row. Native `<details>` focus also produced an oversized black rectangle around **View data**.

Financial engines, formulas, validated outputs, and chart semantics were already approved. This pass does not change them.

## B. New Answer → Explore → Details hierarchy

Every calculated result now follows one model:

1. **Answer** — primary result and supporting metrics
2. **Explore** — interactive visualization, tooltip, chart modes, **View chart data**
3. **Details** — a calculator-specific named section with a visible preview

Generic labels are removed. Chart data is the tabular version of the graph. The detail section is the financial schedule or breakdown for that tool.

## C. Chart interaction changes

Removed from the default UI:

- Previous / next buttons
- Choose a point `<select>`
- External Start / Paid off (and similar) marker buttons

The chart itself is the interaction:

- Desktop: hover nearest point, click to pin, `←` `→` (also Home/End) while the chart stage is focused
- Touch: tap nearest point, tap another point to move, tap outside or Escape to clear
- Subtle hint: “Hover or tap the chart to inspect values. Use ← → when the chart is focused.” Hidden after the first inspection

Lifecycle markers are drawn on the canvas (Start / Paid off, Today / Goal date, Current age / Retirement, Debt-free, and similar). Tooltips stack label then value, color principal blue and interest orange, draw a vertical crosshair, and highlight the active point.

## D. Chart data treatment

**View data** is renamed **View chart data** and moved into the chart header as a compact secondary action.

Opening it reveals a **Chart data** panel directly under the chart:

- Heading: Chart data
- Semantic table of the current view
- Dense monthly series default to annual points (mortgage balance: 31 rows, not 361)
- Monthly mode uses a year selector and “Showing 12 of 360 months”
- This table is for accessibility and exact chart values, not a substitute for the amortization/payoff schedule

## E. Mortgage schedule redesign

**Amortization schedule** is visible after Calculate, with:

- Subtitle: 30 years · 360 monthly payments
- Description of principal, interest, and remaining balance
- Yearly / Monthly toggle and **Download full CSV** (full ledger, no expand required)
- Yearly preview of 4 years, then **View all 30 years**
- Monthly year selector (default year 1, 12 rows, “Showing 12 of 360 payments”)
- Principal in MoneyBasis blue, interest in cost orange, payment/balance neutral
- Tabular numerals, right-aligned money, uppercase headers, row hover without recoloring text

## F. Other calculator detail-section mappings

| Tool | Detail section | Preview behavior |
| --- | --- | --- |
| Mortgage | Amortization schedule | 4 yearly rows, year-paged monthly |
| Compound Interest | Growth by year | First 5 periods, then full projection |
| Retirement | Retirement projection | Current / 40 / 50 / 60 / retirement from returned series, then full projection |
| Savings Goal | Savings timeline | Yearly checkpoints plus goal date |
| Budget | Expense breakdown | Top 5 categories, then all categories |
| Salary | Pay & tax breakdown | Gross, pretax, federal, Social Security, Medicare, Additional Medicare if any, take-home |
| Loan Payoff | Payoff schedule | Current vs extra-payment summary, then year-paged extra-payment ledger |
| Debt | Debt payoff timeline | Payoff events first; monthly balances optional and year-paged |
| Net Worth | Assets & liabilities | Current balance sheet visible by default |
| Rent vs Buy | Cost comparison | First 6 cost rows, then full comparison |

## G. Responsive behavior

On a 390px viewport the mortgage schedule stacks Yearly / Monthly and Download full CSV, keeps the year selector, and lets the table scroll horizontally instead of wrapping 360 rows onto the screen. Chart **View chart data** stays a compact header action, not a full-width accordion bar.

## H. Accessibility and focus changes

- Chart stage is keyboard-focusable; arrows only apply while it is focused
- Chart data table, textual summary, and named detail tables remain available
- `summary:focus` has no outline; `summary:focus-visible` uses a 2px `--focus` ring with 3px offset and 8px radius
- Global `:focus-visible` is 2px (was 3px) so compact controls no longer look like a native black slab
- **View chart data** and expand actions use the same focus-visible ring
- Year selector is a labeled combobox, not a `<label>` wrapping every `<option>`

## I. Tests

Financial unit tests are unchanged in meaning. Added or updated:

- `tests/chart-table.test.ts` — annual default and year paging for dense monthly charts
- `tests/chart-adapters.test.ts` — lifecycle markers (Start, Paid off, Today, Goal date, Debt-free) without changing series values
- `tests/content-regression.test.ts` — fails if `Detailed breakdown / schedule`, `Choose a point`, or `View data` return; allows `View chart data`
- `tests/e2e/calculator-result-ux.spec.ts` — mortgage chart data, schedule preview, yearly expand, monthly year selector, CSV still covered in calculators spec, named detail headings on all ten tools
- `tests/e2e/calculator-visuals.spec.ts` and `theme-pass.spec.ts` — keyboard Home/ArrowRight instead of the removed inspect control

## J. Verification

- TypeScript: passed (`tsc --noEmit` and `next build`)
- Unit tests: **333 passed across 14 files**
- Result UX + calculator visuals browser suite: **21 passed**
- Mortgage CSV e2e: passed (full monthly ledger download without opening a generic accordion)
- Theme chart tooltip e2e: passed
- No production deployment

Browser verification used Chromium (desktop 1440 and mobile 390, plus touch emulation in the visuals suite). Physical devices, WebKit, and Firefox were not tested.

## K. Screenshots

All v2 images are under `output/playwright/calculator-result-ux-v2/`.

Mortgage:

- `mortgage-chart-normal.png`
- `mortgage-chart-tooltip.png`
- `mortgage-chart-data.png`
- `mortgage-schedule-preview.png`
- `mortgage-yearly-full.png`
- `mortgage-monthly-year.png`
- `mortgage-schedule-mobile.png`

Other tools:

- `compound-interest-detail.png`
- `budget-detail.png`
- `debt-snowball-detail.png`
- `rent-vs-buy-detail.png`

## Intentionally unchanged

Financial engines, defaults, validation, calculation conventions, chart numeric adapters (aside from marker labels), sources, SEO, sharing, device saving, mortgage CSV contents, and the education/FAQ/worked-example stack below the result.
